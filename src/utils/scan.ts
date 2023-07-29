import { spawn } from 'child_process';
import * as CONFIG from '../../secrets.json';

export function scan(fileName: string) {
    const promise = new Promise<void>((resolve) => {
        const process = spawn(`scanimage --format=jpeg -d "${CONFIG.PRINTER_NAME}" > "${__dirname}/files/scans/${fileName}.jpg"`);

        process.addListener('close', () => resolve());
    });
    
    return promise;
}
