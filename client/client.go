package client

import (
	"encoding/json"

	"github.com/pdxjohnny/microsocket/service"

	// "github.com/pdxjohnny/dist-rts/storage"
)

type Client struct {
	*service.Service
	// So that calling can appear syncronous
	Channels map[string]chan bool
	// For sharing resources
	Shared map[string]interface{}
}

func NewClient() *Client {
	// Service setup
	inner := service.NewService()
	client := Client{Service: inner}
	client.Caller = &client
	// Init Channels map
	client.Channels = make(map[string]chan bool)
	// Init Shared map
	client.Shared = make(map[string]interface{})
	return &client
}

func (client *Client) Save(update_obj interface{}) error {
	asBytes, err := json.Marshal(update_obj)
	if err != nil {
		return err
	}
	var loadValue interface{}
	err = json.Unmarshal(asBytes, &loadValue)
	if err != nil {
		return err
	}
	addUpdateKey := loadValue.(map[string]interface{})
	addUpdateKey["method"] = "Update"
	// Turn the object back into a json
	asBytes, err = json.Marshal(addUpdateKey)
	if err != nil {
		return err
	}
	client.Write(asBytes)
	return nil
}

//
// func (client *Client) AllData(raw_message []byte) *map[string]interface{} {
//
// }
//
// func (client *Client) ChooseDump(raw_message []byte) {
// 	// Create a new message struct
// 	message := new(storage.DumpMessage)
// 	// Parse the message to a json
// 	err := json.Unmarshal(raw_message, &message)
// 	// Return if error or no DumpKey or Dump is finished
// 	if err != nil || message.DumpKey == "" || message.DumpDone {
// 		return
// 	}
// 	// Otherwise update the DumpTrack map to show the object as dumped
// 	// Make sure the map is initialized
// 	client.DumpTracker(message.DumpKey)
// 	// DEBUG
// 	fmt.Println("updating", string(raw_message))
// 	// Set the object to has been dumped
// 	client.DumpTrack[message.DumpKey][message.Id] = true
// }
