package utils

import (
	"bytes"
	"fmt"
	"os/exec"
)

func Scan() ([]byte, error) {
	args := []string{
		"--format=jpeg",
		"--resolution=600",
	}

	cmd := exec.Command("scanimage", args...)
	var stderr bytes.Buffer
	var stdout bytes.Buffer
	cmd.Stderr = &stderr
	cmd.Stdout = &stdout
	fmt.Println("INFO", cmd.String())

	err := cmd.Run()
	if err != nil {
		fmt.Println("ERROR", stderr.String(), err.Error())
		return nil, err
	}

	return stdout.Bytes(), nil
}
