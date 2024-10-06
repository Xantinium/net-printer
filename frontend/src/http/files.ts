export enum FilesTypes {
    IMAGE = 'image',
    DOCUMENT = 'document',
}

export type FileItem = {
    id: string;
    name: string;
    category: FilesTypes;
    created_at: number;
    content: string;
};

export type FilesRequest = {};

export type FilesResponse = FileItem[];
