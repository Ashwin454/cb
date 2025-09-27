import React, { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  ShoppingCart,
  BarChart3,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { Separator } from "../../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOutUser } from "../../../services/operations/Auth";

export const DashboardSidebar = ({ isMobile = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile hamburger menu
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(LogOutUser(dispatch, navigate));
  };

  const navItems = [
    {
      id: "overview",
      icon: LayoutDashboard,
      label: "Dashboard",
      section: "OVERVIEW",
      path: "/dashboard/overview",
    },
    {
      id: "orders",
      icon: ShoppingCart,
      label: "Orders",
      section: "MANAGEMENT",
      path: "/dashboard/orders",
    },
    {
      id: "menu",
      icon: Menu,
      label: "Menu Items",
      section: "MANAGEMENT",
      path: "/dashboard/menu",
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      section: "MANAGEMENT",
      path: "/dashboard/analytics",
    },
    {
      id: "profile",
      icon: Users,
      label: "Profile",
      section: "PROFILE",
      path: "/dashboard/profile",
    },
    {
      id: "payouts",
      icon: DollarSign,
      label: "Payouts",
      section: "PROFILE",
      path: "/dashboard/payouts",
    },
  ];

  const sections = ["OVERVIEW", "MANAGEMENT", "PROFILE"];

  const NavigationButton = ({ icon: Icon, label, to }) => {
    const content = (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-4 py-3 rounded-xl w-full 
           transition-all duration-300 group overflow-hidden ${
             isActive
               ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105"
               : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:scale-102 hover:translate-x-1"
           } ${collapsed ? "justify-center px-3" : ""}`
        }
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            collapsed ? "mx-auto text-slate-800" : ""
          }`}
        />
        {!collapsed && <span className="font-semibold">{label}</span>}
      </NavLink>
    );
    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 text-white">
              <p className="font-medium">{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return content;
  };

  // Sidebar content (same for mobile and desktop)
  const sidebarContent = (
    <div
      className={`h-full bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-r 
       border-slate-200/60 backdrop-blur-xl flex flex-col overflow-y-auto overflow-x-hidden 
       shadow-xl transition-all duration-500 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center px-6 py-6 border-b border-slate-200/60 ${
          collapsed ? "justify-center px-4" : ""
        }`}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                CampusBites
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Vendor Dashboard
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl tracking-wide">
              CB
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 flex flex-col gap-2 py-6">
        {sections.map((section) => (
          <React.Fragment key={section}>
            {!collapsed && (
              <div className="px-6 mb-3">
                <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">
                  {section}
                </span>
              </div>
            )}
            <nav className="flex flex-col gap-2 px-3">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavigationButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    to={item.path}
                  />
                ))}
            </nav>
          </React.Fragment>
        ))}
      </div>

      {/* Collapse Button (desktop only) */}
      <div
        className={`px-3 pb-3 hidden md:block ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <button
          className={`p-2 rounded-full bg-white border-2 border-slate-200 transition-all hover:shadow-lg ${
            collapsed
              ? ""
              : "flex items-center gap-3 px-4 py-3 w-full hover:border-blue-200"
          } `}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-800 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div
        className={`p-3 border-t border-slate-200/60 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all w-full group hover:shadow-lg hover:border-red-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut
            className={`w-5 h-5 flex-shrink-0 ${
              collapsed ? "mx-auto text-slate-800" : ""
            }`}
          />
          {!collapsed && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden p-3 bg-white shadow flex items-center ">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        <span className="font-bold text-lg text-blue-700">
          CampusBites Dashboard
        </span>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:flex`}
      >
        {sidebarContent}
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </>
  );
};

export default DashboardSidebar;
