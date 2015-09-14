package storage

import (
	"fmt"
	"log"

	"github.com/spf13/viper"

	"github.com/pdxjohnny/dist-rts/config"
)

func Run() {
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
	storage.Read()
}
