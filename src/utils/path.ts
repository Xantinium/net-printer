import { join } from 'path';

function getPrintedFilesPath() {
    return join(__dirname, '..', '..', 'files', 'prints');
}

function getScannedFilesPath() {
    return join(__dirname, '..', '..', 'files', 'scans');
}

function getStaticFilesPath() {
    return join(__dirname, '..', '..', 'front-end', 'dist');
}

export { getPrintedFilesPath, getScannedFilesPath, getStaticFilesPath };