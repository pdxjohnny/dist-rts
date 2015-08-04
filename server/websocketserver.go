package server

import (
	"fmt"
	"runtime"
	"net/http"
	"text/template"

	"github.com/oxtoacart/bpool"

	"github.com/pdxjohnny/easysock"
	"github.com/pdxjohnny/dist-rts/config"
	"github.com/pdxjohnny/dist-rts/storage"
)

var bufpool *bpool.BufferPool
var serverStorage *storage.Storage

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

func DumpStorage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	buf := bufpool.Get()
	serverStorage.Dump(buf)
	buf.WriteTo(w)
	bufpool.Put(buf)
}

func Run() {
  runtime.GOMAXPROCS(4)
	conf := config.Load()
	go easysock.Hub.Run()
	serverStorage = storage.NewStorage()
	bufpool = bpool.NewBufferPool(48)
	http.HandleFunc("/", ServeHome)
	http.HandleFunc("/all", DumpStorage)
	http.HandleFunc("/ws", easysock.ServeWs)
	port := fmt.Sprintf(":%s", conf.Port)
	http.ListenAndServe(port, nil)
	//
	// serverStorage.Read()
}
