import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBids = createAsyncThunk("bids/fetch", async (gigId) => {
  const res = await api.get(`/bids/${gigId}`);
  return res.data;
});

const bidSlice = createSlice({
  name: "bids",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchBids.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  }
});

export default bidSlice.reducer;
