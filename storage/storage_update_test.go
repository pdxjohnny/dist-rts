package storage

import (
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/dist-rts/config"
	"github.com/pdxjohnny/microsocket/random"
)

func TestStorageUpdate(t *testing.T) {
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
