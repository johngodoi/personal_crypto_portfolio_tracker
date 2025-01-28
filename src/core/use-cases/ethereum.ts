import { Portfolio } from "../entities/portfolio";
import { EthereumDriver } from "../../shared/drivers/ethereum";
import { AddressBalances, TokenBalance } from "../entities/token";
import { getPrice } from "../../shared/gateways/price";
import { UseCase } from "./interface";

export class EthereumUseCase implements UseCase {

    private blockchain: string = "ethereum";
    private nativeCurrency: string = "eth";

    constructor(private driver: EthereumDriver, private tokenList: string[]){}
    
    async getCoinIdFromSymbol(symbol: string): Promise<string> {
        return this.driver.getCoinIdFromSymbol(symbol);
    }

    async generateAddress(passphrase: string): Promise<string> {
        return this.driver.generateEthereumAddress(passphrase);
    }

    async isAddressValid(walletAddress: string): Promise<boolean> {
        return this.driver.isEthAddress(walletAddress);
    }

    async getPortfolio(walletAddress: string, fiat:string = "usd"): Promise<Portfolio> {
        const addressBalances = await this.getAddressBalances(walletAddress);
        const nativeTokenId = this.driver.getCoinIdFromSymbol(this.nativeCurrency);
        const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await getPrice(nativeTokenId))!;
    
        const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances.map(async (tokenBalance) => {
            const tokenId = this.driver.getCoinIdFromSymbol(tokenBalance.symbol);
            const quote = (await getPrice(tokenId))!;
            return {
                ...tokenBalance,
                value: quote * parseFloat(tokenBalance.balance),
            };
        }));
        return {
            address: walletAddress,
            nativeBalance: addressBalances.nativeBalance,
            nativeBalanceValue,
            tokenBalanceValues
        } as Portfolio;
    }
    

    async getTokenBalances(walletAddress: string): Promise<TokenBalance[] | null> {
        try {
            const balances: TokenBalance[] = [];
            for (const symbol of this.tokenList) {
    
                const contractAddress = this.driver.getContractAddress(symbol);
                const decimals = await this.driver.getTokenDecimals(contractAddress);
                const balance = await this.driver.getTokenBalance(walletAddress, contractAddress);
        
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
    
    async getAddressBalances(walletAddress: string): Promise< AddressBalances> {
        const nativeBalance = await this.driver.getBalance(walletAddress);
        const tokenBalances = await this.getTokenBalances(walletAddress);
        return { blockchain: this.blockchain, nativeBalance, tokenBalances} as AddressBalances;
    }

}