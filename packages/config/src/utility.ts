import Joi from 'joi';
import { ENVIRONMENT_VARIABLES, EnvironmentSchema } from './';

export const objectToSchema = (
    object: Partial<Record<ENVIRONMENT_VARIABLES, Joi.Schema>>,
) => {
    return Joi.object(object).required();
};

export const pickAndGenerateSchema = (
    variables: ENVIRONMENT_VARIABLES[],
): Joi.Schema => {
    const schema: Partial<Record<ENVIRONMENT_VARIABLES, Joi.Schema>> = {};

    Object.keys(EnvironmentSchema).forEach((value: ENVIRONMENT_VARIABLES) => {
        if (variables.includes(value)) {
            schema[value] = EnvironmentSchema[value];
        }
    });

    return objectToSchema(schema);
};

export const validateAndGetConfig = <T>(
    env: NodeJS.ProcessEnv,
    schema: Joi.Schema,
): T => {
    const result = schema.validate(env);

    if (result.error) {
        throw result.error;
    }

    return result.value;
};
