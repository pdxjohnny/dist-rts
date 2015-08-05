package client

import (
	"encoding/json"

	"github.com/pdxjohnny/microsocket/random"
	"github.com/pdxjohnny/microsocket/service"
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

func (client *Client) ToMap(mapObj interface{}) (map[string]interface{}, error) {
	asBytes, err := json.Marshal(mapObj)
	if err != nil {
		return nil, err
	}
	var loadValue interface{}
	err = json.Unmarshal(asBytes, &loadValue)
	if err != nil {
		return nil, err
	}
	asMap := loadValue.(map[string]interface{})
	return asMap, nil
}

func (client *Client) Send(sendObj interface{}) error {
	// Turn the object back into a json
	asBytes, err := json.Marshal(sendObj)
	if err != nil {
		return err
	}
	client.Write(asBytes)
	return nil
}

func (client *Client) Save(saveThis interface{}) error {
	addUpdateKey, err := client.ToMap(saveThis)
	if err != nil {
		return err
	}
	addUpdateKey["method"] = "Update"
	return client.Send(addUpdateKey)
}

func (client *Client) CreateChannel() string {
	ChannelKey := random.Letters(10)
	// Allocate a channel so we know when all data has been received
	_, ok := client.Channels[ChannelKey]
	// Delete it if it already exists
	if ok {
		delete(client.Channels, ChannelKey)
	}
	// Make the channel
	client.Channels[ChannelKey] = make(chan bool, 1)
	return ChannelKey
}

func (client *Client) AllData(callback func(map[string]interface{})) error {
	ChannelKey := client.CreateChannel()
	// Allocate a channel so we know when all data has been received
	_, ok := client.Channels[ChannelKey]
	// Delete it if it already exists
	if ok {
		delete(client.Channels, ChannelKey)
	}
	// Make the channel
	client.Channels[ChannelKey] = make(chan bool, 1)

	// go callback(allData)
	return nil
}

func (client *Client) ChooseDump(raw_message []byte) {
	// // Create a new message struct
	// message := new(storage.DumpMessage)
	// // Parse the message to a json
	// err := json.Unmarshal(raw_message, &message)
	// fmt.Println(string(raw_message))
	// // Return if error or no DumpKey or not the client specified to dump
	// if err != nil || message.DumpKey == "" ||
	// 	message.ClientId != storage.ClientId {
	// 	return
	// }
	// // Otherwise
	// // Check if this request is applicable to this instance
	// _, ok := client.Channels[message.DumpKey]
	// // If it is then there will be a channel and this will
	// if ok {
	// 	// Send the response to the channel
	// 	client.Channels[message.DumpKey] <- message.DumpChosen
	// }
}
