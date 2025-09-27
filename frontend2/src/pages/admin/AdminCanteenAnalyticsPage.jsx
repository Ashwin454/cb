import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import apiConnector from "../../services/apiConnector";
import { AdminApi } from "../../services/api";
import { ArrowLeft, Store, Users, DollarSign, Star, Phone, Building, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AdminCanteenAnalyticsPage() {
  const { canteenId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);
  
  const [canteen, setCanteen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCanteens() {
      setLoading(true);
      setError("");
      try {
        const res = await apiConnector(`${AdminApi.canteenDetailsApi}/${canteenId}`, "GET", null, {
          Authorization: `Bearer ${token}`
        });
        
        if (!res.data || !res.data.canteen) {
          setError("Canteen not found");
          return;
        }
        
        setCanteen(res.data.canteen);
      } catch (err) {
        console.error("Error fetching canteen details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load canteen details");
        toast.error(err?.response?.data?.message || err?.message || "Failed to load canteen details");
      } finally {
        setLoading(false);
      }
    }
    
    if (canteenId) {
      fetchCanteens();
    }
  }, [canteenId, token]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-slate-300 py-12 text-center">Loading canteen details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-red-400 py-12 text-center">{error}</div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-slate-400 py-12 text-center">Canteen not found</div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {canteen.name}
              <Badge variant={canteen.isOpen ? 'default' : 'destructive'} className="ml-2">
                {canteen.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </h1>
            <div className="flex items-center gap-3 text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {canteen.campus?.name || '-'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {canteen.contactPhone || canteen.mobile || '-'}
              </span>
              <span className="flex items-center gap-1">
                <UserCircle2 className="w-4 h-4" />
                {canteen.owner?.name || canteen.contactPersonName || '-'}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-slate-400 hover:text-white border border-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{canteen.totalEarnings || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{canteen.availableBalance || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              Total Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{canteen.totalPayouts || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details & Description */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-lg">Canteen Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div>
              <div className="mb-2">
                <span className="font-semibold">Owner:</span> {canteen.owner?.name || canteen.contactPersonName || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Campus:</span> {canteen.campus?.name || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Contact:</span> {canteen.mobile || canteen.contactPhone || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Email:</span> {canteen.email || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Address:</span> {canteen.address || '-'}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-semibold">GST Number:</span> {canteen.gstNumber || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">PAN Number:</span> {canteen.panNumber || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Aadhaar Number:</span> {canteen.adhaarNumber || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">FSSAI License:</span> {canteen.fssaiLicense || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Operating Hours:</span> {canteen.operatingHours?.opening || '-'} - {canteen.operatingHours?.closing || '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card className="bg-white/10 border-white/20 mb-8">
        <CardHeader>
          <CardTitle className="text-white text-lg">Approval Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div>
              <div className="mb-2">
                <span className="font-semibold">Approval Status:</span> 
                <Badge variant={canteen.approvalStatus === 'approved' ? 'default' : 'destructive'} className="ml-2">
                  {canteen.approvalStatus}
                </Badge>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Is Approved:</span> {canteen.isApproved ? 'Yes' : 'No'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Approved At:</span> {canteen.approvedAt ? new Date(canteen.approvedAt).toLocaleDateString() : '-'}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-semibold">Operating Days:</span> {canteen.operatingDays?.join(', ') || '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Created At:</span> {canteen.createdAt ? new Date(canteen.createdAt).toLocaleDateString() : '-'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Last Updated:</span> {canteen.updatedAt ? new Date(canteen.updatedAt).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Section (if available) */}
      {canteen.adminRatings && canteen.adminRatings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" /> Admin Ratings ({canteen.adminRatings.length})
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            {canteen.adminRatings.map((r, idx) => (
              <Card key={idx} className="bg-white/10 border-white/20 flex-1 min-w-[220px]">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-white">{r.rating} / 5</span>
                  </div>
                  <div className="text-slate-300">{r.feedback}</div>
                  <div className="text-slate-400 text-xs">{r.date ? new Date(r.date).toLocaleDateString() : ''}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <section className="mt-8">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-400">
              Total Payouts: ₹{canteen.totalPayouts || 0}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
