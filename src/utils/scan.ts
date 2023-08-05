import { exec } from 'node:child_process';
import * as CONFIG from '../../secrets.json';
import { getScannedFilesPath } from './path';

export type Resolution = 75 | 150 | 300 | 600;

export type ScanProps = {
    resolution: Resolution
}

export function scan(props: ScanProps): Promise<null | string> {
    const { resolution } = props;

    const fileName = `${Date.now()}.jpg`;
    const command = `scanimage --device-name=${CONFIG.PRINTER_NAME} --format=jpeg --resolution=${resolution} > ${getScannedFilesPath()}/${fileName}`;
    
    const promise = new Promise<null | string>((resolve, reject) => {
        const process = exec(command);

        process.addListener('close', () => {
            resolve(null);
        });

        process.addListener('error', (error) => {
            reject(error.message);
        });
    });
    
    return promise;
}
