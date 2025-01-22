import express, { Request, Response } from 'express';
import { isAddress } from './shared/drivers/ethereum';
import { getAddressBalances } from './core/use-cases/list-balances';
import { getQuote } from './core/use-cases/get-quote';


const app = express();
const port = process.env.EXPRESS_PORT || 3000;
  
app.get('/balances/:address', async (req: Request, res: Response) => {
    const walletAddress = req.params.address;

    if (!walletAddress || !isAddress(walletAddress)) {
        res.status(400).json({ error: 'Invalid wallet address' });
        return;
    }

    try {
        const tokenList = process.env.TOKENS_OF_INTEREST!.split(",");
        const addressBalances = await getAddressBalances(walletAddress, tokenList);
        res.json(addressBalances);

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.get('/prices/:symbol', async (req: Request, res: Response) => {
    const symbol = req.params.symbol;

    if (!symbol) {
        res.status(400).json({ error: 'Invalid token symbol' });
        return;
    }

    try {
        const quote = await getQuote(symbol);
        res.json(quote);

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;