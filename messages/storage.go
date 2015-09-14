package messages

// Store anything with an Id
type StorageUpdate struct {
	Id     string
	Method string
}

type StorageDump struct {
	Method  string
	DumpKey string
}

type StorageChooseDump struct {
	Method  string
	DumpKey string
	// The client id of the service that is chosen to dump
	ClientId string
}

type StorageDumpDone struct {
	Method  string
	DumpKey string
	Size    int
}
