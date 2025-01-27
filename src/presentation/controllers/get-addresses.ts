import { Request, Response } from 'express';
import { generateEthereumAddress } from "../../shared/drivers/ethereum";
import { generateSolanaAddress } from "../../shared/drivers/solana";
import { generateRippleAddress } from '../../shared/drivers/ripple';
import { generateTronAddress } from '../../shared/drivers/tron';

async function getAddresses(req: Request, res: Response) {
    const passphrase = process.env.MNEMONIC_PASSPHRASE;
    if (!passphrase) {
        res.status(500).json({ error: 'Mnemonic passphrase not set' });
        return;
    }
    const ethereum = generateEthereumAddress(passphrase);
    const solana = await generateSolanaAddress(passphrase);
    const ripple = generateRippleAddress(passphrase);
    const tron = generateTronAddress(passphrase);
    res.json({ ethereum, solana, ripple, tron });
}

export { getAddresses };