package commands

import (
	"github.com/spf13/cobra"

	"github.com/pdxjohnny/dist-rts/config"

	"github.com/pdxjohnny/dist-rts/storage"
	"github.com/pdxjohnny/dist-rts/web"
)

var Commands = []*cobra.Command{
	&cobra.Command{
		Use:   "web",
		Short: "Runs the webserver and websocket server",
		Run: func(cmd *cobra.Command, args []string) {
			config.ConfigBindFlags(cmd)
			web.Run()
		},
	},
	&cobra.Command{
		Use:   "storage",
		Short: "Run the storage service",
		Run: func(cmd *cobra.Command, args []string) {
			config.ConfigBindFlags(cmd)
			storage.Run()
		},
	},
}

func init() {
	config.ConfigDefaults(Commands...)
}
