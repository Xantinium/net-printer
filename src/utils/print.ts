import { exec } from 'child_process';
import * as CONFIG from '../../secrets.json';
import { getPrintedFilesPath } from './path';

export type PrintOptions = {
	fileName: string
	resolution: string
	pages: string
};

async function createPrintProcess(command: string, args: string[]): Promise<string | null> {
    const promise = new Promise<string | null>((resolve, reject) => {
        const process = exec(`${command} ${args.join(' ')}`);

        const chunks = [];
        const errorChunks = [];

        process.stdout.addListener('data', (data) => {
            chunks.push(data);
        });

        process.stderr.addListener('data', (data) => {
            errorChunks.push(data);
        });

        process.addListener('error', (error) => {
            reject(error.message);
        });

        process.addListener('close', (code) => {
            if (code !== 0) {
                const errorMessage = Buffer.concat(errorChunks).toString();
                reject(errorMessage);
                return;
            }
            resolve(null);
        });
    });

    return promise;
}

function print(options: PrintOptions) {
    const args = [
        `-d ${CONFIG.PRINTER_NAME}`,
        '-o media=A4',
        options.pages === '' ? null : `-o page-ranges=${options.pages}`,
        `-o resolution=${options.resolution}`,
        `${getPrintedFilesPath()}/${options.fileName}`,
    ];
    return createPrintProcess('lp', args.filter((el) => el !== null));
}

export { print };
