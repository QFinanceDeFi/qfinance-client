import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { pools, IPoolDetails } from "../../data/stakingPools";
import { makeContract, makeStakingContract, makeTokenContract, QFI, web3 } from "../../data/init";
import axios from "axios";

interface IStakeState {
    pools: IUserStakePool[];
    status: 'pending' | 'succeeded' | 'failed' | 'standby';
}

interface IUserStakePool {
    address: string;
    valueLocked: string;
    balance: any;
    staked: any;
    rewards: any;
    allowance: any;
    apy: any;
}

const initialState: IStakeState = {
    pools: [], status: 'standby'
}

export const getStakingInfo: any = createAsyncThunk('stake/getStakingInfo', async (args, { getState }) => {
    const state: any = getState();
    try {
        const accounts: string[] = state.connect.connected ? await web3.eth.getAccounts() : [];

        const addresses: any[] = pools.map((p: any) => p.stakingToken);

        const balances: any = await axios.post(`https://${process.env.REACT_APP_ALCHEMY}`, {
            "jsonrpc": "2.0",
            "method": "alchemy_getTokenBalances",
            "params": [accounts.length > 0 ? accounts[0] : '0x', [...addresses]],
            "id": 1
        }).then((res: any) => { return res.data.result });

        const data = pools.map(async (item: IPoolDetails) => {
            const contract = makeStakingContract(item.address);
            const qfi = makeTokenContract(QFI);
            const rewardPerToken = await contract.methods.rewardPerToken().call();
            const duration = await contract.methods.rewardsDuration().call();
            const annual = (web3.utils.toBN(rewardPerToken).div(web3.utils.toBN(duration))).div(web3.utils.toBN(60*60*24*365));
            const allowance = accounts.length > 0 ? await web3.alchemy.getTokenAllowance({contract: item.stakingToken, owner: accounts[0], spender: item.address }) : '0';
            const staked = accounts.length > 0 ? await contract.methods.balanceOf(accounts[0]).call() : '0';
            const rewards = accounts.length > 0 ? await contract.methods.earned(accounts[0]).call() : '0';
            const balance = accounts.length > 0 ? balances.tokenBalances?.find((t: any) => t.contractAddress === item.stakingToken)?.tokenBalance ?? '0' : '0';

            if (item.poolName.includes("QFI Pool")) {
                const apy = annual.div(web3.utils.toBN(2)).toLocaleString();
                const qfiBalance = web3.utils.fromWei(await qfi.methods.balanceOf(item.address).call(), 'ether');


                return {
                    address: item.address,
                    valueLocked: (Number(qfiBalance) * state.prices.qfiPrice).toFixed(2),
                    balance,
                    allowance,
                    staked,
                    rewards,
                    apy
                }
            } else if (item.poolName.includes("LP")) {
                const lpBalance: any = await axios.post(`https://${process.env.REACT_APP_ALCHEMY}`, {
                    "jsonrpc": "2.0",
                    "method": "alchemy_getTokenBalances",
                    "params": [item.stakingToken, [QFI]],
                    "id": 1
                }).then((res: any) => { return res.data.result });

                const qBalance = web3.utils.toBN(lpBalance.tokenBalances[0].tokenBalance);
                const lpContract = makeTokenContract(item.stakingToken);
                const totalValue = qBalance.mul(web3.utils.toBN((state.prices.qfiPrice * 2 * 100).toFixed(0))).div(web3.utils.toBN(100));
                const costPerToken = totalValue.div(web3.utils.toBN(await lpContract.methods.totalSupply().call()));
                const apy = (Number(annual) / Number(costPerToken) / 4).toLocaleString();
                const qfiBalance = Number(web3.utils.fromWei(await qfi.methods.balanceOf(item.address).call(), 'ether')) + Number(web3.utils.fromWei(qBalance, 'ether'));

                return {
                    address: item.address,
                    valueLocked: (qfiBalance * state.prices.qfiPrice).toFixed(2),
                    balance,
                    allowance,
                    staked,
                    rewards,
                    apy
                }
            } else if (item.poolName.includes("QPDT")) {
                const sTokenContract: any = makeContract(item.stakingToken, false);
                const totalSupply = web3.utils.toBN(await sTokenContract.methods.totalSupply().call());
                const totalValue = web3.utils.toBN(await sTokenContract.methods.totalValue().call());
                const costPerToken = Number((Number(web3.utils.fromWei(totalValue, 'ether')) / Number(web3.utils.fromWei(totalSupply, 'ether')) * Number(state.prices.ethPrice)).toFixed(0));

                const apy = (Number(annual.toString()) / Number(costPerToken.toString()) / 10).toLocaleString();
                const qfiBalance = Number(web3.utils.fromWei(await qfi.methods.balanceOf(item.address).call()));
                
                return {
                    address: item.address,
                    valueLocked: (qfiBalance * state.prices.qfiPrice).toFixed(2),
                    balance,
                    allowance,
                    staked,
                    rewards,
                    apy
                }
            }

        })

        return Promise.all(data);
    }
    catch (e) {
        console.log(e);

        return Promise.all([]);
    }
})

export const stakeSlice = createSlice({
    name: 'stake',
    initialState,
    reducers: {
        stakeFunc: (state: IStakeState) => console.log(state)
    },
    extraReducers: {
        [getStakingInfo.pending]: (state: IStakeState) => {
            state.status = 'pending';
        },
        [getStakingInfo.fulfilled]: (state: IStakeState, action: PayloadAction<any>) => {
            state.pools = action.payload;
            state.status = 'succeeded';
        },
        [getStakingInfo.failed]: (state: IStakeState) => {
            state.status = 'failed';
        }
    }
});

/* @ts-ignore */
export const { stakeFunc } = stakeSlice.actions;

export const stakeSelector = (state: RootState) => state.stake;

export default stakeSlice.reducer;