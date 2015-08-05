package client

import (
	"fmt"
	"log"
	"testing"

	"github.com/pdxjohnny/dist-rts/config"
)

type TestClientUpdateStruct struct {
	String  string
	Boolean bool
}

func TestClientUpdate(t *testing.T) {
	conf := config.Load()
	client := NewClient()
	wsUrl := fmt.Sprintf("http://%s:%s/ws", conf.Host, conf.Port)
	err := client.Connect(wsUrl)
	if err != nil {
		log.Println(err)
	}
	updateValue := TestClientUpdateStruct{
		String:  "ClientUpdateStruct",
		Boolean: true,
	}
	client.Save(&updateValue)
}
