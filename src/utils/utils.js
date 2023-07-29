import fs from 'node:fs';
import { spawn } from 'child_process';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';

const PUBLIC_KEY = 'project_public_1945a4048e228c5d9aa0bfac6d45cd75_iSXRl0bcdc4c4f7b1ec34d78c405516aa1df5';
const SECRET_KEY = 'secret_key_7abd132ce7f8d5ec7ae3f3593310eca5_TvQwW7683637cce998488a16559a27cb207b8';

const iLovePdfApi = new ILovePDFApi(PUBLIC_KEY, SECRET_KEY);

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
