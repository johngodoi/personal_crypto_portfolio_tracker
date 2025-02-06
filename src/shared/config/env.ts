import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    OPENAPI_VERSION: z.string().default('3.0.0'),
    APP_NAME: z.string().default('Crypto Portfolio Tracker'),
    APP_VERSION: z.string().default('0.0.1'),
    APP_DESCRIPTION: z.string().default('API for Crypto Portfolio Tracker backend'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    OTLP_ENDPOINT: z.string().url().default('http://localhost:4317'),
    CURRENCY: z.string().default('usd'),
    TOKENS_OF_INTEREST: z.string().default(""),
    COINGECKO_BASE_URL: z.string().url().default('https://api.coingecko.com/api/v3'),
    ALCHEMY_API_KEY: z.string(),
    ETHEREUM_RPC_BASE_URL: z.string().url().default('https://eth-mainnet.alchemyapi.io/v2'),
    RIPPLE_RPC_BASE_URL: z.string().url().default('wss://s1.ripple.com'),
    SOLANA_RPC_BASE_URL: z.string().url().default('https://api.mainnet-beta.solana.com'),
    TRON_RPC_BASE_URL: z.string().url().default('https://api.trongrid.io'),
    MNEMONIC_PASSPHRASE: z.string().optional(),
    CONFIG_ADDRESSES_PATH: z.string().optional(),
    CONFIG_ADDRESSES_PATH_PATTERN: z.string().default('../../../config/addresses.json'),
    TEST_WALLET_ADDRESS: z.string().optional(),
    TSCONFIG_PATH_PATTERN: z.string().default('../../../tsconfig.json'),
    TOKEN_ENTITIES_PATH_PATTERN: z.string().default('../../core/entities/token.ts'),
    ROUTES_PATH_PATTERN: z.string().default('../../presentation/routers/routes.ts'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

export const env = _env.data;