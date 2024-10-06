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

	mux.HandleFunc("/api/scan", handlers.WithRecover(handlers.ScanHandler))
	mux.HandleFunc("/api/print", handlers.WithRecover(handlers.PrintHandler))
	mux.HandleFunc("/api/files", handlers.WithRecover(handlers.FilesHandler))
	mux.HandleFunc("/api/file_upload", handlers.WithRecover(handlers.FileUploadHandler))
	mux.HandleFunc("/api/file_remove", handlers.WithRecover(handlers.FileRemoveHandler))

	err := http.ListenAndServe(":80", mux)
	if err != nil {
		panic(err)
	}
}
