import { Request, Response } from 'express';
import { UseCase } from '../../core/use-cases/interface';
import { PriceGateway } from '../../shared/gateways/price/interface';


export class PricesController{
    constructor(private useCases: {[blockchain: string]: () => UseCase}, private priceGateway: PriceGateway) {}
    
    async getPrices(req: Request, res: Response) {
        const symbol = req.params.symbol;
        const blockchain = req.params.blockchain;
        if (!symbol) {
            res.status(400).json({ error: 'Invalid token symbol' });
            return;
        }
        if(!(blockchain in this.useCases)) {
            res.status(400).json({ error: `Invalid blockchain ${blockchain}` });
            return;
        }
        const useCase = this.useCases[blockchain]();

        try {
            const tokenId = await useCase.getCoinIdFromSymbol(symbol);
            const price = (await this.priceGateway.getPrice(tokenId))!;
            res.json({blockchain, symbol, price});
        }
        catch (error: any) {
            console.error("Error:", error);
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    }
}
