package utils

import (
	"bytes"
	"fmt"
	"os/exec"
)

type PrintFileOptions struct {
	FileName  string
	Pages     string
	CopiesNum int
}

func PrintFile(options PrintFileOptions) error {
	args := []string{
		"-c",
		"sudo lp",
		"-o print-quality=5",
		"-o outputorder=reverse",
		"-o media=A4",
		"-o Resolution=600dpi",
		fmt.Sprintf("-n %d", options.CopiesNum),
	}

	switch options.Pages {
	case "":
	case "odd":
		args = append(args, "-o page-set=odd")
	case "even":
		args = append(args, "-o page-set=even")
	default:
		args = append(args, fmt.Sprintf("-o page-ranges=\"%s\"", options.Pages))
	}

	args = append(args, fmt.Sprintf("\"%s\"", options.FileName))

	cmd := exec.Command("/bin/sh", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	fmt.Println("INFO", cmd.String())

	err := cmd.Run()
	if err != nil {
		fmt.Println("ERROR", stderr.String(), err.Error())
	}

	return err
}
