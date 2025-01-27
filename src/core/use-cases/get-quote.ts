import { getCoinIdFromSymbol } from "../../shared/drivers/ethereum";
import { getRippleCoinIdFromSymbol } from "../../shared/drivers/ripple";
import { getSolanaCoinIdFromSymbol } from "../../shared/drivers/solana";
import { getTronCoinIdFromSymbol } from "../../shared/drivers/tron";
import { getPrice } from "../../shared/gateways/price";

async function getQuote(blockchain: string, symbol: string, currency: string = 'usd') {
    const symbolToCoindIdMappers: {[blockchain: string]: (symbol:string)=>string} = {
        "ethereum": getCoinIdFromSymbol,
        "solana": getSolanaCoinIdFromSymbol,
        "ripple": getRippleCoinIdFromSymbol,
        "tron": getTronCoinIdFromSymbol
    }
    const tokenId = symbolToCoindIdMappers[blockchain](symbol);
    const price = await getPrice(tokenId);
    return { symbol, price, currency };
}

export { getQuote };    