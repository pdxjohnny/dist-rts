package storage

import (
	"encoding/json"
	"fmt"

	"github.com/pdxjohnny/microsocket/random"
	"github.com/pdxjohnny/microsocket/service"
)

type Storage struct {
	*service.Service
	// Store anything with an Id here the key is the key
	Data map[string][]byte
	// Something to call on update
	OnUpdate func(*Storage, []byte)
	// Keep track of dumped objects
	DumpTrack map[string]interface{}
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
	storage.DumpTrack = make(map[string]interface{})
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

func (storage *Storage) DumpTracker(string) string {
	DumpKey := random.Letters(10)
	_, ok := storage.DumpTrack[DumpKey]
	if ok {
		delete(storage.DumpTrack, DumpKey)
	}
	storage.DumpTrack[DumpKey] = make(map[string]bool)
	return DumpKey
}

func (storage *Storage) Dump(raw_message []byte) {
	// Create a new message struct
	message := new(UpdateMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey
	if err != nil || message.DumpKey == "" {
		return
	}
	// Otherwise Dump data
	// Make sure there is a map to check what has been dumped
	DumpKey := storage.DumpTracker(message.DumpKey)
	// Loop through all stored data
	for key, value := range storage.Data {
		// Make sure this stored object hasn't been dumped yet
		_, ok := storage.DumpTrack[DumpKey][key]
		if !ok {
			// Set the object to has been dumped
			storage.DumpTrack[DumpKey][key] = true
		}
	}
	// Tell clients we are done dumping
	// storage.Write()
	// Done dumping no need to track dumped anymore
	delete(storage.DumpTrack, DumpKey)
}

func (storage *Storage) RecvDump(raw_message []byte) {
	// Create a new message struct
	message := new(UpdateMessage)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey or Dump is finished
	if err != nil || message.DumpKey == "" || message.DumpDone {
		return
	}
	// Otherwise update the DumpTrack map to show the object as dumped
	// Make sure there is a map to check what has been dumped
	DumpKey := storage.DumpTracker(message.DumpKey)
	// Set the object to has been dumped
	storage.DumpTrack[DumpKey][message.Id] = true
}
