package server

import (
	"fmt"
	"net/http"
	"text/template"

	"github.com/pdxjohnny/dist-rts/config"
	"github.com/pdxjohnny/easysock"
)

func ServeHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Not found", 404)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", 405)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	homeTempl, err := template.ParseFiles("../static/home.html")
	if err != nil {
		homeTempl, err = template.ParseFiles("static/home.html")
	}
	homeTempl.Execute(w, r.Host)
}

func Run() error {
	conf := config.Load()
	go easysock.Hub.Run()
	http.HandleFunc("/", ServeHome)
	http.HandleFunc("/ws", easysock.ServeWs)
	port := fmt.Sprintf(":%s", conf.Port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
