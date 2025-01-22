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

interface EthereumAddressBalances { ethBalance: string, tokenBalances: TokenBalance[] };

export { TokenBalance, EthereumAddressBalances, FungibleTokens };