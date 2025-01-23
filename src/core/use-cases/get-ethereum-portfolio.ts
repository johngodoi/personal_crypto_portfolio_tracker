import { Portfolio } from "../entities/portfolio";
import { getQuote } from "./get-quote";
import { getAddressBalances } from "./list-ethereum-balances";

async function getPortfolio(walletAddress: string, tokenList: string[]): Promise<Portfolio> {
    const addressBalances = await getAddressBalances(walletAddress, tokenList);
    const ethBalanceValue = Number(addressBalances.ethBalance) * (await getQuote("ethereum", 'eth', 'usd')).price!;

    const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances.map(async (tokenBalance) => {
        const quote = await getQuote("ethereum", tokenBalance.symbol, 'usd');
        return {
            ...tokenBalance,
            value: quote.price! * parseFloat(tokenBalance.balance),
        };
    }));
    return {
        address: walletAddress,
        ethBalance: addressBalances.ethBalance,
        ethBalanceValue,
        tokenBalanceValues
    };
}

export { getPortfolio };