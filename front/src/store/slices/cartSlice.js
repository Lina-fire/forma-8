import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const getToken = () => ({ headers: { 'x-access-token': localStorage.getItem('token') } });

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await axios.get(`${API}/cart`, getToken());
  return res.data.cart;
});

export const addToCart = createAsyncThunk('cart/add', async (product_id) => {
  await axios.post(`${API}/cart/add`, { product_id, quantity: 1 }, getToken());
  return product_id;
});

export const removeFromCart = createAsyncThunk('cart/remove', async (product_id) => {
  await axios.delete(`${API}/cart/remove/${product_id}`, getToken());
  return product_id;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addToCart.fulfilled, (state, action) => {})
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product_id !== action.payload);
      });
  }
});

export default cartSlice.reducer;