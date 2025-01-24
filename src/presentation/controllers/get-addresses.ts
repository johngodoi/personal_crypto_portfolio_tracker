import { Request, Response } from 'express';
import { generateEthereumAddress } from "../../shared/drivers/ethereum";
import { generateSolanaAddress } from "../../shared/drivers/solana";

async function getAddresses(req: Request, res: Response) {
    const passphrase = process.env.MNEMONIC_PASSPHRASE;
    if (!passphrase) {
        res.status(500).json({ error: 'Mnemonic passphrase not set' });
        return;
    }
    const ethereum = generateEthereumAddress(passphrase);
    const solana = await generateSolanaAddress(passphrase);
    res.json({ ethereum, solana });
}

export { getAddresses };