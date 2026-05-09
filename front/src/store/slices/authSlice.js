import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchCart, clearCartState } from './cartSlice';
import { fetchFavorites, clearFavoritesState } from './favoritesSlice';

const API = 'http://localhost:8080/api';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // После успешного входа загружаем корзину и избранное
      dispatch(fetchCart());
      dispatch(fetchFavorites());
      
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/register`, userData);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка регистрации');
    }
  }
);

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(clearAuth());
  dispatch(clearCartState());
  dispatch(clearFavoritesState());
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: JSON.parse(localStorage.getItem('user')), 
    loading: false, 
    error: null 
  },
  reducers: { 
    clearAuth: (state) => { 
      state.user = null; 
      state.error = null;
    } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => { 
        state.user = action.payload; 
        state.loading = false; 
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => { 
        state.error = action.payload; 
        state.loading = false; 
      })
      .addCase(register.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => { 
        state.user = action.payload; 
        state.loading = false; 
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => { 
        state.error = action.payload; 
        state.loading = false; 
      });
  }
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;