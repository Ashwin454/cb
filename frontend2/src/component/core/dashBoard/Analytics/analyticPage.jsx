import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Separator } from "../../../ui/separator";
import { Badge } from "../../../ui/badge";
import Skeleton from "../../../ui/skeleton";
import { Alert, AlertDescription } from "../../../ui/alert";

import { getAllAnalytics } from "../../../../services/operations/Analytics";
import { useSelector } from "react-redux";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8c52ec",
  "#06b6d4",
  "#84c916",
];

const GRADIENT_CARDS = {
  orders: "bg-gradient-to-br from-blue-500 to-indigo-600",
  earnings: "bg-gradient-to-br from-emerald-500 to-teal-600",
  balance: "bg-gradient-to-br from-purple-500 to-violet-600",
  rating: "bg-gradient-to-br from-amber-500 to-orange-600",
};

const Icons = {
  orders: "📦",
  earnings: "💰",
  balance: "💳",
  rating: "⭐",
  items: "🍽️",
  payouts: "💸",
  time: "⏰",
  calendar: "📅",
  analytics: "📊",
  trending: "📈",
};

export const AnalyticsTab = () => {
  const { canteenId } = useSelector((state) => state.Canteen);
  const { token } = useSelector((state) => state.Auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (!canteenId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAnalytics(canteenId, token);
        setAnalyticsData(data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canteenId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <span className="text-white text-2xl">{Icons.analytics}</span>
            </div>
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <Card key={idx} className="border-0 shadow-xl bg-white">
                <Skeleton className="h-44 rounded-lg" />
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {[...Array(4)].map((_, idx) => (
              <Card key={idx} className="border-0 shadow-xl bg-white">
                <Skeleton className="h-80 rounded-lg" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <span className="text-white text-2xl">{Icons.analytics}</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="max-w-xl mx-auto text-gray-600">
              Comprehensive insights about your business performance
            </p>
          </div>
          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { basic, financial, orders, items, operating } = analyticsData;

  const statusData = Object.entries(orders.statusCounts).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  const salesTrendData = financial.salesData.map((d) => ({
    date: `${d._id.day}/${d._id.month}`,
    sales: d.dailyTotal,
    orders: d.count,
  }));

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const found = orders.ordersByHour.find(({ _id }) => _id === hour);
    return { hour: `${hour}:00`, orders: found ? found.count : 0 };
  });

  const dayData = Object.entries(operating.ordersByDay).map(([day, count]) => ({
    day,
    orders: count,
  }));

  return (
    <div className="space-y-10 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights and performance metrics for your business
        </p>
      </div>

      {/* ---- Analytics Cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Orders Card */}
        <Card
          className={`group shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden`}
        >
          <div className={`${GRADIENT_CARDS.orders} h-2`}></div>
          <CardContent className="bg-gradient-to-br from-white to-blue-50 p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="uppercase text-blue-600 font-semibold tracking-wide text-sm">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {basic.totalOrders && basic.totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">All time orders</p>
              </div>
              <div className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-white text-xl">{Icons.orders}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Earnings Card */}
        <Card
          className={`group shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden`}
        >
          <div className={`${GRADIENT_CARDS.earnings} h-2`}></div>
          <CardContent className="bg-gradient-to-br from-white to-emerald-50 p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="uppercase text-emerald-600 font-semibold tracking-wide text-sm">
                  Total Earnings
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{basic.totalEarnings && basic.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Lifetime revenue</p>
              </div>
              <div className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
                <span className="text-white text-xl">{Icons.earnings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Balance Card */}
        <Card
          className={`group shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden`}
        >
          <div className={`${GRADIENT_CARDS.balance} h-2`}></div>
          <CardContent className="bg-gradient-to-br from-white to-purple-50 p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="uppercase text-purple-600 font-semibold tracking-wide text-sm">
                  Available Balance
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹
                  {basic.availableBalance &&
                    basic.availableBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Ready for payout</p>
              </div>
              <div className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-violet-600">
                <span className="text-white text-xl">{Icons.balance}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Rating Card */}
        <Card
          className={`group shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden`}
        >
          <div className={`${GRADIENT_CARDS.rating} h-2`}></div>
          <CardContent className="bg-gradient-to-br from-white to-amber-50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <p className="uppercase text-amber-600 font-semibold tracking-wide text-sm">
                  Average Rating
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-3xl font-bold text-gray-800">
                    {basic.averageRating}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.floor(Number(basic.averageRating))
                            ? "text-amber-500"
                            : "text-gray-300"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">Customer satisfaction</p>
              </div>
              <div className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600">
                <span className="text-white text-xl">{Icons.rating}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and other analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 mb-10">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-10 h-10 flex items-center justify-center">
                  <span className="text-white text-sm">{Icons.trending}</span>
                </div>
                <div>
                  <CardTitle>Sales Trend</CardTitle>
                  <p className="text-sm text-gray-500">
                    Last 30 days performance
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100">
                {salesTrendData.length} days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {salesTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={salesTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.3}
                      ></stop>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "sales" ? `₹${value}` : value,
                      name === "sales" ? "Sales" : "Orders",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    activeDot={{ r: 7 }}
                    dot={{ r: 5 }}
                    fill="url(#salesGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center h-72">
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">{Icons.trending}</div>
                  No sales data available
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 mb-10">
          <CardHeader className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-10 h-10 flex items-center justify-center">
                <span className="text-white text-sm">{Icons.orders}</span>
              </div>
              <div>
                <CardTitle>Order Status</CardTitle>
                <p className="text-sm text-gray-500">Distribution breakdown</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100">
              {statusData.reduce((acc, item) => acc + item.value, 0)} total
            </Badge>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 && statusData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    stroke="#fff"
                    strokeWidth={3}
                    label={({ name, percent }) =>
                      percent > 0.03
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center h-72">
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">{Icons.orders}</div>
                  No order status data
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 mt-10">
        <CardHeader className="border-b border-gray-100 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <span className="text-white text-sm">{Icons.time}</span>
            </div>
            <div>
              <CardTitle>Hourly Orders</CardTitle>
              <p className="text-sm text-gray-500">Peak order hours</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100">
            {orders.averageCompletionTimeMinutes} min avg
          </Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={hourlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8c52ec" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8c52ec" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="orders"
                fill="url(#hourlyGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 mt-10">
        <CardHeader className="border-b border-gray-100 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <span className="text-white text-sm">{Icons.calendar}</span>
            </div>
            <div>
              <CardTitle>Weekly Pattern</CardTitle>
              <p className="text-sm text-gray-500">Order distribution by day</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-100">
            {operating.operatingHours.opening} -{" "}
            {operating.operatingHours.closing}
          </Badge>
        </CardHeader>
        <CardContent>
          {dayData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={dayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="weeklyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill="url(#weeklyGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center h-72">
              <div className="text-gray-400 text-center">
                <div className="text-6xl mb-4">{Icons.calendar}</div>
                No weekly data available.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 mt-10">
        <CardHeader className="border-b border-gray-100 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <span className="text-white text-sm">{Icons.items}</span>
            </div>
            <div>
              <CardTitle>Top Performing Items</CardTitle>
              <p className="text-sm text-gray-500">Best sellers</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-indigo-100">
            {items.allItems.length} total
          </Badge>
        </CardHeader>
        <CardContent>
          {items.top5Items.length > 0 ? (
            items.top5Items.map((item, idx) => (
              <div
                key={item.itemId}
                className="flex justify-between bg-white border border-gray-100 rounded-lg shadow p-4 mb-3 hover:shadow-md transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {idx + 1}. {item.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.totalQuantity} sold — {item.salesPercentage}% sales
                  </p>
                </div>
                <div className="font-semibold text-gray-900">
                  ₹{item.totalRevenue.toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded">
              No sales data available
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden group">
          <div className={`${GRADIENT_CARDS.earnings} h-2`}></div>
          <CardContent className="text-center p-8 bg-gradient-to-br from-white to-cyan-50">
            <div className="rounded-full bg-gradient-to-br from-indigo-500 to-cyan-600 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              {Icons.items}
            </div>
            <p className="uppercase text-indigo-700 font-semibold mb-1 text-sm">
              Active Menu Items
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {basic.activeItems}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden group">
          <div
            className={`${GRADIENT_CARDS.earnings} h-2 bg-gradient-to-br from-red-500 to-pink-600`}
          ></div>
          <CardContent className="text-center p-8 bg-gradient-to-br from-white to-pink-50">
            <div className="rounded-full bg-gradient-to-br from-red-500 to-pink-600 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              {Icons.payouts}
            </div>
            <p className="uppercase text-pink-700 font-semibold mb-1 text-sm">
              Total Payouts
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {basic.totalPayouts.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 overflow-hidden group">
          <div
            className={`${GRADIENT_CARDS.earnings} h-2 bg-gradient-to-br from-yellow-500 to-amber-600`}
          ></div>
          <CardContent className="text-center p-8 bg-gradient-to-br from-white to-yellow-50">
            <div className="rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white text-xl">
              {Icons.calendar}
            </div>
            <p className="uppercase text-yellow-700 font-semibold mb-1 text-sm">
              Operating Days
            </p>
            <p className="text-lg font-bold text-gray-800">
              {operating.operatingDays.join(", ")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
