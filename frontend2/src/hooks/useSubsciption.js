import React from "react";
import { useEffect } from "react";
import { notificationApi } from "../services/api";
import apiConnector from "../services/apiConnector"
import toast from "react-hot-toast";
export const usePushSubscription = (userId) => {
  useEffect(() => {
    if (!userId) return;
   const subscribeUser = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        let subscription = await registration.pushManager.getSubscription();

       

      if(!subscription){
          const res = await apiConnector(notificationApi.getPublicKey,"GET");
          
        const { publicKey } = res.data;

        subscription= await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey,
        });
      }

        const response = await apiConnector(notificationApi.saveSubsciption,"POST", {
          userId,
          subscription: JSON.stringify(subscription.toJSON()),
        });
       
        
      } catch (err) {
        toast.error(err?.message)
      }
    };

    subscribeUser(); 
  }, [userId]);
};
