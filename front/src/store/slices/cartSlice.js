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

export const updateCartQuantity = createAsyncThunk('cart/update', async ({ product_id, quantity }) => {
  await axios.put(`${API}/cart/update/${product_id}`, { quantity }, getToken());
  return { product_id, quantity };
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await axios.delete(`${API}/cart/clear`, getToken());
  return;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  reducers: {
    // Синхронный редьюсер для очистки корзины (для logout)
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
    }
  },
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
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        const item = state.items.find(item => item.product_id === product_id);
        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;