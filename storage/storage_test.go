package storage

import (
	"encoding/json"
	"fmt"
	"bytes"
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

func TestStorageCallMethod(t *testing.T) {
	conf := config.Load()
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
	checkJson := fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", randString)
	storage.Write([]byte(checkJson))
	<-gotUpdate
	log.Println("Got gotUpdate", randString)
}

func TestStorageDump(t *testing.T) {
	conf := config.Load()
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
	// Make a random Id and send it
	checkJson := fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", random.Letters(50))
	storage.Write([]byte(checkJson))
	// Write the Id we are waiting for
	checkJson = fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", randString)
	storage.Write([]byte(checkJson))
	// Wait for the Id to be read
	<-gotUpdate
	// Test the dump function, there should be at least two values beacuse we sent
	// two
	buffer := new(bytes.Buffer)
	storage.Dump(buffer)
	// fmt.Println(buffer.String())
	dump := make(map[string]Message)
	json.Unmarshal(buffer.Bytes(), &dump)
	if len(dump) < 2 {
		panic("Did not receive both JSONs sent")
	}
	log.Println("Received both JSONs sent")
}
