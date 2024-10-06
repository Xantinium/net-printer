package utils

import (
	"encoding/json"
	"os"
	"time"

	"github.com/ostafen/clover"
)

type config struct {
	PrinterNameForScan  string `json:"PRINTER_NAME_FOR_SCAN"`
	PrinterNameForPrint string `json:"PRINTER_NAME_FOR_PRINT"`
}

const MAIN_COLLECTION = "main"

var (
	c  config
	db *clover.DB
)

func InitConfig() {
	fileBytes, err := os.ReadFile("config.json")
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(fileBytes, &c)
	if err != nil {
		panic(err)
	}

	db, err = clover.Open("data")
	if err != nil {
		panic(err)
	}

	exists, err := db.HasCollection(MAIN_COLLECTION)
	if err != nil {
		panic(err)
	}

	if !exists {
		err = db.CreateCollection(MAIN_COLLECTION)
		if err != nil {
			panic(err)
		}
	}
}

func CloseDB() {
	db.Close()
}

func GetPrinterNameForScan() string {
	return c.PrinterNameForScan
}

func GetPrinterNameForPrint() string {
	return c.PrinterNameForPrint
}

type FileCategory int64

const (
	CATEGORY_IMAGE    FileCategory = 0
	CATEGORY_DOCUMENT FileCategory = 1
)

type FileItem struct {
	Id        string       `json:"id"`
	Name      string       `json:"name"`
	Category  FileCategory `json:"category"`
	CreatedAt int64        `json:"created_at"`
	Content   []byte       `json:"content"`
}

type SaveFileOptions struct {
	Name     string
	Category FileCategory
	Content  []byte
}

func SaveFile(options SaveFileOptions) error {
	document := clover.NewDocument()

	document.Set("name", options.Name)
	document.Set("category", options.Category)
	document.Set("created_at", time.Now().Unix())
	document.Set("content", options.Content)

	_, err := db.InsertOne(MAIN_COLLECTION, document)
	if err != nil {
		return err
	}

	return nil
}

func RemoveFile(id string) error {
	return db.Query(MAIN_COLLECTION).DeleteById(id)
}

func convertFileDocument(document *clover.Document) FileItem {
	return FileItem{
		Id:        document.Get("_id").(string),
		Name:      document.Get("name").(string),
		Category:  FileCategory(document.Get("category").(int64)),
		CreatedAt: document.Get("created_at").(int64),
		Content:   document.Get("content").([]byte),
	}
}

func GetFile(id string) (FileItem, error) {
	document, err := db.Query(MAIN_COLLECTION).FindById(id)
	if err != nil {
		return FileItem{}, err
	}

	return convertFileDocument(document), nil
}

func GetFiles(category FileCategory) ([]FileItem, error) {
	documents, err := db.Query(MAIN_COLLECTION).Where(clover.Field("category").Eq(category)).FindAll()
	if err != nil {
		return nil, err
	}

	files := make([]FileItem, len(documents))

	for i, document := range documents {
		files[i] = convertFileDocument(document)
	}

	return files, nil
}
