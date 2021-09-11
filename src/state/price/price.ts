import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import axios from "axios";

interface IPriceState {
    qfiPrice: number;
    ethPrice: number;
    status: 'pending' | 'succeeded' | 'failed' | 'standby';
}

interface IResponse {
    name: string;
    symbol: string;
    price: number;
}

const initialState: IPriceState = {
    qfiPrice: 0, ethPrice: 0, status: 'standby'
}

export const getPrices: any = createAsyncThunk('price/getPrices', async (): Promise<IResponse[]> => {
    const url: string = process.env.REACT_APP_PRICES_API ?? '';
    try {
        const res = await axios.get(url);

        return res.data;
    }
    catch(e) {
        console.log(e);

        return [];
    }
})

export const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: {
        setQFIPrice: (state: IPriceState, action: PayloadAction<number>) => {
            state.qfiPrice = action.payload;
            state.status = 'standby';
        },
        setETHPrice: (state: IPriceState, action: PayloadAction<number>) => {
            state.ethPrice = action.payload;
            state.status = 'standby';
        }
    },
    extraReducers: {
        [getPrices.pending]: (state: IPriceState) => {
            state.status = 'pending';
        },
        [getPrices.fulfilled]: (state: IPriceState, action: PayloadAction<any>) => {
            try {
                if (action.payload.length > 0) {
                    state.qfiPrice = action.payload.find((item: IResponse) => item.name === 'QFinance').price;
                    state.ethPrice = action.payload.find((item: IResponse) => item.name === 'Ethereum').price;
                    state.status = 'succeeded';
                }                
            }
            catch (e) {
                console.log(e);
                state.status = 'failed';
            }
        },
        [getPrices.failed]: (state: IPriceState) => {
            state.status = 'failed';
        }
    }
});

export const { setQFIPrice, setETHPrice } = priceSlice.actions;

export const selectPrices = (state: RootState) => state.prices;

export default priceSlice.reducer;