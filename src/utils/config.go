package utils

import (
	"encoding/json"
	"os"
	"path"
	"time"

	"github.com/ostafen/clover/v2"
	"github.com/ostafen/clover/v2/document"
	"github.com/ostafen/clover/v2/query"
)

type config struct {
	RootDir             string `json:"ROOT_DIR"`
	PrinterNameForScan  string `json:"PRINTER_NAME_FOR_SCAN"`
	PrinterNameForPrint string `json:"PRINTER_NAME_FOR_PRINT"`
}

const MAIN_COLLECTION = "main"

var (
	c  config
	db *clover.DB
)

func GetPath(subpath string) string {
	return path.Join(c.RootDir, subpath)
}

func InitConfig() {
	fileBytes, err := os.ReadFile("config.json")
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(fileBytes, &c)
	if err != nil {
		panic(err)
	}

	os.Mkdir(GetPath("data"), os.ModeDir)

	db, err = clover.Open(GetPath("data"))
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
	doc := document.NewDocument()

	doc.Set("name", options.Name)
	doc.Set("category", options.Category)
	doc.Set("created_at", time.Now().Unix())
	doc.Set("content", options.Content)

	_, err := db.InsertOne(MAIN_COLLECTION, doc)
	if err != nil {
		return err
	}

	return nil
}

func RemoveFile(id string) error {
	return db.DeleteById(MAIN_COLLECTION, id)
}

func convertFileDocument(doc *document.Document) FileItem {
	return FileItem{
		Id:        doc.Get("_id").(string),
		Name:      doc.Get("name").(string),
		Category:  FileCategory(doc.Get("category").(int64)),
		CreatedAt: doc.Get("created_at").(int64),
		Content:   doc.Get("content").([]byte),
	}
}

func GetFile(id string) (FileItem, error) {
	doc, err := db.FindById(MAIN_COLLECTION, id)
	if err != nil {
		return FileItem{}, err
	}

	return convertFileDocument(doc), nil
}

func GetFiles() ([]FileItem, error) {
	docs, err := db.FindAll(query.NewQuery(MAIN_COLLECTION))
	if err != nil {
		return nil, err
	}

	files := make([]FileItem, len(docs))

	for i, doc := range docs {
		files[i] = convertFileDocument(doc)
	}

	return files, nil
}
