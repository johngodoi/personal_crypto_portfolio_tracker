import { TokenBalance } from "./token";

interface TokenBalanceValue extends TokenBalance {
    value: number;
}

interface Portfolio {
    address: string;
    ethBalance: string;
    ethBalanceValue: number;
    tokenBalanceValues: TokenBalanceValue[];
}

export { Portfolio, TokenBalanceValue };