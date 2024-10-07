export enum FilesTypes {
    IMAGE = 0,
    DOCUMENT = 1,
}

export type FileItem = {
    id: string;
    name: string;
    category: FilesTypes;
    created_at: number;
};

export type FilesRequest = {};

export type FilesResponse = FileItem[];
