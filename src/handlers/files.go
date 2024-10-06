package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

func FilesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := utils.GetFiles()
	if err != nil {
		respondWithError(w, err)
	}

	filesBytes, err := json.Marshal(files)
	if err != nil {
		respondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(filesBytes)
}
