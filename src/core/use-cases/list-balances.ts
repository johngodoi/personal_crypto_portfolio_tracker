import { getEthBalance, getTokenBalance, getTokenDecimals } from "../../shared/drivers/ethereum";
import { EthereumAddressBalances, EthereumTokensPortfolio, TokenBalance } from "../entities/token";

async function getTokenBalances(walletAddress: string, contractAddresses: string[]): Promise<TokenBalance[] | null> {
    try {
        const balances: TokenBalance[] = [];
        for (const contractAddress of contractAddresses) {
            const decimals = await getTokenDecimals(contractAddress);
            const balance = await getTokenBalance(walletAddress, contractAddress);
    
            balances.push({
                balance,
                decimals: Number(decimals),
                contractAddress,
            });
        }
        return balances;
    } catch (error) {
        console.error("Error getting token balance:", error);
        return null;
    }
};

async function getAddressBalances(walletAddress: string, tokenList: string[]): Promise< EthereumAddressBalances> {
    const tokensPortfolio: EthereumTokensPortfolio = {};
    const ethBalance = await getEthBalance(walletAddress);
    const tokenBalances = await getTokenBalances(walletAddress, tokenList);
    for(const token of tokenBalances!){
        tokensPortfolio[token.contractAddress] = token;
    }
    return { ethBalance, tokenBalances: tokensPortfolio } as EthereumAddressBalances;
}

export { getAddressBalances };