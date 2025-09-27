import React, { memo, useMemo, useCallback } from "react";

/**
 * MenuItemFilters Component
 * Provides search input, status filter, ready filter, category filter
 * with counts for each option.
 *
 * Props:
 * - searchTerm, setSearchTerm
 * - statusFilter, setStatusFilter
 * - categoryFilter, setCategoryFilter
 * - readyFilter, setReadyFilter
 * - menuItems: array of menu item objects
 * - categories: array of category names
 */
const MenuItemFilters = memo(
  ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    readyFilter,
    setReadyFilter,
    menuItems,
    categories,
  }) => {
    // Calculate filter counts
    const filterCounts = useMemo(() => {
      const total = menuItems.length;
      const active = menuItems.filter(
        (i) => i && ("available" in i ? i.available : true)
      ).length;
      const inactive = menuItems.filter(
        (i) => i && ("available" in i ? !i.available : false)
      ).length;
      const ready = menuItems.filter((i) => i && i.isReady === true).length;
      const notReady = menuItems.filter((i) => i && i.isReady === false).length;

      return { total, active, inactive, ready, notReady };
    }, [menuItems]);

    // Handlers
    const handleSearchChange = useCallback(
      (e) => {
        setSearchTerm(e.target.value);
      },
      [setSearchTerm]
    );

    const handleStatusChange = useCallback(
      (e) => {
        setStatusFilter(e.target.value);
      },
      [setStatusFilter]
    );

    const handleReadyChange = useCallback(
      (e) => {
        setReadyFilter(e.target.value);
      },
      [setReadyFilter]
    );

    const handleCategoryChange = useCallback(
      (e) => {
        setCategoryFilter(e.target.value);
      },
      [setCategoryFilter]
    );

    // Default static category options
    const staticCategories = useMemo(
      () => [
        "snacks",
        "salads",
        "soups",
        "breads",
        "beverages",
        "desserts",
        "others",
      ],
      []
    );

    return (
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/3 mb-2 md:mb-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search menu items by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
            autoComplete="off"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 mr-2"
        >
          <option value="all">All Items ({filterCounts.total})</option>
          <option value="active">Active Items ({filterCounts.active})</option>
          <option value="inactive">
            Inactive Items ({filterCounts.inactive})
          </option>
        </select>

        {/* Ready Status Filter */}
        <select
          value={readyFilter}
          onChange={handleReadyChange}
          className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700 mr-2"
        >
          <option value="all">All Ready Status</option>
          <option value="ready">Ready Items ({filterCounts.ready})</option>
          <option value="not-ready">
            Not Ready Items ({filterCounts.notReady})
          </option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
          {staticCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default MenuItemFilters;
