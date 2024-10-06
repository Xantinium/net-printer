package utils

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
)

type ScanOptions struct {
	Printer  string
	FileName string
}

func Scan(options ScanOptions) error {
	_, err := os.Create(options.FileName)
	if err != nil {
		fmt.Println("ERROR", err.Error())
		return err
	}

	args := []string{
		"-c",
		"sudo scanimage",
		"--format=jpeg",
		"--resolution=600",
		fmt.Sprintf("--device-name=\"%s\"", options.Printer),
		fmt.Sprintf("--output-file=\"%s\"", options.FileName),
	}

	cmd := exec.Command("/bin/sh", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	fmt.Println("INFO", cmd.String())

	err = cmd.Run()
	if err != nil {
		fmt.Println("ERROR", stderr.String(), err.Error())
	}

	return err
}
