import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../component/ui/dialog";
import { Badge } from "../../component/ui/badge";
import apiConnector from "../../services/apiConnector";
import { AdminApi } from "../../services/api";
import { Calendar, Search, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AdminPayoutsPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  const [search, setSearch] = useState("");
  const [canteens, setCanteens] = useState([]);
  const [filteredCanteens, setFilteredCanteens] = useState([]);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [form, setForm] = useState({ trnId: "", date: "", amount: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payouts, setPayouts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchCanteens() {
      setLoading(true);
      setError("");
      try {
        const res = await apiConnector(`${AdminApi.allCanteensApi}?includeUnapproved=true`, "GET", null, {
          Authorization: `Bearer ${token}`
        });
        setCanteens(res.data.canteens || []);
        setFilteredCanteens(res.data.canteens || []);
      } catch (err) {
        console.error("Error fetching canteens:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load canteens");
        toast.error(err?.response?.data?.message || err?.message || "Failed to load canteens");
      } finally {
        setLoading(false);
      }
    }
    fetchCanteens();
  }, [token]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCanteens(canteens);
    } else {
      setFilteredCanteens(
        canteens.filter(
          (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c._id?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, canteens]);

  async function fetchPayouts() {
    setPayoutsLoading(true);
    try {
      const res = await apiConnector(AdminApi.getPayoutsApi, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setPayouts(res.data.payouts || []);
    } catch (err) {
      console.error("Error fetching payouts:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to load payouts");
    } finally {
      setPayoutsLoading(false);
    }
  }

  useEffect(() => {
    fetchPayouts();
  }, [token]);

  function validateForm() {
    const errors = {};
    const amountNum = Number(form.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      errors.amount = "Amount must be a positive number.";
    }
    if (!form.date) {
      errors.date = "Date is required.";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      selectedDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if (selectedDate > today) {
        errors.date = "Date cannot be in the future.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedCanteen) {
      toast.error("Select a canteen/vendor first");
      return;
    }
    if (!form.trnId || !form.date || !form.amount) {
      toast.error("All fields except notes are required");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiConnector(AdminApi.createPayoutApi, "POST", {
        canteenId: selectedCanteen._id,
        trnId: form.trnId,
        date: form.date,
        amount: Number(form.amount),
        notes: form.notes,
      }, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to record payout");
      }

      toast.success("Payout recorded successfully");
      setForm({ trnId: "", date: "", amount: "", notes: "" });
      setSelectedCanteen(null);
      fetchPayouts();
      setFormErrors({});
    } catch (err) {
      console.error("Error recording payout:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to record payout");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Payouts</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search and select canteen/vendor */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Search className="w-5 h-5" /> Search Vendor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 text-gray-50 focus:outline-none"
            />
            {loading ? (
              <div className="text-slate-300 py-4 text-center flex items-center justify-center"><Loader2 className="animate-spin mr-2" />Loading...</div>
            ) : error ? (
              <div className="text-red-400 py-4 text-center">{error}</div>
            ) : (
              <div className="max-h-[32rem] overflow-y-auto">
                {filteredCanteens.length === 0 ? (
                  <div className="text-slate-400 text-center">No vendors found.</div>
                ) : (
                  filteredCanteens.map((c) => (
                    <div
                      key={c._id}
                      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer mb-1 ${selectedCanteen?._id === c._id ? "bg-blue-600 text-white" : "hover:bg-white/20 text-white"}`}
                      onClick={() => setSelectedCanteen(c)}
                    >
                      <span className="font-semibold">{c.name}</span>
                      <Badge variant="secondary" className="ml-2">{c._id.slice(-6)}</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Payout form */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Record Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-1">Selected Vendor</label>
                <div className="bg-white/20 rounded px-3 py-2 text-white font-semibold min-h-[40px]">
                  {selectedCanteen ? selectedCanteen.name : <span className="text-slate-300">None selected</span>}
                </div>
              </div>
              <div>
                <label className="block text-white mb-1">Transaction ID</label>
                <Input
                  value={form.trnId}
                  onChange={e => setForm(f => ({ ...f, trnId: e.target.value }))}
                  placeholder="Transaction ID"
                  className="bg-white/20 text-white placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Amount</label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="Amount"
                  className="bg-white/20 text-white placeholder:text-slate-300"
                  min={1}
                  step="any"
                />
                {formErrors.amount && <div className="text-red-400 text-sm mt-1">{formErrors.amount}</div>}
              </div>
              <div>
                <label className="block text-white mb-1">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="bg-white/20 text-white placeholder:text-slate-300"
                  max={new Date().toISOString().split('T')[0]}
                />
                {formErrors.date && <div className="text-red-400 text-sm mt-1">{formErrors.date}</div>}
              </div>
              <div>
                <label className="block text-white mb-1">Notes (optional)</label>
                <Input
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Notes"
                  className="bg-white/20 text-white placeholder:text-slate-300"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
                Record Payout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Payouts List */}
      <div className="mt-12 bg-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">All Payouts</h2>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={fetchPayouts} disabled={payoutsLoading}>
            {payoutsLoading ? <Loader2 className="animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-1" />} View All
          </Button>
        </div>
        {payoutsLoading ? (
          <div className="text-slate-300 py-8 text-center flex items-center justify-center"><Loader2 className="animate-spin mr-2" />Loading payouts...</div>
        ) : payouts.length === 0 ? (
          <div className="text-slate-400 py-8 text-center">No payouts found.</div>
        ) : (
          <div className="overflow-x-auto bg-white/5 rounded-xl">
            <table className="min-w-full text-white bg-white/5 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-4 py-2 font-semibold text-black">Vendor</th>
                  <th className="px-4 py-2 font-semibold text-black">Transaction ID</th>
                  <th className="px-4 py-2 font-semibold text-black">Date</th>
                  <th className="px-4 py-2 font-semibold text-black">Amount</th>
                  <th className="px-4 py-2 font-semibold text-black">Notes</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p._id} className="border-b border-white/10 hover:bg-white/10 transition group">
                    <td className="px-4 py-2">
                      <span
                        className="text-green-500 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/canteens/${p.canteen?._id}`)}
                      >
                        {p.canteen?.name || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-white">{p.trnId}</td>
                    <td className="px-4 py-2 text-white">{p.date ? new Date(p.date).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 text-white">₹{p.amount}</td>
                    <td className="px-4 py-2 text-white">{p.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
