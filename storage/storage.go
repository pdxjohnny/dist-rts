package storage

import (
	"encoding/json"
	"fmt"
	"bytes"

	"github.com/pdxjohnny/microsocket/service"
)

type Storage struct {
	*service.Service
	// Store anything with an Id here the key is the key
	Data map[string][]byte
	// Something to call on update
	OnUpdate func(*Storage, []byte)
}

// Store anything with an Id
type Message struct {
	Id string
}

func NewStorage() *Storage {
	// Service setup
	inner := service.NewService()
	storage := Storage{Service: inner}
	storage.Caller = &storage
	// Init Dat map
	storage.Data = make(map[string][]byte)
	return &storage
}

func (storage *Storage) Update(raw_message []byte) {
	// Create a new message struct
	message := new(Message)
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

func (storage *Storage) Dump(printTo *bytes.Buffer) {
  fmt.Fprintf(printTo, "{")
	onSaved := 0
	writeComma := ","
  for key, value := range storage.Data {
		onSaved++
		if onSaved >= len(storage.Data) {
			writeComma = ""
		}
    fmt.Fprintf(printTo, "%q: %s%s", key, string(value), writeComma)
  }
  fmt.Fprintf(printTo, "}")
}
