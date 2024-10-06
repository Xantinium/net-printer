package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

func getCategory(r *http.Request) utils.FileCategory {
	category := r.URL.Query().Get("category")

	switch category {
	case string(utils.CATEGORY_IMAGE):
		return utils.CATEGORY_IMAGE
	default:
		return utils.CATEGORY_DOCUMENT
	}
}

func FilesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := utils.GetFiles(getCategory(r))
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
