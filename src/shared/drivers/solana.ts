import * as bip39 from 'bip39';
import { Keypair, Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { derivePath } from "ed25519-hd-key"
import { SOLANA } from "../../../config/blockchains.json";
import { FungibleTokens } from '../../core/entities/token';

export class SolanaDriver {

  constructor(private connection: Connection) {}

  getNativeCurrencyName(): string {
      return SOLANA.native_currency.symbol;
  }

  getBlockchainName(): string {
      return SOLANA.name;
  }

  async generateSolanaAddress(mnemonic: string): Promise<string> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
    const solKeypair = Keypair.fromSeed(derivedSeed);
    return solKeypair.publicKey.toString();
  }

  async listTokensOwnedByAddress(
    address: string
  ): Promise<{
      address: string;
      balance: number;
      decimals: number;
  }[]>{
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      new PublicKey(address),
      { programId: TOKEN_PROGRAM_ID}
    );

    return tokenAccounts.value.map((account) => {
      const info = account.account.data.parsed.info;
      const balance = info.tokenAmount.amount / Math.pow(10, info.tokenAmount.decimals);
      return {address: info.mint as string, balance, decimals: info.tokenAmount.decimals};
    });
  }

  getSymbolFromAddress(address: string): string {
      const fungibleTokens: { [key: string]: { contract_address: string; coin_gecko_id: string } } = SOLANA.fungible_tokens;
      for (const symbol in fungibleTokens) {
          if (fungibleTokens[symbol].contract_address === address) {
              return symbol;
          }
      }
      return "UNKNOWN";
  }

  isNative(tokenSymbol: string): boolean {
      return tokenSymbol.toLowerCase() === SOLANA.native_currency.symbol.toLowerCase();
  }

  isSolanaAddress(address: string): boolean {
      try {
          new PublicKey(address);
          return true;
      } catch (error) {
          return false;
      }
  }

  getCoinIdFromSymbol(symbol: string): string {
    const isNativeCurrency = this.isNative(symbol);
    if (isNativeCurrency) {
        return SOLANA.native_currency.coin_gecko_id;
    }
    const fungibleTokens = SOLANA.fungible_tokens as FungibleTokens;
    return fungibleTokens[symbol.toUpperCase()].coin_gecko_id;
  }

  async getBalance(
    address: string
  ): Promise<number> {
      const balance = await this.connection.getBalance(new PublicKey(address));
      return balance / Math.pow(10, SOLANA.native_currency.decimals);
  }

  async getSolTokenBalance(
    mintAddress: string
  ): Promise<number> {
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(mintAddress));
      if (accountInfo && accountInfo.data) {
        const buffer = Buffer.from(accountInfo.data);
        const amount = buffer.readUInt32LE(8);
        return amount / Math.pow(10, 6); // FIXME: Convertion from lamports to USDT
      }
      return 0;
  }

}
