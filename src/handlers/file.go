package handlers

import (
	"errors"
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

func getFile(r *http.Request) (utils.FileItem, error) {
	fileId := r.URL.Query().Get("file_id")
	if fileId == "" {
		return utils.FileItem{}, errors.New("empty file_id param")
	}

	file, err := utils.GetFile(fileId)
	if err != nil {
		return utils.FileItem{}, err
	}

	return file, nil
}

func FileHandler(w http.ResponseWriter, r *http.Request) {
	file, err := getFile(r)
	if err != nil {
		respondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(file.Content)
}
