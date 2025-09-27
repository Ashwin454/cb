import React, { useState, useEffect } from 'react';
import {
  RefreshCw, Bell, X, Filter, Clock, CheckCircle, XCircle, Package, CreditCard, List, Grid3X3, Activity, AlertCircle, BarChart3
} from 'lucide-react';
import { Button } from '../../../ui/button';
import OrderCard from './OrderCard';

const OrdersTab = ({ orders, onRefresh, onOrderClick, onStatusUpdate, canteenId }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [newOrderNotification, setNewOrderNotification] = useState({ show: false, count: 0 });
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    if (orders.length > lastOrderCount && lastOrderCount > 0) {
      const newCount = orders.length - lastOrderCount;
      setNewOrderNotification({ show: true, count: newCount });
      const timer = setTimeout(() => setNewOrderNotification({ show: false, count: 0 }), 10000);
      return () => clearTimeout(timer);
    }
    setLastOrderCount(orders.length);
  }, [orders.length, lastOrderCount]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'payment_pending': return 'bg-orange-100 text-orange-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusIcon = (status) => {
    const iconClass = 'w-3 h-3 mr-1';
    const colors = {
      placed: 'bg-blue-500',
      payment_pending: 'bg-orange-500',
      preparing: 'bg-yellow-500',
      ready: 'bg-green-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      default: 'bg-gray-500'
    };
    return <div className={`${iconClass} ${colors[status] || colors.default} rounded-full`}></div>;
  };

  const statusFilters = [
    { value: 'all', label: 'All Orders', icon: <List className='w-4 h-4' />, count: orders.length, description: 'View all orders' },
    { value: 'placed', label: 'Placed', icon: <Clock className='w-4 h-4' />, count: orders.filter(o => o.status === 'placed').length, description: 'New orders received' },
    { value: 'payment_pending', label: 'Payment Pending', icon: <CreditCard className='w-4 h-4' />, count: orders.filter(o => o.status === 'payment_pending').length, description: 'Awaiting payment' },
    { value: 'preparing', label: 'Preparing', icon: <Package className='w-4 h-4' />, count: orders.filter(o => o.status === 'preparing').length, description: 'Currently being prepared' },
    { value: 'ready', label: 'Ready', icon: <CheckCircle className='w-4 h-4' />, count: orders.filter(o => o.status === 'ready').length, description: 'Ready for pickup' },
    { value: 'completed', label: 'Completed', icon: <CheckCircle className='w-4 h-4' />, count: orders.filter(o => o.status === 'completed').length, description: 'Successfully delivered' },
    { value: 'cancelled', label: 'Cancelled', icon: <XCircle className='w-4 h-4' />, count: orders.filter(o => o.status === 'cancelled').length, description: 'Cancelled orders' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 w-full overflow-x-hidden'>
      <div className='space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-full'>

        {/* New Order Notification */}
        {newOrderNotification.show && (
          <div className='relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-emerald-200/50 animate-in slide-in-from-top-4 duration-500'>
            <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
            <div className='relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
              <div className='flex items-center space-x-3 sm:space-x-4 min-w-0'>
                <div className='bg-white/20 rounded-full p-2 sm:p-3 flex-shrink-0'>
                  <Bell className='w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-bold text-white text-base sm:text-lg break-words'>
                    🎉 New Order{newOrderNotification.count > 1 ? 's' : ''} Received!
                  </p>
                  <p className='text-emerald-100 text-sm sm:text-base'>
                    {newOrderNotification.count} new order
                    {newOrderNotification.count > 1 ? 's' : ''} need
                    {newOrderNotification.count > 1 ? '' : 's'} your immediate attention
                  </p>
                </div>
              </div>
              <Button variant='ghost' size='sm' onClick={() => setNewOrderNotification({ show: false, count: 0 })}
                className='text-white hover:bg-white/20 rounded-xl self-end sm:self-auto flex-shrink-0'>
                <X className='w-4 h-4 sm:w-5 sm:h-5' />
              </Button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className='relative overflow-hidden bg-white rounded-3xl border border-gray-200/60 shadow-xl shadow-gray-100/50'>
          <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5'></div>
          <div className='relative p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
            <div className='space-y-2 flex items-center space-x-3'>
              <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-2 sm:p-3 shadow-lg shadow-indigo-200/50 flex-shrink-0'>
                <Activity className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
              </div>
              <div>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent'>
                  Orders Management
                </h1>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg mt-1'>
                  Manage and track all orders with real-time analytics
                </p>
              </div>
            </div>
            <Button
              onClick={onRefresh}
              className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base'
              disabled={!canteenId}>
              <RefreshCw className='w-4 h-4 sm:w-5 sm:h-5 mr-2' /> Refresh Data
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div className='bg-gradient-to-br from-white to-gray-50/30 rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-lg'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4'>
            {statusFilters.map((filter, index) => (
              <button key={filter.value} onClick={() => setStatusFilter(filter.value)}
                className={`relative group p-3 sm:p-4 cursor-pointer lg:p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:-translate-y-1 ${
                  statusFilter === filter.value
                    ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl'
                    : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}>
                {statusFilter === filter.value && (
                  <>
                    <div className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-indigo-500 rounded-full border-2 border-white animate-pulse'></div>
                    <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl blur-xl scale-110 opacity-60'></div>
                  </>
                )}
                <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl ${
                    statusFilter === filter.value ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <div className={`${statusFilter === filter.value ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'}`}>
                    {filter.icon}
                  </div>
                </div>
                <div className='text-left'>
                  <div className={`${statusFilter === filter.value ? 'text-indigo-900' : 'text-gray-800'} font-bold text-xs sm:text-sm mb-2`}>
                    {filter.label}
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className={`${statusFilter === filter.value ? 'text-indigo-700' : filter.count > 0 ? 'text-gray-900' : 'text-gray-400'} text-lg sm:text-2xl font-bold`}>
                      {filter.count}
                    </span>
                  </div>
                  <p className={`${statusFilter === filter.value ? 'text-indigo-600' : 'text-gray-500'} text-xs mt-2`}>
                    {filter.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Display */}
        <div className='space-y-4 sm:space-y-6 w-full'>
          {orders.length > 0
            ? orders
                .filter(order => statusFilter === 'all' || order?.status === statusFilter)
                .map(order => (
                  <OrderCard key={order._id} order={order} onOrderClick={onOrderClick} onStatusUpdate={onStatusUpdate} />
                ))
            : <div className='bg-white rounded-3xl p-8 text-center'>No orders found</div>}
        </div>

      </div>
    </div>
  );
};

export default OrdersTab;
