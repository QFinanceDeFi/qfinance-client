import { configureStore } from "@reduxjs/toolkit";
import connectReducer from "./state/connect/connect";
import walletReducer from "./state/wallet/wallet";
import priceReducer from "./state/price/price";
import poolsReducer from "./state/pools/pools";
import stakeReducer from "./state/stake/stake";
import txReducer from "./state/tx/tx";

export const store = configureStore({
    reducer: {
        connect: connectReducer,
        wallet: walletReducer,
        prices: priceReducer,
        pools: poolsReducer,
        stake: stakeReducer,
        tx: txReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;