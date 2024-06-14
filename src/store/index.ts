import { configureStore } from "@reduxjs/toolkit";
import reducer from "./lottieSlice";

const store = configureStore({
  reducer: {
    item: reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
