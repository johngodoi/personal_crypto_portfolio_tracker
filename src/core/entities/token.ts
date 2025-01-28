interface TokenBalance {
    balance: string;
    decimals: number;
    symbol: string;
    contractAddress: string;
};

type FungibleTokens = {
    [symbol: string]: {
        contract_address: string;
        coin_gecko_id: string;
    };
};

interface AddressBalances { blockchain: string, nativeBalance: string, tokenBalances: TokenBalance[] };

export { TokenBalance, AddressBalances, FungibleTokens };