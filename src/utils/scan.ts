import { exec } from 'child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --resolution=600 --progress > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<void>((resolve) => {
        exec(command, () => resolve());
    });
    
    return promise;
}
