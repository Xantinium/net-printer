package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/xantinium/net-printer/src/utils"
)

type Request struct {
	Content string `json:"content"`
}

func getFileContent(req Request) []byte {
	chars := strings.Split(req.Content, ",")
	fileBytes := make([]byte, len(chars))
	for i, char := range chars {
		byteChar, _ := strconv.Atoi(char)
		fileBytes[i] = byte(byteChar)
	}
	return fileBytes
}

func FileUploadHandler(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Query().Get("filename")
	body, err := io.ReadAll(r.Body)
	if err != nil {
		respondWithError(w, err)
		return
	}

	var req Request
	err = json.Unmarshal(body, &req)
	if err != nil {
		respondWithError(w, err)
		return
	}

	err = utils.SaveFile(utils.SaveFileOptions{
		Name:     filename,
		Category: utils.CATEGORY_DOCUMENT,
		Content:  getFileContent(req),
	})
	if err != nil {
		respondWithError(w, err)
		return
	}

	respondWithNoData(w)
}
