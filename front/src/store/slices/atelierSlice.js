import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8080/api';  // ← исправлено
const getToken = () => ({ headers: { 'x-access-token': localStorage.getItem('token') } });

export const createRequest = createAsyncThunk('atelier/create', async (formData) => {
  const res = await axios.post(`${API}/atelier/create`, formData, {
    headers: { ...getToken().headers, 'Content-Type': 'multipart/form-data' }
  });
  return res.data.request;
});

export const fetchUserRequests = createAsyncThunk('atelier/fetchUser', async () => {
  const res = await axios.get(`${API}/atelier/user`, getToken());
  return res.data.requests;
});

const atelierSlice = createSlice({
  name: 'atelier',
  initialState: { requests: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(fetchUserRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      });
  }
});

export default atelierSlice.reducer;