import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';
const getToken = () => ({ headers: { 'x-access-token': localStorage.getItem('token') } });

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  const res = await axios.get(`${API}/favorites`, getToken());
  return res.data.favorites;
});

export const addToFavorites = createAsyncThunk('favorites/add', async (product_id) => {
  await axios.post(`${API}/favorites/add`, { product_id }, getToken());
  return product_id;
});

export const removeFromFavorites = createAsyncThunk('favorites/remove', async (product_id) => {
  await axios.delete(`${API}/favorites/remove/${product_id}`, getToken());
  return product_id;
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state) => { state.loading = false; })
      .addCase(addToFavorites.fulfilled, (state, action) => {})
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product_id !== action.payload);
      });
  }
});

export default favoritesSlice.reducer;