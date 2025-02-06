import { Portfolio } from "../entities/portfolio";
import { AddressBalances, TokenBalance } from "../entities/token";
import { SolanaDriver } from "../../shared/drivers/solana";
import { UseCase } from "./interface";
import { env } from "../../shared/config/env";
import { PriceGateway } from "../../shared/gateways/price/interface";


export class SolanaUseCase implements UseCase {

    constructor(private driver: SolanaDriver, private priceGateway: PriceGateway) {}
    
    async getCoinIdFromSymbol(symbol: string): Promise<string> {
        return this.driver.getCoinIdFromSymbol(symbol);
    }

    async generateAddress(passphrase: string): Promise<string> {
        return this.driver.generateSolanaAddress(passphrase);
    }

    async isAddressValid(walletAddress: string): Promise<boolean> {
        return this.driver.isSolanaAddress(walletAddress);
    }

    async getPortfolio(walletAddress: string, fiat: string = env.CURRENCY): Promise<Portfolio> {
        const addressBalances = await this.getAddressBalances(walletAddress);
        const nativeTokenId = this.driver.getCoinIdFromSymbol(this.driver.getNativeCurrencyName().toLowerCase());
        const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await this.priceGateway.getPrice(nativeTokenId))!;

        const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances!.map(async (tokenBalance) => {
            const tokenId = this.driver.getCoinIdFromSymbol(tokenBalance.symbol);
            const quote = (await this.priceGateway.getPrice(tokenId))!;
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
        };
    }

    async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
        try {
    
            const solTokens = await this.driver.listTokensOwnedByAddress(walletAddress);
            const balances: TokenBalance[] = [];
            for (const token of solTokens) {
    
                const symbol = this.driver.getSymbolFromAddress(token.address);
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
            return [];
        }
    };
    
    async getAddressBalances(walletAddress: string): Promise<AddressBalances> {
        const nativeBalance = (await this.driver.getBalance(walletAddress)).toString();
        const tokenBalances = await this.getTokenBalances(walletAddress);
        return { blockchain: this.driver.getBlockchainName().toLowerCase(), nativeBalance, tokenBalances};
    }
}