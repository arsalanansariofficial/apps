import { createSlice } from '@reduxjs/toolkit';
import { App_User, App_Product, App_Exception } from '../utility/types';

export interface Cart_Items extends App_Product {
  quantity: number;
}

export interface App_Slice {
  cart: Cart_Items[];
  isLoading: boolean;
  response: null | any;
  user: null | App_User;
  products: App_Product[];
  product: null | App_Product;
  exception: null | App_Exception;
  filteredProducts: App_Product[];
  userHavingOrders: null | App_User;
}

const initialState: App_Slice = {
  cart: [],
  user: null,
  products: [],
  product: null,
  response: null,
  exception: null,
  isLoading: false,
  filteredProducts: [],
  userHavingOrders: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = [];
    },
    logout(state) {
      state.user = null;
      state.userHavingOrders = null;
    },
    addToCart(state, action) {
      state.cart = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setProduct(state, action) {
      state.product = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setException(state, action) {
      state.exception = action.payload;
    },
    setResponse(state, action) {
      state.response = action.payload;
    },
    setUserHavingOrders(state, action) {
      state.userHavingOrders = action.payload;
    },
    setfilteredProducts(state, action) {
      state.filteredProducts = action.payload;
    },
    login(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    }
  }
});

export default appSlice.reducer;
export const appActions = appSlice.actions;
