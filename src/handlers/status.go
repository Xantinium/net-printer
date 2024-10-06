package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
)

type Status string

const (
	StatusUnknown Status = "unknown"
	StatusReady   Status = "ready"
	StatusError   Status = "error"
)

type Response struct {
	Status Status `json:"status"`
}

func StatusHandler(w http.ResponseWriter, r *http.Request) {
	stdout, err := exec.Command("lpstat", "-p").Output()
	if err != nil {
		respondWithError(w, err)
		return
	}

	fmt.Println(string(stdout))

	res := Response{
		Status: StatusReady,
	}
	resBytes, err := json.Marshal(res)
	if err != nil {
		respondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resBytes)
}
