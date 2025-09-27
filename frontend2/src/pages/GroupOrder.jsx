import React from 'react';

// Populated Menu Item type
const PopulatedMenuItem = {
  _id: '',
  name: '',
  price: 0
};

// Item type supports populated object or string id for `item`
const Item = {
  item: '', // string | PopulatedMenuItem
  quantity: 0,
  nameAtPurchase: '',
  priceAtPurchase: 0,
  _id: '' // optional DB subdocument id
};

const Member = {
  _id: '',
  name: ''
};

const PaymentAmount = {
  user: '',
  amount: 0
};

const Transaction = {
  user: '',
  transactionId: '',
  status: ''
};

const GroupOrder = {
  _id: '',
  creator: '',
  members: [], // Member[]
  groupLink: '',
  qrCodeUrl: '',
  canteen: '',
  items: [], // Item[]
  totalAmount: 0,
  paymentDetails: {
    splitType: 'equal', // 'equal' | 'custom'
    amounts: [], // PaymentAmount[]
    payer: '',
    transactions: [] // Transaction[]
  },
  status: ''
};

// Transaction row component for desktop view
const TransactionRowDesktop = ({ txn, member, isCurrentUser, amount }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  
  const statusText = txn.status === 'pending' 
    ? 'Processing...' 
    : txn.status.charAt(0).toUpperCase() + txn.status.slice(1);
    
  const loadingSpinner = txn.status === 'pending' ? (
    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-yellow-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : null;
  
  return (
    <tr>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {isCurrentUser ? 'You' : member?.name}
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
        ₹{amount.toFixed(2)}
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[txn.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
          {loadingSpinner}
          {statusText}
        </span>
      </td>
    </tr>
  );
};

// Transaction row component for mobile view
const TransactionRowMobile = ({ txn, member, isCurrentUser, amount }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  
  const statusText = txn.status === 'pending' 
    ? 'Processing...' 
    : txn.status.charAt(0).toUpperCase() + txn.status.slice(1);
    
  const loadingSpinner = txn.status === 'pending' ? (
    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-yellow-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : null;
  
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-white">
          {isCurrentUser ? 'You' : member?.name || 'Unknown'}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(txn.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        <div className="font-semibold">₹{amount.toFixed(2)}</div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[txn.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
          {loadingSpinner}
          {statusText}
        </span>
      </div>
      {txn.transactionId && (
        <div className="col-span-2 mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
          Txn ID: {txn.transactionId}
        </div>
      )}
    </div>
  );
};

const GroupOrderPage = ({ 
  groupOrder, 
  loading, 
  items, 
  splitType, 
  amounts, 
  payer, 
  paymentProcessing, 
  savingItems,
  menuItems, 
  selectedMenuItemId, 
  newItemQuantity,
  user,
  token,
  groupLink,
  onJoinGroup,
  onAddItem,
  onRemoveItem,
  onUpdateItemQuantity,
  onUpdateAmount,
  onSetSplitType,
  onSetPayer,
  onSetSelectedMenuItem,
  onSetNewItemQuantity,
  onUpdateOrder,
  onNavigateToHome,
  showToast
}) => {

  const calculateTotal = () => {
    return items.reduce(
      (acc, i) =>
        acc +
        (i.priceAtPurchase ?? (typeof i.item === 'object' ? i.item.price : 0)) *
          i.quantity,
      0
    );
  };

  const handleAddItem = () => {
    if (!selectedMenuItemId || newItemQuantity < 1) {
      showToast('error', 'Invalid input', 'Please select an item and enter quantity >= 1.');
      return;
    }

    const selectedMenuItem = menuItems.find(
      (mi) => mi._id === selectedMenuItemId
    );

    if (!selectedMenuItem) {
      showToast('error', 'Error', 'Selected item not found in menu.');
      return;
    }

    onAddItem(selectedMenuItem, newItemQuantity);
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
    showToast('success', 'Item removed', 'Item has been removed from the order.');
  };

  const handleUpdateItemQuantity = (itemId, quantity) => {
    onUpdateItemQuantity(itemId, Math.max(1, quantity));
  };

  const handleUpdateAmount = (userId, newAmount) => {
    onUpdateAmount(userId, newAmount);
  };

  const handleSplitEqually = () => {
    const equalAmount = calculateTotal() / groupOrder.members.length;
    const equalAmounts = groupOrder.members.map(member => ({
      user: member._id,
      amount: equalAmount,
    }));
    groupOrder.members.forEach(member => {
      handleUpdateAmount(member._id, equalAmount);
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='animate-pulse text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading group order details...
          </p>
        </div>
      </div>
    );
  }

  if (!groupOrder) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='animate-pulse text-center'>
          <h2>Group Order Not Found</h2>
          <button 
            onClick={onNavigateToHome}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const userIsMember = groupOrder.members.some((m) => m._id === user?.id);

  return (
    <div className='container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'>
          Group Order
        </h1>
        <div className='flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end'>
          <span className='px-3 py-1 text-xs sm:text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'>
            {groupOrder.status}
          </span>
        </div>
      </div>

      {/* Group info */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
          <div className='mx-auto sm:mx-0'>
            <img
              src={groupOrder.qrCodeUrl}
              alt='Group QR Code'
              className='w-24 h-24 sm:w-32 sm:h-32'
            />
            <p className='mt-2 break-all text-xs sm:text-sm text-center sm:text-left text-gray-600 dark:text-gray-400'>
              Group Link: <span className='font-mono'>{groupOrder.groupLink}</span>
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4 sm:mt-0 w-full sm:w-auto'>
            <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
              <h2 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Canteen
              </h2>
              <p className='text-sm font-medium break-words'>
                {groupOrder.canteen}
              </p>
            </div>
            <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
              <h2 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Status
              </h2>
              <p className='text-sm font-medium'>{groupOrder.status}</p>
            </div>
          </div>
        </div>
      </div>

      {!userIsMember ? (
        <div className='text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
            Join this Group Order
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>
            You've been invited to join this group order. Click the button below
            to participate and start adding items.
          </p>
          <button
            onClick={onJoinGroup}
            className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full text-base transition-all duration-300 transform hover:scale-105'
          >
            Join Group Order
          </button>
        </div>
      ) : (
        <>
          {/* Add Item Section */}
          <div className='mb-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg'>
            <div className='pb-3 sm:pb-4 p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                Add Item to Your Share
              </h3>
            </div>
            <div className='p-4'>
              <div className='flex flex-col sm:flex-row gap-3'>
                <div className='flex-1'>
                  <select
                    className='w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white'
                    value={selectedMenuItemId || ''}
                    onChange={(e) => onSetSelectedMenuItem(e.target.value)}
                    disabled={savingItems}>
                    <option value=''>Select an item</option>
                    {menuItems.map((mi) => (
                      <option key={mi._id} value={mi._id}>
                        {mi.name} - ₹{mi.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='w-full sm:w-20'>
                  <input
                    type='number'
                    min={1}
                    className='text-center w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white'
                    value={newItemQuantity}
                    onChange={(e) => onSetNewItemQuantity(Math.max(1, +e.target.value))}
                    disabled={savingItems}
                    placeholder='Qty'
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  className='bg-red-600 hover:bg-red-700 text-white whitespace-nowrap w-full sm:w-auto px-4 py-2 rounded-lg disabled:opacity-50'
                  disabled={savingItems || !selectedMenuItemId}>
                  {savingItems ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white inline'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Item'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className='mb-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg'>
            <div className='pb-3 sm:pb-4 p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                Your Order Items
                <span className='ml-2 px-2.5 py-0.5 text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full'>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
            </div>
            <div className='p-4'>
              {items.length === 0 ? (
                <div className='text-center py-8'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                    No items added
                  </h3>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    Start by adding items from the menu above.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {items.map((item, idx) => {
                    let displayName = 'Unknown item';
                    let displayPrice = 0;

                    if (typeof item.item === 'object' && item.item !== null) {
                      displayName = item.item.name;
                      displayPrice = item.item.price;
                    } else if (item.nameAtPurchase) {
                      displayName = item.nameAtPurchase;
                      displayPrice = item.priceAtPurchase ?? 0;
                    }

                    const totalPrice = displayPrice * item.quantity;

                    return (
                      <div
                        key={item._id || idx}
                        className='flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700'>
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900 dark:text-white'>
                            {displayName}
                          </h4>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            ₹{displayPrice.toFixed(2)} × {item.quantity} = ₹
                            {totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='number'
                            min={1}
                            className='w-20 text-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white'
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItemQuantity(
                                typeof item.item === 'object'
                                  ? item.item._id
                                  : item.item,
                                Math.max(1, +e.target.value)
                              )
                            }
                            disabled={savingItems}
                          />
                          <button
                            className='text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded'
                            onClick={() =>
                              handleRemoveItem(
                                typeof item.item === 'object'
                                  ? item.item._id
                                  : item.item
                              )
                            }
                            disabled={savingItems}>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Payment Split */}
          <div className='mb-8 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg'>
            <div className='pb-4 p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Payment Split
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Choose how to split the total amount among group members.
              </p>
            </div>
            <div className='p-4'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center'>
                    <input
                      id='equal-split'
                      type='radio'
                      checked={splitType === 'equal'}
                      onChange={() => onSetSplitType('equal')}
                      name='splitType'
                      disabled={savingItems}
                      className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300'
                    />
                    <label
                      htmlFor='equal-split'
                      className='ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Equal split
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      id='custom-split'
                      type='radio'
                      checked={splitType === 'custom'}
                      onChange={() => onSetSplitType('custom')}
                      name='splitType'
                      disabled={savingItems}
                      className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300'
                    />
                    <label
                      htmlFor='custom-split'
                      className='ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Custom split
                    </label>
                  </div>
                </div>

                {splitType === 'custom' && (
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center mb-3'>
                      <div className='grid grid-cols-3 gap-4 font-medium text-sm text-gray-500 dark:text-gray-400 flex-1'>
                        <span>Member</span>
                        <span className='text-center'>Amount (₹)</span>
                        <span className='text-right'>Share</span>
                      </div>
                      <button
                        type='button'
                        onClick={handleSplitEqually}
                        disabled={savingItems}
                        className='ml-4 text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'>
                        Split Equally
                      </button>
                    </div>
                    {groupOrder.members.map((member) => {
                      const userAmount = amounts.find(
                        (a) => a.user === member._id
                      ) || { user: member._id, amount: 0 };
                      const total = calculateTotal();
                      const percentage =
                        total > 0 ? (userAmount.amount / total) * 100 : 0;

                      return (
                        <div
                          key={member._id}
                          className='grid grid-cols-3 gap-4 items-center'>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {member._id === user?.id ? 'You' : member.name}
                          </span>
                          <div className='flex items-center space-x-1'>
                            <button
                              type='button'
                              className='h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0 flex items-center justify-center'
                              onClick={() =>
                                handleUpdateAmount(
                                  member._id,
                                  Math.max(0, userAmount.amount - 10)
                                )
                              }
                              disabled={savingItems || userAmount.amount <= 0}>
                              <svg
                                className='h-3 w-3'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M20 12H4'
                                />
                              </svg>
                            </button>
                            <div className='relative flex-1'>
                              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>
                                ₹
                              </span>
                              <input
                                type='number'
                                min={0}
                                step={0.01}
                                value={userAmount.amount}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleUpdateAmount(
                                    member._id,
                                    isNaN(value) ? 0 : Math.max(0, value)
                                  );
                                }}
                                disabled={savingItems}
                                className='pl-8 text-center text-sm h-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white'
                                placeholder='0.00'
                              />
                            </div>
                            <button
                              type='button'
                              className='h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0 flex items-center justify-center'
                              onClick={() =>
                                handleUpdateAmount(
                                  member._id,
                                  userAmount.amount + 10
                                )
                              }
                              disabled={savingItems}>
                              <svg
                                className='h-3 w-3'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                                />
                              </svg>
                            </button>
                          </div>
                          <div className='flex items-center justify-end'>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium'>Assigned Total</span>
                        <span
                          className={`font-semibold ${
                            Math.abs(
                              amounts.reduce((sum, a) => sum + a.amount, 0) -
                                calculateTotal()
                            ) < 0.01
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                          ₹
                          {amounts
                            .reduce((sum, a) => sum + a.amount, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center mt-1'>
                        <span className='font-medium'>Order Total</span>
                        <span className='font-semibold text-gray-900 dark:text-white'>
                          ₹{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      {Math.abs(
                        amounts.reduce((sum, a) => sum + a.amount, 0) -
                          calculateTotal()
                      ) >= 0.01 && (
                        <div className='mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                          <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
                            ⚠️ Total mismatch: ₹
                            {(
                              amounts.reduce((sum, a) => sum + a.amount, 0) -
                              calculateTotal()
                            ).toFixed(2)}
                          </p>
                          <p className='text-xs text-red-500 dark:text-red-400 mt-1'>
                            The assigned amounts must equal the order total to
                            proceed with payment.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payer Selection */}
          <div className='mb-8 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg'>
            <div className='pb-4 p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Select Payer
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Choose who will make the payment for this order.
              </p>
            </div>
            <div className='p-4'>
              <div className='space-y-3'>
                {groupOrder.members.map((member) => (
                  <div
                    key={member._id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      payer === member._id
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => onSetPayer(member._id)}>
                    <div
                      className={`flex items-center justify-center h-5 w-5 rounded-full border ${
                        payer === member._id
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                      {payer === member._id && (
                        <svg
                          className='h-3 w-3 text-white'
                          fill='currentColor'
                          viewBox='0 0 12 12'>
                          <path d='M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z' />
                        </svg>
                      )}
                    </div>
                    <span className='ml-3 block text-sm font-medium text-gray-900 dark:text-white'>
                      {member._id === user?.id ? 'You' : member.name}
                    </span>
                    {member._id === user?.id && (
                      <span className='ml-auto px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full'>
                        You
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className='sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 pt-3 sm:pt-4 pb-4 sm:pb-6 border-t border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-3xl mx-auto'>
              {(() => {
                const isCustomSplitValid =
                  splitType === 'equal' ||
                  Math.abs(
                    amounts.reduce((sum, a) => sum + a.amount, 0) -
                      calculateTotal()
                  ) < 0.01;

                return (
                  <>
                    <button
                      disabled={
                        paymentProcessing ||
                        savingItems ||
                        items.length === 0 ||
                        !isCustomSplitValid
                      }
                      onClick={onUpdateOrder}
                      className={`w-full py-4 sm:py-5 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 ${
                        isCustomSplitValid
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
                          : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                      } disabled:opacity-50`}>
                      {paymentProcessing ? (
                        <>
                          <svg
                            className='animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white inline'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'>
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                          </svg>
                          Processing...
                        </>
                      ) : !isCustomSplitValid ? (
                        'Fix Split Amounts to Continue'
                      ) : (
                        `Pay ₹${calculateTotal().toFixed(2)}`
                      )}
                    </button>
                    <p className='mt-2 text-center text-xs text-gray-500 dark:text-gray-400'>
                      {!isCustomSplitValid
                        ? 'Custom split amounts must equal the order total'
                        : "You'll complete the payment in the next step"}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Transaction History */}
          {groupOrder.paymentDetails.transactions.length > 0 && (
            <div className='mt-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg'>
              <div className='pb-3 sm:pb-4 p-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                  Transaction History
                </h3>
              </div>
              <div className='p-0 sm:p-6'>
                <div className='overflow-x-auto -mx-4 sm:mx-0'>
                  {/* Desktop Table */}
                  <div className='hidden sm:block'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <thead className='bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th
                            scope='col'
                            className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            Member
                          </th>
                          <th
                            scope='col'
                            className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            Amount
                          </th>
                          <th
                            scope='col'
                            className='px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800'>
                        {groupOrder.paymentDetails.transactions.map((txn) => (
                          <TransactionRowDesktop
                            key={txn.transactionId}
                            txn={txn}
                            member={groupOrder.members.find(
                              (m) => m._id === txn.user
                            )}
                            isCurrentUser={
                              groupOrder.members.find((m) => m._id === txn.user)
                                ?._id === user?.id
                            }
                            amount={
                              amounts.find((a) => a.user === txn.user)?.amount ||
                              0
                            }
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List */}
                  <div className='sm:hidden space-y-3 p-4'>
                    {groupOrder.paymentDetails.transactions.map((txn) => (
                      <div
                        key={txn.transactionId}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700'>
                        <TransactionRowMobile
                          txn={txn}
                          member={groupOrder.members.find(
                            (m) => m._id === txn.user
                          )}
                          isCurrentUser={
                            groupOrder.members.find((m) => m._id === txn.user)
                              ?._id === user?.id
                          }
                          amount={
                            amounts.find((a) => a.user === txn.user)?.amount || 0
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupOrderPage;