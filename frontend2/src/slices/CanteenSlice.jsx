import { createSlice } from "@reduxjs/toolkit"


const initialState={
    canteenId:localStorage.getItem("CanteenId")?JSON.parse(localStorage.getItem("CanteenId")):null,
    // canteenId:"6879b625128117ac2e529b2e",
    canteen:localStorage.getItem("Canteen")?JSON.parse(localStorage.getItem("Canteen")):null,
    Items:localStorage.getItem("Items")?JSON.parse(localStorage.getItem("Items")):[],
    Loading:false
}


const CanteenSlice=createSlice({
    name:"Canteen",
    initialState,
    reducers:{
        
        setCanteenId(state,value){
            state.canteenId=value.payload;
        },
        setCanteen(state,value){
            state.canteen=value.payload
        },
        AddNewItem(state,value){
            state.Items.push(value.payload);
        },
        RemoveItems(state,value){
            const {index}=value.payload;
            Items.findindex

        },
        setLoading(state,value){
            state.Loading=value.payload;
        },
        ResetCanteen(state,value){
            state.Items=null;
            state.Loading=false;
            state.canteen=null;
            state.canteenId=null
        }
    }
})

export const {setCanteen,setCanteenId,setItems,setLoading,ResetCanteen}=CanteenSlice.actions;

export default CanteenSlice.reducer;