import fs from 'node:fs';
import { spawn } from 'child_process';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';
import * as CONFIG from '../../secrets.json';

const iLovePdfApi = new ILovePDFApi(CONFIG.ILOVEPDF_PUBLIC_KEY, CONFIG.ILOVEPDF_SECRET_KEY);

/**
 * Функция для преобразования: docx => pdf
 * @param {string} path
 */
async function convertDocxToPdf(path) {
    const task = iLovePdfApi.newTask('officepdf');
    await task.start();
    const file = new ILovePDFFile(path);
    await task.addFile(file);
    await task.process();
    const data = await task.download();
    fs.writeFileSync('/home/vladislav/Downloads/test.pdf', data);
}

convertDocxToPdf('/home/vladislav/Downloads/test.docx');

/**
 * Функция для создания дочернего процесса
 * @param {string} command 
 * @param {string[]} args 
 * @param {Buffer?} buffer 
 */
async function spawnProcess(command, args, buffer = null) {
    const promise = new Promise((resolve, reject) => {
        const process = spawn(command, args);

        const chunks = [];
        const errorChunks = [];

        if (buffer !== null) {
            process.stdin.write(buffer);
            process.stdin.end();
        }

        process.stdout.addListener('data', (data) => {
            chunks.push(data);
        });

        process.stderr.addListener('data', (data) => {
            errorChunks.push(data);
        });

        process.addListener('error', (error) => {
            reject(error);
        });

        process.addListener('close', (code) => {
            if (code !== 0) {
                const errorMessage = Buffer.concat(errorChunks).toString();
                reject(new Error(errorMessage));
                return;
            }
            const successMessage = Buffer.concat(chunks).toString();
            resolve(successMessage);
        });
    });

    return promise;
}

export {
    spawnProcess,
};
