"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "../../component/common/admin-navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2d4a6b]">
          <AdminNavbar />
          <Outlet/>
        </div>
     
  );
}