import toast from "react-hot-toast"
import apiConnector from "../apiConnector";
import { payoutsapi } from "../api";

export const getBalance=async(token)=>{
    let result=null;
    const toastId=toast.loading("getting balance");
    try{
        const response=await apiConnector(payoutsapi.getBalanceApi,"GET",null,{
            Authorization:`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message);
        }
      
        toast.success("balance Fetched successFully");
        result=response.data.data
    }
    catch(err){
        
        toast.error(err?.response?.data?.message || "Error Occured")
    }
    toast.dismiss(toastId);
    
    return result;
}

export const requestPayout=async(data,token)=>{
    let result=null;
    try{
        const response=await apiConnector(payoutsapi.getRequestApi,"POST",data,{
            Authorization:`Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        
        result=response.data.data
    }
     catch(err){
        toast.error(err?.response?.data?.message || "Error Occured")
    }
   
    return result;
}


export const getPayoutHistory=async(token)=>{
    let result=null;
    
    try{
        const response=await apiConnector(payoutsapi.getPayoutHistory,"GET",null,{
            Authorization:`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("balance Fetched successFully");
        result=response.data.data
    }
    catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Error Occured")
    }
    
    return result;
}

export const getPayoutStatus=async(id,token)=>{
   let result=null;
      try{
        const response=await apiConnector(`${payoutsapi.getPayoutStatus}/${id}`,"GET",null,{
            Authorization:`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("balance Fetched successFully");
        result=response.data.data
    }
    catch(err){
        toast.error(err?.response?.data?.message || "Error Occured")
    }
    
    return result;
}