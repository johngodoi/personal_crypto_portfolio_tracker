import { TokenBalance } from "./token";

interface TokenBalanceValue extends TokenBalance {
    value: number;
}

interface Portfolio {
    address: string;
    nativeBalance: string;
    nativeBalanceValue: number;
    tokenBalanceValues: TokenBalanceValue[];
}

export { Portfolio, TokenBalanceValue };