import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Badge } from "../../component/ui/badge";
import { Input } from "../../component/ui/input";
import { Label } from "../../component/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../component/ui/select";
import { Textarea } from "../../component/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../component/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  Building,
  CreditCard,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  getAllBankDetails,
  verifyBankDetails,
} from "../../services/operations/BankDetails";
import toast from "react-hot-toast";

const BankDetailsVerification = () => {
  const { token } = useSelector((state) => state.Auth);
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [verificationAction, setVerificationAction] = useState("");

  // Fetch bank details
  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await getAllBankDetails(token, {
        status: statusFilter,
        page: currentPage,
        limit: 10,
      });

      if (response) {
        setBankDetails(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification
  const handleVerification = async (bankDetailsId, verified) => {
    setActionLoading((prev) => ({ ...prev, [bankDetailsId]: true }));
    try {
      const response = await verifyBankDetails(
        token,
        bankDetailsId,
        verified,
        verificationNotes
      );

      if (response) {
        fetchBankDetails();
        setVerificationDialog(false);
        setVerificationNotes("");
        setSelectedBankDetails(null);
      }
    } catch (error) {
      console.error("Error verifying bank details:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [bankDetailsId]: false }));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Filter bank details based on search term
  const filteredBankDetails = bankDetails.filter((detail) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      detail.canteen?.name?.toLowerCase().includes(searchLower) ||
      detail.owner?.name?.toLowerCase().includes(searchLower) ||
      detail.owner?.email?.toLowerCase().includes(searchLower) ||
      detail.accountHolderName?.toLowerCase().includes(searchLower) ||
      detail.bankName?.toLowerCase().includes(searchLower)
    );
  });

  // Open verification dialog
  const openVerificationDialog = (bankDetail, action) => {
    setSelectedBankDetails(bankDetail);
    setVerificationAction(action);
    setVerificationNotes("");
    setVerificationDialog(true);
  };

  useEffect(() => {
    fetchBankDetails();
  }, [statusFilter, currentPage]);

  const getStatusBadge = (isVerified) => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2d4a6b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2d4a6b]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bank Details Verification
              </h1>
              <p className="text-slate-300">
                Review and verify vendor bank details for payouts
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-sm border border-slate-600/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-400" />
                    <Input
                      placeholder="Search by canteen, owner, or bank details..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-12 pr-4 py-3 h-12 bg-slate-800/60 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-slate-800/80 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Select
                      value={statusFilter}
                      onValueChange={handleStatusFilter}
                    >
                      <SelectTrigger className="w-48 h-12 bg-slate-800/60 border-2 border-slate-600/50 rounded-lg text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm">
                        <div className="flex items-center">
                          <Filter className="w-4 h-4 mr-2 text-slate-300" />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-2 border-slate-600/50 rounded-lg shadow-xl backdrop-blur-sm">
                        <SelectItem
                          value="all"
                          className="hover:bg-slate-700/50 focus:bg-slate-700/50 text-white"
                        >
                          All Status
                        </SelectItem>
                        <SelectItem
                          value="pending"
                          className="hover:bg-yellow-900/30 focus:bg-yellow-900/30 text-white"
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                          value="verified"
                          className="hover:bg-green-900/30 focus:bg-green-900/30 text-white"
                        >
                          Verified
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={fetchBankDetails}
                      className="h-12 px-6 bg-slate-800/60 border-2 border-slate-600/50 text-white hover:bg-slate-700/60 hover:border-purple-400 hover:text-purple-200 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details List */}
        <div className="grid gap-6">
          {filteredBankDetails.length === 0 ? (
            <Card className="bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-sm border border-slate-600/30 shadow-xl">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Bank Details Found
                </h3>
                <p className="text-slate-300">
                  No bank details match your current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBankDetails.map((detail) => (
              <Card
                key={detail._id}
                className="bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-sm border border-slate-600/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-lg text-white">
                            {detail.canteen?.name}
                          </span>
                        </div>
                        {getStatusBadge(detail.isVerified)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">
                              Owner:
                            </span>
                            <span className="font-medium text-white">
                              {detail.owner?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">
                              Account Holder:
                            </span>
                            <span className="font-medium text-white">
                              {detail.accountHolderName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300">
                              Bank:
                            </span>
                            <span className="font-medium text-white">
                              {detail.bankName}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-slate-300">
                              Account Number:
                            </span>
                            <span className="font-medium ml-2 text-white">
                              {detail.accountNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-slate-300">
                              IFSC Code:
                            </span>
                            <span className="font-medium ml-2 text-white">
                              {detail.ifscCode}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-slate-300">
                              Branch:
                            </span>
                            <span className="font-medium ml-2 text-white">
                              {detail.branchName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {detail.verificationNotes && (
                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-200">
                              Verification Notes:
                            </span>
                          </div>
                          <p className="text-sm text-yellow-100">
                            {detail.verificationNotes}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-slate-400">
                        <div>Submitted: {formatDate(detail.createdAt)}</div>
                        {detail.verifiedAt && (
                          <div>Verified: {formatDate(detail.verifiedAt)}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!detail.isVerified ? (
                        <>
                          <Button
                            onClick={() =>
                              openVerificationDialog(detail, "approve")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={actionLoading[detail._id]}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              openVerificationDialog(detail, "reject")
                            }
                            variant="destructive"
                            disabled={actionLoading[detail._id]}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                          {detail.verifiedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              by {detail.verifiedBy.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Verification Dialog */}
        <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
          <DialogContent className="sm:max-w-md bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm border border-slate-600/50 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {verificationAction === "approve"
                  ? "Approve Bank Details"
                  : "Reject Bank Details"}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {verificationAction === "approve"
                  ? "Are you sure you want to approve these bank details? This will allow the vendor to receive payouts."
                  : "Are you sure you want to reject these bank details? Please provide a reason for rejection."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes" className="text-slate-200">
                  Verification Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder={
                    verificationAction === "approve"
                      ? "Add any notes about the verification process..."
                      : "Please provide a reason for rejection..."
                  }
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="mt-1 bg-slate-800/60 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 backdrop-blur-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVerificationDialog(false)}
                className="bg-slate-800/60 border-2 border-slate-600/50 text-white hover:bg-slate-700/60 hover:border-slate-500 focus:ring-4 focus:ring-slate-500/20 backdrop-blur-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleVerification(
                    selectedBankDetails._id,
                    verificationAction === "approve"
                  )
                }
                className={
                  verificationAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white focus:ring-4 focus:ring-green-500/20"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-4 focus:ring-red-500/20"
                }
                disabled={actionLoading[selectedBankDetails?._id]}
              >
                {verificationAction === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BankDetailsVerification;
