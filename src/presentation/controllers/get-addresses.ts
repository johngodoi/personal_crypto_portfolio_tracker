import { Request, Response } from 'express';
import { UseCase } from '../../core/use-cases/interface';
import { AddressesConfig } from '../../core/entities/addresses';
import { loadAddresses } from '../../core/use-cases/config';


export class AddressesController{

    constructor(private useCases: {[blockchain: string]: () => UseCase}) {}
    
    async getAddresses(req: Request, res: Response) {
        
        const addressesConfig: AddressesConfig | null = await loadAddresses();
        if(addressesConfig) {
            res.json(addressesConfig);
            return;
        }

        const passphrase = process.env.MNEMONIC_PASSPHRASE;
        if (!passphrase) {
            res.status(500).json({ error: 'Mnemonic passphrase not set' });
            return;
        }
        const addresses:AddressesConfig = {};
        for (const blockchain in this.useCases) {
            const useCase = this.useCases[blockchain]();
            addresses[blockchain] = await useCase.generateAddress(passphrase);
        }
        res.json(addresses);
    }

}
