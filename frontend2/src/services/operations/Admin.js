import toast from 'react-hot-toast';
import apiConnector from "../apiConnector"
import { AdminApi } from '../api';
import {setToken} from "../../slices/authSlice"
export const AdminLogin=(data,navigate)=>{
    const toastId=toast.loading("Signing In...");
    return async(dispatch)=>{
        try{
            const response=await apiConnector(AdminApi.adminLoginApi,"POST",data);
            if(!response.data.success){
                throw new Error(response.data.message);

            }

            dispatch(setToken(response.data.token));
            localStorage.setItem('token',JSON.stringify(response.data.token));
            navigate("/dashboard");

        }
        catch(err){
            console.log(err)
            toast.error(err?.response?.data?.message || "Error at Admin login");
        }

        toast.dismiss(toastId)
    }
}