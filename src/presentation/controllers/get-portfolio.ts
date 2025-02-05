import { Request, Response } from 'express';
import { UseCase } from '../../core/use-cases/interface';
import { env } from '../../shared/config/env';


export class PortfolioController{
    constructor(private useCases: {[blockchain: string]: () => UseCase}) {}

    async getPortfolio(req: Request, res: Response) {
        const blockchain = req.params.blockchain;
        if(!(blockchain in this.useCases)) {
            res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
            return;
        }
        const useCase = this.useCases[blockchain]();
        const walletAddress = req.params.address;
        const isValidAddress = await useCase.isAddressValid(walletAddress as string);
        if (!walletAddress || !isValidAddress) {
            res.status(400).json({ error: 'Invalid wallet address' });
            return;
        }
        try {
                const portfolio = await useCase.getPortfolio(walletAddress, env.CURRENCY);
                res.json(portfolio);
        }
        catch (error: any) {
            console.error("Error:", error);
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    }
}