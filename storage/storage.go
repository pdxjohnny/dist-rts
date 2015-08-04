package storage

import (
	"encoding/json"
	"log"

	"github.com/pdxjohnny/websocket-mircoservice/service"
)

type Storage struct {
	service.Service
	// Store anything with an id here the key is the key
	Data map[string][]byte
	// Something to call on update
	OnUpdate func(*Storage, []byte)
}

// Store anything with an id
type Message struct {
	id string
}

func NewStorage() *Storage {
	// Create a new stroage struct
	storage := new(Storage)
	// Set Recv to MethodMap which will call the correct method
	storage.Recv = storage.MethodMap
	// Setup the methods to call
	storage.Methods = map[string]service.Method{
		"update": Update,
	}
	return storage
}

func Update(raw_storage *interface{}, raw_message []byte) {
  // Typecast the interface as Storage
  storage := raw_storage.(Storage)
	// Create a new message struct
	message := new(Message)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no id
	if err != nil || message.id == "" {
		return
	}
	storage.Data[message.id] = raw_message
	log.Println("Updated", message.id)
	if storage.OnUpdate != nil {
		go storage.OnUpdate(storage, raw_message)
	}
}
