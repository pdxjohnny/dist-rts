package web

import (
	"fmt"
	"log"
	"net/http"
)

func Metric(increment int64, handler func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		increment++
		handler(w, req)
	}
}

func Start(mux *http.ServeMux, address, port, cert, key string) {
	listen := fmt.Sprintf("%s:%s", address, port)
	if cert == "" || key == "" {
		fmt.Printf("About to listen on http://%s/\n", listen)
		err := http.ListenAndServe(listen, mux)
		if err != nil {
			log.Println("Error listening", err)
		}
	} else {
		fmt.Printf("About to listen on https://%s/\n", listen)
		err := http.ListenAndServeTLS(listen, cert, key, mux)
		if err != nil {
			log.Println("Error listening", err)
		}
	}
}
