import { Request, Response } from 'express';
import { isEthAddress } from '../../shared/drivers/ethereum';
import { isSolanaAddress } from '../../shared/drivers/solana';
import { getAddressBalances } from '../../core/use-cases/list-ethereum-balances';
import { getSolanaAddressBalances } from '../../core/use-cases/list-solana-balances';
import { getRippleAddressBalances } from '../../core/use-cases/list-ripple-balances';
import { isXRPAddress } from '../../shared/drivers/ripple';
import { isTronAddress } from '../../shared/drivers/tron';
import { getTronAddressBalances } from '../../core/use-cases/list-tron-balances';


async function getBalances(req: Request, res: Response): Promise<void> {
    const blockchain = req.params.blockchain;
    if (!['ethereum', 'solana', 'ripple', 'tron'].includes(blockchain)) {
        res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
        return;
    }
    const walletAddress = req.params.address;
    const blockchainAddressCheckers:{[name:string]: (address:string) => boolean } = {
        "ethereum": isEthAddress,
        "solana": isSolanaAddress,
        "ripple": isXRPAddress,
        "tron": isTronAddress
    }
    const isValidAddress = blockchainAddressCheckers[blockchain](walletAddress as string);
    
    if (!walletAddress || !isValidAddress) {
        res.status(400).json({ error: 'Invalid wallet address' });
        return;
    }
    try {
        const tokenList = (process.env.TOKENS_OF_INTEREST || "").split(",");
        if (blockchain === 'ethereum') {
            const addressBalances = await getAddressBalances(walletAddress, tokenList);
            res.json(addressBalances);
        } else if(blockchain === 'solana') {
            const addressBalances = await getSolanaAddressBalances(walletAddress);
            res.json(addressBalances);
        } else if(blockchain === 'ripple') {
            const addressBalances = await getRippleAddressBalances(walletAddress);
            res.json(addressBalances);
        } else if (blockchain === 'tron') {
            const addressBalances = await getTronAddressBalances(walletAddress, tokenList);
            res.json(addressBalances);
        }
    }
    catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

export { getBalances };