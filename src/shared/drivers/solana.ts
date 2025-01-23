import * as bip39 from 'bip39';
import { Keypair, Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { derivePath } from "ed25519-hd-key"
import { SOLANA } from "../../../config/blockchains.json";
import { FungibleTokens } from '../../core/entities/token';

const connection = new Connection('https://api.mainnet-beta.solana.com'); 

async function generateSolanaAddress(mnemonic: string): Promise<string> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
    const solKeypair = Keypair.fromSeed(derivedSeed);
    return solKeypair.publicKey.toString();
}

async function listTokensOwnedByAddress(
  address: string
): Promise<{
    address: string;
    balance: Number;
    decimals: Number;
}[]>{
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(address),
    { programId: TOKEN_PROGRAM_ID}
  );

  return tokenAccounts.value.map((account) => {
    const info = account.account.data.parsed.info;
    const balance = info.tokenAmount.amount / Math.pow(10, info.tokenAmount.decimals);
    return {address: info.mint as string, balance, decimals: info.tokenAmount.decimals};
  });
}

function getSymbolFromSolanaAddress(address: string): string {
    const fungibleTokens: { [key: string]: { contract_address: string; coin_gecko_id: string } } = SOLANA.fungible_tokens;
    for (const symbol in fungibleTokens) {
        if (fungibleTokens[symbol].contract_address === address) {
            return symbol;
        }
    }
    return "UNKNOWN";
}

function isNative(tokenSymbol: string): boolean {
    return tokenSymbol.toLowerCase() === SOLANA.native_currency.symbol.toLowerCase();
}

function isSolanaAddress(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch (error) {
        return false;
    }
}

function getSolanaCoinIdFromSymbol(symbol: string): string {
  const isNativeCurrency = isNative(symbol);
  if (isNativeCurrency) {
      return SOLANA.native_currency.coin_gecko_id;
  }
  const fungibleTokens = SOLANA.fungible_tokens as FungibleTokens;
  return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
}

async function getSolBalance(
  address: string
): Promise<number> {
    const balance = await connection.getBalance(new PublicKey(address));
    return balance / Math.pow(10, SOLANA.native_currency.decimals); // Convert from lamports to SOL
}

async function getSolTokenBalance(
  mintAddress: string
): Promise<number> {
    const accountInfo = await connection.getAccountInfo(new PublicKey(mintAddress));
    if (accountInfo && accountInfo.data) {
      const buffer = Buffer.from(accountInfo.data);
      const amount = buffer.readUInt32LE(8);
      return amount / Math.pow(10, 6); // Convert from lamports to USDT
    }
    return 0;
}


export { generateSolanaAddress, listTokensOwnedByAddress, getSolBalance, getSolTokenBalance, isSolanaAddress, getSymbolFromSolanaAddress, getSolanaCoinIdFromSymbol };