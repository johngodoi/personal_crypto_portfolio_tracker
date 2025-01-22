import { getPrice } from "../../shared/gateways/price";

async function getQuote(symbol: string, currency: string = 'usd') {
    const price = await getPrice(symbol.toLowerCase());
    return { symbol, price, currency };
}

export { getQuote };    