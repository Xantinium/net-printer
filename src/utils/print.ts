import { exec } from 'child_process';
import * as CONFIG from '../../secrets.json';
import { getPrintedFilesPath } from './path';

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
console.log(`${getPrintedFilesPath()}/${'test.pdf'}`);

function print(fileName: string) {
    const args = [
        `-d ${CONFIG.PRINTER_NAME}`,
        'media=A4',
        `${getPrintedFilesPath()}/${fileName}`,
    ];
    return createPrintProcess('lp', args);
}

export { print };
