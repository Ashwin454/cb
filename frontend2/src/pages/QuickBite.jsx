import React, { useState, useEffect } from "react";
import { getQuickBites } from "../services/operations/Menu";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQuantity,
  decrementQuantity,
  incrementQuantity,
} from "../slices/CartSlice";

// ================= ICON COMPONENTS =================
const CheckCircle = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const Leaf = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const MapPin = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Star = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Search = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const Plus = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const Chili = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const Minus = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 12H4"
    />
  </svg>
);

const Lightning = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const Building = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
  </svg>
);

const Target = ({ className = "" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const Refresh = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const Filter = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
    />
  </svg>
);

// ================ STYLING (Animations) =================
const CustomStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `,
    }}
  />
);

// ============= UI COMPONENTS =============
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, disabled = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none px-4 py-2 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

// ============= HELPERS =============
const getItemRating = (item) => {
  const priceScore = Math.min(item.price / 100, 1);
  const nameScore = (item.name.length % 5) / 5;
  return Math.max(3, Math.min(5, 3.5 + priceScore + nameScore));
};

// ============= ITEM CARD COMPONENT =============
const QuickBiteItemCard = ({
  item,
  onAddToCart,
  onUpdateQuantity,
  currentQuantity,
}) => {
  const canteenName = item.canteen?.name || "Unknown Canteen";
  const isCanteenValid = canteenName !== "Unknown Canteen";

  return (
    <div className="group relative overflow-hidden bg-slate-800 border border-slate-700 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full h-40 md:h-[28rem] flex flex-col md:flex-col">
      {/* Desktop Layout - Vertical (Image on top) */}
      <div className="hidden md:flex flex-col h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-2xl bg-slate-700 h-96">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Status Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Ready Badge */}
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3 h-3" /> Ready Now!
            </div>

            {/* Veg/Non-Veg Badge */}
            <div
              className={`text-xs px-2 py-1 rounded-md flex gap-1 items-center shadow-lg ${
                item.isVeg ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {item.isVeg ? (
                <Leaf className="w-3 h-3" />
              ) : (
                <Chili className="w-3 h-3" />
              )}
              {item.isVeg ? "Veg" : "Non-Veg"}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-white leading-tight line-clamp-2 min-h-[2.5rem]">
              {item.name}
            </h3>

            {/* Canteen Name */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400 font-medium truncate">
                {canteenName}
              </p>
            </div>

            {item.description && (
              <p className="text-xs text-gray-300 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white">₹{item.price}</span>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-white">
                {getItemRating(item).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex gap-1">
            {item.category && (
              <div className="bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded-md">
                {item.category}
              </div>
            )}
          </div>

          {/* Add to Cart / Quantity Controls */}
          {currentQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              disabled={!isCanteenValid}
              className={`w-full font-bold py-3 rounded-xl text-sm transition-all duration-200 ${
                isCanteenValid
                  ? "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isCanteenValid ? "Add to Cart" : "Unavailable"}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-slate-700 rounded-xl p-3">
              <button
                onClick={() => onUpdateQuantity(item, currentQuantity - 1)}
                className="w-8 h-8 p-0 rounded-lg bg-slate-600 text-red-400 hover:bg-red-500 hover:text-white border border-slate-500 transition-all duration-200"
              >
                <Minus className="h-4 w-4 mx-auto" />
              </button>

              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-white text-base">
                  {currentQuantity}
                </span>
                <span className="text-xs text-gray-400">in cart</span>
              </div>

              <button
                onClick={() => onUpdateQuantity(item, currentQuantity + 1)}
                className="w-8 h-8 p-0 rounded-lg bg-slate-600 text-green-400 hover:bg-green-500 hover:text-white border border-slate-500 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mx-auto" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout - Horizontal (Image on left, content on right) */}
      <div className="md:hidden flex h-full min-h-[10rem]">
        {/* Image Section - Left Half */}
        <div className="relative w-1/2 bg-slate-700 rounded-l-2xl overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* Status Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {/* Ready Badge */}
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3 h-3" /> Ready
            </div>

            {/* Veg/Non-Veg Badge */}
            <div
              className={`text-xs px-2 py-1 rounded-full flex gap-1 items-center shadow-lg ${
                item.isVeg ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {item.isVeg ? (
                <>
                  <Leaf className="w-3 h-3" />
                  <Leaf className="w-3 h-3" />
                </>
              ) : (
                <Chili className="w-3 h-3" />
              )}
              {item.isVeg ? "Veg" : "Non-Veg"}
            </div>
          </div>
        </div>

        {/* Content Section - Right Half */}
        <div className="w-1/2 p-3 flex flex-col justify-between bg-slate-800 min-h-0">
          {/* Product Info */}
          <div className="space-y-1 flex-1 min-h-0">
            <h3 className="font-bold text-sm text-white leading-tight line-clamp-2">
              {item.name}
            </h3>

            {/* Canteen Name */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400 font-medium truncate">
                {canteenName}
              </p>
            </div>

            {/* Price and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-orange-500 font-bold text-base">
                ₹{item.price}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-white">
                  {getItemRating(item).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="flex gap-1">
              {item.category && (
                <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.category}
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart / Quantity Controls */}
          <div className="mt-1 flex-shrink-0">
            {currentQuantity === 0 ? (
              <button
                onClick={() => onAddToCart(item)}
                disabled={!isCanteenValid}
                className={`w-full font-semibold py-1.5 rounded-md text-xs transition-all duration-200 ${
                  isCanteenValid
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCanteenValid ? "Add" : "Unavailable"}
              </button>
            ) : (
              <div className="flex items-center justify-between bg-slate-700 rounded-md p-1.5">
                <button
                  onClick={() => onUpdateQuantity(item, currentQuantity - 1)}
                  className="w-6 h-6 p-0 rounded bg-slate-600 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>

                <span className="font-semibold text-white text-xs px-1.5">
                  {currentQuantity}
                </span>

                <button
                  onClick={() => onUpdateQuantity(item, currentQuantity + 1)}
                  className="w-6 h-6 p-0 rounded bg-slate-600 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN FUNCTIONAL COMPONENT =============
export default function QuickBitePage() {
  const { User } = useSelector((state) => state.Auth);
  const { cart } = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const [readyItems, setReadyItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietType, setDietType] = useState("all");

  // ADD TO CART
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  // UPDATE QUANTITY
  const handleUpdateQuantity = (item, quantity) => {
    if (quantity <= 0) {
      dispatch(updateQuantity({ id: item._id, quantity: 0 }));
    } else {
      dispatch(updateQuantity({ id: item._id, quantity }));
    }
  };

  // GET CURRENT QUANTITY FROM CART
  const getCurrentQuantity = (itemId) => {
    const cartItem = cart.find((item) => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // FILTERS
  const applyFilters = () => {
    let filtered = [...readyItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    if (dietType === "veg") {
      filtered = filtered.filter((item) => item.isVeg);
    } else if (dietType === "non-veg") {
      filtered = filtered.filter((item) => !item.isVeg);
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, dietType, readyItems]);

  const loadReadyItems = async () => {
    setLoading(true);
    const result = await getQuickBites(User.campus);

    setReadyItems(result);

    setLoading(false);
  };
  useEffect(() => {
    loadReadyItems();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-900">
      <CustomStyles />

      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* QuickBites Banner Section */}
          <div className="text-center mb-12">
            <div className="border-2 border-dashed border-slate-600 rounded-3xl p-8 mb-8 max-w-4xl mx-auto bg-slate-800/50">
              <h1 className="text-6xl font-black text-white mb-4">
                Quick<span className="text-red-500">Bites</span>
              </h1>

              {/* Plate Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
              </div>

              <p className="text-xl text-gray-300 mb-6">
                Ready-to-serve items from all canteens across all campuses
              </p>

              {/* Call to Action */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-slate-600 flex-1"></div>
                <div className="flex items-center gap-2 text-white">
                  <Lightning className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-medium">
                    Order now and skip the wait!
                  </span>
                </div>
                <div className="h-px bg-slate-600 flex-1"></div>
              </div>

              {/* Feature Cards */}
              <div className="flex justify-center gap-6">
                <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    {filteredItems.length}
                  </div>
                  <div className="text-sm text-white">Ready Items</div>
                </div>
                <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
                  <div className="flex justify-center mb-2">
                    <Lightning className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-sm text-white">Instant Pickup</div>
                </div>
                <div className="bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
                  <div className="flex justify-center mb-2">
                    <Building className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-sm text-white">All Canteens</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
            </div>

            {/* Diet Type Filter */}
            <div className="flex justify-center gap-4 mb-6">
              {[
                { key: "all", label: "All", icon: "🍽️" },
                { key: "veg", label: "Veg", icon: "🥬" },
                { key: "non-veg", label: "Non-Veg", icon: "🍗" },
              ].map((diet) => (
                <button
                  key={diet.key}
                  onClick={() => setDietType(diet.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    dietType === diet.key
                      ? "bg-red-500 text-white"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <span className="text-lg">{diet.icon}</span>
                  <span>{diet.label}</span>
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end">
              <button
                onClick={loadReadyItems}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Refresh className="w-4 h-4" />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-800 rounded-xl px-6 py-3 border border-slate-700">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-gray-300">
                Showing {filteredItems.length} delicious ready-to-serve items
              </span>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-300">
                Finding delicious ready items... 🍽️
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No items found
              </h3>
              <p className="text-gray-400">
                Try different search terms or filters
              </p>
            </div>
          ) : (
            <>
              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {filteredItems.map((item) => (
                  <QuickBiteItemCard
                    key={item._id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    currentQuantity={getCurrentQuantity(item._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
