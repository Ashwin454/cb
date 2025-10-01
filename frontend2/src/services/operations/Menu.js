import toast from "react-hot-toast";
import apiConnector from "../apiConnector";
import { MenuApi } from "../api";

export const getCanteenMenu=async(canteenId)=>{
    let result=null;
    const toastId=toast.loading("Fetching the Menu items...");
    try{
        const response=await apiConnector(`${MenuApi.getCanteenMenu}/${canteenId}`,"GET");
        if(!response.data.success){
            throw new Error(response.data.message);
        }
       
        result=response.data.data;
        toast.success("menu Fetched SuccessFully");
        toast.dismiss(toastId);
        return result;
    }
    catch(Err){
        toast.error(Err.response.data.message);
    }
    toast.dismiss(toastId);
    
}


export const CreateMenuItem=async(data,token)=>{
    const toastId=toast.loading("Creating Item");
    let result=null;
    try{
         const response = await apiConnector( MenuApi.CreateMenuItem,"POST",data,{
        Authorization: `Bearer ${token}`,
      },{
        "Content-Type": "multipart/form-data", // fixed typo here
      });
      if(!response.data.success){
        throw new Error(response.data.message);
      }
     
      result=response.data.data;
      toast.success("Item Create SuccessFully");
      toast.dismiss(toastId);
      return result;
    }
    catch(err){
       
        toast.error(err?.response?.data?.message || "Error Occured");
    }
    toast.dismiss(toastId);
    

}


export const UpdateItemStatus=async(id,data,token)=>{
    const toastId=toast.loading("Updating Item");
    let result=null;
    try{
         const response = await apiConnector( `${MenuApi.EditMenuItem}/${id}`,"PUT",data,{
        Authorization: `Bearer ${token}`,
      },{
        "Content-Type": "multipart/form-data", 
      });
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      
      result=response.data.data;
      toast.success("Item Updated SuccessFully");
      toast.dismiss(toastId);
       return result;
    }
    catch(err){

        toast.error(err?.response?.data?.message || "Error Occured");
    }
    toast.dismiss(toastId);
   
}


export const DeleteMenuItem=async(id,token)=>{
    const toastId=toast.loading("Deleting Item");
   
    try{
         const response = await apiConnector( `${MenuApi.DeleteItem}/${id}`,"DELETE",null,{
             Authorization: `Bearer ${token}`,
         });
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Item deleted SuccessFully");
    }
    catch(err){
   
        toast.error(err?.response?.data?.message || "Error Occured");
    }
    toast.dismiss(toastId);
    
}


export const getQuickBites=async(campusId)=>{
  const toastId=toast.loading("getting ready items");
  let result=[];
  try{
    const response=await apiConnector(MenuApi.QuickBitesapi,"GET",null,null,{
      campus:campusId
    })
    if(!response.data.success){
      throw new Error(response.data.message)
    }
   
    result=response.data.data
    toast.success("Items fetched SuccessFully");
    toast.dismiss(toastId)
    
  }
  catch(err){
   
    toast.error(err?.response?.data?.message || "error Occurred");
  }
  toast.dismiss(toastId)
  return result;

}


