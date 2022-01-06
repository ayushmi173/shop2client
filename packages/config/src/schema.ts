import Joi from 'joi';
import {
    DEFAULT_ADMIN_PORT,
    DEFAULT_BACKEND_PORT,
    DEFAULT_UI_PORT,
    ENVIRONMENT_VARIABLES,
    NODE_ENV,
    PLATFORM,
} from './';

export const EnvironmentSchema: Record<ENVIRONMENT_VARIABLES, Joi.Schema> = {
    [ENVIRONMENT_VARIABLES.ADMIN_PORT]: Joi.number()
        .default(DEFAULT_ADMIN_PORT)
        .required(),
    [ENVIRONMENT_VARIABLES.ADMIN_URL]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.BACKEND_PORT]: Joi.number()
        .default(DEFAULT_BACKEND_PORT)
        .required(),
    [ENVIRONMENT_VARIABLES.BACKEND_URL]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.ENVIRONMENT]: Joi.allow(
        ...Object.values(PLATFORM),
    ).required(),
    [ENVIRONMENT_VARIABLES.NODE_ENV]: Joi.allow(
        ...Object.values(NODE_ENV),
    ).required(),
    [ENVIRONMENT_VARIABLES.POSTGRES_DATABASE_NAME]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.POSTGRES_DATABASE_HOST]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.POSTGRES_PASSWORD]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.POSTGRES_PORT]: Joi.number().required(),
    [ENVIRONMENT_VARIABLES.POSTGRES_USER]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.UI_URL]: Joi.string().required(),
    [ENVIRONMENT_VARIABLES.UI_PORT]: Joi.number()
        .default(DEFAULT_UI_PORT)
        .required(),
    [ENVIRONMENT_VARIABLES.JWT_SECRET_KEY]: Joi.string().required(),
};
