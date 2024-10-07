package handlers

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/xantinium/net-printer/src/utils"
)

func PrintHandler(w http.ResponseWriter, r *http.Request) {
	file, err := getFile(r)
	if err != nil {
		respondWithError(w, err)
		return
	}

	err = os.WriteFile(utils.GetPath(file.Id), file.Content, os.ModeDevice)
	if err != nil {
		respondWithError(w, err)
		return
	}
	defer removeFile(file.Id)

	err = utils.PrintFile(utils.PrintFileOptions{
		FileName:  utils.GetPath(file.Id),
		Pages:     getPages(r),
		CopiesNum: getCopiesNum(r),
	})
	if err != nil {
		respondWithError(w, err)
		return
	}

	respondWithNoData(w)
}

func removeFile(name string) {
	time.AfterFunc(time.Minute*5, func() {
		os.Remove(utils.GetPath(name))
	})
}

func getPages(r *http.Request) string {
	return r.URL.Query().Get("pages")
}

func getCopiesNum(r *http.Request) int {
	copiesNumStr := r.URL.Query().Get("copies_num")

	if copiesNumStr == "" {
		return 1
	}

	copiesNum, err := strconv.Atoi(copiesNumStr)
	if err != nil {
		return 1
	}

	return copiesNum
}
