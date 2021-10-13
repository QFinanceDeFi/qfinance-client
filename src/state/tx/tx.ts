import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeContract, makeStakingContract, makeTokenContract, web3 } from "../../data/init";
import type { RootState } from "../../store";

interface ITxState {
    status: 'pending' | 'succeeded' | 'failed' | 'standby';
    current: 'approve' | 'deposit' | 'liquidate' | 'withdraw' | 'removeStake' | 'stake' | 'claim' | '';
    target: string;
    hashes: string[];
}

const initialState: ITxState = {
    status: 'standby',
    current: '',
    target: '',
    hashes: []
}

export const depositEth: any = createAsyncThunk('tx/depositEth', async (args: any) => {
    try {
        const accounts: string[] = await web3.eth.getAccounts();
        const contract: any = makeContract(args.address, !args.isPublic);
        const data: any = await contract.methods.processDeposit().encodeABI();
        const txParams: any = {
            from: web3.utils.toChecksumAddress(accounts[0]),
            to: args.address,
            value: web3.utils.toHex(web3.utils.toWei(args.amount, 'ether')),
            data
        }

        const tx: any = await web3.eth.sendTransaction(txParams);

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const liquidate: any = createAsyncThunk('tx/liquidate', async (args: any) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const contract: any = makeContract(args.address, !args.isPublic);
        const data: string = contract.methods.withdrawEth(100).encodeABI();
        const txParams: object = {
            to: args.address,
            from: accounts[0],
            value: 0x0,
            data
        }

        const tx: any = await web3.eth.sendTransaction(txParams);

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const withdrawTokens: any = createAsyncThunk('tx/withdraw', async (args: any) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const contract: any = makeContract(args.address, !args.isPublic);
        const data: string = await contract.methods.withdrawTokens().encodeABI();
        const txParams: object = {
            to: args.address,
            from: web3.utils.toChecksumAddress(accounts[0]),
            value: 0x0,
            data
        }

        const tx: any = await web3.eth.sendTransaction(txParams).catch((e: any) => console.log(e));

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const approveToken: any = createAsyncThunk('tx/approve', async (args: any) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const contract: any = makeTokenContract(args.address);
        const data: string = await contract.methods.approve(args.poolAddress, args.amount).encodeABI();
        const txParams: object = {
            to: args.address,
            from: web3.utils.toChecksumAddress(accounts[0]),
            value: 0x0,
            data
        }

        const tx: any = await web3.eth.sendTransaction(txParams).catch((e: any) => console.log(e));

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const stakeToken: any = createAsyncThunk('tx/stake', async (args: any) => {
    try {
        const accounts: string[] = await web3.eth.getAccounts();
        const contract: any = makeStakingContract(args.address);
        const data: string = await contract.methods.stake(args.amount).encodeABI();
        const txParams: object = {
            to: args.address,
            from: web3.utils.toChecksumAddress(accounts[0]),
            value: 0x0,
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams).catch((e: any) => console.log(e));

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const withdrawStake: any = createAsyncThunk('tx/withdrawStake', async (args: any) => {
    try {
        const accounts: string[] = await web3.eth.getAccounts();
        const contract: any = makeStakingContract(args.address);
        const data: string = await contract.methods.withdraw(args.amount).encodeABI();
        const txParams: object = {
            to: args.address,
            from: web3.utils.toChecksumAddress(accounts[0]),
            value: 0x0,
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams).catch((e: any) => console.log(e));

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
});

export const getRewards: any = createAsyncThunk('tx/getRewards', async (args: any) => {
    try {
        const accounts: string[] = await web3.eth.getAccounts();
        const contract: any = makeStakingContract(args.address);
        const data: string = await contract.methods.getReward().encodeABI();
        const txParams: object = {
            to: args.address,
            from: web3.utils.toChecksumAddress(accounts[0]),
            value: 0x0,
            data
        }
        const tx: any = await web3.eth.sendTransaction(txParams).catch((e: any) => console.log(e));

        return tx;
    }
    catch (e) {
        console.log(e);

        return;
    }
})

export const txSlice = createSlice({
    name: 'tx',
    initialState,
    reducers: {
        setTarget: (state: ITxState, action: PayloadAction<string>) => {
            state.target = action.payload;
        }
    },
    extraReducers: {
        [depositEth.pending]: (state: ITxState) => {
            state.current = 'deposit';
            state.status = 'pending';
        },
        [depositEth.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [depositEth.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [liquidate.pending]: (state: ITxState) => {
            state.current = 'liquidate';
            state.status = 'pending';
        },
        [liquidate.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [liquidate.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [withdrawTokens.pending]: (state: ITxState) => {
            state.current = 'withdraw';
            state.status = 'pending';
        },
        [withdrawTokens.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [withdrawTokens.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [approveToken.pending]: (state: ITxState) => {
            state.current = 'approve';
            state.status = 'pending';
        },
        [approveToken.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [approveToken.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [stakeToken.pending]: (state: ITxState) => {
            state.current = 'stake';
            state.status = 'pending';
        },
        [stakeToken.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [stakeToken.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [withdrawStake.pending]: (state: ITxState) => {
            state.current = 'removeStake';
            state.status = 'pending';
        },
        [withdrawStake.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [withdrawStake.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        },
        [getRewards.pending]: (state: ITxState) => {
            state.current = 'claim';
            state.status = 'pending';
        },
        [getRewards.fulfilled]: (state: ITxState, action: PayloadAction<any>) => {
            state.current = '';
            if (!action.payload) {
                state.status = 'failed';
            } else {
                state.hashes.push(action.payload.txHash);
                state.status = 'succeeded';
            }
        },
        [getRewards.failed]: (state: ITxState) => {
            state.current = '';
            state.status = 'failed';
        }
    }
});

export const { setTarget } = txSlice.actions;

export const txSelector = (state: RootState) => state.tx;

export default txSlice.reducer;