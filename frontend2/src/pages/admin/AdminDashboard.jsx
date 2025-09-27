import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../component/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import { Label } from "../../component/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../component/ui/select";
import { Input } from "../../component/ui/input";
import {AdminApi} from "../../services/api"
import { CheckCircle, XCircle, Ban, ShieldCheck, UserX, UserCheck, Clock, Store, Mail, Phone, MapPin, FileText, Users, TrendingUp, BarChart3, ShoppingCart, Crown, Star, Activity, DollarSign, Award } from "lucide-react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {useSelector} from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  BarElement,
  ArcElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, BarElement, ArcElement, ChartDataLabels, Tooltip);

// Animation styles (converted from Framer Motion to CSS)
const animationStyles = {
  fadeIn: { animation: 'fadeIn 0.6s ease-in-out forwards' },
  slideUp: { animation: 'slideUp 0.5s ease-out forwards' },
  scaleIn: { animation: 'scaleIn 0.4s ease-out forwards' },
  staggerChildren: { animation: 'staggerFadeIn 0.1s ease-out forwards' }
};

// CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes staggerFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
.hover-rotate {
  transition: transform 0.3s ease;
}
.hover-rotate:hover {
  transform: rotate(5deg) scale(1.05);
}
.group-hover-scale {
  transition: transform 0.3s ease;
}
.group:hover .group-hover-scale {
  transform: scale(1.1);
}
`;
document.head.appendChild(styleSheet);

// Use the exact AdminApi endpoints you provided
const AdminAnalytics = AdminApi;

// CountUp component for animated numbers
function CountUp({ end, duration = 1.2, className = "", decimals = 0 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = (end - start) / (duration * 60);
    let frame;
    function animate() {
      start += increment;
      if (start < end) {
        setValue(parseFloat(start.toFixed(decimals)));
        frame = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [end, duration, decimals]);
  return <span className={className}>{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

export default function AdminDashboard() {
  // State variables (using logic from second page)
  const {token}=useSelector(state=>state.Auth)
  const [summary, setSummary] = useState(null);
  const [usersMonthly, setUsersMonthly] = useState([]);
  const [ordersMonthly, setOrdersMonthly] = useState([]);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [revenueWeekly, setRevenueWeekly] = useState([]);
  const [revenueMonthly, setRevenueMonthly] = useState([]);
  const [totalRevenueValue, setTotalRevenueValue] = useState(0);
  const [dailyRevenueValue, setDailyRevenueValue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [peakOrderTimes, setPeakOrderTimes] = useState([]);
  const [revenueByPaymentMethod, setRevenueByPaymentMethod] = useState([]);
  const [suspectedUsers, setSuspectedUsers] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
  const [topSpenders, setTopSpenders] = useState([]);
  const [topCanteens, setTopCanteens] = useState([]);
  const [topCampusesByRevenue, setTopCampusesByRevenue] = useState([]);
  const [revenueByCampusCanteen, setRevenueByCampusCanteen] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [canteenActionLoading, setCanteenActionLoading] = useState({});

  // Vendor rating states
  const [selectedCanteenForRating, setSelectedCanteenForRating] = useState("");
  const [vendorRating, setVendorRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Toast replacement (replacing Next.js useToast)
  const toast = (msg) => {
    const message = typeof msg === 'string' ? msg : 
      msg.title + (msg.description ? ": " + msg.description : "");
    alert(message);
  };

  // API helper function (from second page)
  const handleApiResponse = (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return response.data;
  };

  // Fetch users by role (from second page logic)
  const fetchUsersByRole = async () => {
    try {
      const response = await axios.get(AdminAnalytics.usersByRoleListApi);
      const data = handleApiResponse(response);
      const combined = [
        ...(data.students || []).map((u) => ({ ...u, role: 'student' })),
        ...(data.canteenOwners || []).map((u) => ({ ...u, role: 'canteen' }))
      ];
      setUsersList(combined);
    } catch (error) {
      console.error("Error fetching user list:", error);
      toast({ title: "Error", description: "Failed to fetch user list." });
    }
  };

  // Fetch pending vendors (from second page logic)
  const fetchPendingVendors = async () => {
    try {
      const response = await axios.get(AdminAnalytics.pendingVendorsApi,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      const data = handleApiResponse(response);
      setPendingVendors(data || []);
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
      setPendingVendors([]);
    }
  };

  // Fetch all canteens (from second page logic)
  const fetchAllCanteens = async () => {
    try {
      const response = await axios.get(AdminAnalytics.allCanteensApi);
      const data = handleApiResponse(response);
      setCanteens(data.canteens || data || []);
    } catch (error) {
      console.error("Error fetching canteens:", error);
    }
  };

  // Handle vendor rating (from second page logic)
  const handleRateVendor = async () => {
    if (!selectedCanteenForRating || vendorRating === 0 || vendorRating < 1 || vendorRating > 5) {
      toast({ title: "Error", description: "Please select a canteen and provide a rating between 1 and 5." });
      return;
    }

    setRatingLoading(true);
    try {
      await axios.post(AdminAnalytics.rateVendorsApi, {
        canteenId: selectedCanteenForRating,
        rating: vendorRating,
      });
      toast({ title: "Success", description: "Vendor rated successfully!" });
      setSelectedCanteenForRating("");
      setVendorRating(0);
    } catch (error) {
      console.error("Error rating vendor:", error);
      toast({ title: "Error", description: error.response?.data?.message || "Failed to rate vendor" });
    } finally {
      setRatingLoading(false);
    }
  };

  // Handle ban user (from second page logic)
  const handleBanUser = async (userId, ban) => {
    setActionLoading(l => ({ ...l, [userId]: true }));
    try {
      await axios.post(AdminAnalytics.banUserApi, { userId, ban });
      toast({ title: ban ? "User banned" : "User unbanned" });
      fetchUsersByRole();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update user status" });
    } finally {
      setActionLoading(l => ({ ...l, [userId]: false }));
    }
  };

  // Handle approve canteen (from second page logic)
  const handleApproveCanteen = async (canteenId, approved, rejectionReason = "") => {
    setCanteenActionLoading(l => ({ ...l, [canteenId]: true }));
    try {
      await axios.post(`${AdminAnalytics.approveVendorApi}/${canteenId}/approve`, {
        approved,
        rejectionReason
      });
      toast({ title: approved ? "Canteen approved" : "Canteen rejected" });
      fetchPendingVendors();
      setCanteens(prevCanteens => 
        prevCanteens.map(c => 
          c._id === canteenId ? { ...c, approvalStatus: approved ? "approved" : "rejected", isApproved: approved } : c
        )
      );
    } catch (error) {
      console.error("Error approving canteen:", error);
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update vendor status" });
    } finally {
      setCanteenActionLoading(l => ({ ...l, [canteenId]: false }));
    }
  };

  // Handle suspend canteen (from second page logic)
  const handleSuspendCanteen = async (canteenId, suspend) => {
    setCanteenActionLoading(l => ({ ...l, [canteenId]: true }));
    try {
      await axios.post(AdminAnalytics.suspendCanteenApi, { canteenId, suspend });
      toast({ title: suspend ? "Canteen suspended" : "Canteen unsuspended" });
      setCanteens(canteens => 
        canteens.map(c => c._id === canteenId ? { ...c, isSuspended: suspend } : c)
      );
    } catch (error) {
      console.error("Error suspending canteen:", error);
      toast({ title: "Error", description: error.response?.data?.message || "Failed to suspend canteen" });
    } finally {
      setCanteenActionLoading(l => ({ ...l, [canteenId]: false }));
    }
  };

  // Main data fetch effect - Updated to use your exact API endpoints
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          summaryRes,
          usersRes,
          userRolesRes,
          topSpendersRes,
          ordersRes,
          orderStatusRes,
          topCanteensRes,
          revenueDailyRes,
          revenueWeeklyRes,
          revenueMonthlyRes,
          totalRevenueRes,
          averageOrderValueRes,
          peakOrderTimesRes,
          revenueByPaymentMethodRes,
          suspectedUsersRes,
          topCampusesByRevenueRes,
          revenueByCampusCanteenRes,
          ordersByCampusCanteenRes
        ] = await Promise.all([
          axios.get(AdminAnalytics.totalsApi),
          axios.get(AdminAnalytics.monthlyUserCountApi),
          axios.get(AdminAnalytics.userCountByRoleApi),
          axios.get(AdminAnalytics.topSpendersApi),
          axios.get(AdminAnalytics.monthlyOrdersApi),
          axios.get(AdminAnalytics.orderStatusBreakdownApi),
          axios.get(AdminAnalytics.topCanteensByOrderVolumeApi,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }), // Updated to use the correct endpoint
          axios.get(AdminAnalytics.dailyRevenueApi),
          axios.get(AdminAnalytics.weeklyRevenueApi),
          axios.get(AdminAnalytics.monthlyRevenueApi),
          axios.get(AdminAnalytics.totalRevenueApi),
          axios.get(AdminAnalytics.averageOrderValueApi),
          axios.get(AdminAnalytics.peakOrderTimesApi),
          axios.get(AdminAnalytics.revenueByPaymentMethodApi),
          axios.get(AdminAnalytics.suspectedUserApi),
          axios.get(AdminAnalytics.topCampusesByRevenueApi),
          axios.get(AdminAnalytics.revenueByCampusCanteenApi),
          axios.get(AdminAnalytics.ordersByCampusCanteenApi)
        ]);

        // Process all responses (using handleApiResponse from second page)
        setSummary(handleApiResponse(summaryRes));
        setUsersMonthly(handleApiResponse(usersRes) || []);
        
        const userRolesObj = {};
        (handleApiResponse(userRolesRes) || []).forEach((item) => {
          userRolesObj[item._id] = item.count;
        });
        setUserRoles(userRolesObj);
        
        setTopSpenders(handleApiResponse(topSpendersRes) || []);
        setOrdersMonthly(handleApiResponse(ordersRes) || []);
        
        const orderStatusObj = {};
        (handleApiResponse(orderStatusRes) || []).forEach((item) => {
          orderStatusObj[item._id] = item.count;
        });
        setOrderStatus(orderStatusObj);
        
        setTopCanteens(handleApiResponse(topCanteensRes) || []);
        setRevenueDaily(handleApiResponse(revenueDailyRes) || []);
        setRevenueWeekly(handleApiResponse(revenueWeeklyRes) || []);
        setRevenueMonthly(handleApiResponse(revenueMonthlyRes) || []);
        setTotalRevenueValue(handleApiResponse(totalRevenueRes)?.totalRevenue || 0);
        setAverageOrderValue(handleApiResponse(averageOrderValueRes)?.averageOrderValue || 0);
        setPeakOrderTimes(handleApiResponse(peakOrderTimesRes) || []);
        setRevenueByPaymentMethod(handleApiResponse(revenueByPaymentMethodRes) || []);
        setTopCampusesByRevenue(handleApiResponse(topCampusesByRevenueRes) || []);
        setRevenueByCampusCanteen(handleApiResponse(revenueByCampusCanteenRes) || []);
        
        const suspectedData = handleApiResponse(suspectedUsersRes);
        setSuspectedUsers(Array.isArray(suspectedData?.data) ? suspectedData.data : suspectedData || []);

        // Calculate daily revenue
        const revenueData = handleApiResponse(revenueDailyRes) || [];
        const latestDailyRevenue = revenueData.length > 0 
          ? revenueData.sort((a, b) => (b._id || b.date).localeCompare(a._id || a.date))[0]?.revenue || 0
          : 0;
        setDailyRevenueValue(latestDailyRevenue);

        // Calculate total orders
        const ordersData = handleApiResponse(ordersByCampusCanteenRes) || [];
        const total = ordersData.reduce((sum, item) => sum + (item.totalOrders || 0), 0);
        setTotalOrders(total);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast({ title: "Data Fetch Error", description: "Failed to load dashboard data." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchUsersByRole();
    fetchPendingVendors();
    fetchAllCanteens();
  }, []);

  // Chart data configurations (keeping from first page but using second page data)
  const usersChartData = {
    labels: usersMonthly.map((u) => u._id || 'Unknown'),
    datasets: [{
      label: "New Users",
      data: usersMonthly.map((u) => u.count),
      borderColor: "#fff",
      backgroundColor: "#f87171",
      borderWidth: 3,
    }],
  };

  const ordersChartData = {
    labels: ordersMonthly.map((o) => o._id || 'Unknown'),
    datasets: [{
      label: "Orders",
      data: ordersMonthly.map((o) => o.count),
      borderColor: "#fff",
      backgroundColor: "#60a5fa",
      borderWidth: 3,
    }],
  };

  const orderStatusChartData = orderStatus ? {
    labels: Object.keys(orderStatus),
    datasets: [{
      label: "Order Status",
      data: Object.values(orderStatus),
      backgroundColor: ["#fbbf24", "#34d399", "#f87171", "#a78bfa"],
      borderColor: "#fff",
      borderWidth: 3,
    }],
  } : { labels: [], datasets: [] };

  const userRolesChartData = userRoles ? {
    labels: Object.keys(userRoles),
    datasets: [{
      label: "User Roles",
      data: Object.values(userRoles),
      backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"],
      borderColor: "#fff",
      borderWidth: 3,
    }],
  } : { labels: [], datasets: [] };

  const revenueByPaymentMethodChartData = {
    labels: revenueByPaymentMethod.map((item) => item.paymentMethod),
    datasets: [{
      label: "Revenue",
      data: revenueByPaymentMethod.map((item) => item.totalRevenue),
      backgroundColor: ["#34d399", "#fbbf24", "#a78bfa", "#f87171"],
      borderColor: "#fff",
      borderWidth: 3,
    }],
  };

  const totalCanteenOrders = topCanteens.reduce((sum, c) => sum + (c.totalOrders || c.count || c.orderCount || 0), 0);
  const topCanteensChartData = {
    labels: topCanteens.map((c) => c.name || c.canteenName),
    datasets: [{
      label: "Order Volume (%)",
      data: topCanteens.map((c) => {
        const value = c.totalOrders || c.count || c.orderCount || 0;
        return totalCanteenOrders > 0 ? (value / totalCanteenOrders) * 100 : 0;
      }),
      backgroundColor: "#ef4444",
      borderColor: "#fff",
      borderWidth: 3,
    }],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2d4a6b]">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // Main return using exact UI structure from first page but with second page logic
  return (
    <div className="min-h-screen p-6 bg-white/80 dark:bg-gradient-to-br dark:from-[#0a192f] dark:via-[#1e3a5f] dark:to-[#2d4a6b] transition-colors duration-500">
      <div className="relative z-10 max-w-7xl mx-auto p-6" style={animationStyles.fadeIn}>
        {/* Header - keeping exact structure from first page */}
        <div className="mb-12" style={animationStyles.slideUp}>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/20 hover-rotate">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-xl text-slate-300">Monitor and manage your campus food ecosystem</p>
            </div>
          </div>
          
          {/* Enhanced Stats Cards - keeping exact UI from first page */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-8 mb-12">
            {summary && typeof summary.totalUsers !== 'undefined' && (
              <div style={animationStyles.scaleIn} className=" w-full">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-red-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg text-slate-300 font-bold uppercase tracking-wider mb-2">Total Users</p>
                        <p className="text-3xl font-bold text-white">{summary.totalUsers.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-green-400 text-sm font-medium">+12% this month</span>
                        </div>
                      </div>
                      <div className="w-16 h-11 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover-scale">
                        <Users className="w-8 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {summary && typeof summary.totalCanteens !== 'undefined' && (
              <div style={animationStyles.scaleIn} className=" w-full">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-red-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg text-slate-300 font-bold uppercase tracking-wider mb-2">Total Canteens</p>
                        <p className="text-3xl font-bold text-white">{summary.totalCanteens.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-green-400 text-sm font-medium">+8% this month</span>
                        </div>
                      </div>
                      <div className="w-16 h-11 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover-scale">
                        <Store className="w-8 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {typeof totalOrders !== 'undefined' && (
              <div style={animationStyles.scaleIn} className=" w-full">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg text-slate-300 font-bold uppercase tracking-wider mb-2">Total Orders</p>
                        <p className="text-3xl font-bold text-white"><CountUp end={totalOrders} /></p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-green-400 text-sm font-medium">Monthly order volume</span>
                        </div>
                      </div>
                      <div className="w-16 h-11 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center group-hover-scale">
                        <ShoppingCart className="w-8 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {typeof totalRevenueValue !== 'undefined' && (
              <div style={animationStyles.scaleIn} className=" w-full">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-yellow-500/30 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg text-slate-300 font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                        <p className="text-3xl font-bold text-white">₹<CountUp end={totalRevenueValue} /></p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-green-400 text-sm font-medium">Cumulative earnings</span>
                        </div>
                      </div>
                      <div className="mx-3 w-24 h-11 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover-scale">
                        <DollarSign className="w-8 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {typeof averageOrderValue !== 'undefined' && (
              <div style={animationStyles.scaleIn} className=" w-full">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-cyan-500/30 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg text-slate-300 font-bold uppercase tracking-wider mb-2">Avg. Order Value</p>
                        <p className="text-3xl font-bold text-white">₹<CountUp end={averageOrderValue} decimals={2} /></p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                          <span className="text-red-400 text-sm font-medium">Avg. value per order</span>
                        </div>
                      </div>
                      <div className="mx-2 w-20 h-11 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover-scale">
                        <Award className="w-8 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Hero Cards - keeping exact structure from first page */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div style={animationStyles.scaleIn}>
              <Card className="bg-gradient-to-br from-purple-500/80 to-violet-400/80 shadow-2xl border-0 rounded-2xl flex items-center justify-center h-full">
                <CardContent className="flex flex-col items-center justify-center h-72 w-full">
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="flex items-center justify-center mb-4">
                      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 shadow-lg">
                        <DollarSign className="w-10 h-10 text-black drop-shadow-lg" />
                      </span>
                    </div>
                    <span className="text-4xl font-extrabold text-black mb-2">Daily Revenue</span>
                    <span className="text-3xl font-bold text-black">₹<CountUp end={dailyRevenueValue} decimals={2} /></span>
                    <div className="flex items-center mt-4 text-black">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      <span className="text-base font-medium">Today's Earnings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {topSpenders.length > 0 && (
              <div style={animationStyles.scaleIn}>
                <Card className="bg-gradient-to-br from-red-500/80 to-red-500/80 shadow-2xl border-0 rounded-2xl flex items-center justify-center h-full">
                  <CardContent className="flex flex-col items-center justify-center h-72 w-full">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="flex items-center justify-center mb-4">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 shadow-lg">
                          <Crown className="w-10 h-10 text-black drop-shadow-lg" />
                        </span>
                      </div>
                      <span className="text-4xl font-extrabold text-black mb-2">Top Spender</span>
                      <span className="text-3xl font-bold text-black">{topSpenders[0].name || topSpenders[0].username}</span>
                      <span className="text-xl font-medium text-black mt-2">₹<CountUp end={topSpenders[0].amount || topSpenders[0].totalSpent} decimals={2} /></span>
                      <div className="flex items-center mt-4 text-black">
                        <Star className="w-5 h-5 mr-2" />
                        <span className="text-base font-medium">Highest Spending User</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Charts Grid - keeping exact structure but using second page data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">New Users</h3>
                      <p className="text-slate-400 text-sm">Monthly growth trend</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '300px' }} className="flex items-center justify-center h-full">
                    {usersMonthly.length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div> : 
                      <Line 
                        data={usersChartData} 
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          elements: { line: { borderColor: '#fff', borderWidth: 4 }, point: { backgroundColor: '#fff', radius: 6 } },
                          scales: {
                            x: {
                              ticks: { color: '#fff', font: { size: 16, weight: 'bold' } },
                              grid: { color: 'rgba(0,0,0,0.3)' },
                            },
                            y: {
                              ticks: { color: '#fff', font: { size: 16, weight: 'bold' } },
                              grid: { color: 'rgba(0,0,0,0.3)' },
                              suggestedMin: 0,
                            },
                          },
                          layout: { padding: 24 },
                        }}
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Orders</h3>
                      <p className="text-slate-400 text-sm">Monthly order volume</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '300px' }} className="flex items-center justify-center h-full">
                    {ordersMonthly.length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div> : 
                      <Line 
                        data={ordersChartData} 
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          elements: { line: { borderColor: '#fff', borderWidth: 4 }, point: { backgroundColor: '#fff', radius: 6 } },
                          scales: {
                            x: {
                              ticks: { color: '#fff', font: { size: 16, weight: 'bold' } },
                              grid: { color: 'rgba(0,0,0,0.3)' },
                            },
                            y: {
                              ticks: { color: '#fff', font: { size: 16, weight: 'bold' } },
                              grid: { color: 'rgba(0,0,0,0.3)' },
                              suggestedMin: 0,
                            },
                          },
                          layout: { padding: 24 },
                        }}
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Top Canteens by Orders</h3>
                      <p className="text-slate-400 text-sm">Canteens with highest order volume</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '300px' }} className="flex items-center justify-center h-full">
                    {topCanteens.length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div> : 
                      <Bar 
                        data={topCanteensChartData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return context.parsed.y.toFixed(1) + '%';
                                }
                              }
                            }
                          },
                          scales: {
                            x: {
                              ticks: { color: '#fff', font: { weight: 'bold' } },
                              grid: { color: 'rgba(255,255,255,0.1)' },
                            },
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                color: '#fff',
                                callback: function(tickValue) { return tickValue + '%'; },
                              },
                              grid: { color: 'rgba(255,255,255,0.1)' },
                            },
                          },
                        }} 
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pie Charts - keeping exact structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Order Status</h3>
                      <p className="text-slate-400 text-sm">Distribution breakdown</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center w-full" style={{ height: '340px', width: '340px', margin: '0 auto' }}>
                    {!orderStatus || Object.keys(orderStatus).length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div> : 
                      <Pie 
                        data={orderStatusChartData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { color: '#fff', font: { size: 14, weight: 'bold' } },
                            },
                            datalabels: {
                              color: '#111',
                              font: { size: 22, weight: 'bold' },
                              formatter: (value, ctx) => {
                                const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = (value * 100 / sum).toFixed(1) + '%';
                                return percentage;
                              },
                            },
                          },
                        }}
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Revenue by Payment Method</h3>
                      <p className="text-slate-400 text-sm">Breakdown of revenue sources</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center w-full" style={{ height: '340px', width: '340px', margin: '0 auto' }}>
                    {!revenueByPaymentMethod || revenueByPaymentMethod.length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No payment data available</div> : 
                      <Pie 
                        data={revenueByPaymentMethodChartData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { color: '#fff', font: { size: 14, weight: 'bold' } },
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.raw;
                                  return `${label}: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                              }
                            }
                          },
                        }}
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={animationStyles.scaleIn}>
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">User Roles</h3>
                      <p className="text-slate-400 text-sm">Role distribution</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center w-full" style={{ height: '340px', width: '340px', margin: '0 auto' }}>
                    {!userRoles || Object.keys(userRoles).length === 0 ? 
                      <div className="flex items-center justify-center h-full text-slate-400">No data available</div> : 
                      <Pie 
                        data={userRolesChartData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { color: '#fff', font: { size: 14, weight: 'bold' } },
                            },
                            datalabels: {
                              color: '#111',
                              font: { size: 22, weight: 'bold' },
                              formatter: (value, ctx) => {
                                const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = (value * 100 / sum).toFixed(1) + '%';
                                return percentage;
                              },
                            },
                          },
                        }}
                      />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Suspected Users Table - keeping exact structure */}
          <div style={animationStyles.slideUp} className="mb-12 my-20 w-full">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <UserX className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Suspected Users</h3>
                    <p className="text-slate-400 text-sm">Users with suspicious activity or unpaid penalties</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 w-full">
                {Array.isArray(suspectedUsers) && suspectedUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No suspected users found.</div>
                ) : Array.isArray(suspectedUsers) && suspectedUsers.length > 0 ? (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-white/20">
                      <thead className="bg-white/15">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Suspicious Count</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Penalty Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Penalty Order</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Penalty Paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {suspectedUsers.map((user, index) => (
                          <tr key={user.email + index} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.suspiciousCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">₹{user.penalty?.Amount ?? user.penalty?.amount ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.penalty?.Order?.OrderNumber ?? user.penalty?.order?.orderNumber ?? 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Badge variant={user.penalty?.isPaid === false ? "destructive" : "default"}>
                                {user.penalty?.isPaid === false ? "Unpaid" : "Paid"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400">No suspected users found.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Campus and Canteen Table - keeping exact structure */}
          <div style={animationStyles.scaleIn}>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Revenue by Campus and Canteen</h3>
                    <p className="text-slate-400 text-sm">Detailed revenue breakdown</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {revenueByCampusCanteen.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No revenue by campus and canteen data available.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/20">
                      <thead className="bg-white/15">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Campus</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Canteen</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {revenueByCampusCanteen.map((data, index) => (
                          <tr key={data.campusId + data.canteenId + index} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{data.campusName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{data.canteenName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.revenue || data.totalRevenue || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
