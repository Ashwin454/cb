import { createSlice } from "@reduxjs/toolkit"


const initialState={
    Profile:localStorage.getItem("Profile")?JSON.parse(localStorage.getItem("Profile")):null,
    BankDetails:null,
    loading:false
}

const ProfileSlice=createSlice({
    name:"Profile",
    initialState,
    reducers:{
        setProfile(state,value){
            state.Profile=value.payload;
        },
        setBankDetails(state,value){
            state.BankDetails=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload;
        },
        ResetProfile(state,value){
            state.BankDetails=null;
            state.Profile=null;
            state.loading=false
        }
    }
})

export const {setLoading,setProfile,setBankDetails,ResetProfile}=ProfileSlice.actions;

export default ProfileSlice.reducer