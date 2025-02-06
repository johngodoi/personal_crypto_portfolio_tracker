import { createEthereumUseCase, createRippleUseCase, createSolanaUseCase, createTronUseCase } from "../../core/use-cases";
import { env } from "../../shared/config/env";
import { createEthereumDriver, createRippleDriver, createSolanaDriver, createTronDriver } from "../../shared/drivers";
import { PriceGateway } from "../../shared/gateways/price/interface";

function createUseCases(priceGateway: PriceGateway) {
    const tokenList = env.TOKENS_OF_INTEREST.split(",");
    return {
        "ethereum": () => createEthereumUseCase(createEthereumDriver(), priceGateway, tokenList),
        "tron": () => createTronUseCase(createTronDriver(), priceGateway, tokenList),
        "solana": () => createSolanaUseCase(createSolanaDriver(), priceGateway),
        "ripple": () => createRippleUseCase(createRippleDriver(), priceGateway),
    };
}

export { createUseCases };