
import toast from "react-hot-toast"
import apiConnector from "../apiConnector"
import { OrderApi } from "../api";
export const GetCanteenOrders=async(token)=>{
    let result=[];
    const toastId=toast.loading("Fetching All Orders...");
    try{
        const response=await apiConnector(OrderApi.GetCanteenAllOrders,"GET",null,{
            Authorization:`Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result=response.data.data;
        toast.success("Order fetched successFully");
    }
    catch(err){
        console.log(err)
        toast.error(err.response.data.message)
    }
    toast.dismiss(toastId);
    
    return result;
}

export const UpdateOrderStatus=async(orderId,status,token)=>{
    let result=null;
    const toastId=toast.loading("Changing order Status...");
    console.log(status)
    try{
        const response=await apiConnector(`${OrderApi.ChangeOrderStatus}/${orderId}`,"POST",status,{
        Authorization:`Bearer ${token}`
        })
        
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result=response.data.data;
        toast.success("Order Status Changed");

    }
    catch(err){
        console.log(err)
        toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
    return result;
}

export const GetOrderDetails=async(OrderId,token)=>{
    const toastId=toast.loading("fetching Order Details..");
    let result=null;

    try{
        const response=await apiConnector(`${OrderApi.orderDetails}/${OrderId}`,"GET",null,{
            Authorization:`Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Order Details Fetched SuccessFully")
        result=response.data.data;
    }
    catch(err){
        toast.error(err.response.data.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const getStudentOrders=async(token)=>{
    const toastId=toast.loading("Fetching Order");
    let data=[];
    try{
        const response=await apiConnector(OrderApi.getStudentAllOrders,"GET",null,{
            Authorization:`Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        console.log(response);
        data=response.data.data;
        toast.success("Order Fetched SuccessFully");

    }
    catch(err){
        console.log(err);
        toast.error(err?.response?.data?.message || "Error at Order Page");
    }
    toast.dismiss(toastId);
    return data;
}