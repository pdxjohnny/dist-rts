package storage

import (
	"encoding/json"
)

type TestStorage struct {
	Method string
	Id     string
}

func checkOnUpdate(should_be string, gotUpdate chan int) func(storage *Storage, raw_message []byte) {
	return func(storage *Storage, raw_message []byte) {
		// Create a new message struct
		message := new(TestStorage)
		// Parse the message to a json
		json.Unmarshal(raw_message, &message)
		if should_be == string(message.Id) {
			gotUpdate <- 1
		}
	}
}
