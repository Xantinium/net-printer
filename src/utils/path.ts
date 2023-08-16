import { join } from 'path';

const GENERAL_PATH = '/opt/net-printer';

function getPrintedFilesPath() {
    return join(GENERAL_PATH, 'files', 'prints');
}

function getScannedFilesPath() {
    return join(GENERAL_PATH, 'files', 'scans');
}

function getStaticFilesPath() {
    return join(GENERAL_PATH, 'front-end', 'dist');
}

export { getPrintedFilesPath, getScannedFilesPath, getStaticFilesPath };