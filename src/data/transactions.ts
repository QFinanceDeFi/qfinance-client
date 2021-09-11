import { web3, makeContract } from "./init";

export const depositEth: any = async (amount: string, isPublic: boolean, address: string): Promise<any> => {
    try {
        const contract: any = makeContract(address, !isPublic);
        const accounts: string[] = await web3.eth.getAccounts();
        const data: any = await contract.methods.processDepost().encodeABI();
        const txParams: object = {
            from: accounts[0],
            to: address,
            value: web3.utils.toWei(amount, 'ether'),
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams);

        return tx;
    }
    catch (e) {
        console.log(e);

        return e;
    }
}

export const liquidate: Function = async (percent: number, address: string) => {
    try {
        const contract: any = makeContract(address, false);
        const accounts: string[] = await web3.eth.getAccounts();
        const data: any = await contract.methods.withdrawEth(percent).encodeABI();
        const txParams: object = {
            from: accounts[0],
            to: address,
            value: '0x0',
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams);

        return tx;
    }
    catch (e) {
        console.log(e);

        return e;
    }
}

export const withdrawTokens: Function = async (address: string) => {
    try {
        const contract: any = makeContract(address, false);
        const accounts: string[] = await web3.eth.getAccounts();
        const data: any = await contract.methods.withdrawTokens().encodeABI();
        const txParams: object = {
            from: accounts[0],
            to: address,
            value: '0x0',
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams);

        return tx;
    }
    catch (e) {
        console.log(e);

        return e;
    }
}