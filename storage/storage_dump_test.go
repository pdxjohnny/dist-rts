package storage

import (
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/dist-rts/config"
)

func TestStorageDump(t *testing.T) {
	conf := config.Load()
	storage := NewStorage()
	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
	err := storage.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	storage.Read()
}

//
// func TestStorageDump(t *testing.T) {
// 	conf := config.Load()
// 	gotUpdate := make(chan int)
// 	randString := random.Letters(50)
// 	storage := NewStorage()
// 	storage.OnUpdate = checkOnUpdate(randString, gotUpdate)
// 	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
// 	err := storage.Connect(wsUrl)
// 	if err != nil {
// 		log.Println(err)
// 	}
// 	go storage.Read()
// 	// Make a random Id and send it
// 	checkJson := fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", random.Letters(50))
// 	storage.Write([]byte(checkJson))
// 	// Write the Id we are waiting for
// 	checkJson = fmt.Sprintf("{\"Id\": \"%s\", \"method\": \"Update\"}", randString)
// 	storage.Write([]byte(checkJson))
// 	// Wait for the Id to be read
// 	<-gotUpdate
// 	// Test the dump function, there should be at least two values beacuse we sent
// 	// two
// 	buffer := new(bytes.Buffer)
// 	storage.Dump(buffer)
// 	// fmt.Println(buffer.String())
// 	dump := make(map[string]Message)
// 	json.Unmarshal(buffer.Bytes(), &dump)
// 	if len(dump) < 2 {
// 		panic("Did not receive both JSONs sent")
// 	}
// 	log.Println("Received both JSONs sent")
// }
