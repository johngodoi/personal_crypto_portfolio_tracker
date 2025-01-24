import e, { Request, Response } from 'express';
import { getQuote } from '../../core/use-cases/get-quote';


async function getPrices(req: Request, res: Response) {
    const symbol = req.params.symbol;
    const blockchain = req.params.blockchain;
    if (!symbol) {
        res.status(400).json({ error: 'Invalid token symbol' });
        return;
    }
    try {
        const quote = await getQuote(blockchain, symbol);
        res.json(quote);
    }
    catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

export { getPrices };