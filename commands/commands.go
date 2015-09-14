package commands

import (
	"github.com/spf13/cobra"

	"github.com/pdxjohnny/dist-rts/web"
)

var Commands = []*cobra.Command{
	&cobra.Command{
		Use:   "web",
		Short: "Runs the webserver and websocket server",
		Run: func(cmd *cobra.Command, args []string) {
			ConfigBindFlags(cmd)
			web.Run()
		},
	},
}

func init() {
	ConfigDefaults(Commands...)
}
