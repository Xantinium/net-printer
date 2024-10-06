package handlers

import (
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

func FileRemoveHandler(w http.ResponseWriter, r *http.Request) {
	fileId := r.URL.Query().Get("id")

	err := utils.RemoveFile(fileId)
	if err != nil {
		respondWithError(w, err)
		return
	}

	respondWithNoData(w)
}
