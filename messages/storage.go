package messages

// Store anything with an Id
type StorageUpdate struct {
	Id     string
	Method string
}

// Store anything with an Id
type StorageDump struct {
	StorageUpdate
	DumpKey  string
	// The client id of the service that is chosen to dump
	ClientId string
	Method   string
}

// Store anything with an Id
type StorageChooseDump struct {
	StorageUpdate
	Method  string
	DumpKey string
	// The client id of the service that is chosen to dump
	ClientId string
}
