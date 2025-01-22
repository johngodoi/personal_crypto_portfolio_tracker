import express, { Request, Response } from 'express';
import { isAddress } from './shared/drivers/ethereum';
import { getAddressBalances } from './core/use-cases/list-balances';


const app = express();
const port = 3000;
  
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});