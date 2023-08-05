import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { AppService, Category } from './app.service';
import { createReadStream } from 'fs';
import { getPrintedFilesPath, getScannedFilesPath } from './utils/path';
import { Response } from 'express';
import { Resolution } from './utils/scan';

type PrintBody = {
	fileName: string
};

type GetFilesQuery = {
	category: Category
};

type ScanQuery = {
	resolution: Resolution
};

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('scan')
	scan(@Query() query: ScanQuery) {
		return this.appService.scan({
			resolution: query.resolution,
		});
	}

	@Post('print')
	print(@Body() body: PrintBody) {
		return this.appService.print(body.fileName);
	}

	@Get('files')
	getFiles(@Query() query: GetFilesQuery) {
		return this.appService.getFiles(query.category);
	}

	@Get('files/prints/:fileName')
	getPrintedFile(@Param() params: { fileName: string }, @Res() res: Response) {
		createReadStream(`${getPrintedFilesPath()}/${params.fileName}`).pipe(res);
	}

	@Get('files/scans/:fileName')
	getScannedFile(@Param() params: { fileName: string }, @Res() res: Response) {
		createReadStream(`${getScannedFilesPath()}/${params.fileName}`).pipe(res);
	}
}
