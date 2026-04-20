import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';  // ← исправлено
const getToken = () => ({ headers: { 'x-access-token': localStorage.getItem('token') } });

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  const res = await axios.post(`${API}/orders/create`, orderData, getToken());
  return res.data.order;
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async () => {
  const res = await axios.get(`${API}/orders/user`, getToken());
  return res.data.orders;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export default ordersSlice.reducer;