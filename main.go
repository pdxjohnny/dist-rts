package main

import (
	"log"

	"github.com/pdxjohnny/dist-rts/server"
)

func main() {
	err := server.Run()
	if err != nil {
		log.Println(err)
	}
}
