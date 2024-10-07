package main

import (
	"net/http"

	"github.com/xantinium/net-printer/src/handlers"
	"github.com/xantinium/net-printer/src/utils"
)

func main() {
	utils.InitConfig()
	defer utils.CloseDB()

	mux := http.NewServeMux()

	handlers.RegisterHandlers(mux, map[string]http.HandlerFunc{
		"/api/scan":        handlers.ScanHandler,
		"/api/print":       handlers.PrintHandler,
		"/api/file":        handlers.FileHandler,
		"/api/files":       handlers.FilesHandler,
		"/api/file_upload": handlers.FileUploadHandler,
		"/api/file_remove": handlers.FileRemoveHandler,
		"/api/status":      handlers.StatusHandler,
	})

	err := http.ListenAndServe(":80", mux)
	if err != nil {
		panic(err)
	}
}
