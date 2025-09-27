import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Camera, Loader2, Plus, RefreshCw, Menu as MenuIcon, Sparkles } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import { useSelector } from 'react-redux';
import { DeleteMenuItem, getCanteenMenu } from '../../../../services/operations/Menu';
import MenuItemCard from './MenuCard';
import MenuItemFilters from './MenuItemFilter';
import apiConnector from '../../../../services/apiConnector';

const EditMenuItemDialog = ({ editingItem,setItems, onUpdate, isLoading, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setIsOpen(true);
    }
  }, [editingItem]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Empty trigger as this dialog is controlled externally */}
        <></>
      </DialogTrigger>
      <DialogContent className="max-w-lg h-[40rem] bg-white border border-gray-200 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-600" />
            Edit Menu Item
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update your menu item details.
          </DialogDescription>
        </DialogHeader>
        <MenuItemForm
          item={editingItem}
          isEditing={true}
          setMenuItems={setItems}
        
        />
        <div className="pt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MenuTab = () => {
  const { canteenId } = useSelector(state => state.Canteen);
  const{token}=useSelector(state=>state.Auth);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [readyFilter, setReadyFilter] = useState('all');

  // Add Item Dialog
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Edit Item Dialog and state
  const [editingItem, setEditingItem] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Fetch menu items
  const getCanteenMenuItems = async () => {
    setMenuLoading(true);
    try {
      const response = await getCanteenMenu(canteenId);
      setMenuItems(response || []);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
    setMenuLoading(false);
  };

  useEffect(() => {
    if (canteenId) {
      getCanteenMenuItems();
    }
  }, [canteenId]);

  // Filtering logic
  useEffect(() => {
    let items = [...menuItems];
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      items = items.filter(item =>
        statusFilter === 'active' ? item.available : !item.available
      );
    }
    if (readyFilter !== 'all') {
      items = items.filter(item =>
        readyFilter === 'ready' ? item.isReady : !item.isReady
      );
    }
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter);
    }
    setFilteredItems(items);
    setCategories([...new Set(menuItems.map(i => i?.category).filter(Boolean))]);
  }, [menuItems, searchTerm, statusFilter, categoryFilter, readyFilter]);

  const handleAddItemClick = () => {
    setEditingItem(null);
    setIsAddItemOpen(true);
  };

  const handleEditItemClick = (item) => {
    setEditingItem(item);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setReadyFilter('all');
  };

  const hasFiltersApplied =
    searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || readyFilter !== 'all';
  const hasMenuItems = menuItems.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  const emptyStateContent = React.useMemo(() => {
    if (!hasMenuItems) {
      return {
        title: 'Welcome to Your Menu!',
        description: 'Start building your amazing menu by adding your first delicious item.',
        showAddButton: true,
      };
    }
    if (hasFiltersApplied) {
      return {
        title: 'No Items Found',
        description: 'No items match your current filters.',
        showAddButton: false,
      };
    }
    return {
      title: 'No Items Found',
      description: 'Your menu is currently empty. Add some items to get started.',
      showAddButton: true,
    };
  }, [hasMenuItems, hasFiltersApplied]);

  const handleDelete=async(ItemId)=>{
    const data=await DeleteMenuItem(ItemId,token);
    setMenuItems((prev)=>prev.filter((item)=>item._id!==ItemId));
  }
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
      </div>
      <div className="text-center mt-8 space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">Loading Your Menu Items</h3>
        <p className="text-gray-600">Please wait while we fetch your menu...</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-12 max-w-2xl mx-auto text-center">
        <MenuIcon className="w-20 h-20 mx-auto text-gray-400 mb-8" />
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{emptyStateContent.title}</h3>
        <p className="text-gray-600 mb-8">{emptyStateContent.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {emptyStateContent.showAddButton ? (
            <>
              <Button
                onClick={handleAddItemClick}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" /> {hasMenuItems ? 'Add New Item' : 'Add Your First Item'}
              </Button>
              <Button
                onClick={getCanteenMenuItems}
                className="cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold"
                disabled={!canteenId}
              >
                <RefreshCw className="w-5 h-5 mr-2" /> Refresh Data
              </Button>
            </>
          ) : (
            <Button
              onClick={handleClearFilters}
              className="cursor-pointer bg-white border-2 border-gray-300 px-6 py-3 rounded-xl font-semibold"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Add item submit handler (simulate API call)
  const handleAddSubmit = async (formData) => {
    // Simulated delay/loading
    setMenuLoading(true);
    // Here you would call your API to create the menu item
    // For demo, just add locally with a fake ID
    setTimeout(() => {
      const newItem = { ...formData, _id: Date.now().toString() };
      setMenuItems(prev => [newItem, ...prev]);
      setMenuLoading(false);
      setIsAddItemOpen(false);
    }, 1000);
  };

  // Edit item submit handler (simulate API call)
  const handleEditSubmit = async (formData) => {
    setIsEditLoading(true);
    // Here you would call your API to update the menu item using editingItem._id
    // For demo, update local state
    setTimeout(() => {
      setMenuItems(prev =>
        prev.map(item => (item._id === editingItem._id ? { ...editingItem, ...formData } : item))
      );
      setIsEditLoading(false);
      setEditingItem(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <MenuIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Menu Management
              </h1>
            </div>
            <p className="text-gray-600 text-lg font-medium">Create and manage your delicious menu items</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddItemClick}
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-2xl rounded-2xl">
                <DialogHeader className="space-y-3 pb-6">
                  <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Add New Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new menu item with details and images.
                  </DialogDescription>
                </DialogHeader>
                <MenuItemForm onSubmit={handleAddSubmit}  setMenuItems={setMenuItems} isSubmitting={menuLoading} />
              </DialogContent>
            </Dialog>
            <Button
              onClick={getCanteenMenuItems}
              className="cursor-pointer bg-white border border-gray-300 px-4 py-2.5 rounded-xl font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border p-6">
          <MenuItemFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            menuItems={menuItems}
            categories={categories}
            readyFilter={readyFilter}
            setReadyFilter={setReadyFilter}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {menuLoading ? (
          <LoadingState />
        ) : hasFilteredItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <MenuItemCard onDelete={handleDelete}
                key={item?._id}
                item={item}
                onEdit={() => handleEditItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Edit Dialog */}
      <EditMenuItemDialog
        editingItem={editingItem}
        isLoading={isEditLoading}
        onUpdate={handleEditSubmit}
        setItems={setMenuItems}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
};

export default MenuTab;
