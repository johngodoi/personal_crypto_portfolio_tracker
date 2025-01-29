
import { mainnet } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { EthereumDriver } from './ethereum';
import { Client } from 'xrpl';
import { RippleDriver } from './ripple';
import { Connection } from '@solana/web3.js';
import { SolanaDriver } from './solana';
import { TronWeb } from 'tronweb';
import { TronDriver } from './tron';
import { env } from '../config/env';


function createEthereumDriver() {
  const alchemyApiKey = env.ALCHEMY_API_KEY;
  const alchemyRpcUrl = `${env.ETHEREUM_RPC_BASE_URL}/${alchemyApiKey}`;
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(alchemyRpcUrl),
  });
  return new EthereumDriver(publicClient);
}

function createRippleDriver() {
  const client = new Client(env.RIPPLE_RPC_BASE_URL);
  return new RippleDriver(client);
}

function createSolanaDriver() {
  const connection = new Connection(env.SOLANA_RPC_BASE_URL); 
  return new SolanaDriver(connection);
}

function createTronDriver() {
  const tronWeb = new TronWeb({
      fullNode: env.TRON_RPC_BASE_URL,
      solidityNode: env.TRON_RPC_BASE_URL,
      fullHost: env.TRON_RPC_BASE_URL,
  });
  return new TronDriver(tronWeb);
}

export { createEthereumDriver, createRippleDriver, createSolanaDriver, createTronDriver };