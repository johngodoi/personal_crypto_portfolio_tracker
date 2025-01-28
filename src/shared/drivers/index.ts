
import { mainnet } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { EthereumDriver } from './ethereum';
import { Client } from 'xrpl';
import { RippleDriver } from './ripple';
import { Connection } from '@solana/web3.js';
import { SolanaDriver } from './solana';
import { TronWeb } from 'tronweb';
import { TronDriver } from './tron';

function createEthereumDriver() {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const alchemyRpcUrl = `${process.env.ALCHEMY_BASE_URL}/${alchemyApiKey}`;
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(alchemyRpcUrl),
  });
  return new EthereumDriver(publicClient);
}

function createRippleDriver() {
  const client = new Client('wss://s1.ripple.com');
  return new RippleDriver(client);
}

function createSolanaDriver() {
  const connection = new Connection('https://api.mainnet-beta.solana.com'); 
  return new SolanaDriver(connection);
}

function createTronDriver() {
  const tronWeb = new TronWeb({
      fullNode: 'https://api.trongrid.io',
      solidityNode: 'https://api.trongrid.io',
      fullHost: 'https://api.trongrid.io',
  });
  return new TronDriver(tronWeb);
}

export { createEthereumDriver, createRippleDriver, createSolanaDriver, createTronDriver };