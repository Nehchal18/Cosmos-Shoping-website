import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existingProductIndex = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].quantity += action.payload.quantity;
        state.quantity += action.payload.quantity;
        state.total += action.payload.price * action.payload.quantity;
      } else {
        state.products.push(action.payload);
        state.quantity += action.payload.quantity;
        state.total += action.payload.price * action.payload.quantity;
      }
    },
    removeProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload
      );
      if (index !== -1) {
        state.quantity -= 1;
        state.total -=
          state.products[index].price * state.products[index].quantity;
        state.products.splice(index, 1);
      }
    },
    increaseQuantity: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload
      );
      if (index !== -1) {
        state.quantity += 1;
        state.total += state.products[index].price;
        state.products[index].quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload
      );
      if (index !== -1) {
        if (state.products[index].quantity === 1) {
          state.quantity -= 1;
          state.total -= state.products[index].price;
          state.products.splice(index, 1);
          if (state.products.size === 0) {
            resetCart(state);
          }
        } else {
          state.quantity -= 1;
          state.total -= state.products[index].price;
          state.products[index].quantity -= 1;
        }
      }
    },
    resetCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
