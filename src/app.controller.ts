import { Controller, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService, Category } from './app.service';
import { createReadStream, appendFileSync } from 'fs';
import { getPrintedFilesPath, getScannedFilesPath } from './utils/path';
import { Response } from 'express';
import { Resolution } from './utils/scan';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertDocxToPdf } from './utils/convert';

type GetFilesQuery = {
	category: Category
};

type ScanQuery = {
	resolution: Resolution
};

type PrintQuery = {
	name: string
	pages: string
	resolution: string
	copy_num: number
};

type RemoveFileQuery = {
	name: string
};

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('scan')
	async scan(@Query() query: ScanQuery) {
		try {
			await this.appService.scan({
				resolution: query.resolution,
			});
		} catch (error) {
			return { errorMsg: error };
		}
		
		return { errorMsg: null };
	}

	@Get('print')
	print(@Query() query: PrintQuery) {
		return this.appService.print({
			fileName: query.name,
			resolution: query.resolution,
			pages: query.pages,
			copy_num: query.copy_num,
		});
	}

	@Get('files')
	getFiles(@Query() query: GetFilesQuery) {
		return this.appService.getFiles(query.category);
	}

	@Get('remove_print')
	removePrint(@Query() query: RemoveFileQuery) {
		return this.appService.removeFile('prints', query.name);
	}

	@Get('remove_scan')
	removeScan(@Query() query: RemoveFileQuery) {
		return this.appService.removeFile('scans', query.name);
	}

	@Get('files/prints/:fileName')
	getPrintedFile(@Param() params: { fileName: string }, @Res() res: Response) {
		createReadStream(`${getPrintedFilesPath()}/${params.fileName}`).pipe(res);
	}

	@Get('files/scans/:fileName')
	getScannedFile(@Param() params: { fileName: string }, @Res() res: Response) {
		createReadStream(`${getScannedFilesPath()}/${params.fileName}`).pipe(res);
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const type = file.mimetype === 'application/pdf' ? 'pdf' : 'docx';
		const fileName = `${Date.now()}.${type}`;
		const filePath = `${getPrintedFilesPath()}/${fileName}`;
		appendFileSync(filePath, file.buffer);
		if (type === 'docx') {
			await convertDocxToPdf(fileName);
			this.appService.removeFile('prints', fileName);
		}
	}
}
