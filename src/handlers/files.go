package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

type FileElement struct {
	Id        string             `json:"id"`
	Name      string             `json:"name"`
	Category  utils.FileCategory `json:"category"`
	CreatedAt int64              `json:"created_at"`
}

func FilesHandler(w http.ResponseWriter, r *http.Request) {
	filesItems, err := utils.GetFiles()
	if err != nil {
		respondWithError(w, err)
		return
	}

	files := make([]FileElement, len(filesItems))
	for index, file := range filesItems {
		files[index] = FileElement{
			Id:        file.Id,
			Name:      file.Name,
			Category:  file.Category,
			CreatedAt: file.CreatedAt,
		}
	}

	filesBytes, err := json.Marshal(files)
	if err != nil {
		respondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(filesBytes)
}
