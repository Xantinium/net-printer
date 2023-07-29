import { exec } from 'child_process';
import * as CONFIG from '../../secrets.json';

export function scan(fileName: string) {
    const command = `scanimage --format=jpeg -d "${CONFIG.PRINTER_NAME}" > "/opt/net-printer/files/scans/${fileName}.jpg"`;
    
    const promise = new Promise<void>((resolve) => {
        exec(command, () => resolve());
    });
    
    return promise;
}
