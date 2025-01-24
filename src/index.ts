import express, { Request, Response } from 'express';
import { getBalances } from './presentation/controllers/get-balances';
import { getPrices } from './presentation/controllers/get-prices';
import { getPortfolio } from './presentation/controllers/get-portfolio';
import { getAddresses } from './presentation/controllers/get-addresses';


const app = express();
const port = process.env.EXPRESS_PORT || 3000;
  
app.get('/blockchains/:blockchain/balances/:address', async (req: Request, res: Response) => {
    return await getBalances(req, res);
});

app.get('/blockchains/:blockchain/prices/:symbol', async (req: Request, res: Response) => {
    return await getPrices(req, res);
});

app.get('/blockchains/:blockchain/portfolio/:address', async (req: Request, res: Response) => {
    return await getPortfolio(req, res);
});

app.get("/addresses", async (req: Request, res: Response) => {
    return await getAddresses(req, res);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;