package utils

import (
	"fmt"
	"os/exec"
)

type ScanOptions struct {
	Printer  string
	FileName string
}

func Scan(options ScanOptions) error {
	args := []string{
		"--format=jpeg",
		"--resolution=600",
		fmt.Sprintf("--device-name=\"%s\"", options.Printer),
		">",
		fmt.Sprintf("\"%s\"", options.FileName),
	}

	cmd := exec.Command("scanimage", args...)
	fmt.Println("INFO", cmd.String())

	err := cmd.Run()
	if err != nil {
		fmt.Println("ERROR", err.Error())
	}

	return err
}
