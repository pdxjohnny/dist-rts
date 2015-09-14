package client

import (
	"github.com/pdxjohnny/microsocket/random"
	"github.com/pdxjohnny/microsocket/service"
)

type Client struct {
	*service.Service
	// So that calling can appear syncronous
	Channels map[string]chan string
	// For sharing resources
	Shared map[string]interface{}
}

func NewClient() *Client {
	// Service setup
	inner := service.NewService()
	client := Client{Service: inner}
	client.Caller = &client
	// Init Channels map
	client.Channels = make(map[string]chan string)
	// Init Shared map
	client.Shared = make(map[string]interface{})
	return &client
}

func (client *Client) CreateChannel(key... []string) string {
	if len(key) > 0 && key[0] != "" {
		ChannelKey := key[0]
	} else {
		ChannelKey := random.Letters(10)
	}
	// Allocate a channel so we know when all data has been received
	_, ok := client.Channels[ChannelKey]
	// Delete it if it already exists
	if ok {
		delete(client.Channels, ChannelKey)
	}
	// Make the channel
	client.Channels[ChannelKey] = make(chan string, 100)
	return ChannelKey
}

func (client *Client) PrepShared(ChannelKey string) {
	_, ok := client.Shared[ChannelKey]
	// Delete it if it already exists
	if ok {
		delete(client.Shared, ChannelKey)
	}
}

func (client *Client) Save(saveThis interface{}) error {
	addUpdateKey, err := client.MapInterface(saveThis)
	if err != nil {
		return err
	}
	addUpdateKey["Method"] = "Update"
	client.SendInterface(addUpdateKey)
	return nil
}
