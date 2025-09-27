import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetCanteenOrders, UpdateOrderStatus } from "../../../../services/operations/Orders";
import  OrdersTab  from "./OrderTab";
import { useToast } from "../../../../hooks/use-toast";
import { useSocket } from "../../../../context/Socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const OrderPage = () => {
  const { User, token } = useSelector((state) => state.Auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate=useNavigate();
  const {canteenId}=useSelector((state)=>state.Canteen);
  const { getSocket, connectSocket, disconnectSocket } = useSocket();
 console.log(canteenId)

  useEffect(()=>{
      connectSocket();
      const socket = getSocket();
      if (!socket) {
        console.error('Socket not available');
        return;
      }
      socket.emit('Join_Room', canteenId);
      socket.on('New_Order', (data)=>{
        setOrders((prev)=>[...prev,data]);
        toast.success("New Order recieved");
      })
      return ()=>{
        socket.off('New_Order');
        disconnectSocket();
      }

  },[canteenId]);
 
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await GetCanteenOrders(token);
      if (response) {
        setOrders(response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const data = { status: newStatus };
      const response = await UpdateOrderStatus(orderId, data, token);

      // If your API returns { data: updatedOrder }
      const updatedOrder = response?.data || response;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/dashboard/Orders/${orderId}`);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <div className="w-full flex justify-center items-center h-full"><div className="loader"></div></div>;
  }

  return (
    <div className="p-4">
      <OrdersTab
        orders={orders}
        onRefresh={fetchOrders}
        onOrderClick={handleOrderClick}
        onStatusUpdate={handleStatusUpdate}
        canteenId={User?.canteenId || null}
      />
    </div>
  );
};

export default OrderPage;
