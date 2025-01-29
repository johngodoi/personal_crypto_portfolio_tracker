import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './presentation/routers/routes';
import { swaggerDocument } from './presentation/routers/docs';
import { env } from './shared/config/env';

const app = express();
const port = env.PORT


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
export default app;