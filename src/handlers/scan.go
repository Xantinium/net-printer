package handlers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/xantinium/net-printer/src/utils"
)

func ScanHandler(w http.ResponseWriter, r *http.Request) {
	filename := fmt.Sprintf("%d.jpg", time.Now().Unix())

	err := utils.Scan(utils.ScanOptions{
		// Printer:  utils.GetPrinterNameForScan(),
		FileName: utils.GetPath(filename),
	})
	if err != nil {
		respondWithError(w, err)
		return
	}
	defer removeFile(filename)

	fileBytes, err := os.ReadFile(utils.GetPath(filename))
	if err != nil {
		respondWithError(w, err)
		return
	}

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
