import { Injectable } from '@nestjs/common';
import { scan } from './utils/scan';
import { print } from './utils/print';
import { getPrintedFilesPath, getScannedFilesPath } from './utils/path';
import fs from 'fs';

export type Category = 'prints' | 'scans';

@Injectable()
export class AppService {
	scan() {
		return scan();
	}

	print(fileName: string) {
		return print(fileName);
	}

	async getFiles(category: Category) {
		const filesPath = category === 'prints' ? getPrintedFilesPath() : getScannedFilesPath();
		
		return new Promise((resolve) => {
			fs.readdir(filesPath, (_, files) => {
				resolve(files.map((el) => ({
					name: el,
					path: `files/${category}/${el}`,
				})));
			});
		});
	}
}
