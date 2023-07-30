import fs from 'node:fs';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';
import * as CONFIG from '../../secrets.json';
import { getPrintedFilesPath } from './path';

const iLovePdfApi = new ILovePDFApi(CONFIG.ILOVEPDF_PUBLIC_KEY, CONFIG.ILOVEPDF_SECRET_KEY);

async function convertDocxToPdf(fileName: string) {
    const task = iLovePdfApi.newTask('officepdf');
    await task.start();
    const file = new ILovePDFFile(`${getPrintedFilesPath()}/${fileName}`);
    await task.addFile(file);
    await task.process();
    const data = await task.download();
    fs.writeFileSync(`${getPrintedFilesPath()}/${fileName.slice(0, -5)}.pdf`, data);
}

export { convertDocxToPdf };
