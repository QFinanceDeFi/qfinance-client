import { web3, QFI } from "./init";

export const getBalance = async (address: string): Promise<number> => {
    if (address === '') {
        return 0;
    }

    let balance = await QFI.methods.balanceOf(address).call();
    balance = web3.utils.fromWei(balance.toString(), 'ether');
    return Number(balance);
}