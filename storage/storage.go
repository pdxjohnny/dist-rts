package storage

import (
	"encoding/json"
	"fmt"

	"github.com/pdxjohnny/microsocket/service"
)

type Storage struct {
	*service.Service
	// Store anything with an Id here the key is the key
	Data map[string][]byte
	// Something to call on update
	OnUpdate func(*Storage, []byte)
	// Keep track of dumped objects
	DumpTrack map[string]map[string]bool
}

// Store anything with an Id
type UpdateMessage struct {
	Id string
}

// Store anything with an Id
type DumpMessage struct {
	UpdateMessage
	DumpKey  string
	DumpDone bool
}

func NewStorage() *Storage {
	// Service setup
	inner := service.NewService()
	storage := Storage{Service: inner}
	storage.Caller = &storage
	// Init Data map
	storage.Data = make(map[string][]byte)
	// Init DumpTrack map
	storage.DumpTrack = make(map[string]map[string]bool)
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
	// Loop through all stored data
	for key, value := range storage.Data {
		// Make sure this stored object hasn't been dumped yet
		_, ok := storage.DumpTrack[message.DumpKey][key]
		if !ok {
			// Set the object to has been dumped
			storage.DumpTrack[message.DumpKey][key] = true
			// Add the DumpKey to the object
			var loadValue interface{}
			err := json.Unmarshal(value, &loadValue)
			if err != nil {
				fmt.Println(err)
			}
			addDumpKey := loadValue.(map[string]interface{})
			addDumpKey["DumpKey"] = message.DumpKey
			// Turn the object back into a json
			dumpValue, err := json.Marshal(addDumpKey)
			if err != nil {
				fmt.Println(err)
			}
			// Dump it to clients
			storage.Write(dumpValue)
		}
	}
	// Tell clients we are done dumping
	DumpDone := DumpMessage{
		DumpDone: true,
		DumpKey: message.DumpKey,
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

func (storage *Storage) RecvDump(raw_message []byte) {
	// Create a new message struct
	message := new(DumpMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey or Dump is finished
	if err != nil || message.DumpKey == "" || message.DumpDone {
		return
	}
	// Otherwise update the DumpTrack map to show the object as dumped
	// Set the object to has been dumped
	storage.DumpTrack[message.DumpKey][message.Id] = true
}
