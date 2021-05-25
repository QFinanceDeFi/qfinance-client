import { web3, airdrop } from "./init";

export const checkAirdrop = async (address: string): Promise<any> => {
    try {
        let res = await airdrop.methods.checkAddress(address).call();
        let retValue = {
            inAirdrop: res[0],
            amount: (Math.floor(Number(web3.utils.fromWei(res[1], 'ether')) * 10000) / 10000).toString()
        }
        return retValue;
    }
    catch(e) {
        return false;
    }
}

export const claimAirdrop = async (context: any): Promise<boolean> => {
    try {
        const data = airdrop.methods.claimAirdrop().encodeABI();
        const txParams = {
            to: '0xaad3f80735ef18a20ce2a07369a06c9004107e5a',
            from: context.state.address,
            value: 0x0,
            data
        }
        const txHash: Promise<string> = await context.state.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        return false;
    }
}