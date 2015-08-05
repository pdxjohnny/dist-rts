package storage

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/pdxjohnny/microsocket/service"
)

type Storage struct {
	*service.Service
	// Store anything with an Id here the key is the key
	Data map[string][]byte
	// Something to call on update
	OnUpdate func(*Storage, []byte)
	// keep track of if we should dump or not
	DumpTrack map[string]chan bool
}

// Store anything with an Id
type UpdateMessage struct {
	Id string
}

// Store anything with an Id
type DumpMessage struct {
	UpdateMessage
	DumpKey    string
	DumpDone   bool
	DumpChosen bool
	// The client id of the service that is chosen to dump
	ClientId string
}

func NewStorage() *Storage {
	// Service setup
	inner := service.NewService()
	storage := Storage{Service: inner}
	storage.Caller = &storage
	// Init Data map
	storage.Data = make(map[string][]byte)
	// Init DumpTrack map
	storage.DumpTrack = make(map[string]chan bool)
	return &storage
}

func (storage *Storage) Update(raw_message []byte) {
	// Create a new message struct
	message := new(UpdateMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no Id
	if err != nil || message.Id == "" {
		return
	}
	storage.Data[message.Id] = raw_message
	if storage.OnUpdate != nil {
		go storage.OnUpdate(storage, raw_message)
	}
}

func (storage *Storage) DumpTracker(DumpKey string) bool {
	// Allocate a channel
	_, ok := storage.DumpTrack[DumpKey]
	if !ok {
		storage.DumpTrack[DumpKey] = make(chan bool, 1)
	}
	// Wait for client of choose this service to Dump
	chooseMe := map[string]interface{}{
		"method":   "ChooseDump",
		"DumpKey":  DumpKey,
		"ClientId": storage.ClientId,
	}
	sendChoose, err := json.Marshal(chooseMe)
	if err != nil {
		return false
	}
	storage.Write(sendChoose)
	// If the service is not
	timeout := make(chan bool, 1)
	go func() {
		time.Sleep(30 * time.Second)
		timeout <- true
	}()
	select {
	case wasChosen := <-storage.DumpTrack[DumpKey]:
		return wasChosen
	case <-timeout:
		return false
	}
	return false
}

func (storage *Storage) AddDumpKey(raw_message []byte, DumpKey string) ([]byte, error) {
	// Add the DumpKey to the object
	var loadValue interface{}
	err := json.Unmarshal(raw_message, &loadValue)
	if err != nil {
		return nil, err
	}
	addDumpKey := loadValue.(map[string]interface{})
	addDumpKey["DumpKey"] = DumpKey
	addDumpKey["method"] = "RecvDump"
	// DEBUG add ServiceID to see who sent what
	addDumpKey["StorageId"] = storage.ClientId
	// Turn the object back into a json
	dumpValue, err := json.Marshal(addDumpKey)
	if err != nil {
		return nil, err
	}
	return dumpValue, nil
}

func (storage *Storage) ChangeMessageKey(raw_message []byte, key string, value interface{}) ([]byte, error) {
	// Add the DumpKey to the object
	var loadValue interface{}
	err := json.Unmarshal(raw_message, &loadValue)
	if err != nil {
		return nil, err
	}
	addDumpKey := loadValue.(map[string]interface{})
	addDumpKey[key] = value
	// Turn the object back into a json
	dumpValue, err := json.Marshal(addDumpKey)
	if err != nil {
		return nil, err
	}
	return dumpValue, nil
}

func (storage *Storage) Dump(raw_message []byte) {
	// Create a new message struct
	message := new(DumpMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey
	if err != nil || message.DumpKey == "" {
		return
	}
	// Otherwise Dump data
	// Make sure the map is initialized
	shouldDump := storage.DumpTracker(message.DumpKey)
	if !shouldDump {
		fmt.Println("I should not Dump")
		return
	}
	fmt.Println("I should Dump")
	// Loop through all stored data
	for _, value := range storage.Data {
		// Add the DumpKey to the object
		dumpValue, err := storage.AddDumpKey(value, message.DumpKey)
		if err != nil {
			fmt.Println(err)
			continue
		}
		// DEBUG
		fmt.Println("sent", string(dumpValue))
		// Dump it to clients
		storage.Write(dumpValue)
	}
	// Tell clients we are done dumping
	DumpDone := DumpMessage{
		DumpDone: true,
		DumpKey:  message.DumpKey,
	}
	sendDumpDone, err := json.Marshal(DumpDone)
	if err != nil {
		fmt.Println(err)
	}
	// Send DumpDone to clients
	storage.Write(sendDumpDone)
	// Done dumping no need to track dumped anymore
	delete(storage.DumpTrack, message.DumpKey)
}

func (storage *Storage) DumpChosen(raw_message []byte) {
	// Create a new message struct
	message := new(DumpMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	fmt.Println(string(raw_message))
	// Return if error or no DumpKey or not the client specified to dump
	if err != nil || message.DumpKey == "" ||
		message.ClientId != storage.ClientId {
		return
	}
	fmt.Println("Sending ", message.DumpChosen)
	// Otherwise
	// Check if this request is applicable to this instance
	_, ok := storage.DumpTrack[message.DumpKey]
	// If it is then there will be a channel and this will
	if ok {
		// Send the response to the channel
		storage.DumpTrack[message.DumpKey] <- message.DumpChosen
	}
}
