import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import gigReducer from "../features/gigs/gigSlice";
import bidReducer from "../features/bids/bidSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer
  }
});
