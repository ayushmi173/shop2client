import { AppDispatch } from 'redux-store';
import { cookie, COOKIES } from '@package/apiClient';
import { IRegistrationDTO } from '../../../backend/src/dtos/auth/registration';

import { authServices } from '../../services';
import {
    userRegisterFailed,
    userRegisterStart,
    userRegisterSuccess,
} from 'redux-store/slice';

export const registerUser =
    (dto: IRegistrationDTO) => async (dispatch: AppDispatch) => {
        try {
            dispatch(userRegisterStart());
            const { token, user } = await authServices.register(dto);
            cookie.set(COOKIES.TOKEN, token),
                {
                    expires: 30,
                };
            console.log(user);
            dispatch(userRegisterSuccess());
        } catch (error) {
            return dispatch(userRegisterFailed(error.response.data.message));
        }
    };
