import { getSolBalance, getSymbolFromSolanaAddress, listTokensOwnedByAddress } from "../../shared/drivers/solana";
import { TokenBalance } from "../entities/token";

async function getSolanaTokenBalances(walletAddress: string): Promise<TokenBalance[] | null> {
    try {

        const solTokens = await listTokensOwnedByAddress(walletAddress);
        const balances: TokenBalance[] = [];
        for (const token of solTokens) {

            const symbol = getSymbolFromSolanaAddress(token.address);
            balances.push({
                balance: token.balance.toString(),
                decimals: token.decimals.valueOf(),
                symbol,
                contractAddress: token.address,
            });
        }
        return balances;
    } catch (error) {
        console.error("Error getting token balance:", error);
        return null;
    }
};

async function getSolanaAddressBalances(walletAddress: string){
    const solBalance = (await getSolBalance(walletAddress)).toString();
    const tokenBalances = await getSolanaTokenBalances(walletAddress);
    return { solBalance, tokenBalances};
}

export { getSolanaAddressBalances };