import { ENVIRONMENT_VARIABLES, pickAndGenerateSchema } from '../';

export type UiConfig = {
    UI_URL: string;
    UI_PORT: number;
    ENVIRONMENT: string;
    NODE_ENV: string;
};

export const uiConfigSchema = pickAndGenerateSchema([
    ENVIRONMENT_VARIABLES.UI_URL,
    ENVIRONMENT_VARIABLES.UI_PORT,
    ENVIRONMENT_VARIABLES.ENVIRONMENT,
    ENVIRONMENT_VARIABLES.NODE_ENV,
]);
