import { createSlice } from "@reduxjs/toolkit"
const initialState={
    token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
    
    User:localStorage.getItem("User")?JSON.parse(localStorage.getItem("User")):null,
    loading:false
}

const AuthSlice=createSlice({
    name:"Auth",
    initialState,
    reducers:{
        setToken(state,value){
            console.log("hogya")
            state.token=value.payload;
        },
        setUser(state,value){
            state.User=value.payload;
        },

        setLoading(state,value){
            state.loading=value.payload;
        },
        Reset(state,value){
            state.User=null;
            state.token=null;
            state.loading=false
            
        }
    }
})
export const{setToken,setUser,setLoading,Reset}=AuthSlice.actions;
export default AuthSlice.reducer;