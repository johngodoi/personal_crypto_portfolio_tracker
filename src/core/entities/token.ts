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

export { TokenBalance, EthereumTokensPortfolio, EthereumAddressBalances, FungibleTokens };