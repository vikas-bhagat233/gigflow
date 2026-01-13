import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const res = await api.get("/auth/me");
  return res.data;
});

export const login = createAsyncThunk("auth/login", async (data) => {
  await api.post("/auth/login", data);
  const me = await api.get("/auth/me");
  return me.data;
});

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuth: false, userId: null, isLoading: false, error: null },
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.userId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.userId = action.payload?.id ?? null;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.userId = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.userId = action.payload?.id ?? null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.userId = null;
        state.error = action.error?.message || "Login failed";
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuth = false;
        state.userId = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
