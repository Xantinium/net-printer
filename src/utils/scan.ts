import { exec } from 'node:child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --format=jpeg --resolution=300 --progress > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<void>((resolve, reject) => {
        const process = exec(command);

        process.on('close', resolve);
        process.on('error', reject);

        process.on('message', (...data) => {
            console.log('process', data);
        })
        process.stdout.on('data', (chunk) => {
            console.log('chunk', chunk);
        });
    });
    
    return promise;
}
