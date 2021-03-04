import { web3, factory, makeContract } from "./init";

export const getPools = async (): Promise<object[]> => {
    let poolsObj: object[] = [];
    const privatePools: string[] = await factory.methods.getPrivatePools().call();

    for (let i=0; i < privatePools.length; i++) {
        let contract: any = makeContract(true, privatePools[i]);
        let balance: number = await contract.methods.totalValue().call();
        balance = Number(web3.utils.fromWei(balance.toString(), 'ether'));
        let poolName: string = await contract.methods.poolName().call();
        poolsObj.push({
            poolName,
            address: privatePools[i],
            balance,
            priv: true
        })
    }

    const publicPools: string[] = await factory.methods.getPublicPools().call();
    for (let i=0; i < publicPools.length; i++) {
        let contract: any = makeContract(true, publicPools[i]);
        let balance: number = await contract.methods.totalValue().call();
        balance = Number(web3.utils.fromWei(balance.toString(), 'ether'));
        let poolName: string = await contract.methods.poolName().call();
        poolsObj.push({
            poolName,
            address: publicPools[i],
            balance,
            priv: false
        })
    }

    return poolsObj;
}

export const getPool = async (priv: boolean, address: string, context: any): Promise<object | boolean> => {
    let outputObj: object | null;
    try {
        let contract: any = makeContract(priv, address);
        let balance: number = await contract.methods.totalValue().call();
        balance = Number(web3.utils.fromWei(balance.toString(), 'ether'));
        let poolName: string = await contract.methods.poolName().call();
        let tokens: string[] = await contract.methods.getTokens().call();
        let amounts: number[] = await contract.methods.getAmounts().call();
        let isPublic: boolean = await contract.methods.isPublic().call();
        let creator: string = await contract.methods.creator().call();
        let breakdown: object[] = [];
        tokens.map((item, index) => {
            return (
                breakdown.push({
                address: item,
                percent: amounts[index]
            })
            )
        })
        let userBalance = 0;
        
        if (context.state.connected && isPublic) {
            userBalance = await contract.methods.balanceOf(context.state.address).call();
            userBalance = Number(web3.utils.fromWei(userBalance.toString(), 'ether'));
        }

        outputObj = {
            poolName,
            creator,
            balance,
            isPublic,
            breakdown,
            userBalance
        }

        return outputObj;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}