
import toast from "react-hot-toast"
import apiConnector from "../apiConnector";
import { CanteenApi } from "../api";
export const GetAllCanteens=async(data)=>{
    const taostId=toast.loading("Fetching Canteens...");
    let result=[];
    const params=data?{ campus:data}:null;
    
    try{
        const response = await apiConnector(CanteenApi.getAllCanteenApi,"GET",null,null,params);
       
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        result=response.data.canteens
        toast.success("Canteens fetched SuccessFully");
    }
    catch(err){
        
        toast.error(err?.response?.data?.message || "Error Occurred")
    }
    toast.dismiss(taostId)
    return result;
}


export const getCanteenDetails=async(canteenId)=>{
    console.log(canteenId)
    let result=null;
    try{
        const response=await apiConnector(`${CanteenApi.getCanteenDetail}/${canteenId}`,"GET");
        console.log(response)
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        result=response.data.canteen;

        return result;
        
    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message)
    }
}