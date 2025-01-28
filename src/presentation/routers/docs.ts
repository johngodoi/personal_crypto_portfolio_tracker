import swaggerJsdoc from 'swagger-jsdoc';
import * as TJS from "typescript-json-schema";
import * as path from "path";

const settings: TJS.PartialArgs = {
    required: true,
};

const tsconfigPath = path.resolve(__dirname, "../../../tsconfig.json");

const program = TJS.getProgramFromFiles([path.resolve(__dirname, "../../core/entities/token.ts")], {
    strictNullChecks: true,
}, tsconfigPath);

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Crypto Portfolio Tracker',
        version: '0.0.1',
        description: 'API for Crypto Portfolio Tracker backend',
      },
      definitions: {
        AddressBalances: TJS.generateSchema(program, "AddressBalances", settings),
        TokenBalance: TJS.generateSchema(program, "TokenBalance", settings),
      },
    },
    apis: [path.resolve(__dirname, "../../presentation/routers/routes.ts")],
  };
const swaggerDocument = swaggerJsdoc(options);

export { swaggerDocument };