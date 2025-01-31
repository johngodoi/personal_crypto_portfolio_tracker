import { Portfolio } from "../entities/portfolio";
import { AddressBalances } from "../entities/token";
import { RippleDriver } from "../../shared/drivers/ripple";
import { getPrice } from "../../shared/gateways/price";
import { UseCase } from "./interface";
import { env } from "../../shared/config/env";


export class RippleUseCase implements UseCase {
    
    constructor(private driver: RippleDriver) {}
    
    async getCoinIdFromSymbol(symbol: string): Promise<string> {
        return this.driver.getCoinIdFromSymbol(symbol);
    }

    async generateAddress(passphrase: string): Promise<string> {
        return this.driver.generateRippleAddress(passphrase);
    }
    
    async isAddressValid(walletAddress: string): Promise<boolean> {
        return this.driver.isXRPAddress(walletAddress);
    }

    async getPortfolio(walletAddress: string, fiat: string = env.CURRENCY): Promise<Portfolio> {
        const addressBalances = await this.getAddressBalances(walletAddress);
        const nativeTokenId = this.driver.getCoinIdFromSymbol(this.driver.getNativeCurrencyName().toLowerCase());
        const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await getPrice(nativeTokenId))!;

        const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances!.map(async (tokenBalance) => {
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
        };
    }

    async getAddressBalances(walletAddress: string): Promise<AddressBalances> {
        const nativeBalance = (await this.driver.getBalance(walletAddress)).toString();
        const tokenBalances = await this.driver.getTokenBalances(walletAddress);
        return { blockchain: this.driver.getBlockchainName().toLowerCase(), nativeBalance, tokenBalances} as AddressBalances;
    }
}
