package main

import (
	"fmt"
	"net/http"

	"github.com/pdxjohnny/easysock"

	"github.com/pdxjohnny/dist-rts/config"
)

func Run() error {
	conf := config.Load()
	go easysock.Hub.Run()
	fs := http.FileServer(http.Dir("static"))
  http.Handle("/", fs)
	http.HandleFunc("/ws", easysock.ServeWs)
	port := fmt.Sprintf(":%s", conf.Port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func main() {
	Run()
}
