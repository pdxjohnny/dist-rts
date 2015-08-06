package client

import (
	"encoding/json"

	"github.com/pdxjohnny/microsocket/random"
	"github.com/pdxjohnny/microsocket/service"

	"github.com/pdxjohnny/dist-rts/messages"
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

func (client *Client) MapInterface(mapObj interface{}) (map[string]interface{}, error) {
	asBytes, err := json.Marshal(mapObj)
	if err != nil {
		return nil, err
	}
	return client.MapBytes(asBytes)
}

func (client *Client) MapBytes(asBytes []byte) (map[string]interface{}, error) {
	var loadValue interface{}
	err := json.Unmarshal(asBytes, &loadValue)
	if err != nil {
		return nil, err
	}
	asMap := loadValue.(map[string]interface{})
	return asMap, nil
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
	addUpdateKey, err := client.MapInterface(saveThis)
	if err != nil {
		return err
	}
	addUpdateKey["Method"] = "Update"
	return client.Send(addUpdateKey)
}

func (client *Client) AllData() map[string]interface{} {
	// Create a channel so we know the storage services id
	ChannelKey := client.CreateChannel()
	// Allocate a shared map so we can store received objects in it
	client.PrepShared(ChannelKey)
	allData := make(map[string]interface{})
	client.Shared[ChannelKey] = &allData
	// Create the Dump message
	sendDump := messages.StorageDump{
		Method:  "Dump",
		DumpKey: ChannelKey,
	}
	// Send the message to make storage services send ChooseDump
	client.Send(sendDump)
	// Wait for a ChooseDump message to come back
	StorageId := <-client.Channels[ChannelKey]
	// Create the dump message
	sendChose := messages.StorageChooseDump{
		Method:   "DumpChosen",
		DumpKey:  ChannelKey,
		ClientId: StorageId,
	}
	// Send the message to make storage services send ChooseDump
	client.Send(sendChose)
	// Wait a DumpDone message to come back
	<-client.Channels[ChannelKey]
	return allData
}

func (client *Client) ChooseDump(raw_message []byte) {
	// Create a new message struct
	message := new(messages.StorageChooseDump)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey or not the client specified to dump
	if err != nil || message.DumpKey == "" || message.ClientId == "" {
		return
	}
	// If we are waiting for this DumpKey then it will be in Channels
	_, ok := client.Channels[message.DumpKey]
	// If its not there don't worry about this message
	if !ok {
		return
	}
	client.Channels[message.DumpKey] <- message.ClientId
}

func (client *Client) DumpRecv(raw_message []byte) {
	// Parse the message to a json
	message, err := client.MapBytes(raw_message)
	// Return if error or no DumpKey or not the client specified to dump
	ChannelKey := message["DumpKey"].(string)
	if err != nil || ChannelKey == "" {
		return
	}
	// If we are waiting for this DumpKey then it will be in Channels
	_, ok := client.Channels[ChannelKey]
	// If its not there don't worry about this message
	if !ok {
		return
	}
	// Added it to the Shared map of data received
	messageId := message["Id"].(string)
	// client.Shared[ChannelKey] is a pointer to a map
	allData := client.Shared[ChannelKey].(*map[string]interface{})
	// Dereference the pointer to the map
	(*allData)[messageId] = &message
}

func (client *Client) DumpDone(raw_message []byte) {
	// Parse the message to a json
	message, err := client.MapBytes(raw_message)
	// Return if error or no DumpKey or not the client specified to dump
	ChannelKey := message["DumpKey"].(string)
	if err != nil || ChannelKey == "" {
		return
	}
	// If we are waiting for this DumpKey then it will be in Channels
	_, ok := client.Channels[ChannelKey]
	// If its not there don't worry about this message
	if !ok {
		return
	}
	// Send the done signal to the channel
	client.Channels[ChannelKey] <- "Done"
}
