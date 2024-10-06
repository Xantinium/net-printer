package handlers

import (
	"errors"
	"net/http"
)

func respondWithError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
}

func respondWithNoData(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func WithRecover(handler func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			r := recover()
			if r != nil {
				var err error
				switch t := r.(type) {
				case string:
					err = errors.New(t)
				case error:
					err = t
				default:
					err = errors.New("Unknown error")
				}

				respondWithError(w, err)
			}
		}()

		handler(w, r)
	}
}
