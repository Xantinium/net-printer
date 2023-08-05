import { exec } from 'node:child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --format=jpeg --resolution=75 --progress > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<void>((resolve) => {
        exec(command, (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
            resolve();
        });
    });
    
    return promise;
}
