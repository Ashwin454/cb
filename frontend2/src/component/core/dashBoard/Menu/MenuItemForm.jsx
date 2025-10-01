import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Button } from '../../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import {
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { CreateMenuItem, UpdateItemStatus } from '../../../../services/operations/Menu';
import { useSelector } from 'react-redux';

const MenuItemForm = ({ item = null, setMenuItems }) => {
  const { canteenId } = useSelector((state) => state.Canteen);
  const { token } = useSelector((state) => state.Auth);

  const [imageUploading, setImageUploading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const isEditing = item !== null && typeof item === 'object';

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEditing
      ? {
          name: item.name || '',
          price: item.price || '',
          description: item.description || '',
          quantity: item.quantity || '',
          category: item.category || '',
          portion: item.portion || '',
          isVeg: typeof item.isVeg === 'boolean' ? item.isVeg : true,
          available: typeof item.available === 'boolean' ? item.available : true,
          image: item.image || '',
        }
      : {
          name: '',
          price: '',
          description: '',
          quantity: '',
          category: '',
          portion: '',
          isVeg: true,
          available: true,
          image: '',
        },
  });

  const imageValue = watch('image');
  const isVegValue = watch('isVeg');
  const availableValue = watch('available');

  const categoryOptions = useMemo(
    () => [
      { value: 'appetizers', label: '🥗 Appetizers' },
      { value: 'main-course', label: '🍽️ Main Course' },
      { value: 'desserts', label: '🍰 Desserts' },
      { value: 'beverages', label: '🥤 Beverages' },
      { value: 'snacks', label: '🍿 Snacks' },
      { value: 'salads', label: '🥙 Salads' },
      { value: 'soups', label: '🍲 Soups' },
      { value: 'breads', label: '🍞 Breads' },
      { value: 'rice', label: '🍚 Rice' },
      { value: 'others', label: '📦 Others' },
    ],
    []
  );

  const portionOptions = useMemo(
    () => [
      { value: 'full', label: 'Full' },
      { value: 'half', label: 'Half' },
      { value: 'quarter', label: 'Quarter' },
      { value: 'mini', label: 'Mini' },
      { value: 'large', label: 'Large' },
      { value: 'regular', label: 'Regular' },
    ],
    []
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // store File object for real upload
    setImageUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image', reader.result, { shouldValidate: true }); // base64 preview only
      setImageUploading(false);
      setShowImagePreview(true);
    };
    reader.readAsDataURL(file);
  };

  const isChangedValue = (originalItem, currentValues) => {
    if (!originalItem) return true;
    return (
      originalItem.name !== currentValues.name ||
      originalItem.price !== currentValues.price ||
      originalItem.description !== currentValues.description ||
      originalItem.quantity !== currentValues.quantity ||
      originalItem.category !== currentValues.category ||
      originalItem.portion !== currentValues.portion ||
      originalItem.isVeg !== currentValues.isVeg ||
      originalItem.available !== currentValues.available ||
      originalItem.image !== currentValues.image
    );
  };

  const handleEdit = async (currentValue) => {
    const formData = new FormData();
    formData.append('name', currentValue.name);
    formData.append('available', currentValue.available);
    formData.append('description', currentValue.description);
    formData.append('price', currentValue.price);
    formData.append('isVeg', currentValue.isVeg);
    formData.append('ItemThumbnail', selectedFile || currentValue.image || '');
    formData.append('category', currentValue.category);
    formData.append('quantity', currentValue.quantity);
    formData.append('portion', currentValue.portion);
    formData.append('canteenId', canteenId);
    
    const result=await UpdateItemStatus(item?._id,formData,token);
   setMenuItems(prev =>
  prev.map(item => (item._id === result._id ? result : item))
);
  };

  const handleCreate = async (currentValue) => {
    const formData = new FormData();
    formData.append('name', currentValue.name);
    formData.append('available', currentValue.available);
    formData.append('description', currentValue.description);
    formData.append('price', currentValue.price);
    formData.append('isVeg', currentValue.isVeg);
    formData.append('ItemThumbnail', selectedFile || currentValue.image || '');
    formData.append('category', currentValue.category);
    formData.append('quantity', currentValue.quantity);
    formData.append('portion', currentValue.portion);
    formData.append('canteenId', canteenId);

    const result = await CreateMenuItem(formData, token);
    if(result){
      setMenuItems((prev) => {

      return [...prev, result];
    });
    }
    
  };

  const onSubmitForm = async () => {
    const currentValue = getValues();

    if (isEditing) {
      if (!isChangedValue(item, currentValue)) {
        alert('All values are same');
        return;
      }
      await handleEdit(currentValue);
    } else {
      await handleCreate(currentValue);
      reset();
      setShowImagePreview(false);
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (isEditing && item) {
      setValue('name', item.name);
      setValue('available', item.available);
      setValue('description', item.description);
      setValue('price', item.price);
      setValue('isVeg', item.isVeg);
      setValue('image', item.image);
      setValue('category', item.category);
      setValue('quantity', item.quantity);
      setValue('portion', item.portion);

      if (item.image) {
        setShowImagePreview(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, setValue]);

  const baseInputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-black';
  const selectTriggerClass =
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-black';

  return (
    <div className="p-6 h-[30rem] overflow-y-scroll">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter item name"
                className={baseInputClass}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                  ₹
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Minimum price is ₹0.01' },
                  })}
                  placeholder="0.00"
                  className={`${baseInputClass} pl-8`}
                  aria-invalid={errors.price ? 'true' : 'false'}
                />
              </div>
              {errors.price && (
                <span className="text-red-500 text-xs">{errors.price.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your delicious menu item..."
                rows={4}
                className={`${baseInputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Category and Serving Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Category & Serving Details
          </h3>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch('category')}
              onValueChange={(val) => setValue('category', val)}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border border-gray-200 rounded-xl shadow-lg max-h-60">
                {categoryOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="px-4 py-3 hover:bg-gray-50"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <span className="text-red-500 text-xs">{errors.category.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portion" className="text-sm font-medium text-gray-700">
                Portion Size
              </Label>
              <Select
                value={watch('portion')}
                onValueChange={(val) => setValue('portion', val)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select portion" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-gray-200 rounded-xl shadow-lg">
                  {portionOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Minimum quantity is 1' },
                })}
                placeholder="e.g., 1, 2, 3"
                className={baseInputClass}
                aria-invalid={errors.quantity ? 'true' : 'false'}
              />
              {errors.quantity && (
                <span className="text-red-500 text-xs">{errors.quantity.message}</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
            💡 Select portion size and enter the number of servings per order
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Item Image
          </h3>

          <div className="space-y-4">
            <div className="relative">
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={imageUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                  imageUploading
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {imageUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                    <p className="text-sm text-blue-600 font-medium">
                      Processing image...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, WebP (Max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {imageValue && showImagePreview && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-gray-700">Image Preview</p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={imageValue}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Image loaded successfully</p>
                    <p className="text-xs text-gray-500">
                      Ready to be saved with your menu item
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Food Type & Availability */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Food Type & Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Food Type</Label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="radio"
                  name="foodType"
                  checked={isVegValue === true}
                  onChange={() => setValue('isVeg', true)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Vegetarian
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="radio"
                  name="foodType"
                  checked={isVegValue === false}
                  onChange={() => setValue('isVeg', false)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Non-Vegetarian
                  </span>
                </div>
              </label>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Availability</Label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availableValue === true}
                  onChange={() => setValue('available', true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availableValue === false}
                  onChange={() => setValue('available', false)}
                  className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Not Available
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={imageUploading || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] py-3 rounded-xl font-semibold text-lg"
          >
            {imageUploading || isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <CheckCircle className="w-5 h-5 mr-1" />
                ) : (
                  <Camera className="w-5 h-5 mr-1" />
                )}
                {isEditing ? 'Update Menu Item' : 'Add Menu Item'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
