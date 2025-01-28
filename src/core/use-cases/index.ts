import { EthereumDriver } from "../../shared/drivers/ethereum";
import { RippleDriver } from "../../shared/drivers/ripple";
import { SolanaDriver } from "../../shared/drivers/solana";
import { TronDriver } from "../../shared/drivers/tron";
import { EthereumUseCase } from "./ethereum";
import { RippleUseCase } from "./ripple";
import { SolanaUseCase } from "./solana";
import { TronUseCase } from "./tron";

function createEthereumUseCase(driver: EthereumDriver, tokenList: string[]) {
    return new EthereumUseCase(driver, tokenList);
}

function createTronUseCase(driver: TronDriver, tokenList: string[]) {
    return new TronUseCase(driver, tokenList);
}

function createSolanaUseCase(driver: SolanaDriver) {
    return new SolanaUseCase(driver);
}

function createRippleUseCase(driver: RippleDriver) {
    return new RippleUseCase(driver);
}

export { createEthereumUseCase, createTronUseCase, createSolanaUseCase, createRippleUseCase };