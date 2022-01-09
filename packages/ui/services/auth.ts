import { BackendService } from '@package/apiClient';
import config from 'config';

import {
    IRegistrationDTO,
    IUserRegistrationResponse,
} from '../../backend/src/dtos/auth/registration';
import { ISanitizedUser } from '@package/entities';

const service: BackendService = BackendService.create({
    baseUrl: config.BACKEND_URL,
    includeToken: false,
});

console.log(config);

const register = (
    credentials: IRegistrationDTO,
): Promise<IUserRegistrationResponse> => {
    return service.post('/auth/register', credentials);
};

const getMe = (token?: string): Promise<ISanitizedUser> => {
    return service.get(
        '/auth/me',
        token
            ? {
                  Authorizatiom: `Bearer ${token}`,
              }
            : undefined,
    );
};

export default {
    getMe,
    register,
};
