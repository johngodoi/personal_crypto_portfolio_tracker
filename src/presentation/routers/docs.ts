import swaggerJsdoc from 'swagger-jsdoc';
import * as TJS from "typescript-json-schema";
import * as path from "path";
import { env } from '../../shared/config/env';

const settings: TJS.PartialArgs = {
    required: true,
};

const tsconfigPath = path.resolve(__dirname, env.TSCONFIG_PATH_PATTERN);

const program = TJS.getProgramFromFiles([path.resolve(__dirname, env.TOKEN_ENTITIES_PATH_PATTERN)], {
    strictNullChecks: true,
}, tsconfigPath);

const options = {
    definition: {
      openapi: env.OPENAPI_VERSION,
      info: {
        title: env.APP_NAME,
        version: env.APP_VERSION,
        description: env.APP_DESCRIPTION,
      },
      definitions: {
        AddressBalances: TJS.generateSchema(program, "AddressBalances", settings),
        TokenBalance: TJS.generateSchema(program, "TokenBalance", settings),
      },
    },
    apis: [path.resolve(__dirname, env.ROUTES_PATH_PATTERN)],
  };
const swaggerDocument = swaggerJsdoc(options);

export { swaggerDocument };