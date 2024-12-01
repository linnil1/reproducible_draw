export enum Status {
    SUCCESS = 'success',
    PENDING = 'pending',
    WARNING = 'warning',
    FAIL = 'fail',
    NULL = 'null'
}

export interface DataResult {
    status: Status
    text: string
}
