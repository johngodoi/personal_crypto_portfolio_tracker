import { Request, Response } from 'express';
import { generateEthereumAddress } from "../../shared/drivers/ethereum";
import { generateSolanaAddress } from "../../shared/drivers/solana";
import { generateRippleAddress } from '../../shared/drivers/ripple';

async function getAddresses(req: Request, res: Response) {
    const passphrase = process.env.MNEMONIC_PASSPHRASE;
    if (!passphrase) {
        res.status(500).json({ error: 'Mnemonic passphrase not set' });
        return;
    }
    const ethereum = generateEthereumAddress(passphrase);
    const solana = await generateSolanaAddress(passphrase);
    const ripple = await generateRippleAddress(passphrase);
    res.json({ ethereum, solana, ripple });
}

export { getAddresses };