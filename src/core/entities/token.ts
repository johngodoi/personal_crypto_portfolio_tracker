interface TokenBalance {
    balance: string;
    decimals: number;
    symbol: string;
    contractAddress: string;
};

type FungibleTokens = {
    [symbol: string]: {
        contract_address: string;
    };
};

interface EthereumTokensPortfolio { 
    [contractAddress: string]: TokenBalance 
};

interface EthereumAddressBalances { ethBalance: string, tokenBalances: EthereumTokensPortfolio };

interface CoinGeckoToken {
    id: string;
    symbol: string;
    name: string;
    platforms?: {
        ethereum?: string;
    };
}

export { TokenBalance, EthereumTokensPortfolio, EthereumAddressBalances, FungibleTokens, CoinGeckoToken };