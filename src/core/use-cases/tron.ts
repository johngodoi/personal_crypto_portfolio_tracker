import { Portfolio } from "../entities/portfolio";
import { AddressBalances } from '../entities/token';
import { TronDriver } from "../../shared/drivers/tron";
import { UseCase } from "./interface";
import { env } from "../../shared/config/env";
import { PriceGateway } from "../../shared/gateways/price/interface";



export class TronUseCase implements UseCase {

    constructor(private driver: TronDriver, private priceGateway: PriceGateway, private tokenList: string[]) { }

    async generateAddress(passphrase: string): Promise<string> {
        return this.driver.generateTronAddress(passphrase);
    }
    
    async getCoinIdFromSymbol(symbol: string): Promise<string> {
        return this.driver.getCoinIdFromSymbol(symbol);
    }

    async isAddressValid(walletAddress: string): Promise<boolean> {
        return this.driver.isTronAddress(walletAddress);
    }

    async getPortfolio(walletAddress: string, fiat: string = env.CURRENCY): Promise<Portfolio> {
        const addressBalances = await this.getAddressBalances(walletAddress);
        const nativeTokenId = this.driver.getCoinIdFromSymbol(this.driver.getNativeCurrencyName().toLowerCase());
        const nativeBalanceValue = Number(addressBalances.nativeBalance) * (await this.priceGateway.getPrice(nativeTokenId))!;

        const tokenBalanceValues = await Promise.all(addressBalances.tokenBalances.map(async (tokenBalance) => {
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

    async getAddressBalances(walletAddress: string): Promise<AddressBalances> {
        const nativeBalance = (await this.driver.getBalance(walletAddress)).toString();
        try{
            const tokenBalances = await this.driver.getTokenBalances(walletAddress, this.tokenList) || [];
            return { blockchain: this.driver.getBlockchainName().toLowerCase(), nativeBalance, tokenBalances} as AddressBalances;
        } catch (error) {
            return { blockchain: this.driver.getBlockchainName().toLowerCase(), nativeBalance, tokenBalances: []} as AddressBalances;
        }
    }
}