
import { createPublicClient, http, getAddress, isAddress, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import ERC20 from "../../../abis/ERC20.json";

const ETHER_DECIMALS = 18;

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemyRpcUrl = `${process.env.ALCHEMY_BASE_URL}/${alchemyApiKey}`;

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(alchemyRpcUrl),
});


async function getEthBalance(walletAddress: string): Promise<string> {
    const balance = await publicClient.getBalance({ address: getAddress(walletAddress) });
    return formatUnits(balance, ETHER_DECIMALS);
}

async function getTokenBalance(walletAddress: string, contractAddress: string): Promise<string> {
    const balanceWei = await getTokenBalanceOf(walletAddress, contractAddress);
    const decimals = await getTokenDecimals(contractAddress);
    return formatUnits(balanceWei, decimals);
}

async function getTokenBalanceOf(walletAddress: string, contractAddress: string): Promise<bigint> {
    return await publicClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20.abi,
        functionName: 'balanceOf',
        args: [getAddress(walletAddress)],
    }) as bigint;
}

async function getTokenDecimals(contractAddress: string): Promise<number> {
    return await publicClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20.abi,
        functionName: 'decimals',
    }) as number;
}

export { getEthBalance, getTokenBalance, getTokenDecimals, isAddress };