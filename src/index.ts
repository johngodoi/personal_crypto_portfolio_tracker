import express, { Request, Response } from 'express';
import { generateEthereumAddress, isAddress } from './shared/drivers/ethereum';
import { getAddressBalances } from './core/use-cases/list-ethereum-balances';
import { getQuote } from './core/use-cases/get-quote';
import { getPortfolio } from './core/use-cases/get-ethereum-portfolio';
import { generateSolanaAddress, isSolanaAddress } from './shared/drivers/solana';
import { getSolanaAddressBalances } from './core/use-cases/list-solana-balances';
import { getSolanaPortfolio } from './core/use-cases/get-solana-portfolio';


const app = express();
const port = process.env.EXPRESS_PORT || 3000;
  
app.get('/blockchains/:blockchain/balances/:address', async (req: Request, res: Response) => {
    const blockchain = req.params.blockchain;
    if(!['ethereum', 'solana'].includes(blockchain)){
        res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
        return;
    }

    const walletAddress = req.params.address;

    const isValidAddress = blockchain === 'ethereum' ? isAddress(walletAddress) : isSolanaAddress(walletAddress);
    if (!walletAddress || !isValidAddress) {
        res.status(400).json({ error: 'Invalid wallet address' });
        return;
    }

    try {
        if(blockchain === 'ethereum'){
            const tokenList = process.env.TOKENS_OF_INTEREST!.split(",");
            const addressBalances = await getAddressBalances(walletAddress, tokenList);
            res.json(addressBalances);
        } else {
            const addressBalances = await getSolanaAddressBalances(walletAddress);
            res.json(addressBalances);
        }

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.get('/blockchains/:blockchain/prices/:symbol', async (req: Request, res: Response) => {
    const symbol = req.params.symbol;
    const blockchain = req.params.blockchain;

    if (!symbol) {
        res.status(400).json({ error: 'Invalid token symbol' });
        return;
    }

    try {
        const quote = await getQuote(blockchain, symbol);
        res.json(quote);

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.get('/blockchains/:blockchain/portfolio/:address', async (req: Request, res: Response) => {
    const blockchain = req.params.blockchain;
    if(!['ethereum', 'solana'].includes(blockchain)){
        res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
        return;
    }

    const walletAddress = req.params.address;

    const isValidAddress = blockchain === 'ethereum' ? isAddress(walletAddress) : isSolanaAddress(walletAddress);
    if (!walletAddress || !isValidAddress) {
        res.status(400).json({ error: 'Invalid wallet address' });
        return;
    }

    try {
        if(blockchain === 'ethereum'){
            const tokenList = process.env.TOKENS_OF_INTEREST!.split(",");
            const portfolio = await getPortfolio(walletAddress, tokenList);
            res.json(portfolio);
        } else {
            const portfolio = await getSolanaPortfolio(walletAddress);
            res.json(portfolio);
        }

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.get("/addresses", async (req: Request, res: Response) => {
    const passphrase = process.env.MNEMONIC_PASSPHRASE;
    if (!passphrase) {
        res.status(500).json({ error: 'Mnemonic passphrase not set' });
        return;
    }
    const ethereum = generateEthereumAddress(passphrase);
    const solana = await generateSolanaAddress(passphrase);
    res.json({ ethereum, solana });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;