import { factory, FACTORY_ADDRESS } from "./init";

export interface ITokens {
    address: string;
    percent: number;
}

export const createPool = async (context: any, poolName: string, tokens: ITokens[], isPublic: boolean): Promise<boolean> => {
    try {
        let addresses = tokens.map(item => item.address)
        let amounts = tokens.map(item => item.percent)
        let data;
        
        if (isPublic) {
            data = factory.methods.newPublicPool(
                poolName,
                addresses,
                amounts
            ).encodeABI();
        }
        else if (!isPublic) {
            data = factory.methods.newPool(
                poolName,
                addresses,
                amounts
            ).encodeABI();
        }

        const txParams = {
            to: FACTORY_ADDRESS,
            from: context.state.address,
            value: 0x0,
            data
        }

        const txHash: Promise<string> = await context.state.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true
    }
    catch(e) {
        console.log(e);
        return false;
    }
}