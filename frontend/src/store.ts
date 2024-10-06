import { action, makeObservable, observable } from 'mobx';
import { httpClient } from './http';
import { FileItem, FilesTypes } from './http/files';

type SelectedFile = {
    name: string;
    content: ArrayBuffer;
};

export class AppStore {
    @observable
    private selectedFile: SelectedFile | null;

    @observable
    private filesCategory: FilesTypes;

    @observable
    private files: FileItem[];

    constructor() {
        this.selectedFile = null;
        this.filesCategory = FilesTypes.DOCUMENT;
        this.files = [];

        this.reloadFiles();

        makeObservable(this);
    }

    getFiles = () => this.files;

    hasSelectedFile = () => this.selectedFile !== null;

    @action.bound
    async scan() {
        const response = await httpClient.scan();
        if (response instanceof Error) {
            console.log(response);
            return;
        }

        this.reloadFiles();
    }

    @action.bound
    onFileChange(filename: string, content: ArrayBuffer) {
        this.selectedFile = {
            name: filename,
            content,
        };

        this.uploadFile();
    }

    @action.bound
    async removeFile(id: string) {
        const response = await httpClient.removeFile(id);
        if (response instanceof Error) {
            console.log(response);
            return;
        }

        this.setFiles(this.files.filter((file) => file.id !== id));
    }

    @action.bound
    private setFiles(files: FileItem[]) {
        this.files = files;
    }

    @action.bound
    private async reloadFiles() {
        const response = await httpClient.getFiles(this.filesCategory);
        if (response instanceof Error) {
            console.log(response);
            return;
        }

        this.setFiles(response);
    }

    @action.bound
    private resetSelectedFile() {
        this.selectedFile = null;
    }

    @action.bound
    private async uploadFile() {
        if (!this.selectedFile) {
            return;
        }

        const response = await httpClient.uploadFile(this.selectedFile.name, this.selectedFile.content);
        this.resetSelectedFile();

        if (response instanceof Error) {
            console.log(response);
            return;
        }

        this.reloadFiles();
    }
}
