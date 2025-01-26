import { Request, Response } from 'express';
import { isEthAddress } from '../../shared/drivers/ethereum';
import { isSolanaAddress } from '../../shared/drivers/solana';
import { getEthereumPortfolio } from '../../core/use-cases/get-ethereum-portfolio';
import { getSolanaPortfolio } from '../../core/use-cases/get-solana-portfolio';
import { isXRPAddress } from '../../shared/drivers/ripple';
import { getRipplePortfolio } from '../../core/use-cases/get-ripple-portfolio';


async function getPortfolio(req: Request, res: Response) {
    const blockchain = req.params.blockchain;
    if (!['ethereum', 'solana', 'ripple'].includes(blockchain)) {
        res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
        return;
    }
    const walletAddress = req.params.address;
    const blockchainAddressCheckers:{[name:string]: (address:string) => boolean } = {
        "ethereum": isEthAddress,
        "solana": isSolanaAddress,
        "ripple": isXRPAddress
    }
    const isValidAddress = blockchainAddressCheckers[blockchain](walletAddress as string);
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
        else if (blockchain === 'solana') {
            const portfolio = await getSolanaPortfolio(walletAddress);
            res.json(portfolio);
        }
        else if (blockchain === 'ripple') {
            const portfolio = await getRipplePortfolio(walletAddress);
            res.json(portfolio);
        }
    }
    catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

export { getPortfolio };