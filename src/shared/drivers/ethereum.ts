
import { createPublicClient, http, getAddress, isAddress, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { abi } from "../../../abis/ERC20.json";
import { ETHEREUM } from "../../../config/blockchains.json";
import { FungibleTokens } from '../../core/entities/token';

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const alchemyRpcUrl = `${process.env.ALCHEMY_BASE_URL}/${alchemyApiKey}`;

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(alchemyRpcUrl),
});

function getContractAddress(tokenSymbol: string): string {
    const fungibleTokens = ETHEREUM.fungible_tokens as FungibleTokens;
    return fungibleTokens[tokenSymbol].contract_address;
}

function getCoinIdFromSymbol(symbol: string): string {
    const fungibleTokens = ETHEREUM.fungible_tokens as FungibleTokens;
    return fungibleTokens[symbol].coin_gecko_id;
}

async function getEthBalance(walletAddress: string): Promise<string> {
    const balance = await publicClient.getBalance({ address: getAddress(walletAddress) });
    return formatUnits(balance, ETHEREUM.native_currency.decimals);
}

async function getTokenBalance(walletAddress: string, contractAddress: string): Promise<string> {
    const balanceWei = await getTokenBalanceOf(walletAddress, contractAddress);
    const decimals = await getTokenDecimals(contractAddress);
    return formatUnits(balanceWei, decimals);
}

async function getTokenBalanceOf(walletAddress: string, contractAddress: string): Promise<bigint> {
    return await publicClient.readContract({
        address: getAddress(contractAddress),
        abi,
        functionName: 'balanceOf',
        args: [getAddress(walletAddress)],
    }) as bigint;
}

async function getTokenDecimals(contractAddress: string): Promise<number> {
    return await publicClient.readContract({
        address: getAddress(contractAddress),
        abi,
        functionName: 'decimals',
    }) as number;
}

export { getEthBalance, getTokenBalance, getTokenDecimals, isAddress, getContractAddress, getCoinIdFromSymbol };