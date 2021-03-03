import { web3, makeStakingContract, makeTokenContract } from "./init";

export interface IStakingDetails {
    name: string;
    address: string;
    stakingToken: string;
    periodFinish: number;
    duration: number;
    rewardsPerToken: number;
    totalRewards: number;
    info: string;
    userStake?: null | IUserStake;
}

export interface IStakingData {
    name: string;
    address: string;
    stakingToken: string;
    info: string;
}

export interface IUserStake {
    balance: number;
    allowance: number;
    rewards: number;
    staked: number;
}

export const getStakingDetails = async (context: any, contracts: IStakingData[]): Promise<IStakingDetails[]> => {

    let returnArray: IStakingDetails[] = [];
    for (let i=0; i < contracts.length; i++) {
        let contract = makeStakingContract(contracts[i].address);
        let periodFinish = await contract.methods.periodFinish().call();
        let rewardsPerToken = await contract.methods.rewardPerTokenStored().call();
        rewardsPerToken = Number(web3.utils.fromWei(rewardsPerToken.toString(), 'ether')).toFixed(18);
        let totalRewards = await contract.methods.getRewardForDuration().call();
        totalRewards = Number(web3.utils.fromWei(totalRewards.toString(), 'ether')).toFixed(18);
        let duration = await contract.methods.rewardsDuration().call();
        let userStake = null;
        if (context.state.connected) {
            let rewards = await contract.methods.earned(context.state.address).call();
            rewards = Number(web3.utils.fromWei(rewards.toString(), 'ether')).toFixed(18);
            userStake = await getUserBalances(context, rewards, contracts[i]);
        }
        returnArray.push({
            name: contracts[i].name,
            address: contracts[i].address,
            stakingToken: contracts[i].stakingToken,
            info: contracts[i].info,
            periodFinish,
            duration,
            rewardsPerToken,
            totalRewards,
            userStake
        })
    }

    return returnArray;
}

export const getUserBalances = async (context: any, rewards: number, data: IStakingData): Promise<IUserStake> => {
    let contract = makeTokenContract(data.stakingToken);
    let balance = await contract.methods.balanceOf(context.state.address).call();
    balance = Number(web3.utils.fromWei(balance.toString(), 'ether')).toFixed(18);
    let allowance = await contract.methods.allowance(context.state.address, data.address).call();
    allowance = Number(web3.utils.fromWei(allowance.toString(), 'ether')).toFixed(18);
    let rewardsContract = makeStakingContract(data.address);
    let staked = await rewardsContract.methods.balanceOf(context.state.address).call();
    staked = Number(web3.utils.fromWei(staked.toString(), 'ether'));
    return {
        balance,
        allowance,
        rewards,
        staked
    }
}

export const checkAllowance = async (userAddress: string, stakingToken: string, rewardsToken: string): Promise<number> => {
    let contract = makeTokenContract(stakingToken);
    let allowance = await contract.methods.allowance(userAddress, rewardsToken);
    allowance = Number(web3.utils.fromWei(allowance.toString(), 'ether'));
    return allowance;
}

export const approveStaking = async (context: any, address: string, stakingToken: string, userStake: any): Promise<any> => {
    let contract = makeTokenContract(stakingToken);
    let stakeAmount = web3.utils.toWei(userStake.balance.toString(), 'ether');
    let data = await contract.methods.approve(address, stakeAmount).encodeABI();
    let web3context = context.web3;
    let txParams = {
        to: stakingToken,
        from: context.address,
        value: 0x00,
        data
    }
    try {
        const txHash = await web3context.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

export const sendStake = async (context: any, stakingContract: string, amount: any): Promise<any> => {
    try {
        let contract = makeStakingContract(stakingContract);
        let stakeAmount = web3.utils.toWei(amount.toString(), 'ether');
        let data = await contract.methods.stake(stakeAmount).encodeABI();
        let txParams = {
            to: stakingContract,
            from: context.address,
            value: 0x00,
            data
        }
        const txHash = await context.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

export const claimEarnings = async (context: any, stakingContract: string): Promise<any> => {
    try {
        let contract = makeStakingContract(stakingContract);
        let data = await contract.methods.getReward().encodeABI();
        let txParams = {
            to: stakingContract,
            from: context.address,
            value: 0x00,
            data
        }
        const txHash = await context.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

export const withdrawStake = async (context: any, stakingContract: string, amount: number): Promise<any> => {
    try {
        let contract = makeStakingContract(stakingContract);
        let withdrawAmount = web3.utils.toWei(amount.toString());
        let data = await contract.methods.withdraw(withdrawAmount).encodeABI();
        let txParams = {
            to: stakingContract,
            from: context.address,
            value: 0x00,
            data
        }
        const txHash = await context.web3.eth.sendTransaction(txParams);
        console.log(txHash);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}