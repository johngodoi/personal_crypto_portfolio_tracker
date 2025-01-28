import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from './presentation/routes';

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Crypto Portfolio Tracker',
        version: '0.0.1',
        description: 'API for Crypto Portfolio Tracker backend',
      },
    },
    apis: ['./src/presentation/routes.ts'],
  };
const swaggerDocument = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
export default app;