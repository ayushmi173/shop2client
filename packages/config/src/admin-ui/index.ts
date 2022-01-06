import { ENVIRONMENT_VARIABLES, pickAndGenerateSchema } from '../';

export type AdminUiConfig = {
    ADMIN_PORT: number;
    ADMIN_URL: string;
    ENVIRONMENT: string;
    NODE_ENV: string;
};

export const adminUiConfigSchema = pickAndGenerateSchema([
    ENVIRONMENT_VARIABLES.ADMIN_PORT,
    ENVIRONMENT_VARIABLES.ADMIN_URL,
    ENVIRONMENT_VARIABLES.ENVIRONMENT,
    ENVIRONMENT_VARIABLES.NODE_ENV,
]);
