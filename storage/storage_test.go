package storage

import (
	"encoding/json"
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/dist-rts/config"
	"github.com/pdxjohnny/websocket-mircoservice/random"
	"github.com/pdxjohnny/websocket-mircoservice/server"
)

type TestStorage struct {
	Method string
	id     string
}

func checkOnUpdate(should_be string, gotUpdate chan int) func(storage *struct, raw_message []byte) {
	return func(storage *struct, raw_message []byte) {
		// Create a new message struct
		message := new(TestStorage)
		// Parse the message to a json
		json.Unmarshal(raw_message, &message)
		fmt.Println(string(raw_message))
		if should_be == string(message.id) {
			gotUpdate <- 1
		}
	}
}

func TestStorageCallMethod(t *testing.T) {
	conf := config.Load()
	go server.Run()
	gotUpdate := make(chan int)
	randString := random.Letters(50)
	storage := NewStorage()
	storage.OnUpdate = checkOnUpdate(randString, gotUpdate)
	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
	err := storage.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	go storage.Read()
	log.Println("Waiting for gotUpdate", randString)
	checkJson := fmt.Sprintf("{\"id\": \"%s\", \"method\": \"update\"}", randString)
	storage.Write([]byte(checkJson))
	<-gotUpdate
	log.Println("Got gotUpdate", randString)
}
