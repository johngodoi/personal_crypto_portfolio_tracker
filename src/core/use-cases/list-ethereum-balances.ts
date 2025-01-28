import { getContractAddress, getEthBalance, getTokenBalance, getTokenDecimals } from "../../shared/drivers/ethereum";
import { AddressBalances, TokenBalance } from "../entities/token";

async function getTokenBalances(walletAddress: string, tokenList: string[]): Promise<TokenBalance[] | null> {
    try {
        const balances: TokenBalance[] = [];
        for (const symbol of tokenList) {

            const contractAddress = getContractAddress(symbol);
            const decimals = await getTokenDecimals(contractAddress);
            const balance = await getTokenBalance(walletAddress, contractAddress);
    
            balances.push({
                balance,
                decimals: Number(decimals),
                symbol,
                contractAddress,
            });
        }
        return balances;
    } catch (error) {
        console.error("Error getting token balance:", error);
        return null;
    }
};

async function getAddressBalances(walletAddress: string, tokenList: string[]): Promise< AddressBalances> {
    const nativeBalance = await getEthBalance(walletAddress);
    const tokenBalances = await getTokenBalances(walletAddress, tokenList);
    return { blockchain: "ethereum", nativeBalance, tokenBalances} as AddressBalances;
}

export { getAddressBalances };