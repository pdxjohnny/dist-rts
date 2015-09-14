package commands

var ConfigOptions = map[string]interface{}{
	"web": map[string]interface{}{
		"addr": map[string]interface{}{
			"value": "0.0.0.0",
			"help":  "Address to bind on",
		},
		"port": map[string]interface{}{
			"value": 8081,
			"help":  "Port to bind to",
		},
		"cert": map[string]interface{}{
			"value": "keys/web/cert.pem",
			"help":  "Certificate to use",
		},
		"key": map[string]interface{}{
			"value": "keys/web/key.pem",
			"help":  "Key to use",
		},
	},
}
