import { Request, Response } from 'express';
import { UseCase } from '../../core/use-cases/interface';


export class AddressesController{

    constructor(private useCases: {[blockchain: string]: () => UseCase}) {}
    
    async getAddresses(req: Request, res: Response) {
        const passphrase = process.env.MNEMONIC_PASSPHRASE;
        if (!passphrase) {
            res.status(500).json({ error: 'Mnemonic passphrase not set' });
            return;
        }
        const addresses:{[blockchain: string]: string} = {};
        for (const blockchain in this.useCases) {
            const useCase = this.useCases[blockchain]();
            addresses[blockchain] = await useCase.generateAddress(passphrase);
        }
        res.json(addresses);
    }

}
