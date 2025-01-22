import express, { Request, Response } from 'express';
import ERC20 from "../abis/ERC20.json";
import { createPublicClient, http, getAddress, isAddress, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

const app = express();
const port = 3000;

interface TokenBalance {
    balance: string;
    decimals: number;
    contractAddress: string;
}
const ETHER_DECIMALS = 18;

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemyRpcUrl = `${process.env.ALCHEMY_BASE_URL}/${alchemyApiKey}`;

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(alchemyRpcUrl),
});

const getTokenBalances = async (walletAddress: string, contractAddresses: string[]): Promise<TokenBalance[] | null> => {
    try {
        const abi = ERC20.abi;
        const balances: TokenBalance[] = [];
        for (const contractAddress of contractAddresses) {
            const balanceWei = await publicClient.readContract({
                address: getAddress(contractAddress),
                abi,
                functionName: 'balanceOf',
                args: [getAddress(walletAddress)],
            });

            const decimals = await publicClient.readContract({
                address: getAddress(contractAddress),
                abi,
                functionName: 'decimals'
              });
    
            const balance = formatUnits(balanceWei as bigint, Number(decimals)); // Use Viem's formatUnits
    
            balances.push({
                balance,
                decimals: Number(decimals),
                contractAddress,
            });
            
        }

        return balances;
    } catch (error) {
        console.error("Error getting LINK balance:", error);
        return null;
    }
};
function formatEtherViem(wei: bigint, decimals: number): string {
    return formatUnits(wei, decimals);
  }

  
app.get('/balances/:address', async (req: Request, res: Response) => {
    const walletAddress = req.params.address;

    if (!walletAddress || !isAddress(walletAddress)) {
        res.status(400).json({ error: 'Invalid wallet address' });
        return;
    }

    try {
        const balance = await publicClient.getBalance({ address: getAddress(walletAddress) });
        const formattedBalance = formatEtherViem(balance, ETHER_DECIMALS);

        const tokenBalances: { [key: string]: TokenBalance } = {};
        const tokens = await getTokenBalances(walletAddress,process.env.TOKENS_OF_INTEREST!.split(","));
        for(const token of tokens!){
            tokenBalances[token.contractAddress] = token;
        }
        res.json({ ethBalance: formattedBalance, tokenBalances });

    } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});