import { Portfolio } from "../entities/portfolio";
import { getQuote } from "./get-quote";
import { getRippleAddressBalances } from "./list-ripple-balances";

async function getRipplePortfolio(walletAddress: string): Promise<Portfolio> {
    const addressBalances = await getRippleAddressBalances(walletAddress);
    const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await getQuote("ripple", 'xrp', 'usd')).price!;

    const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances!.map(async (tokenBalance) => {
        const quote = await getQuote("ripple", tokenBalance.symbol, 'usd');
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

export { getRipplePortfolio };