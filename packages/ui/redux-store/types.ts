export type State = {
    count: {
        value: number;
    };
};

export enum LOADING_STATE {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
}
