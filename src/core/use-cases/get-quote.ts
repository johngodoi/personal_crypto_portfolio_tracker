import { getCoinIdFromSymbol } from "../../shared/drivers/ethereum";
import { getSolanaCoinIdFromSymbol } from "../../shared/drivers/solana";
import { getPrice } from "../../shared/gateways/price";

async function getQuote(blockchain: string, symbol: string, currency: string = 'usd') {
    const tokenId = blockchain === 'ethereum'? getCoinIdFromSymbol(symbol) : getSolanaCoinIdFromSymbol(symbol);
    const price = await getPrice(tokenId);
    return { symbol, price, currency };
}

export { getQuote };    