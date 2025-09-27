// import { createSlice } from '@reduxjs/toolkit';


// const orderSlice = createSlice({
//   name: 'Orders',
//   initialState: {
//     orders: [],
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     clearOrders: (state) => {
//       state.orders = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchOrders.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.orders = action.payload;
//         state.isLoading = false;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.error = action.payload;
//         state.isLoading = false;
//       });
//   },
// });

// export const { clearOrders } = orderSlice.actions;
// export default orderSlice.reducer;