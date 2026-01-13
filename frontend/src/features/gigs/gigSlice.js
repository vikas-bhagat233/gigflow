import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchGigs = createAsyncThunk("gigs/fetch", async (search = "") => {
  const res = await api.get("/gigs", {
    params: search ? { search } : undefined
  });
  return res.data;
});

export const createGig = createAsyncThunk("gigs/create", async (data) => {
  const res = await api.post("/gigs", data);
  return res.data;
});

const gigSlice = createSlice({
  name: "gigs",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchGigs.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    builder.addCase(createGig.fulfilled, (state, action) => {
      // Keep local list in sync if user is already viewing gigs
      state.list = [action.payload, ...state.list];
    });
  }
});

export default gigSlice.reducer;
