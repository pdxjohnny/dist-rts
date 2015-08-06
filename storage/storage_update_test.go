package storage

import (
	"encoding/json"
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/dist-rts/config"
	"github.com/pdxjohnny/microsocket/random"
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

func TestStorageUpdate(t *testing.T) {
	conf := config.Load()
	gotUpdate := make(chan int)
	randString := random.Letters(5)
	storage := NewStorage()
	storage.OnUpdate = checkOnUpdate(randString, gotUpdate)
	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
	err := storage.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	go storage.Read()
	log.Println("Waiting for gotUpdate", randString)
	checkJson := fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", randString)
	storage.Write([]byte(checkJson))
	<-gotUpdate
	log.Println("Got gotUpdate", randString)
}
