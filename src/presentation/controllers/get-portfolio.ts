import { Request, Response } from 'express';
import { isAddress } from '../../shared/drivers/ethereum';
import { isSolanaAddress } from '../../shared/drivers/solana';
import { getEthereumPortfolio } from '../../core/use-cases/get-ethereum-portfolio';
import { getSolanaPortfolio } from '../../core/use-cases/get-solana-portfolio';


async function getPortfolio(req: Request, res: Response) {
    const blockchain = req.params.blockchain;
    if (!['ethereum', 'solana'].includes(blockchain)) {
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
        if (blockchain === 'ethereum') {
            const tokenList = (process.env.TOKENS_OF_INTEREST || "").split(",");
            const portfolio = await getEthereumPortfolio(walletAddress, tokenList);
            res.json(portfolio);
        }
        else {
            const portfolio = await getSolanaPortfolio(walletAddress);
            res.json(portfolio);
        }
    }
    catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

export { getPortfolio };