import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import { ISanitizedUser } from '@package/entities';
import { LOADING_STATE } from 'redux-store/types';

const initialState = {
    register: {
        loading: LOADING_STATE.IDLE,
        error: '',
    },
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userRegisterStart: (state) => {
            state.register.loading = LOADING_STATE.PENDING;
        },
        userRegisterSuccess: (state) => {
            state.register.loading = LOADING_STATE.SUCCESS;
        },
        userRegisterFailed: (state, { payload }: PayloadAction<string>) => {
            state.register.error = payload;
            state.register.loading = LOADING_STATE.FAILED;
        },
    },
});

export const { userRegisterStart, userRegisterSuccess, userRegisterFailed } =
    authSlice.actions;

export const reducer = authSlice.reducer;
