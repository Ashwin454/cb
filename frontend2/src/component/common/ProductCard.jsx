import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Check, Leaf, MapPin, Star } from "lucide-react";

export default function ProductCard({ item, canteenId }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      id: item.id.toString(), // Convert number to string
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
      canteenId: canteenId, // Use the canteenId prop
    });

    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your cart`,
    });

    setQuantity(1); // Reset quantity after adding
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      setQuantity(newQuantity);
    }
  };

  // Determine if item is non-veg based on category or name
  const isNonVeg =
    item.category?.toLowerCase().includes("non-veg") ||
    item.category?.toLowerCase().includes("nonveg") ||
    item.name?.toLowerCase().includes("chicken") ||
    item.name?.toLowerCase().includes("mutton") ||
    item.name?.toLowerCase().includes("fish") ||
    item.name?.toLowerCase().includes("egg");

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-80 w-64">
      {/* Image Section */}
      <div className="relative w-full h-48 flex-shrink-0">
        <img
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Status Badges Overlay */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <Check className="h-3 w-3" />
            Ready Now!
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          {isNonVeg ? (
            <Badge className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              NON-VEG
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              <Leaf className="h-3 w-3" />
              Veg
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-gray-800">
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-300 text-sm mb-2">
            <MapPin className="h-4 w-4" />
            <span>anjali sharma's Canteen</span>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-orange-500 font-bold text-lg">
              ₹{item.price.toFixed(0)}
            </div>
            <Badge className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Star className="h-3 w-3" />
              5.0
            </Badge>
          </div>

          {/* Category Tag */}
          <div className="mb-3">
            <Badge className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
              {item.category || "General"}
            </Badge>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!item.isAvailable || item.stock === 0}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg transition-all duration-200"
        >
          {!item.isAvailable || item.stock === 0 ? "Out of Stock" : "Add"}
        </Button>
      </div>
    </div>
  );
}
