import { Injectable } from '@nestjs/common';
import { ScanProps, scan } from './utils/scan';
import { PrintOptions, print } from './utils/print';
import { getPrintedFilesPath, getScannedFilesPath } from './utils/path';
import { readdir, unlinkSync } from 'node:fs';

export type Category = 'prints' | 'scans';

@Injectable()
export class AppService {
	scan(props: ScanProps) {
		return scan(props);
	}

	print(options: PrintOptions) {
		return print(options);
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

	removeFile(category: Category, name: string) {
		const path = `${category === 'scans' ? getScannedFilesPath() : getPrintedFilesPath()}/${name}`;
		unlinkSync(path);
	}
}
