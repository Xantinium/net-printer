import { Injectable } from '@nestjs/common';
import { scan } from './utils/scan';
import { print } from './utils/print';
import { getPrintedFilesPath, getScannedFilesPath } from './utils/path';
import { readdir } from 'node:fs';

export type Category = 'prints' | 'scans';

@Injectable()
export class AppService {
	scan() {
		return scan();
	}

	print(fileName: string) {
		return print(fileName);
	}

	async getFiles(category: string): Promise<Array<{
		name: string
		path: string
	}>> {
		if (!['prints', 'scans'].includes(category)) {
			return [];
		}

		const filesPath = category === 'prints' ? getPrintedFilesPath() : getScannedFilesPath();
		
		return new Promise((resolve) => {
			readdir(filesPath, (_, files) => {
				resolve(files.map((el) => ({
					name: el,
					path: `api/files/${category}/${el}`,
				})));
			});
		});
	}
}
