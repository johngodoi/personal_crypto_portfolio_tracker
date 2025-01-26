import { Portfolio } from "../entities/portfolio";
import { getQuote } from "./get-quote";
import { getSolanaAddressBalances } from "./list-solana-balances";

async function getSolanaPortfolio(walletAddress: string): Promise<Portfolio> {
    const addressBalances = await getSolanaAddressBalances(walletAddress);
    const nativeBalanceValue = Number(addressBalances.solBalance) * (await getQuote("solana", 'sol', 'usd')).price!;

    const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances!.map(async (tokenBalance) => {
        const quote = await getQuote("solana", tokenBalance.symbol, 'usd');
        return {
            ...tokenBalance,
            value: quote.price! * parseFloat(tokenBalance.balance),
        };
    }));
    return {
        address: walletAddress,
        nativeBalance: addressBalances.solBalance,
        nativeBalanceValue,
        tokenBalanceValues
    };
}

export { getSolanaPortfolio };