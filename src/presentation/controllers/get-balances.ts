import { Request, Response } from 'express';
import { isAddress } from '../../shared/drivers/ethereum';
import { isSolanaAddress } from '../../shared/drivers/solana';
import { getAddressBalances } from '../../core/use-cases/list-ethereum-balances';
import { getSolanaAddressBalances } from '../../core/use-cases/list-solana-balances';


async function getBalances(req: Request, res: Response) {
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
            const addressBalances = await getAddressBalances(walletAddress, tokenList);
            res.json(addressBalances);
        }
        else {
            const addressBalances = await getSolanaAddressBalances(walletAddress);
            res.json(addressBalances);
        }
    }
    catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

export { getBalances };