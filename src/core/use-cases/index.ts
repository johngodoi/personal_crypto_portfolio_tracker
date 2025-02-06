import { EthereumDriver } from "../../shared/drivers/ethereum";
import { RippleDriver } from "../../shared/drivers/ripple";
import { SolanaDriver } from "../../shared/drivers/solana";
import { TronDriver } from "../../shared/drivers/tron";
import { PriceGateway } from "../../shared/gateways/price/interface";
import { EthereumUseCase } from "./ethereum";
import { RippleUseCase } from "./ripple";
import { SolanaUseCase } from "./solana";
import { TronUseCase } from "./tron";

function createEthereumUseCase(driver: EthereumDriver, priceGateway: PriceGateway, tokenList: string[]) {
    return new EthereumUseCase(driver, priceGateway, tokenList);
}

function createTronUseCase(driver: TronDriver, priceGateway: PriceGateway, tokenList: string[]) {
    return new TronUseCase(driver, priceGateway, tokenList);
}

function createSolanaUseCase(driver: SolanaDriver, priceGateway: PriceGateway) {
    return new SolanaUseCase(driver, priceGateway);
}

function createRippleUseCase(driver: RippleDriver, priceGateway: PriceGateway) {
    return new RippleUseCase(driver, priceGateway);
}

export { createEthereumUseCase, createTronUseCase, createSolanaUseCase, createRippleUseCase };