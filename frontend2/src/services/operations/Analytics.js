import toast from "react-hot-toast";
import apiConnector from "../apiConnector";
import { VendorAnalytics } from "../api";

export const getBasicDashboard = async (canteenId, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      `${VendorAnalytics.Analyticapi}/${canteenId}/basic`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
    
    toast.error("Failed to fetch Basic Dashboard data");
  }
  return result;
};

export const getFinancialOverview = async (canteenId, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      `${VendorAnalytics.Analyticapi}/${canteenId}/finance`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
    
    toast.error("Failed to fetch Financial Overview");
  }
  return result;
};

export const getPerformanceAnalysis = async (canteenId, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      `${VendorAnalytics.Analyticapi}/${canteenId}/orders`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
    
    toast.error("Failed to fetch Performance Analysis");
  }
  return result;
};

export const getItemAnalysis = async (canteenId, token) => {
  let result = []
  try {
    const response = await apiConnector(
      `${VendorAnalytics.Analyticapi}/${canteenId}/items`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
    
    toast.error("Failed to fetch Item Analysis");
  }
  return result;
};

export const getOperatingMetrics = async (canteenId, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      `${VendorAnalytics.Analyticapi}/${canteenId}/operating`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (err) {
   
    toast.error("Failed to fetch Operating Metrics");
  }
  return result;
};

export const getAllAnalytics = async (canteenId, token) => {
  try {
    const [basic, financial, orders, items, operating] = await Promise.all([
      getBasicDashboard(canteenId, token),
      getFinancialOverview(canteenId, token),
      getPerformanceAnalysis(canteenId, token),
      getItemAnalysis(canteenId, token),
      getOperatingMetrics(canteenId, token),
    ]);

    return {
      basic,
      financial,
      orders,
      items,
      operating,
    };
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    throw error;
  }
};
