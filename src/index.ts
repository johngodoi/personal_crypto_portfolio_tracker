import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './presentation/routers/routes';
import { swaggerDocument } from './presentation/routers/docs';

const app = express();
const port = process.env.EXPRESS_PORT || 3000;


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
export default app;