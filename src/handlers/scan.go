package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/xantinium/net-printer/src/utils"
)

func ScanHandler(w http.ResponseWriter, r *http.Request) {
	fileBytes, err := utils.Scan()
	if err != nil {
		respondWithError(w, err)
		return
	}

	filename := fmt.Sprintf("%d.jpg", time.Now().Unix())

	err = utils.SaveFile(utils.SaveFileOptions{
		Name:     filename,
		Category: utils.CATEGORY_IMAGE,
		Content:  fileBytes,
	})
	if err != nil {
		respondWithError(w, err)
		return
	}

	respondWithNoData(w)
}
