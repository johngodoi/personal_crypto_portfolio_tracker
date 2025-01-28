import { AccountInfoRequest, AccountLinesRequest, Client, isValidAddress, Wallet } from 'xrpl';
import { FungibleTokens, TokenBalance } from '../../core/entities/token';
import { RIPPLE } from "../../../config/blockchains.json";

export class RippleDriver {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  generateRippleAddress(passphrase: string): string {
    try {
        const wallet = Wallet.fromMnemonic(passphrase); 
        return wallet.address;
    } catch (error) {
        console.error('Error generating address:', error);
        throw error;
    }
  }

  async getTokenBalances(walletAddress: string): Promise<TokenBalance[] | null> {
      try {
          await this.client.connect();

          const request: AccountLinesRequest = {
              command: 'account_lines',
              account: walletAddress,
          };

          const response = await this.client.request(request);

          if (response.result.lines) {
              const tokenBalances: { [currency: string]: { issuer: string; value: string }[] } = {};
              const balances: TokenBalance[] = [];
              response.result.lines.forEach((line: any) => {
              if (line.currency && line.balance !== '0') {
                  if (!tokenBalances[line.currency]) {
                      tokenBalances[line.currency] = [];
                  }
                  tokenBalances[line.currency].push({ issuer: line.account, value: line.balance });
              }
              });

              if (Object.keys(tokenBalances).length > 0) {
                for (const currency in tokenBalances) {
                    tokenBalances[currency].forEach(balance => {
                        balances.push({
                            balance: balance.value,
                            symbol: this.decodeHexString(currency),
                            contractAddress: balance.issuer,
                            decimals: 0,
                        })
                    });
                }
              }
              return balances;

          } else {
              return [];
          }
      } catch (error) {
          console.error('Error checking token balances:', error);
          return [];
      } finally {
          if (this.client) {
              await this.client.disconnect();
          }
      }
  }

  async getBalance(address:string){
      
      try {
          await this.client.connect();
          const request: AccountInfoRequest = {
            command: 'account_info',
            account: address,
          };
      
          const response = await this.client.request(request);
      
          if (response.result.account_data) {
            const xrpBalance = Number(response.result.account_data.Balance).valueOf();
            return xrpBalance / Math.pow(10, 6); // Convert from drops to XRP
          } else {
            return 0;
          }
        } catch (error) {
          console.error('Error checking XRP balance:', error);
          return 0;
        } finally {
          await this.client.disconnect();
        }
      
  }

  isXRPAddress(address: string): boolean { 
    try {
      return isValidAddress(address);
    } catch (error) {
      console.error("Error checking address:", error);
      return false; // Return false in case of an error during validation
    }
  }

  decodeHexString(hexString: string): string {
    if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even number of characters.");
    }

    let decodedString = "";
    for (let i = 0; i < hexString.length; i += 2) {
      const hexByte = hexString.substring(i, i + 2);
      const decimalValue = parseInt(hexByte, 16);

      // Check for null terminator (0x00) and stop if encountered.
      if (decimalValue === 0) {
          break; // Stop decoding at the first null character.
      }

      decodedString += String.fromCharCode(decimalValue);
    }

    return decodedString;
  }

  isNative(tokenSymbol: string): boolean {
    return tokenSymbol.toLowerCase() === RIPPLE.native_currency.symbol.toLowerCase();
  }

  getCoinIdFromSymbol(symbol: string): string {
    const isNativeCurrency = this.isNative(symbol);
    if (isNativeCurrency) {
        return RIPPLE.native_currency.coin_gecko_id;
    }
    const fungibleTokens = RIPPLE.fungible_tokens as FungibleTokens;
    return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
  }

}
