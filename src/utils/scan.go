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

	stdout, err := exec.Command("scanimage", args...).Output()
	fmt.Println(string(stdout))
	if err != nil {
		fmt.Println(err.Error())
	}

	return err
}
