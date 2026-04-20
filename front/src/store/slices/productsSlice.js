import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';

export const fetchProducts = createAsyncThunk('products/fetch', async ({ offset, limit }) => {
  const res = await axios.get(`${API}/products/lim?offset=${offset}&limit=${limit}`);
  return res.data.products;
});

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await axios.get(`${API}/products/all`);
  return { products: res.data.products, count: res.data.count };
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], totalCount: 0, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.totalCount = action.payload.count;
      });
  }
});

export default productsSlice.reducer;