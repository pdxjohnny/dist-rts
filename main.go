package main

import (
	"log"

	"github.com/pdxjohnny/websocket-mircoservice/server"
)

func main() {
	err := server.Run()
	if err != nil {
		log.Println(err)
	}
}
