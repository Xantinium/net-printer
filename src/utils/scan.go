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
		fmt.Sprint("\"%s\"", options.FileName),
	}

	cmd := exec.Command("scanimage", args...)
	fmt.Println("INFO", cmd.String())

	stdout, err := cmd.Output()
	fmt.Println("INFO", string(stdout))
	if err != nil {
		fmt.Println("ERROR", err.Error())
	}

	return err
}
