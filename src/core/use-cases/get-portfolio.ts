import { Portfolio } from "../entities/portfolio";
import { getQuote } from "./get-quote";
import { getAddressBalances } from "./list-balances";

async function getPortfolio(walletAddress: string, tokenList: string[]): Promise<Portfolio> {
    const addressBalances = await getAddressBalances(walletAddress, tokenList);
    const ethBalanceValue = Number(addressBalances.ethBalance) * (await getQuote('eth', 'usd')).price!;

    const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances.map(async (tokenBalance) => {
        const quote = await getQuote(tokenBalance.symbol, 'usd');
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