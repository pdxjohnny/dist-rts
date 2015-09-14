package client

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/pdxjohnny/dist-rts/messages"
)

func (client *Client) AllData() map[string]interface{} {
	// Create a channel so we know the storage services id
	ChannelKey := client.CreateChannel()
	ChannelKeyDone := client.CreateChannel(ChannelKey + "_done")
	// Allocate a shared map so we can store received objects in it
	client.PrepShared(ChannelKey)
	allData := make(map[string]interface{})
	client.Shared[ChannelKey] = &allData
	// Send the message to make storage services send ChooseDump
	client.SendInterface(messages.StorageDump{
		Method:  "Dump",
		DumpKey: ChannelKey,
	})
	// Wait for a ChooseDump message to come back
	StorageId := <-client.Channels[ChannelKey]
	// Send the dump message to make storage services send ChooseDump
	client.SendInterface(messages.StorageChooseDump{
		Method:   "DumpChosen",
		DumpKey:  ChannelKey,
		ClientId: StorageId,
	})
	numNeeded := -1
	numRecieved := 0
	allDone := make(chan bool, 1)
	go func() {
		for {
			// Increent numRecieved when a dump message is received
			<-client.Channels[ChannelKey]
			numRecieved++
			// If there are as many or more and needed then return
			if numNeeded != -1 && numRecieved >= numNeeded {
				allDone <- true
				return
			}
		}
	}()
	go func() {
		// Set the amount of dumps sent as numNeeded
		size := <-client.Channels[ChannelKeyDone]
		add, err := strconv.Atoi(size)
		if err != nil {
			log.Println("AllData", err)
		}
		numNeeded = add
		// If there are as many or more and needed then return
		if numNeeded != -1 && numRecieved >= numNeeded {
			allDone <- true
		}
	}()
	// Wait for all to be received before returning
	<-allDone
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
	// client.Shared[ChannelKey] is a pointer to a map
	allData := client.Shared[ChannelKey].(*map[string]interface{})
	// Added it to the Shared map of data received
	// Dereference the pointer to the map
	(*allData)[message["Id"].(string)] = &message
	// One was received so send that to AllData
	client.Channels[ChannelKey] <- ""
}

func (client *Client) DumpDone(raw_message []byte) {
	// Create a new message struct
	message := new(messages.StorageDumpDone)
	// Parse the message to a json
	err := json.Unmarshal(raw_message, &message)
	// Return if error or no DumpKey or not the client specified to dump
	if err != nil || message.DumpKey == "" {
		log.Fatalln("Error in dumpdone Parse")
		return
	}
	// If we are waiting for this DumpKey then it will be in Channels
	_, ok := client.Channels[message.DumpKey]
	// If its not there don't worry about this message
	if !ok {
		return
	}
	// Send the done signal to the channel
	client.Channels[message.DumpKey+"_done"] <- strconv.Itoa(message.Size)
}
