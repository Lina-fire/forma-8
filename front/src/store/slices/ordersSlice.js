import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const getToken = () => ({ headers: { 'x-access-token': localStorage.getItem('token') } });

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  const res = await axios.post(`${API}/orders/create`, orderData, getToken());
  return res.data.order;
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async () => {
  const res = await axios.get(`${API}/orders/user`, getToken());
  return res.data.orders;
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (orderId) => {
  const res = await axios.put(`${API}/orders/${orderId}/cancel`, {}, getToken());
  return res.data.order;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        // Обновляем статус заказа в списке
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  }
});

export default ordersSlice.reducer;