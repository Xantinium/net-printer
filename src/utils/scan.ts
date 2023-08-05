import { spawn } from 'node:child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --format=jpeg --resolution=300 --progress > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<void>((resolve, reject) => {
        const process = spawn(command);

        process.stdout.on('data', (data) => {
            console.log(data);
        })

        process.on('error', () => {
            reject();
        });

        process.on('close', () => {
            resolve();
        })
    });
    
    return promise;
}
