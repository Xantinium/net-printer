import { join } from 'path';
import { exec } from 'child_process';
import * as CONFIG from '../../secrets.json';

export function scan() {
    const fileName = `${Date.now()}.jpg`;
    const scannedFilesDir = join(__dirname, '..', '..', 'files', 'scans');
    const command = `scanimage --format=jpeg -d "${CONFIG.PRINTER_NAME}" > "${scannedFilesDir}/${fileName}"`;
    
    const promise = new Promise<void>((resolve) => {
        exec(command, () => resolve());
    });
    
    return promise;
}
