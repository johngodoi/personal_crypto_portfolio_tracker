import tronweb, { TronWeb } from 'tronweb';
import { FungibleTokens, TokenBalance } from '../../core/entities/token';
import { TRON } from '../../../config/blockchains.json';

export class TronDriver {
  constructor(private tronWeb: TronWeb) {}

  getNativeCurrencyName(): string {
      return TRON.native_currency.symbol;
  }

  getBlockchainName(): string {
      return TRON.name;
  }

  generateTronAddress(mnemonic: string): string {
    try {
      const account = tronweb.utils.accounts.generateAccountWithMnemonic(mnemonic);
      return account.address;
    } catch (error) {
      console.error("Error generating Tron address:", error);
      throw error;
    }
  }
  
  isTronAddress(address: string): boolean {
    try {
      return tronweb.utils.address.isAddress(address);
    } catch (error) {
      console.error("Error checking Tron address:", error);
      return false;
    }
  }
  
  
  async getBalance(address:string){
    const account = await this.tronWeb.trx.getAccount(address);
    return account.balance ? account.balance / 1000000 : 0;
  }
  
  async getTokenBalances(address: string, tokenList: string[]): Promise<TokenBalance[] | null> {
      try {
          this.tronWeb.setAddress(address);
          const balances: TokenBalance[] = [];
          type FungibleTokens = {
            [key: string]: {
              contract_address: string;
              coin_gecko_id: string;
            };
          };
          const trxTokens = TRON.fungible_tokens as FungibleTokens;
          const knownTRC20 = tokenList
          .filter((symbol) => symbol in trxTokens);
  
          if (knownTRC20.length > 0) {
              for (const tokenSymbol of knownTRC20) {
                const contractAddress = trxTokens[tokenSymbol].contract_address;
                const contract = await this.tronWeb.contract().at(contractAddress);
                const balance = await contract.balanceOf(address).call();
                const decimals = await contract.decimals().call();
                const name = await contract.name().call();
                const trc20Balance = Number(balance) / Math.pow(10, Number(decimals));
                balances.push({
                  balance: trc20Balance!.toString(),
                  symbol: tokenSymbol,
                  contractAddress: contractAddress,
                  decimals: Number(decimals),
                })
              }
          }
  
          if (knownTRC20.length == 0) {
              console.log("No tokens found on this address.");
          }
          return balances;
  
      } catch (error) {
          console.error("Error checking balances:", error);
          return null;
      }
    }
  
    isNative(tokenSymbol: string): boolean {
      return tokenSymbol.toLowerCase() === TRON.native_currency.symbol.toLowerCase();
    }
  
    getCoinIdFromSymbol(symbol: string): string {
      const isNativeCurrency = this.isNative(symbol);
      if (isNativeCurrency) {
          return TRON.native_currency.coin_gecko_id;
      }
      const fungibleTokens = TRON.fungible_tokens as FungibleTokens;
      return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
    }
}
