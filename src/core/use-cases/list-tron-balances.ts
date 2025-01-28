import { getTronTokenBalances, getTRXBalance } from '../../shared/drivers/tron';
import { AddressBalances } from '../entities/token';


async function getTronAddressBalances(walletAddress: string, tokenList: string[]): Promise<AddressBalances> {
    const nativeBalance = (await getTRXBalance(walletAddress)).toString();
    const tokenBalances = await getTronTokenBalances(walletAddress, tokenList) || [];
    return { blockchain:"tron", nativeBalance, tokenBalances} as AddressBalances;
}

export { getTronAddressBalances };