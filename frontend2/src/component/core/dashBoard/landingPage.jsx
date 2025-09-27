import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  Wallet,
  Menu,
  Users,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import apiConnector from "../../../services/apiConnector";
import { OrderApi } from "../../../services/api";
import { payoutsapi } from "../../../services/api";

// --- StatCard Component ---
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor,
  iconColor,
  trend,
  loading,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          ) : (
            value
          )}
        </p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="mt-2">{trend}</div>
    </div>
  </div>
);

// --- QuickAction Component ---
const QuickAction = ({
  title,
  description,
  icon: Icon,
  bgColor,
  iconBg,
  onClick,
  loading,
}) => (
  <div
    className={`p-6 rounded-2xl border-2 border-transparent ${bgColor} hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={!loading ? onClick : undefined}
  >
    <div className="flex flex-col items-center text-center">
      <div
        className={`p-4 rounded-2xl ${iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// --- WaveBackground Component ---
const WaveBackground = memo(() => (
  <div className="absolute bottom-0 left-0 right-0">
    <svg
      viewBox="0 0 1440 120"
      className="w-full h-auto"
      preserveAspectRatio="none"
    >
      <path
        fill="rgb(248 250 252)"
        d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
      />
    </svg>
  </div>
));

// --- Main OverviewTab Component ---
const OverviewTab = memo(({ menuItems = [] }) => {
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.Auth);
  const { canteenId } = useSelector((state) => state.Canteen);

  // --- API Calls ---
  const getCanteenOrders = async (token) => {
    try {
      const response = await apiConnector(
        OrderApi.GetCanteenAllOrders,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Error at overview");
    }
  };

  const getBalance = async (token) => {
    try {
      const response = await apiConnector(
        payoutsapi.getBalanceApi,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data.balance;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error at overview");
    }
  };

  // --- Fetch Dashboard Data ---
  const fetchDashboardData = useCallback(async () => {
    if (!token || !canteenId) return;

    setLoading(true);
    try {
      const ordersRes = await getCanteenOrders(token);
      const balanceRes = await getBalance(token);

      setOrders(ordersRes || []);
      setBalance(balanceRes.balance ?? 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [token, canteenId]);

  // --- Enhanced Stats ---
  const enhancedStats = useMemo(() => {
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return [
      {
        title: "Total Orders",
        value: totalOrders,
        subtitle: "All time orders",
        icon: ShoppingCart,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        trend: <TrendingUp className="w-4 h-4 text-green-500" />,
      },
      {
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString()}`,
        subtitle: "Lifetime earnings",
        icon: DollarSign,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-600",
        trend: <TrendingUp className="w-4 h-4 text-green-500" />,
      },
      {
        title: "Available Balance",
        value: `₹${balance.toLocaleString()}`,
        subtitle: "Ready for payout",
        icon: Wallet,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        trend: <Users className="w-4 h-4 text-blue-500" />,
      },
      {
        title: "Pending Orders",
        value: pendingOrders,
        subtitle: "Need attention",
        icon: Clock,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-600",
        trend: (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-amber-600">
              {pendingOrders > 0 ? "Active" : "None"}
            </span>
          </div>
        ),
      },
    ];
  }, [orders, balance]);

  // --- Quick Actions ---
  const quickActions = [
    {
      title: "Manage Menu",
      description: `${menuItems.length} items in menu`,
      icon: Menu,
      bgColor: "bg-blue-50 hover:bg-blue-100",
      iconBg: "bg-blue-500 hover:bg-blue-600",
      onClick: () => {
        window.location.hash = "#menu";
        toast.success("Navigating to menu management...");
      },
    },
    {
      title: "View Orders",
      description: `${
        orders.filter((o) => o.status === "pending").length
      } pending orders`,
      icon: ShoppingCart,
      bgColor: "bg-green-50 hover:bg-green-100",
      iconBg: "bg-green-500 hover:bg-green-600",
      onClick: () => {
        window.location.hash = "#orders";
        toast.success("Navigating to orders...");
      },
    },
    {
      title: "View Payouts",
      description: `₹${balance.toLocaleString()} available`,
      icon: DollarSign,
      bgColor: "bg-purple-50 hover:bg-purple-100",
      iconBg: "bg-purple-500 hover:bg-purple-600",
      onClick: () => {
        window.location.hash = "#payouts";
        toast.success("Navigating to payouts...");
      },
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 lg:py-20 xl:py-24 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-white/25 backdrop-blur-sm rounded-full text-xs sm:text-sm lg:text-base font-semibold relative z-20 border border-white/30 shadow-lg">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 text-white" />
                <span className="text-white">Campus Vendor Partner</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-white relative z-20 drop-shadow-2xl tracking-tight px-2">
                Dashboard Overview
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-white/95 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 relative z-20 drop-shadow-lg font-medium">
                Welcome back! Here's a comprehensive view of your canteen's
                performance and key metrics.
              </p>
            </div>
          </div>
        </div>
        <WaveBackground />
      </div>

      {/* Stats + Quick Actions */}
      <div className="relative -mt-4 sm:-mt-8 px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {enhancedStats.map((stat, index) => (
              <StatCard key={index} {...stat} loading={loading} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Quick Actions
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your canteen efficiently with these shortcuts
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} loading={loading} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OverviewTab.displayName = "OverviewTab";
export default OverviewTab;
