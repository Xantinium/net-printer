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

	cmd := exec.Command("scanimage", args...)
	fmt.Println(cmd.String())

	stdout, err := cmd.Output()
	fmt.Println(string(stdout))
	if err != nil {
		fmt.Println(err.Error())
	}

	return err
}
