import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    return Array.isArray(storedCart) ? storedCart : [];
  } catch {
    return [];
  }
};

const initialState = {
  cart: getInitialCart(),
  totalPrice: 0,
};

// Calculate total and persist to localStorage
function calcTotal(state) {
  state.totalPrice = state.cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

const cartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      // Find existing item by _id (consistent with data structure)
      const existing = state.cart.find((i) => i._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
      calcTotal(state);
    },

    removeFromCart(state, action) {
      const id = action.payload;
      // Fixed: Use _id instead of id for consistency
      state.cart = state.cart.filter((i) => i._id !== id);
      calcTotal(state);
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      
      // Validation: Don't allow negative or zero quantities
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.cart = state.cart.filter((i) => i._id !== id);
      } else {
        // Fixed: Use _id instead of id for consistency
        const item = state.cart.find((i) => i._id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      calcTotal(state);
    },

    // Increment quantity by 1
    incrementQuantity(state, action) {
      const id = action.payload;
      const item = state.cart.find((i) => i._id === id);
      if (item) {
        item.quantity += 1;
      }
      calcTotal(state);
    },

    // Decrement quantity by 1
    decrementQuantity(state, action) {
      const id = action.payload;
      const item = state.cart.find((i) => i._id === id);
      if (item) {
        if (item.quantity <= 1) {
          // Remove item if quantity would become 0
          state.cart = state.cart.filter((i) => i._id !== id);
        } else {
          item.quantity -= 1;
        }
      }
      calcTotal(state);
    },

    clearCart(state) {
      state.cart = [];
      state.totalPrice = 0;
      
      localStorage.removeItem('cart');
    },

    setCart(state, action) {
      state.cart = action.payload;
      calcTotal(state);
    },


    initializeCart(state) {
      calcTotal(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCart,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
