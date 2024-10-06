package utils

import (
	"fmt"
	"os/exec"
)

type PrintFileOptions struct {
	Printer   string
	FileName  string
	Pages     string
	CopiesNum int
}

func PrintFile(options PrintFileOptions) error {
	args := []string{
		"-o print-quality=5",
		"-o outputorder=reverse",
		"-o media=A4",
		"-o Resolution=600dpi",
		fmt.Sprintf("-d %s", options.Printer),
		fmt.Sprintf("-n %d", options.CopiesNum),
	}

	switch options.Pages {
	case "":
	case "odd":
		args = append(args, "-o page-set=odd")
	case "even":
		args = append(args, "-o page-set=even")
	default:
		args = append(args, fmt.Sprintf("-o page-ranges=%s", options.Pages))
	}

	args = append(args, options.FileName)

	cmd := exec.Command("lp", args...)
	fmt.Println("INFO", cmd.String())

	err := cmd.Run()
	if err != nil {
		fmt.Println("ERROR", err.Error())
	}

	return err
}
