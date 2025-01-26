const COINGECKO_BASE_URL = process.env.COINGECKO_BASE_URL;

async function getPrice(tokenId: string, currency: string = 'usd'): Promise<number | null> {
    try {
        const url = `${COINGECKO_BASE_URL}/simple/price?ids=${tokenId}&vs_currencies=${currency}`
        const priceResponse = await fetch(url);
        const priceData = await priceResponse.json();

        if (priceData && priceData[tokenId] && priceData[tokenId][currency]) {
            return priceData[tokenId][currency];
        } else {
            console.error(`Could not retrieve price for ${tokenId} in ${currency}.`);
            throw new Error(`Could not retrieve price for ${tokenId} in ${currency}.`);
        }
    } catch (error) {
        console.error("Error fetching token price:", error);
        throw error;
    }
}

export { getPrice };