import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, Utensils, Store } from "lucide-react";
import { Link } from "react-router-dom";

// Simple Modal Component
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function GlobalSearch({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Debounce search
  useEffect(() => {
    if (!query) {
      setResults({});
      setError("");
      return;
    }
    setLoading(true);
    const handler = setTimeout(() => {
      axios
        .get(`/api/v1/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data.results || {});
          setError("");
        })
        .catch(() => setError("Something went wrong."))
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={() => onOpenChange(false)}>
      {/* Search Input */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items, dishes, or canteens..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : query && Object.keys(results).length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No results found.
          </div>
        ) : (
          Object.entries(results).map(([type, items]) => (
            <div key={type} className="mb-6">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 capitalize flex items-center gap-2">
                {type === "canteen" ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <Utensils className="w-4 h-4" />
                )}
                {type}s
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={getResultLink(item)}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                      onClick={() => onOpenChange(false)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        {item.type === "canteen" && item.location && (
                          <span className="text-sm text-gray-400">
                            {item.location}
                          </span>
                        )}
                      </div>
                      {item.type === "item" && item.price && (
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                          ₹{item.price}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

// Utility function
function getResultLink(item) {
  if (item.type === "item" || item.type === "dish") return `/menu/${item._id}`;
  if (item.type === "canteen") return `/menu/${item._id}`;
  return "#";
}
