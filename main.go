package main

import (
	"runtime"

	"github.com/spf13/cobra"

	"github.com/pdxjohnny/dist-rts/commands"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	var rootCmd = &cobra.Command{Use: "dist-rts"}
	rootCmd.AddCommand(commands.Commands...)
	rootCmd.Execute()
}
