package server

import (
	"fmt"
	"net/http"

	"github.com/GeertJohan/go.rice"
	"github.com/pdxjohnny/easysock"

	"github.com/pdxjohnny/dist-rts/config"
)

func Run() error {
	conf := config.Load()
	go easysock.Hub.Run()
	http.Handle("/", http.FileServer(rice.MustFindBox("../static").HTTPBox()))
	http.HandleFunc("/ws", easysock.ServeWs)
	port := fmt.Sprintf(":%s", conf.Port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
