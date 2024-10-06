package handlers

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"strings"
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
	res := Response{Status: StatusUnknown}

	stdout, err := exec.Command("lpstat", "-p").Output()
	if err != nil {
		res.Status = StatusError
	} else {
		if strings.Contains(string(stdout), "enabled") {
			res.Status = StatusReady
		}
	}

	resBytes, err := json.Marshal(res)
	if err != nil {
		respondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resBytes)
}
