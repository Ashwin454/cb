import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "../slices/authSlice"
import CanteenReducers from "../slices/CanteenSlice"
import ProfileSlice from "../slices/Profile"
import CartSlice from "../slices/CartSlice"

const RootReducer=combineReducers({
    Auth:AuthReducer,
    Canteen:CanteenReducers,
    Profile:ProfileSlice,
    Cart:CartSlice
   
})


export default RootReducer