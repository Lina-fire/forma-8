import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],       // массив избранных товаров
        totalItems: 0    // количество товаров в избранном
    },
    reducers: {
        addToFavorites: (state, action) => {
            const product = action.payload;
            const exists = state.items.some(item => item.id === product.id);
            
            if (!exists) {
                state.items.push(product);
                state.totalItems += 1;
            }
        },
        removeFromFavorites: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
            state.totalItems = state.items.length;
        },
        clearFavorites: (state) => {
            state.items = [];
            state.totalItems = 0;
        }
    }
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;