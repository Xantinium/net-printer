import { spawn } from 'child_process';
import secrets from '../secrets.json';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';

const iLovePdfApi = new ILovePDFApi(secrets.public, secrets.secret);

const task = iLovePdfApi.newTask('officepdf');

function convertDocxToPdf(path) {}

export function scan() {
    const promise = new Promise((resolve) => {
        const process = spawn('scanimage --format=jpeg -d "pixma:04A9183A_94D745" > "/opt/test.jpg"');

        process.addListener('close', () => resolve());
    });
    
    return promise;
}
