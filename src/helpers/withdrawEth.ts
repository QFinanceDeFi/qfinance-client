import { makeContract } from "./init";

export const withdrawEth = async (context: any, percent: number, priv: boolean, address: string): Promise<boolean> => {
    try {
        let contract: any = makeContract(priv, address);
        let data: any = await contract.methods.withdrawEth(percent).encodeABI();
        const txParams: object = {
            to: address,
            from: context.state.address,
            value: 0x00,
            data
        }
        const txHash: Promise<string> = await context.state.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}