
import { getAddress, isAddress, formatUnits } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { abi } from "../../../abis/ERC20.json";
import { ETHEREUM } from "../../../config/blockchains.json";
import { FungibleTokens } from '../../core/entities/token';


export class EthereumDriver {
    public publicClient: any;
    constructor(publicClient: any) {
        this.publicClient = publicClient;
    }

    generateEthereumAddress(mnemonic: string): string {
        return mnemonicToAccount(mnemonic).address;
    }
    
    isNative(tokenSymbol: string): boolean {
        return tokenSymbol.toLowerCase() === ETHEREUM.native_currency.symbol.toLowerCase();
    }
    
    getContractAddress(tokenSymbol: string): string {
        const fungibleTokens = ETHEREUM.fungible_tokens as FungibleTokens;
        return fungibleTokens[tokenSymbol].contract_address;
    }
    
    getCoinIdFromSymbol(symbol: string): string {
        const isNativeCurrency = this.isNative(symbol);
        if (isNativeCurrency) {
            return ETHEREUM.native_currency.coin_gecko_id;
        }
        const fungibleTokens = ETHEREUM.fungible_tokens as FungibleTokens;
        return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
    }
    
    async getBalance(walletAddress: string): Promise<string> {
        const balance = await this.publicClient.getBalance({ address: getAddress(walletAddress) });
        return formatUnits(balance, ETHEREUM.native_currency.decimals);
    }
    
    async getTokenBalance(walletAddress: string, contractAddress: string): Promise<string> {
        const balanceWei = await this.getTokenBalanceOf(walletAddress, contractAddress);
        const decimals = await this.getTokenDecimals(contractAddress);
        return formatUnits(balanceWei, decimals);
    }
    
    async getTokenBalanceOf(walletAddress: string, contractAddress: string): Promise<bigint> {
        return await this.publicClient.readContract({
            address: getAddress(contractAddress),
            abi,
            functionName: 'balanceOf',
            args: [getAddress(walletAddress)],
        }) as bigint;
    }
    
    async getTokenDecimals(contractAddress: string): Promise<number> {
        return await this.publicClient.readContract({
            address: getAddress(contractAddress),
            abi,
            functionName: 'decimals',
        }) as number;
    }
    
    isEthAddress(address: string): boolean {
        return isAddress(address);
    }
}
