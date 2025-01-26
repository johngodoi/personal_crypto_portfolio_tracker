import { AccountInfoRequest, AccountLinesRequest, Client, isValidAddress, Wallet } from 'xrpl';
import { FungibleTokens, TokenBalance } from '../../core/entities/token';
import { RIPPLE } from "../../../config/blockchains.json";


function generateRippleAddress(passphrase: string): string {
    try {
        const wallet = Wallet.fromMnemonic(passphrase); 
        const address = wallet.address;
        return address; 
    } catch (error) {
        console.error('Error generating address:', error);
        throw error;
    }
}

async function getRippleTokenBalances(walletAddress: string): Promise<TokenBalance[] | null> {
    const client = new Client('wss://s1.ripple.com'); // Replace with your preferred server
    try {
        await client.connect();

        const request: AccountLinesRequest = {
            command: 'account_lines',
            account: walletAddress,
        };

        const response = await client.request(request);

        if (response.result.lines) {
            const tokenBalances: { [currency: string]: { issuer: string; value: string }[] } = {};
            const balances: TokenBalance[] = [];
            response.result.lines.forEach((line: any) => {
            if (line.currency && line.balance !== '0') { // Check for non-zero balances
                if (!tokenBalances[line.currency]) {
                    tokenBalances[line.currency] = [];
                }
                tokenBalances[line.currency].push({ issuer: line.account, value: line.balance });
            }
            });

            if (Object.keys(tokenBalances).length === 0) {
            console.log(`No token balances found for ${walletAddress}`);
            } else {
            console.log(`Token balances for ${walletAddress}:`);
            for (const currency in tokenBalances) {
                console.log(`- ${currency}:`);
                tokenBalances[currency].forEach(balance => {
                    balances.push({
                        balance: balance.value,
                        symbol: decodeHexString(currency),
                        contractAddress: balance.issuer,
                        decimals: 0,
                    })
                    console.log(`    - Issuer: ${balance.issuer}, Value: ${balance.value}`);
                });
            }
            }
            return balances;

        } else {
            console.log(`No trustlines found for address: ${walletAddress}`);
            return [];
        }
    } catch (error) {
        console.error('Error checking token balances:', error);
        return [];
    } finally {
        if (client) {
            await client.disconnect();
        }
    }
}

async function getXRPBalance(address:string){
    const client = new Client('wss://s1.ripple.com'); // Replace with your preferred server
    
    try {
        console.log('Connecting to XRPL...');
        await client.connect();
        console.log('Connected to XRPL');
        const request: AccountInfoRequest = {
          command: 'account_info',
          account: address,
        };
    
        const response = await client.request(request);
    
        if (response.result.account_data) {
          const xrpBalance = Number(response.result.account_data.Balance).valueOf();
          console.log(`XRP Balance for ${address}: ${xrpBalance}`);
          return xrpBalance / Math.pow(10, 6); // Convert from drops to XRP
        } else {
          console.log(`No account found for address: ${address}`);
          return 0;
        }
      } catch (error) {
        console.error('Error checking XRP balance:', error);
        return 0;
      } finally {
        await client.disconnect();
      }
    
}

function isXRPAddress(address: string): boolean { 
  try {
    return isValidAddress(address);
  } catch (error) {
    console.error("Error checking address:", error);
    return false; // Return false in case of an error during validation
  }
}

function decodeHexString(hexString: string): string {
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

function isNative(tokenSymbol: string): boolean {
  return tokenSymbol.toLowerCase() === RIPPLE.native_currency.symbol.toLowerCase();
}

function getRippleCoinIdFromSymbol(symbol: string): string {
  const isNativeCurrency = isNative(symbol);
  if (isNativeCurrency) {
      return RIPPLE.native_currency.coin_gecko_id;
  }
  const fungibleTokens = RIPPLE.fungible_tokens as FungibleTokens;
  return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
}

export { generateRippleAddress, getRippleTokenBalances, getXRPBalance, isXRPAddress, decodeHexString, getRippleCoinIdFromSymbol };