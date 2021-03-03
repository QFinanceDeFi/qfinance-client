import { web3, makeContract } from "./init";

export const depositEth = async (context: any, amount: string, priv: boolean, address: string): Promise<boolean> => {
    try {
        let contract: any = makeContract(priv, address);
        let data: any = await contract.methods.processDeposit().encodeABI();
        const txParams: object = {
            to: address,
            from: context.state.address,
            value: web3.utils.toWei(amount, 'ether'),
            data
        };
        console.log(txParams);
        const txHash: string = await context.state.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}