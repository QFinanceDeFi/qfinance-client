import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { factory, makeContract, web3 } from "../../data/init";
import { getStakingInfo } from "../stake/stake";

interface IPoolState {
    publicPools: IPoolDetails[];
    privatePools: IPoolDetails[];
    total: number;
    balance: string;
    status: 'pending' | 'succeeded' | 'failed' | 'standby';
}

interface IPoolDetails {
    address: string;
    poolName: string;
    poolBalance: string;
    breakdown: IBreakdown[];
    userBalance: string;
    isPublic: boolean;
    creator?: string;
}

interface IBreakdown {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    percent: number;
}

const initialState: IPoolState = {
    publicPools: [], privatePools: [], status: 'standby', total: 0, balance: '0'
};

export const getPublicPools: any = createAsyncThunk('pools/getPublicPools', async (args, { getState }): Promise<IPoolDetails[]> => {
    const state: any = getState();
    try {
        const publicPools = await factory.methods.getPublicPools().call();
        const accounts = state.connect.connected ? await web3.eth.getAccounts() : [''];

        let pools = publicPools.map(async (item: any) => {
            const contract: any = makeContract(item, false);

            return {
                address: item,
                poolName: await contract.methods.poolName().call(),
                poolBalance: await contract.methods.totalValue().call(),
                breakdown: [],
                userBalance: await contract.methods.balanceOf(accounts[0]).call().catch(() => '0'),
                creator: await contract.methods.creator().call(),
                isPublic: true
            }
        });

        return Promise.all(pools);
    }
    catch (e) {
        console.log(e);

        return [];
    }
});

export const getPrivatePools: any = createAsyncThunk('pools/getPrivatePools', async (args, { getState }): Promise<IPoolDetails[]> => {
    const state: any = getState();
    try {
        const privatePools = await factory.methods.getPrivatePools().call();
        const accounts = state.connect.connected ? await web3.eth.getAccounts() : [];

        let pools = privatePools.map(async (item: any) => {
            const contract: any = makeContract(item, false);

            const creator = web3.utils.toChecksumAddress(await contract.methods.creator().call());

            return {
                address: item,
                poolName: await contract.methods.poolName().call(),
                poolBalance: await contract.methods.totalValue().call(),
                breakdown: [],
                creator,
                userBalance: creator === web3.utils.toChecksumAddress(accounts[0]) ? await contract.methods.balanceOf(accounts[0]).call() : '0',
                isPublic: false
            }
        });

        return Promise.all(pools);
    }
    catch (e) {
        console.log(e);

        return [];
    }
});

export const getPoolDetails: any = createAsyncThunk('pools/getPoolDetails', async (address: string): Promise<any[]> => {
    try {
        const poolContract: any = makeContract(address, false);
        const tokens: string[] = await poolContract.methods.getTokens().call();
        const percent: number[] = await poolContract.methods.getAmounts().call();
        const isPublic: boolean = await poolContract.methods.isPublic()?.call() ?? false;
        const output: any = tokens.map(async (item: any, index: number) => {
            const details: any = await web3.alchemy.getTokenMetadata(item);

            return {
                pool: address, token: item, percent: percent[index], isPublic, name: details.name, symbol: details.symbol, decimals: details.decimals
            }
        });

        return Promise.all(output);
    }
    catch (e) {
        console.log(e);

        return Promise.all([]);
    }
})

export const poolsSlice = createSlice({
    name: 'pools',
    initialState,
    reducers: {
        poolFunc: (state: IPoolState) => console.log(state)
    },
    extraReducers: {
        [getPrivatePools.pending]: (state: IPoolState) => {
            state.status = 'pending';
        },
        [getPrivatePools.fulfilled]: (state: IPoolState, action: PayloadAction<any>) => {
            try {
                if (action.payload.length > 0) {
                    state.privatePools = action.payload;
                    state.total = state.privatePools.length + state.publicPools.length;
                    let balance = state.privatePools.reduce((a: any, b: any) => a.add(web3.utils.toBN(b.poolBalance)), web3.utils.toBN(0));
                    state.balance = web3.utils.fromWei(state.publicPools.reduce((a: any, b: any) => a.add(web3.utils.toBN(b.poolBalance)), balance), 'ether');
                    state.status = 'succeeded';
                }                
            }
            catch (e) {
                console.log(e);
                state.status = 'failed';
            }
        },
        [getPrivatePools.failed]: (state: IPoolState) => {
            state.status = 'failed';
        },
        [getPublicPools.pending]: (state: IPoolState) => {
            state.status = 'pending';
        },
        [getPublicPools.fulfilled]: (state: IPoolState, action: PayloadAction<any>) => {
            try {
                if (action.payload.length > 0) {
                    state.publicPools = action.payload;
                    state.total = state.privatePools.length + state.publicPools.length;
                    let balance = state.privatePools.reduce((a: any, b: any) => a.add(web3.utils.toBN(b.poolBalance)), web3.utils.toBN(0));
                    state.balance = web3.utils.fromWei(state.publicPools.reduce((a: any, b: any) => a.add(web3.utils.toBN(b.poolBalance)), balance), 'ether');
                    state.status = 'succeeded';
                }                
            }
            catch (e) {
                console.log(e);
                state.status = 'failed';
            }
        },
        [getPublicPools.failed]: (state: IPoolState) => {
            state.status = 'failed';
        },
        [getPoolDetails.pending]: (state: IPoolState) => {
            state.status = 'pending';
        },
        [getPoolDetails.fulfilled]: (state: IPoolState, action: PayloadAction<any>) => {
            if (action.payload[0].isPublic) {
                const index = state.publicPools.findIndex(p => p.address === action.payload[0].pool);
                state.publicPools[index].breakdown = [];
                const data = action.payload.map((item: any) => {
                    return {
                        address: item.token,
                        name: item.name,
                        symbol: item.symbol,
                        decimals: item.decimals,
                        percent: item.percent
                    }
                })
                state.publicPools[index].breakdown = data;
            } else {
                const index = state.privatePools.findIndex(p => p.address === action.payload[0].pool);
                if (index === -1) return;
                state.privatePools[index].breakdown = [];
                const data = action.payload.map((item: any) => {
                    return {
                        address: item.token,
                        name: item.name,
                        symbol: item.symbol,
                        decimals: item.decimals,
                        percent: item.percent
                    }
                })
                state.privatePools[index].breakdown = data;
            }
            state.status = 'succeeded';
        },
        [getStakingInfo.failed]: (state: IPoolState) => {
            state.status = 'failed';
        }
    }
});

export const { poolFunc } = poolsSlice.actions;

export const selectPools = (state: RootState) => state.pools;

export default poolsSlice.reducer;