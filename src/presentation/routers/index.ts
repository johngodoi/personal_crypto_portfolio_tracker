import { createEthereumUseCase, createRippleUseCase, createSolanaUseCase, createTronUseCase } from "../../core/use-cases";
import { createEthereumDriver, createRippleDriver, createSolanaDriver, createTronDriver } from "../../shared/drivers";

function createUseCases() {
    const tokenList = (process.env.TOKENS_OF_INTEREST || "").split(",");
    return {
        "ethereum": () => createEthereumUseCase(createEthereumDriver(), tokenList),
        "tron": () => createTronUseCase(createTronDriver(), tokenList),
        "solana": () => createSolanaUseCase(createSolanaDriver()),
        "ripple": () => createRippleUseCase(createRippleDriver()),
    };
}

export { createUseCases };