export enum Statuses {
    UNKNOWN = 'unknown',
    READY = 'ready',
    ERROR = 'error',
}

export type StatusRequest = {};

export type StatusResponse = {
    status: Statuses;
};
