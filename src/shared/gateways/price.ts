import { CoinGeckoToken } from "../../core/entities/token";

const COINGECKO_BASE_URL = process.env.COINGECKO_BASE_URL;

async function getCoinIdFromSymbol(symbol: string): Promise<string | null> {
    try {
      const response = await fetch(`${COINGECKO_BASE_URL}/coins/list`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const coins = await response.json() as CoinGeckoToken[];
  
      const coin = coins.find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase());
  
      if (coin) {
        return coin.id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      return null;
    }
  }

async function getPrice(symbol: string, currency: string = 'usd'): Promise<number | null> {
    try {
        const tokenId = await getCoinIdFromSymbol(symbol);
        if (!tokenId) {
            console.log(`Could not retrieve ID for token with symbol ${symbol}.`);
            return null;
        }

        const priceResponse = await fetch(`${COINGECKO_BASE_URL}/simple/price?ids=${tokenId}&vs_currencies=${currency}`);

        const priceData = await priceResponse.json();

        if (priceData && priceData[tokenId] && priceData[tokenId][currency]) {
            return priceData[tokenId][currency];
        } else {
            console.log(`Could not retrieve price for ${tokenId} in ${currency}.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching token price:", error);
        return null;
    }
}

export { getPrice };