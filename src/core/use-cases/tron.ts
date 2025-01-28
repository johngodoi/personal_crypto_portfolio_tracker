import { Portfolio } from "../entities/portfolio";
import { AddressBalances } from '../entities/token';
import { TronDriver } from "../../shared/drivers/tron";
import { getPrice } from "../../shared/gateways/price";
import { UseCase } from "./interface";



export class TronUseCase implements UseCase {
    
    private blockchain: string = "tron";
    private nativeCurrency: string = "trx";

    constructor(private driver: TronDriver, private tokenList: string[]) { }

    async generateAddress(passphrase: string): Promise<string> {
        return this.driver.generateTronAddress(passphrase);
    }
    
    async getCoinIdFromSymbol(symbol: string): Promise<string> {
        return this.driver.getCoinIdFromSymbol(symbol);
    }

    async isAddressValid(walletAddress: string): Promise<boolean> {
        return this.driver.isTronAddress(walletAddress);
    }

    async getPortfolio(walletAddress: string, fiat: string = "usd"): Promise<Portfolio> {
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
        };
    }

    async getAddressBalances(walletAddress: string): Promise<AddressBalances> {
        const nativeBalance = (await this.driver.getBalance(walletAddress)).toString();
        const tokenBalances = await this.driver.getTokenBalances(walletAddress, this.tokenList) || [];
        return { blockchain: this.blockchain, nativeBalance, tokenBalances} as AddressBalances;
    }
}