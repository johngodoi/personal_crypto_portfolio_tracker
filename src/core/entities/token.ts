interface TokenBalance {
    balance: string;
    decimals: number;
    contractAddress: string;
};

interface EthereumTokensPortfolio { 
    [contractAddress: string]: TokenBalance 
};

interface EthereumAddressBalances { ethBalance: string, tokenBalances: EthereumTokensPortfolio };

export { TokenBalance, EthereumTokensPortfolio, EthereumAddressBalances };