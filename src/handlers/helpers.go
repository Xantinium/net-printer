package handlers

import (
	"errors"
	"net/http"

	"github.com/xantinium/net-printer/src/utils"
)

type CustomHandler struct {
	fileServer http.Handler
	handlers   map[string]http.HandlerFunc
}

func (ch *CustomHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	handler, exists := ch.handlers[r.URL.Path]
	if exists {
		withRecover(handler)(w, r)
		return
	}

	ch.fileServer.ServeHTTP(w, r)
}

func respondWithError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
}

func respondWithNoData(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}

func withRecover(handler func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
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
					err = errors.New("unknown error")
				}

				respondWithError(w, err)
			}
		}()

		handler(w, r)
	}
}

func RegisterHandlers(mux *http.ServeMux, handlers map[string]http.HandlerFunc) {
	mux.Handle("/", &CustomHandler{
		fileServer: http.FileServer(http.Dir(utils.GetPath("frontend/dist"))),
		handlers:   handlers,
	})
}
