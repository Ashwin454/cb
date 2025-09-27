import toast from "react-hot-toast";
import apiConnector from "../apiConnector";
import { AdminApi } from "../api";

// Get all bank details for admin verification
export const getAllBankDetails = async (token, filters = {}) => {
  let result = null;
  try {
    const { status = "all", page = 1, limit = 10 } = filters;
    const response = await apiConnector(
      `${AdminApi.getAllBankDetailsApi}?status=${status}&page=${page}&limit=${limit}`,
      "GET",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data;
  } catch (error) {
    console.error("Error fetching bank details:", error);
    toast.error("Failed to fetch bank details");
  }
  return result;
};

// Verify bank details (approve/reject)
export const verifyBankDetails = async (
  token,
  bankDetailsId,
  verified,
  notes = ""
) => {
  let result = null;
  try {
    const response = await apiConnector(
      `${AdminApi.verifyBankDetailsApi}/${bankDetailsId}/verify`,
      "POST",
      { verified, notes },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data;
    toast.success(
      `Bank details ${verified ? "verified" : "rejected"} successfully`
    );
  } catch (error) {
    console.error("Error verifying bank details:", error);
    toast.error("Failed to verify bank details");
  }
  return result;
};
