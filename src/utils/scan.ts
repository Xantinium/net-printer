import { exec } from 'node:child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

let output = '';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --format=jpeg --resolution=300 --progress > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<void>((resolve, reject) => {
        const process = exec(command);

        process.addListener('close', () => {
            setTimeout(() => {
                console.log('close', output);
            }, 2000);
            resolve();
        });

        process.addListener('error', () => {
            reject();
        });

        process.stdout.addListener('data', (data) => {
            output += `${data}\n`;
        });
    });
    
    return promise;
}
