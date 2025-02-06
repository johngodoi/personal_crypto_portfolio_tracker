export interface PriceGateway {
    getPrice(tokenId: string, currency?: string): Promise<number | null>;
}