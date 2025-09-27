import React, { useState, useCallback, memo } from "react";
import { Edit, Leaf, Trash2, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/Switch";
import { UpdateItemStatus } from "../../../../services/operations/Menu";
import { useSelector } from "react-redux";

/**
 * Props:
 * - item: menu item object with fields:
 *    _id, name, description, price, category,
 *    image, available, isVeg, isReady
 * - onEdit: function(item)
 * - onDelete: function(itemId)
 * - onToggleReady: function(itemId, newReadyStatus)
 */
const MenuItemCard = memo(({ item, onEdit, onDelete, onToggleReady }) => {
  const [currentItem, setCurrentItem] = useState(item);
  const [togglingReady, setTogglingReady] = useState(false);
  const { token } = useSelector((state) => state.Auth);
  // Handle ready toggle\

  const handleToggleReady = useCallback(async () => {
    if (togglingReady) return;
    setTogglingReady(true);

    try {
      // Placeholder — plug actual API logic later
      const updated = { ...currentItem, isReady: !currentItem.isReady };
      const result = await UpdateItemStatus(currentItem._id, updated, token);
      setCurrentItem(result);
      if (onToggleReady) {
        onToggleReady(currentItem?._id, updated.isReady);
      }
    } finally {
      setTogglingReady(false);
    }
  }, [currentItem, togglingReady, onToggleReady]);

  const handleEdit = useCallback(() => {
    if (onEdit) onEdit(currentItem);
  }, [onEdit, currentItem]);

  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(currentItem?._id);
  }, [onDelete, currentItem]);

  // Dynamic CSS classes
  const cardClassName = `group relative overflow-hidden bg-white border-0 shadow-lg rounded-2xl transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 ${
    currentItem?.available === false
      ? "opacity-75 ring-2 ring-red-100"
      : "hover:ring-2 hover:ring-indigo-100"
  }`;

  const imageClassName = `w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
    currentItem?.available === false ? "grayscale saturate-50" : ""
  }`;

  const availabilityBadgeClass = `inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-xl backdrop-blur-sm border ${
    currentItem?.available !== false
      ? "bg-emerald-500/90 text-white border-emerald-400/50"
      : "bg-red-500/90 text-white border-red-400/50"
  }`;

  const vegBadgeClass = `inline-flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-xl backdrop-blur-sm border ${
    currentItem?.isVeg
      ? "bg-green-500/90 text-white border-green-400/50"
      : "bg-orange-500/90 text-white border-orange-400/50"
  }`;

  const readyBadgeClass = `inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl backdrop-blur-sm border ${
    currentItem?.isReady
      ? "bg-emerald-500/90 text-white border-emerald-400/50"
      : "bg-amber-500/90 text-white border-amber-400/50"
  }`;

  return (
    <Card className={cardClassName}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-slate-100/10 pointer-events-none" />

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-slate-100">
        <div className="aspect-[3/2] relative">
          <img
            src={currentItem?.image || "/placeholder.svg"}
            alt={currentItem?.name}
            className={imageClassName}
            loading="lazy"
            decoding="async"
          />
          {/* Top-to-Bottom Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Badges */}
        <div className="absolute inset-0 p-3">
          <div className="flex justify-between items-start">
            <span className={availabilityBadgeClass}>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  currentItem.available !== false
                    ? "bg-emerald-200"
                    : "bg-red-200"
                }`}
              />
              {currentItem.available !== false ? "Available" : "Unavailable"}
            </span>

            <span className={vegBadgeClass}>
              <Leaf
                className={`w-2.5 h-2.5 ${
                  !currentItem.isVeg ? "rotate-180" : ""
                }`}
              />
              {currentItem.isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className={readyBadgeClass}>
              {currentItem.isReady ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Preparing
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="relative p-4 space-y-3">
        {/* Title and Description */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-1 group-hover:text-indigo-700 transition-colors duration-300">
            {currentItem.name}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {currentItem.description ||
              "Delicious item crafted with care and quality ingredients"}
          </p>
        </div>

        {/* Price + Category */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">
            ₹{currentItem.price}
          </span>
          <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg capitalize">
            {currentItem.category}
          </span>
        </div>

        {/* Ready Status Toggle */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentItem.isReady
                  ? "bg-emerald-500 shadow-emerald-200"
                  : "bg-amber-500 shadow-amber-200"
              }`}
            />
            <span className="text-xs font-medium text-slate-700">
              {currentItem.isReady ? "Ready to serve" : "Mark when ready"}
            </span>
          </div>

          <Switch
            checked={currentItem.isReady || false}
            onCheckedChange={handleToggleReady}
            disabled={togglingReady}
            className={`transition-all duration-200 ${
              togglingReady
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 bg-blue-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 font-medium rounded-lg text-xs"
            onClick={handleEdit}
          >
            <Edit className="w-3 h-3 mr-1.5" />
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 font-medium rounded-lg text-xs"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3 mr-1.5" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default MenuItemCard;
