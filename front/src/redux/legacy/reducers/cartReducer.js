import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from '../actions/cartActions';

const initialState = {
    items: [],      // массив товаров в корзине
    totalItems: 0   // количество товаров
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const product = action.payload;
            const exists = state.items.some(item => item.id === product.id);
            
            if (exists) {
                return state;
            }
            
            return {
                ...state,
                items: [...state.items, product],
                totalItems: state.totalItems + 1
            };
        }
        
        case REMOVE_FROM_CART: {
            const productId = action.payload;
            return {
                ...state,
                items: state.items.filter(item => item.id !== productId),
                totalItems: state.totalItems - 1
            };
        }
        
        case CLEAR_CART:
            return initialState;
            
        default:
            return state;
    }
};

export default cartReducer;