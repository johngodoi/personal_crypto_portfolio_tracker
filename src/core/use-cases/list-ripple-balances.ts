import { Client, AccountLinesRequest } from 'xrpl';
import { getRippleTokenBalances, getXRPBalance } from '../../shared/drivers/ripple';



async function getRippleAddressBalances(walletAddress: string){
    const xrpBalance = (await getXRPBalance(walletAddress)).toString();
    const tokenBalances = await getRippleTokenBalances(walletAddress);
    return { xrpBalance, tokenBalances};
}

export { getRippleAddressBalances };