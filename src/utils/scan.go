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
		fmt.Sprintf("--device-name=%s", options.Printer),
		">",
		options.FileName,
	}

	return exec.Command("scanimage", args...).Run()
}
