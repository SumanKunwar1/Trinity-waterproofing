import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./ordersSlice";
import reviewsReducer from "./reviewsSlice";
import newslettersReducer from "./newslettersSlice";
import faqSlice from "./faqSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    reviews: reviewsReducer,
    newsletters: newslettersReducer,
    faqs: faqSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
