import { Portfolio } from "../entities/portfolio";
import { AddressBalances } from "../entities/token";

export interface UseCase {
    getPortfolio(walletAddress: string, fiat:string): Promise<Portfolio>
    getAddressBalances(walletAddress: string): Promise<AddressBalances>
    isAddressValid(walletAddress: string): Promise<boolean>
    generateAddress(passphrase: string): Promise<string>
    getCoinIdFromSymbol(symbol: string): Promise<string>
}