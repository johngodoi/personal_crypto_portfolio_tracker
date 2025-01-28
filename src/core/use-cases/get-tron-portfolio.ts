import { Portfolio } from "../entities/portfolio";
import { getQuote } from "./get-quote";
import { getTronAddressBalances } from "./list-tron-balances";

async function getTronPortfolio(walletAddress: string, tokenList: string[]): Promise<Portfolio> {
    const addressBalances = await getTronAddressBalances(walletAddress, tokenList);
    const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await getQuote("tron", 'trx', 'usd')).price!;

    const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances.map(async (tokenBalance) => {
        const quote = await getQuote("tron", tokenBalance.symbol, 'usd');
        return {
            ...tokenBalance,
            value: quote.price! * parseFloat(tokenBalance.balance),
        };
    }));
    return {
        address: walletAddress,
        nativeBalance: addressBalances.nativeBalance,
        nativeBalanceValue,
        tokenBalanceValues
    };
}

export { getTronPortfolio };