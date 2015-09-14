package config

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
	"storage": map[string]interface{}{
		"host": map[string]interface{}{
			"value": "localhost",
			"help":  "Host to connect to",
		},
		"port": map[string]interface{}{
			"value": 8081,
			"help":  "Port to connect to",
		},
		"cert": map[string]interface{}{
			"value": "keys/web/cert.pem",
			"help":  "Certificate to use",
		},
	},
}
