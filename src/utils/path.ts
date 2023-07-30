import { join } from 'path';
import { cwd } from 'process';

function getPrintedFilesPath() {
    return join(cwd(), 'files', 'prints');
}

function getScannedFilesPath() {
    return join(cwd(), 'files', 'scans');
}

function getStaticFilesPath() {
    return join(cwd(), 'front-end', 'dist');
}

export { getPrintedFilesPath, getScannedFilesPath, getStaticFilesPath };