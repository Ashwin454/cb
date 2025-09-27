import React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import { Input } from "../../component/ui/input";
import { UserCheck, UserX, CheckCircle2, Star, StarHalf, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../component/ui/tooltip";
import { Link } from "react-router-dom";
import apiConnector from "../../services/apiConnector";
import { AdminApi } from "../../services/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [expanded, setExpanded] = useState({});
  const [payouts, setPayouts] = useState({});
  const [payoutsLoading, setPayoutsLoading] = useState({});
  const [approveLoading, setApproveLoading] = useState({});
  const [ratingLoading, setRatingLoading] = useState({});
  const [owners, setOwners] = useState([]);
  
  const { token } = useSelector((state) => state.Auth);

  async function fetchVendors() {
    setLoading(true);
    setError("");
    try {
      // Fetch all canteens including unapproved ones
      const vendorsRes = await apiConnector(AdminApi.allCanteensApi, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      const canteens = Array.isArray(vendorsRes.data?.canteens) ? vendorsRes.data.canteens : [];
      
      // Ensure consistent data structure for all vendors
      const processedVendors = canteens.map((vendor) => ({
        ...vendor,
        _id: vendor._id?.toString(),
        owner: vendor.owner || null,
        isSuspended: vendor.isSuspended || false,
        isBanned: vendor.isBanned || false,
        approvalStatus: vendor.approvalStatus || 'pending',
        adminRatings: vendor.adminRatings || [],
        rating: vendor.rating || {
          average: vendor.adminRatings?.length > 0 
            ? vendor.adminRatings.reduce((acc, curr) => acc + curr.rating, 0) / vendor.adminRatings.length 
            : 0,
          count: vendor.adminRatings?.length || 0
        }
      }));
      
      setVendors(processedVendors);
      setFilteredVendors(processedVendors);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load vendors");
      toast.error(err?.response?.data?.message || err?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }

  // Fetch all canteen owners for mapping
  async function fetchOwners() {
    try {
      const res = await apiConnector(AdminApi.usersByRoleListApi, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setOwners(res.data.canteenOwners || []);
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  }

  useEffect(() => {
    fetchVendors();
    fetchOwners();
  }, [token]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredVendors(vendors);
    } else {
      setFilteredVendors(
        vendors.filter(
          (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, vendors]);

  async function handleBanVendor(userId, ban, canteenId) {
    setActionLoading((l) => ({ ...l, [userId]: true }));
    
    try {
      const res = await apiConnector(AdminApi.suspendCanteenApi, "POST", { 
        canteenId, 
        suspend: ban 
      }, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
      
      if (res.data.success) {
        toast.success(res.data.message || (ban ? "Vendor banned" : "Vendor unbanned"));
        
        // Refresh the vendors list to get updated data
        await fetchVendors();
      } else {
        throw new Error(res.data.message || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Error banning vendor:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to update vendor");
    } finally {
      setActionLoading((l) => ({ ...l, [userId]: false }));
    }
  }

  // Handle vendor rating
  async function handleRateVendor(canteenId, rating) {
    const vendorId = canteenId?.toString();
    if (!vendorId) {
      toast.error("Invalid vendor ID");
      return;
    }

    // Check if vendor is approved
    const vendor = vendors.find(v => v._id === vendorId);
    if (vendor?.approvalStatus !== 'approved' && !vendor?.isApproved) {
      toast.error("Please approve the vendor before rating.");
      return;
    }

    setRatingLoading((l) => ({ ...l, [vendorId]: true }));
    
    try {
      const rateRes = await apiConnector(
        AdminApi.rateVendorsApi,
        "POST",
        {
          canteenId: vendorId,
          rating,
          feedback: `Admin rating: ${rating} stars`
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      );
      
      if (rateRes.data.success) {
        // Update the vendor's rating without refreshing the whole list
        setVendors(prevVendors => 
          prevVendors.map(vendor => {
            if (vendor._id === vendorId) {
              const newAdminRatings = [...(vendor.adminRatings || []), 
                { rating, feedback: `Admin rating: ${rating} stars`, date: new Date() }
              ];
              const totalRatings = newAdminRatings.reduce((sum, r) => sum + r.rating, 0);
              const avgRating = totalRatings / newAdminRatings.length;
              
              return {
                ...vendor,
                adminRatings: newAdminRatings,
                rating: {
                  average: avgRating,
                  count: newAdminRatings.length
                }
              };
            }
            return vendor;
          })
        );
        
        toast.success(`Rated vendor ${rating} star${rating !== 1 ? 's' : ''}`);
      } else {
        throw new Error(rateRes.data?.message || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error rating vendor:", err);
      toast.error(err?.response?.data?.message || err?.message || "An error occurred while submitting the rating.");
    } finally {
      setRatingLoading((l) => ({ ...l, [vendorId]: false }));
    }
  }

  // Render star rating component
  function StarRating({ 
    rating, 
    onRate, 
    loading = false, 
    size = 4 
  }) {
    const [hover, setHover] = useState(0);
    
    if (loading) {
      return <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-${size} h-${size} text-yellow-400 opacity-50`} 
          />
        ))}
      </div>;
    }
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hover ? star <= hover : star <= Math.round(rating || 0);
          const isHalf = !hover && star - 0.5 <= (rating || 0) && star > (rating || 0);
          
          return (
            <button
              key={star}
              type="button"
              className={`p-1 ${onRate ? 'cursor-pointer' : 'cursor-default'}`}
              onMouseEnter={() => onRate && setHover(star)}
              onMouseLeave={() => onRate && setHover(0)}
              onClick={() => onRate && onRate(star)}
              disabled={!onRate}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              {isFilled ? (
                <Star className={`w-${size} h-${size} text-yellow-400 fill-current`} />
              ) : isHalf ? (
                <StarHalf className={`w-${size} h-${size} text-yellow-400 fill-current`} />
              ) : (
                <Star className={`w-${size} h-${size} text-gray-400`} />
              )}
            </button>
          );
        })}
        {rating > 0 && (
          <span className="text-xs text-gray-400 ml-1">
            ({rating.toFixed(1)})
          </span>
        )}
      </div>
    );
  }

  // Updated approve vendor function with better error handling and email confirmation
  async function handleApproveVendor(canteenId) {
    const vendorId = canteenId?.toString();
    if (!vendorId) {
      toast.error("Invalid vendor ID");
      return;
    }

    setApproveLoading((l) => ({ ...l, [vendorId]: true }));
    
    try {
      const approveRes = await apiConnector(
        `${AdminApi.approveVendorApi}/${vendorId}/approve`,
        "POST",
        { 
          approved: true,
          rejectionReason: ""
        },
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      );
      
      if (approveRes.data.success) {
        // Update the vendor's approval status
        setVendors(prevVendors => 
          prevVendors.map(vendor => 
            vendor._id === vendorId 
              ? { 
                  ...vendor, 
                  approvalStatus: 'approved',
                  isApproved: true,
                  approvedAt: new Date().toISOString()
                } 
              : vendor
          )
        );
        
        // Show success message - the backend response should include the email confirmation
        const vendorName = vendors.find(v => v._id === vendorId)?.name || "Vendor";
        const ownerEmail = vendors.find(v => v._id === vendorId)?.owner?.email || "owner";
        
        toast.success(`${vendorName} has been approved and email notification sent to ${ownerEmail}`);
        
        console.log("Vendor approved successfully. Email notification sent via backend.");
      } else {
        throw new Error(approveRes.data?.message || "Failed to approve vendor");
      }
    } catch (err) {
      console.error("Error approving vendor:", err);
      
      // More detailed error handling
      let errorMessage = "An error occurred while approving the vendor.";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setApproveLoading((l) => ({ ...l, [vendorId]: false }));
    }
  }

  async function fetchVendorPayouts(vendor) {
    const canteenId = vendor.canteenId || vendor.canteen || vendor._id;
    setPayoutsLoading((l) => ({ ...l, [vendor._id]: true }));
    try {
      const res = await apiConnector(`${AdminApi.payoutsByCanteenApi}/${canteenId}`, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setPayouts((p) => ({ ...p, [vendor._id]: res.data.payouts || [] }));
    } catch (err) {
      console.error("Error fetching payouts:", err);
      setPayouts((p) => ({ ...p, [vendor._id]: [] }));
    } finally {
      setPayoutsLoading((l) => ({ ...l, [vendor._id]: false }));
    }
  }

  function handleExpand(vendor) {
    setExpanded((e) => {
      const next = { ...e, [vendor._id]: !e[vendor._id] };
      if (!e[vendor._id]) fetchVendorPayouts(vendor);
      return next;
    });
  }

  // Map ownerId to name (handle both string and object cases)
  const ownerMap = Object.fromEntries((owners || []).map((o) => [o._id, o.name]));

  // Helper to get owner name from vendor.owner (ID or object)
  function getOwnerName(owner) {
    if (!owner) return '-';
    if (typeof owner === 'string') return ownerMap[owner] || '-';
    if (typeof owner === 'object' && owner._id) return ownerMap[owner._id] || owner.name || '-';
    return '-';
  }

  // Helper to get owner email for display
  function getOwnerEmail(owner) {
    if (!owner) return '-';
    if (typeof owner === 'object' && owner.email) return owner.email;
    return '-';
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">All Vendors</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 text-gray-50 focus:outline-none"
        />
      </div>
      {loading ? (
        <div className="text-slate-300 py-12 text-center">Loading vendors...</div>
      ) : error ? (
        <div className="text-red-400 py-12 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white/10 rounded-xl">
          <table className="min-w-full text-white bg-white/5 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-2 font-semibold text-black">Name</th>
                <th className="px-4 py-2 font-semibold text-black">Owner</th>
                <th className="px-4 py-2 font-semibold text-black">Banned</th>
                <th className="px-4 py-2 font-semibold text-black">Rating</th>
                <th className="px-4 py-2 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No vendors found.</td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <React.Fragment key={vendor._id}>
                    <tr className="border-b border-white/10 hover:bg-blue-900/40 transition group bg-blue-900/30 text-white">
                      <td className="px-4 py-2 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/canteens/${vendor._id}`} className="hover:underline">
                            {vendor.name}
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExpand(vendor)}
                            className="p-1 hover:bg-white/20"
                          >
                            {expanded[vendor._id] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-white">
                        <div className="flex flex-col">
                          <span>{getOwnerName(vendor.owner)}</span>
                          <span className="text-xs text-gray-400">{getOwnerEmail(vendor.owner)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={vendor.isSuspended || vendor.isBanned ? "destructive" : "secondary"}
                          className={vendor.isSuspended || vendor.isBanned ? "bg-red-500/90 text-white" : "bg-gray-700/80 text-white"}
                        >
                          {(vendor.isSuspended || vendor.isBanned) ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center min-w-[120px]">
                          {vendor.approvalStatus === "approved" ? (
                            <div className="flex flex-col items-start">
                              <StarRating 
                                rating={vendor.rating?.average || 0} 
                                onRate={(rating) => handleRateVendor(vendor._id, rating)}
                                loading={ratingLoading[vendor._id]}
                                size={5}
                              />
                              {vendor.rating?.count > 0 && (
                                <span className="text-xs text-gray-400 mt-1">
                                  {vendor.rating.count} rating{vendor.rating.count !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Approve to rate</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={`rounded-full border ${vendor.isSuspended ? 'text-green-400 border-green-400 hover:bg-green-600/20' : 'text-red-400 border-red-400 hover:bg-red-600/20'}`}
                                  onClick={() => handleBanVendor(vendor.owner?._id, !vendor.isSuspended, vendor._id)}
                                  aria-label={vendor.isSuspended ? "Unsuspend Vendor" : "Suspend Vendor"}
                                  disabled={actionLoading[vendor.owner?._id]}
                                >
                                  {actionLoading[vendor.owner?._id]
                                    ? <span className={`animate-spin w-5 h-5 border-2 ${vendor.isSuspended ? 'border-green-400' : 'border-red-400'} border-t-transparent rounded-full`}></span>
                                    : vendor.isSuspended
                                      ? <UserCheck className="w-5 h-5" />
                                      : <UserX className="w-5 h-5" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {vendor.isSuspended ? "Unsuspend Vendor" : "Suspend Vendor"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {vendor.approvalStatus !== "approved" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full border text-white border-green-400 hover:bg-green-600/20"
                                    onClick={() => handleApproveVendor(vendor._id)}
                                    aria-label="Approve Vendor"
                                    disabled={approveLoading[vendor._id]}
                                  >
                                    {approveLoading[vendor._id]
                                      ? <span className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"></span>
                                      : <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Approve & Send Email
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Payouts Row */}
                    {expanded[vendor._id] && (
                      <tr className="bg-blue-900/20 border-b border-white/10">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-3">Payouts for {vendor.name}</h4>
                            {payoutsLoading[vendor._id] ? (
                              <div className="text-slate-300 py-4 text-center">Loading payouts...</div>
                            ) : payouts[vendor._id]?.length === 0 ? (
                              <div className="text-slate-400 py-4 text-center">No payouts found.</div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-white bg-white/5 rounded-lg overflow-hidden">
                                  <thead>
                                    <tr className="bg-white/10">
                                      <th className="px-3 py-2 font-semibold text-sm text-black">Transaction ID</th>
                                      <th className="px-3 py-2 font-semibold text-sm text-black">Date</th>
                                      <th className="px-3 py-2 font-semibold text-sm text-black">Amount</th>
                                      <th className="px-3 py-2 font-semibold text-sm text-black">Notes</th>
                                      <th className="px-3 py-2 font-semibold text-sm text-black">Admin</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {payouts[vendor._id]?.map((payout) => (
                                      <tr key={payout._id} className="border-b border-white/10 hover:bg-white/10 transition">
                                        <td className="px-3 py-2 text-sm text-white">{payout.trnId}</td>
                                        <td className="px-3 py-2 text-sm text-white">
                                          {payout.date ? new Date(payout.date).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-white">₹{payout.amount}</td>
                                        <td className="px-3 py-2 text-sm text-white">{payout.notes || "-"}</td>
                                        <td className="px-3 py-2 text-sm text-white">{payout.admin?.name || "-"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
