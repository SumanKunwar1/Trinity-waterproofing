import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./ordersSlice";
import reviewsReducer from "./reviewsSlice";
import newslettersReducer from "./newslettersSlice";
import faqSlice from "./faqSlice";
import companyDetailsReducer from "./companyDetailsSlice";
import productReducer from "./productsSlice";
export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    reviews: reviewsReducer,
    newsletters: newslettersReducer,
    faqs: faqSlice,
    companyDetails: companyDetailsReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
