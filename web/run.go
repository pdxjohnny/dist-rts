package web

import (
	"net/http"

	"github.com/spf13/viper"
	"github.com/pdxjohnny/easysock"
)

func Run() {
	mux := http.NewServeMux()
	go easysock.Hub.Run()
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/", fs)
	mux.HandleFunc("/ws", easysock.ServeWs)
	Start(
		mux,
		viper.GetString("addr"),
		viper.GetString("port"),
		viper.GetString("cert"),
		viper.GetString("key"),
	)
}
