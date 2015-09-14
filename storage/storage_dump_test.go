package storage

import (
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/microsocket/random"
	"github.com/spf13/viper"

	"github.com/pdxjohnny/dist-rts/client"
	"github.com/pdxjohnny/dist-rts/config"
)

func TestStorageDump(t *testing.T) {
	config.ConfigSet()
	wsUrl := fmt.Sprintf(
		"http://%s:%s/ws",
		viper.GetString("host"),
		viper.GetString("port"),
	)
	log.Println("Connecting to", wsUrl)
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
	// The number of items to save
	numSaved := 5
	// Populate the storage.Data
	for index := 0; index < numSaved; index++ {
		item := map[string]interface{}{
			"Id": random.Letters(5),
		}
		clientTest.Save(item)
	}
	// Get all of the data in storeage
	savedData := clientTest.AllData()
	// if numSaved != len(savedData) {
	// 	panic("All of the items we sent weren't saved!!")
	// }
	log.Println(savedData)
}
