import { CoingeckoGateway } from "./coingecko";
import { PriceGateway } from "./interface";

function createPriceGateway(): PriceGateway {
  return new CoingeckoGateway();
}

export { createPriceGateway };
