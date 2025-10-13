import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Star,
  Clock,
  MapPin,
  Utensils,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
  Filter,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  Search,
  Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getCanteenMenu } from "../services/operations/Menu";
import { getCanteenDetails } from "../services/operations/Canteens";
import {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../slices/CartSlice";
import { useSocket } from "../context/Socket";

// TruncatedText Component for description with expand/collapse functionality
const TruncatedText = ({ text, maxLines = 2, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);

  // Callback ref to measure text when element is mounted
  const measureText = useCallback(
    (element) => {
      if (element && text && text.length > 0) {
        // Check if text is actually overflowing
        const isOverflowing = element.scrollHeight > element.clientHeight;

        if (isOverflowing) {
          setNeedsTruncation(true);
          setShowToggle(true);
        } else {
          setNeedsTruncation(false);
          setShowToggle(false);
        }
      }
    },
    [text]
  );

  // Additional effect to check text overflow after render
  useEffect(() => {
    if (textRef.current && text && text.length > 0) {
      const checkOverflow = () => {
        const element = textRef.current;
        if (element) {
          const isOverflowing = element.scrollHeight > element.clientHeight;

          if (isOverflowing) {
            setNeedsTruncation(true);
            setShowToggle(true);
          } else {
            setNeedsTruncation(false);
            setShowToggle(false);
          }
        }
      };

      // Check immediately and after a short delay
      checkOverflow();
      const timeoutId = setTimeout(checkOverflow, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [text]);

  useEffect(() => {
    if (text && text.length > 0) {
      const checkTextHeight = () => {
        if (textRef.current) {
          // Create a temporary element to measure text height
          const tempElement = document.createElement("div");
          const computedStyle = getComputedStyle(textRef.current);

          tempElement.style.cssText = `
            position: absolute;
            visibility: hidden;
            width: ${textRef.current.offsetWidth}px;
            font-size: ${computedStyle.fontSize};
            font-family: ${computedStyle.fontFamily};
            font-weight: ${computedStyle.fontWeight};
            line-height: 1.4;
            word-wrap: break-word;
            white-space: normal;
            padding: 0;
            margin: 0;
            border: none;
            box-sizing: border-box;
          `;
          tempElement.textContent = text;
          document.body.appendChild(tempElement);

          const lineHeight = parseFloat(
            getComputedStyle(tempElement).lineHeight
          );
          const maxHeight = lineHeight * maxLines;
          const actualHeight = tempElement.scrollHeight;

          document.body.removeChild(tempElement);

          // Only show "more" button if text actually exceeds 2 lines
          const exceedsMaxLines = actualHeight > maxHeight;

          if (exceedsMaxLines) {
            setNeedsTruncation(true);
            setShowToggle(true);
          } else {
            setNeedsTruncation(false);
            setShowToggle(false);
          }
        }
      };

      // Use multiple methods to ensure we catch the measurement
      const timeoutId = setTimeout(checkTextHeight, 50);
      const timeoutId2 = setTimeout(checkTextHeight, 200);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
      };
    } else {
      setNeedsTruncation(false);
      setShowToggle(false);
    }
  }, [text, maxLines]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!text || text.trim() === "") {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {isExpanded ? (
        <div className="transition-all duration-300 ease-in-out">
          {text}
          {showToggle && needsTruncation && (
            <motion.button
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={toggleExpanded}
              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium ml-1 transition-all duration-200 group"
            >
              <span>Show less</span>
              <ChevronUp
                size={12}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </motion.button>
          )}
        </div>
      ) : (
        <div className="relative transition-all duration-300 ease-in-out">
          <div
            ref={(el) => {
              textRef.current = el;
              measureText(el);
            }}
            className={`line-clamp-2 ${needsTruncation ? "pr-12" : ""}`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </div>
          {showToggle && needsTruncation && (
            <motion.button
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={toggleExpanded}
              className="absolute bottom-0 right-0 inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-200 group bg-gray-800 pl-2"
              style={{
                background:
                  "linear-gradient(to left, #1f2937 0%, #1f2937 70%, transparent 100%)",
              }}
            >
              <span>more</span>
              <ChevronDown
                size={12}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

const CanteenMenuPage = () => {
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [activeFilters, setActiveFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState([]);
  const { getSocket, connectSocket, disconnectSocket } = useSocket();
  const { token } = useSelector((state) => state.Auth);
  const { canteenId } = useParams();
  const { cart } = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCanteenItems = async () => {
    try {
      const result = await getCanteenMenu(canteenId);
      setMenuItems(result);

      // Calculate price range
      if (result.length > 0) {
        const prices = result.map((item) => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
        setActiveFilters({ minPrice, maxPrice });

        // Extract unique categories
        const categories = [
          ...new Set(result.map((item) => item.category).filter(Boolean)),
        ];
        setAvailableCategories(categories);
      }

      setFilteredItems(result);
    } catch (err) {
      toast.error(err?.message || "Error fetching menu");
    }
  };

  const fetchCanteenDetails = async () => {
    try {
      const result = await getCanteenDetails(canteenId);
      setCanteen(result);
    } catch (err) {
      toast.error(err?.message || "Error fetching canteen details");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (canteenId && token) {
        setLoading(true);
        await Promise.all([fetchCanteenItems(), fetchCanteenDetails()]);
        setLoading(false);
      }
    };
    fetchData();
  }, [canteenId, token]);

  // Filter items based on price range, search query, and category
  useEffect(() => {
    let filtered = menuItems.filter(
      (item) =>
        item.price >= activeFilters.minPrice &&
        item.price <= activeFilters.maxPrice
    );

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [menuItems, activeFilters, searchQuery, selectedCategory]);

  const handlePriceFilterChange = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: parseInt(value),
    }));
  };

  const resetFilters = () => {
    setActiveFilters({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (
      activeFilters.minPrice !== priceRange.min ||
      activeFilters.maxPrice !== priceRange.max
    ) {
      count++;
    }
    if (searchQuery.trim()) {
      count++;
    }
    if (selectedCategory !== "all") {
      count++;
    }
    return count;
  };

  const cartref = useRef(cart);

  useEffect(() => {
    cartref.current = cart;
  }, [cart]);

  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    socket?.emit("Join_Room", canteenId);

    return () => {
      console.log(cartref.current);
      if (cartref.current.length === 0) {
        disconnectSocket();
      }
    };
  }, [canteenId]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0b1120" }}>
      {/* Header */}
      <header className="relative h-64 md:h-80 bg-gray-500">
        <img
          src={canteen?.images?.[0] || "https://via.placeholder.com/800x400"}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-4 hover:underline transition-colors duration-200"
          >
            <ArrowLeft size={16} /> Back to Canteens
          </button>
          <h1 className="text-5xl font-bold text-white">{canteen?.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-gray-200">
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{canteen?.campus?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Menu</h2>
              <span className="text-gray-300">
                ({filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"})
              </span>
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(!showFilter)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <Sliders size={14} className="text-white" />
              <span className="text-sm font-semibold">Price Filter</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-white text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {getActiveFilterCount()}
                </span>
              )}
              {/* Ripple effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
            </motion.button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-gray-700 shadow-lg mb-6 overflow-hidden"
              style={{ backgroundColor: "#0b1120" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Active Filters</h3>
                  <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetFilters}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        Reset All
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowFilter(false)}
                      className="p-1.5 bg-gray-700 hover:bg-red-600 rounded-full transition-all duration-300 group"
                    >
                      <X
                        size={14}
                        className="text-gray-300 group-hover:text-white transition-colors"
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Active Filters Summary */}
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Current Filters:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Search: "{searchQuery}"
                      </span>
                    )}
                    {selectedCategory !== "all" && (
                      <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                        Category: {selectedCategory}
                      </span>
                    )}
                    {(activeFilters.minPrice !== priceRange.min ||
                      activeFilters.maxPrice !== priceRange.max) && (
                      <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">
                        Price: ₹{activeFilters.minPrice} - ₹
                        {activeFilters.maxPrice}
                      </span>
                    )}
                    {getActiveFilterCount() === 0 && (
                      <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">
                        No filters applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Price: ₹{activeFilters.minPrice}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={activeFilters.minPrice}
                      onChange={(e) =>
                        handlePriceFilterChange("minPrice", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${
                          ((activeFilters.minPrice - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e5e7eb ${
                          ((activeFilters.minPrice - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Price: ₹{activeFilters.maxPrice}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={activeFilters.maxPrice}
                      onChange={(e) =>
                        handlePriceFilterChange("maxPrice", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${
                          ((activeFilters.maxPrice - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e5e7eb ${
                          ((activeFilters.maxPrice - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Price Range Display */}
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-300">
                    Showing items from ₹{activeFilters.minPrice} to ₹
                    {activeFilters.maxPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">
              {menuItems.length === 0
                ? "No items available"
                : "No items match your filter criteria"}
            </p>
            {menuItems.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
          >
            <AnimatePresence>
              {filteredItems.map((item) => {
                const cartItem = cart.find(
                  (cartItem) => cartItem._id === item._id
                );
                const quantity = cartItem?.quantity || 0;
                const isInCart = quantity > 0;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="mobile-card sm:flex sm:flex-col sm:rounded-2xl sm:shadow-lg sm:overflow-hidden sm:bg-gray-800 sm:border sm:border-gray-700 sm:hover:shadow-2xl sm:transition-all sm:duration-300 sm:hover:border-gray-600 sm:h-full sm:hover:scale-105"
                  >
                    {/* Mobile: Horizontal Layout, Desktop: Vertical Layout */}
                    <div className="flex flex-row sm:flex-col">
                      {/* Image Section with Badges */}
                      <div className="mobile-image-container sm:relative sm:w-full sm:h-44 md:h-48 lg:h-52 xl:h-56 sm:rounded-t-2xl sm:overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg sm:rounded-t-2xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-lg sm:rounded-t-2xl">
                            <Utensils className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Active Badge - Top Left */}
                        <div className="absolute top-2 left-2">
                          <span className="mobile-badge bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Active
                          </span>
                        </div>

                        {/* VEG/NON-VEG Badge - Below Active Badge */}
                        <div className="absolute top-8 left-2">
                          <span
                            className={`mobile-badge text-white text-xs px-2 py-1 rounded-full font-medium ${
                              item.isVeg ? "bg-green-500" : "bg-pink-500"
                            }`}
                          >
                            {item.isVeg ? "VEG" : "NON-VEG"}
                          </span>
                        </div>
                      </div>

                      {/* Content Section - Directly adjacent to image with no gap */}
                      <div className="mobile-content sm:flex sm:flex-col sm:flex-1 sm:p-3 sm:md:p-4 sm:bg-gray-800 sm:rounded-b-2xl">
                        <div className="flex flex-col gap-1 mb-2 sm:mb-3">
                          <span className="mobile-title sm:font-bold sm:text-lg sm:md:text-xl sm:text-white sm:line-clamp-2">
                            {item.name?.toUpperCase()}
                          </span>
                          <div className="mobile-subtitle sm:text-gray-300 sm:text-sm sm:leading-relaxed">
                            {item.description ? (
                              <TruncatedText
                                text={item.description}
                                maxLines={2}
                                className="text-gray-200 font-normal"
                              />
                            ) : (
                              <span className="text-gray-400 font-medium uppercase tracking-wide">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="mobile-price sm:font-bold sm:text-orange-500 sm:text-lg sm:md:text-xl">
                            ₹{item.price}
                          </span>
                          {isInCart && (
                            <span className="text-green-400 text-xs sm:text-sm font-medium">
                              In Cart
                            </span>
                          )}
                        </div>

                        {/* Modern Add to Cart / Quantity Selector */}
                        <div className="w-full">
                          {isInCart ? (
                            /* Quantity Selector - Show when item is in cart */
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between bg-gray-700 rounded-lg sm:rounded-xl border border-gray-600 p-1 sm:p-1.5 shadow-lg quantity-selector"
                            >
                              {/* Minus Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (quantity > 1) {
                                    dispatch(decrementQuantity(item._id));
                                  } else {
                                    dispatch(removeFromCart(item._id));
                                    toast.success(
                                      `${item.name} removed from cart`
                                    );
                                  }
                                }}
                                className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cart-button group overflow-hidden"
                              >
                                <Minus size={14} className="sm:w-4 sm:h-4" />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                              </motion.button>

                              {/* Quantity Display */}
                              <div className="flex-1 mx-2 sm:mx-3">
                                <span className="text-white text-sm sm:text-base md:text-lg font-bold text-center block">
                                  {quantity}
                                </span>
                              </div>

                              {/* Plus Button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  dispatch(incrementQuantity(item._id))
                                }
                                className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cart-button group overflow-hidden"
                              >
                                <Plus size={14} className="sm:w-4 sm:h-4" />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                              </motion.button>
                            </motion.div>
                          ) : (
                            /* Add to Cart Button - Show when item is not in cart */
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                dispatch(addToCart(item));
                                toast.success(`${item.name} added to cart`);
                              }}
                              className="mobile-button sm:relative sm:w-full sm:bg-red-600 sm:hover:bg-red-700 sm:text-white sm:rounded-full sm:py-3 sm:font-bold sm:flex sm:items-center sm:justify-center sm:gap-2 sm:transition-all sm:duration-300 sm:shadow-md sm:hover:shadow-lg sm:active:scale-95 sm:text-base sm:cart-button sm:group sm:overflow-hidden"
                            >
                              <Plus size={16} className="sm:w-5 sm:h-5" />
                              <span>Add to Cart</span>
                              {/* Ripple effect */}
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
                              {/* Shimmer effect */}
                              <div className="absolute inset-0 -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer transition-opacity duration-500 rounded-full"></div>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Custom CSS for range sliders and responsive utilities */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          word-break: break-word;
        }

        /* Enhanced text truncation styles */
        .truncated-text {
          position: relative;
          line-height: 1.4;
        }

        .truncated-text.expanded {
          max-height: none !important;
          overflow: visible !important;
        }

        .truncated-text.collapsed {
          max-height: 2.8em;
          overflow: hidden;
        }

        /* Responsive grid adjustments */
        @media (max-width: 640px) {
          .grid {
            gap: 0.75rem;
          }

          /* Better touch targets for mobile */
          .cart-button {
            min-height: 44px;
            min-width: 44px;
          }

          /* Improved mobile card spacing */
          .quantity-selector {
            min-height: 44px;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .grid {
            gap: 1rem;
          }
        }

        @media (min-width: 1025px) {
          .grid {
            gap: 1.5rem;
          }
        }

        /* Enhanced button interactions */
        .cart-button {
          position: relative;
          overflow: hidden;
        }

        .cart-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .cart-button:hover::before {
          left: 100%;
        }

        /* Smooth quantity selector transitions */
        .quantity-selector {
          backdrop-filter: blur(10px);
          background: rgba(55, 65, 81, 0.9);
        }

        /* Touch-friendly button sizing for mobile */
        @media (max-width: 640px) {
          .cart-button {
            min-height: 36px;
            min-width: 36px;
          }

          /* Mobile card styling to match the image design */
          .mobile-card {
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: row;
            align-items: stretch;
          }

          /* Mobile badge styling - Pill shapes */
          .mobile-badge {
            border-radius: 20px;
            font-weight: 600;
            font-size: 10px;
            padding: 4px 8px;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          /* Mobile image container */
          .mobile-image-container {
            width: 150px;
            height: 100%;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
            border-radius: 12px 0 0 12px;
          }

          /* Mobile content area - Remove any margin/padding that creates gap */
          .mobile-content {
            flex: 1;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 0;
            border-radius: 0 12px 12px 0;
          }

          /* Mobile title styling - 18px, bold, capitalized */
          .mobile-title {
            font-size: 18px;
            font-weight: bold;
            color: white;
            line-height: 1.2;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          /* Mobile subtitle styling - 14px, better typography */
          .mobile-subtitle {
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 8px;
            display: block;
          }

          /* Mobile price styling - Orange, bold, 16px */
          .mobile-price {
            font-size: 16px;
            font-weight: bold;
            color: #ff9800;
            margin-bottom: 12px;
          }

          /* Mobile button styling - Red, fully rounded, white text with icon */
          .mobile-button {
            background: #e53935;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 16px;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .mobile-button:hover {
            background: #d32f2f;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .mobile-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .mobile-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            transition: left 0.5s;
          }

          .mobile-button:hover::before {
            left: 100%;
          }
        }

        /* Shimmer animation */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }

        /* Enhanced button glow effect */
        .cart-button:hover {
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
        }

        /* Desktop card styling */
        @media (min-width: 640px) {
          .mobile-card {
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .mobile-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: #4b5563;
          }

          .mobile-image-container {
            width: 100%;
            height: 176px;
            position: relative;
            overflow: hidden;
            border-radius: 16px 16px 0 0;
          }

          .mobile-content {
            padding: 16px;
            background: #1f2937;
            border-radius: 0 0 16px 16px;
          }

          .mobile-title {
            font-size: 18px;
            font-weight: bold;
            color: white;
            line-height: 1.2;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          .mobile-subtitle {
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 8px;
            display: block;
          }

          .mobile-price {
            font-size: 16px;
            font-weight: bold;
            color: #ff9800;
            margin-bottom: 12px;
          }

          .mobile-button {
            background: #e53935;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 12px 20px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .mobile-button:hover {
            background: #d32f2f;
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
          }
        }

        /* Smooth transitions for all interactive elements */
        .cart-button,
        .quantity-selector button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default CanteenMenuPage;
