import { StatusRequest, StatusResponse } from './status';
import { FilesRequest, FilesResponse } from './files';
import { PrintRequest, PrintResponse } from './print';
import { ScanRequest, ScanResponse } from './scan';
import { FileUploadRequest, FileUploadResponse } from './file-upload';
import { FileRemoveRequest, FileRemoveResponse } from './file-remove';

type Endpoints = {
    '/status': {
        request: StatusRequest;
        response: StatusResponse;
    };
    '/files': {
        request: FilesRequest;
        response: FilesResponse;
    };
    '/print': {
        request: PrintRequest;
        response: PrintResponse;
    };
    '/scan': {
        request: ScanRequest;
        response: ScanResponse;
    };
    '/file_upload': {
        request: FileUploadRequest;
        response: FileUploadResponse;
    };
    '/file_remove': {
        request: FileRemoveRequest;
        response: FileRemoveResponse;
    };
};

class HTTPClient {
    getPrinterStatus() {
        return this.request('/status', {});
    }

    getFiles() {
        return this.request('/files', {});
    }

    print(filename: string, copiesNum: number, pages: string) {
        return this.request('/print', {
            filename,
            copies_num: copiesNum,
            pages,
        });
    }

    scan() {
        return this.request('/scan', {});
    }

    uploadFile(filename: string, content: ArrayBuffer) {
        return this.request('/file_upload', {
            filename,
            _content: new Uint8Array(content).toString(),
        });
    }

    removeFile(id: string) {
        return this.request('/file_remove', { id });
    }

    // eslint-disable-next-line class-methods-use-this
    private async request<E extends keyof Endpoints>(endpoint: E, payload: Endpoints[E]['request']) {
        const body: Record<string, string> = {};
        const params = new URLSearchParams();

        Object.entries(payload).forEach((entry) => {
            const [field, value] = entry;

            if (field[0] === '_') {
                body[field.slice(1)] = String(value);
            } else {
                params.set(field, String(value));
            }
        });

        try {
            const url = `/api${endpoint}?${params.toString()}`;
            const rawResponse = await fetch(url, Object.keys(body).length === 0 ? undefined : {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const response = await rawResponse.text();

            if (rawResponse.status !== 200) {
                return new Error(response);
            }

            return JSON.parse(response) as Endpoints[E]['response'];
        } catch (err) {
            return new Error(String(err));
        }
    }
}

export const httpClient = new HTTPClient();
