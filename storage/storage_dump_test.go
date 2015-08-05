package storage

import (
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/microsocket/random"

	"github.com/pdxjohnny/dist-rts/client"
	"github.com/pdxjohnny/dist-rts/config"
)

func TestStorageDump(t *testing.T) {
	conf := config.Load()
	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
	// Set up the storage service
	storage := NewStorage()
	err := storage.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	go storage.Read()
	// Set up the client
	clientTest := client.NewClient()
	err = clientTest.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	go clientTest.Read()
	// Populate the storage.Data
	for index := 0; index < 5; index++ {
		item := map[string]interface{}{
			"id":       random.Letters(5),
			"ClientId": clientTest.ClientId,
		}
		clientTest.Save(item)
	}
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
