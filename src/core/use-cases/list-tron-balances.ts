import { getTronTokenBalances, getTRXBalance } from '../../shared/drivers/tron';


async function getTronAddressBalances(walletAddress: string, tokenList: string[]) {
    const trxBalance = (await getTRXBalance(walletAddress)).toString();
    const tokenBalances = await getTronTokenBalances(walletAddress, tokenList) || [];
    return { trxBalance, tokenBalances};
}

export { getTronAddressBalances };