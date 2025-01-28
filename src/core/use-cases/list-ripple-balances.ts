import { getRippleTokenBalances, getXRPBalance } from '../../shared/drivers/ripple';
import { AddressBalances } from "../entities/token";


async function getRippleAddressBalances(walletAddress: string): Promise<AddressBalances> {
    const nativeBalance = (await getXRPBalance(walletAddress)).toString();
    const tokenBalances = await getRippleTokenBalances(walletAddress);
    return { blockchain: "ripple", nativeBalance, tokenBalances} as AddressBalances;
}

export { getRippleAddressBalances };