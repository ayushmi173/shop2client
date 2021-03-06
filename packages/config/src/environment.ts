export const DEFAULT_ADMIN_PORT = 7000;
export const DEFAULT_BACKEND_PORT = 5000;
export const DEFAULT_UI_PORT = 3000;

export enum NODE_ENV {
    TEST = 'test',
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

export enum PLATFORM {
    staging = 'staging',
    production = 'production',
}

export enum ENVIRONMENT_VARIABLES {
    NODE_ENV = 'NODE_ENV',
    ENVIRONMENT = 'ENVIRONMENT',
    POSTGRES_USER = 'POSTGRES_USER',
    POSTGRES_DATABASE_HOST = 'POSTGRES_DATABASE_HOST',
    POSTGRES_PORT = 'POSTGRES_PORT',
    POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
    POSTGRES_DATABASE_NAME = 'POSTGRES_DATABASE_NAME',
    ADMIN_PORT = 'ADMIN_PORT',
    ADMIN_URL = 'ADMIN_URL',
    BACKEND_PORT = 'BACKEND_PORT',
    BACKEND_URL = 'BACKEND_URL',
    UI_PORT = 'UI_PORT',
    UI_URL = 'UI_URL',
    JWT_SECRET_KEY = 'JWT_SECRET_KEY',
}
