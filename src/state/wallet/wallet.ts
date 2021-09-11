import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { QFI, web3 } from "../../data/init";
import type { RootState } from "../../store";

interface IWalletState {
    qfiBalance: string;
    ethBalance: string;
    status: 'pending' | 'succeeded' | 'failed' | 'standby';
}

const initialState: IWalletState = {
    qfiBalance: '0', ethBalance: '0', status: 'standby'
}

export const getWalletData: any = createAsyncThunk('wallet/getWalletData', async (): Promise<{ethBalance: string, qfiBalance: string}> => {
    const accounts = await web3.eth.getAccounts();
    const balances = async () => {
        if (!accounts || accounts.length === 0) {
            const ethBalance: string = '0';
            const qfiBalance: string = '0';
            return {
                ethBalance,
                qfiBalance
            }
        } else {
            const ethBalance: string = await web3.eth.getBalance(accounts[0]);
            const balances: any = await axios.post(`https://${process.env.REACT_APP_ALCHEMY}`, {
                "jsonrpc": "2.0",
                "method": "alchemy_getTokenBalances",
                "params": [accounts[0], [QFI]],
                "id": 1
            }).then((res: any) => { return res.data.result });

            return {ethBalance, qfiBalance: balances.tokenBalances[0].tokenBalance}
        }
    }

    const { ethBalance, qfiBalance }: any = await balances();

    return { ethBalance, qfiBalance };
});

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setQFIBalance: (state: IWalletState, action: PayloadAction<any>) => {
            state.qfiBalance = action.payload;
        },
        setETHBalance: (state: IWalletState, action: PayloadAction<any>) => {
            state.ethBalance = action.payload;
        },
        setWalletStatus: (state: IWalletState, action: PayloadAction<'pending' | 'succeeded' | 'failed' | 'standby'>) => {
            state.status = action.payload;
        },
        setWalletState: (state: IWalletState, action: PayloadAction<any>) => {
            state.qfiBalance = action.payload.qfiBalance;
            state.ethBalance = action.payload.ethBalance;
        }
    },
    extraReducers: {
        [getWalletData.pending]: (state: IWalletState) => {
            state.status = 'pending';
        },
        [getWalletData.fulfilled]: (state: IWalletState, action: PayloadAction<{qfiBalance: string, ethBalance: string}>) => {
            state.qfiBalance = action.payload.qfiBalance;
            state.ethBalance = action.payload.ethBalance;
        },
        [getWalletData.rejected]: (state: IWalletState) => {
            state.status = 'failed';
        }
    }
});

export const { setQFIBalance, setETHBalance, setWalletStatus, setWalletState } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet;

export default walletSlice.reducer;