import { useEffect, useState } from "react";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../component/ui/dialog";
import apiConnector from "../../services/apiConnector";
import { AdminApi, CampusApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AdminCampusesPage() {
  const [campuses, setCampuses] = useState([]);
  const [filteredCampuses, setFilteredCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", code: "", city: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [campusRequests, setCampusRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [refreshCampusRequests, setRefreshCampusRequests] = useState(() => () => {});
  
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  useEffect(() => {
    async function fetchCampuses() {
      setLoading(true);
      setError("");
      try {
        const res = await apiConnector(AdminApi.campusesSummaryApi, "GET", null, {
          Authorization: `Bearer ${token}`
        });
        const campusSummaries = res.data.campuses || [];

        const campusesWithStudentCount = await Promise.all(
          campusSummaries.map(async (campus) => {
            try {
              const usersRes = await apiConnector(
                `${AdminApi.campusUsersApi}/${campus.campusId}/users`, 
                "GET", 
                null, 
                {
                  Authorization: `Bearer ${token}`
                }
              );
              const studentUsers = (usersRes.data.users || []).filter((u) => u.role === 'student');
              return { ...campus, userCount: studentUsers.length };
            } catch (error) {
              console.error(`Failed to fetch users for campus ${campus.name}:`, error);
              return { ...campus }; 
            }
          })
        );

        setCampuses(campusesWithStudentCount);
        setFilteredCampuses(campusesWithStudentCount);
      } catch (err) {
        console.error("Error fetching campuses:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load campuses");
        toast.error(err?.response?.data?.message || err?.message || "Failed to load campuses");
      } finally {
        setLoading(false);
      }
    }
    fetchCampuses();
  }, [token]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCampuses(campuses);
    } else {
      setFilteredCampuses(
        campuses.filter(
          (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.code?.toLowerCase().includes(search.toLowerCase()) ||
            c.city?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, campuses]);

  useEffect(() => {
    async function fetchCampusRequests() {
      setRequestsLoading(true);
      setRequestsError("");
      try {
        const res = await apiConnector(AdminApi.campusRequestsApi, "GET", null, {
          Authorization: `Bearer ${token}`
        });
        setCampusRequests(res.data.requests || []);
      } catch (err) {
        console.error("Error fetching campus requests:", err);
        setRequestsError(err?.response?.data?.message || err?.message || "Failed to load campus requests");
      } finally {
        setRequestsLoading(false);
      }
    }
    fetchCampusRequests();
    
    setRefreshCampusRequests(() => fetchCampusRequests);
  }, [token]);

  async function handleAddCampus() {
    setAddLoading(true);
    try {
      const res = await apiConnector(AdminApi.submitCampusRequestApi, "POST", addForm, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
      
      if (res.data.success && res.data.campus) {
        toast.success("Campus added successfully");
        setCampuses((prev) => [...prev, res.data.campus]);
        setAddDialogOpen(false);
        setAddForm({ name: "", code: "", city: "" });
      } else {
        throw new Error(res.data.message || "Failed to add campus");
      }
    } catch (err) {
      console.error("Error adding campus:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to add campus");
    } finally {
      setAddLoading(false);
    }
  }

  function handleCampusClick(campus) {
    navigate(`/admin/campuses/${campus.campusId}`);
  }

  // Approve campus request
  async function handleApproveRequest(req) {
    console.log(req)
    try {
    //   // Only create campus on approve
      const createRes = await apiConnector(CampusApi.createCampus, "POST", {
        name: req.collegeName,
        code: req.collegeName.replace(/\s+/g, "_").toUpperCase().slice(0, 8),
        city: req.city,
      }, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });

      await apiConnector(
        `${AdminApi.reviewCampusRequestApi}/${req._id}/review`, 
        "PATCH", 
        { approved: true }, 
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      );

      toast.success("Campus approved and created!");
      setCampusRequests((prev) => prev.filter((r) => r._id !== req._id));
      
      // Refresh campuses list
      const campusesRes = await apiConnector(AdminApi.campusesSummaryApi, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setCampuses(campusesRes.data.campuses || []);
      setFilteredCampuses(campusesRes.data.campuses || []);
    } catch (err) {
      console.error("Error approving campus:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to approve campus");
    }
  }

  // Reject campus request (mark as reviewed/rejected in backend)
  async function handleRejectRequest(req) {
    try {
      // Only mark as reviewed/rejected, do NOT create campus
      await apiConnector(
        `${AdminApi.reviewCampusRequestApi}/${req._id}/review`, 
        "PATCH", 
        { approved: false }, 
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      );
      setCampusRequests((prev) => prev.filter((r) => r._id !== req._id));
      toast.success("Campus request rejected");
    } catch (err) {
      console.error("Error rejecting campus:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to reject campus request");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Registered Campuses</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by name, code, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 text-gray-50 focus:outline-none"
        />
        <Button onClick={() => setAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-semibold">Add Campus</Button>
      </div>
      {loading ? (
        <div className="text-slate-300 py-12 text-center">Loading campuses...</div>
      ) : error ? (
        <div className="text-red-400 py-12 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white/10 rounded-xl">
          <table className="min-w-full text-white bg-white/5 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-2 font-semibold text-black">Name</th>
                <th className="px-4 py-2 font-semibold text-black">Code</th>
                <th className="px-4 py-2 font-semibold text-black">City</th>
                <th className="px-4 py-2 font-semibold text-black">Outlets</th>
                <th className="px-4 py-2 font-semibold text-black">Users</th>
                <th className="px-4 py-2 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampuses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No campuses found.</td>
                </tr>
              ) : (
                filteredCampuses.map((campus) => (
                  <tr key={campus._id} className="border-b border-white/10 hover:bg-white/10 transition group">
                    <td className="px-4 py-2 font-medium text-white">{campus.name}</td>
                    <td className="px-4 py-2 text-white">{campus.code}</td>
                    <td className="px-4 py-2 text-white">{campus.city}</td>
                    <td className="px-4 py-2 text-white">{campus.canteenCount}</td>
                    <td className="px-4 py-2 text-white">{campus.userCount}</td>
                    <td className="px-4 py-2">
                      <Button size="sm" className="bg-black hover:bg-neutral-900 text-white font-semibold" onClick={() => handleCampusClick(campus)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Campus Requests Section */}
      <div className="mt-12 bg-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Campus Requests</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => refreshCampusRequests()}>Refresh</Button>
        </div>
        {requestsLoading ? (
          <div className="text-slate-300 py-8 text-center">Loading campus requests...</div>
        ) : requestsError ? (
          <div className="text-red-400 py-8 text-center">{requestsError}</div>
        ) : campusRequests.filter(r => r.isReviewed === false).length === 0 ? (
          <div className="text-slate-400 py-8 text-center">No campus requests found.</div>
        ) : (
          <div className="overflow-x-auto bg-white/5 rounded-xl">
            <table className="min-w-full text-white bg-white/5 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-4 py-2 font-semibold text-black">Name</th>
                  <th className="px-4 py-2 font-semibold text-black">Email</th>
                  <th className="px-4 py-2 font-semibold text-black">Mobile</th>
                  <th className="px-4 py-2 font-semibold text-black">Role</th>
                  <th className="px-4 py-2 font-semibold text-black">College</th>
                  <th className="px-4 py-2 font-semibold text-black">City</th>
                  <th className="px-4 py-2 font-semibold text-black">Message</th>
                  <th className="px-4 py-2 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campusRequests.filter(r => r.isReviewed === false).map((req) => (
                  <tr key={req._id} className="border-b border-white/10 hover:bg-white/10 transition group">
                    <td className="px-4 py-2 text-white">{req.name}</td>
                    <td className="px-4 py-2 text-white">{req.email}</td>
                    <td className="px-4 py-2 text-white">{req.mobile}</td>
                    <td className="px-4 py-2 text-white">{req.role}</td>
                    <td className="px-4 py-2 text-white">{req.collegeName}</td>
                    <td className="px-4 py-2 text-white">{req.city}</td>
                    <td className="px-4 py-2 text-white">{req.message || '-'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveRequest(req)}>Approve</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleRejectRequest(req)}>Reject</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Campus Modal */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Campus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Campus Name"
              value={addForm.name}
              onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Campus Code"
              value={addForm.code}
              onChange={e => setAddForm(f => ({ ...f, code: e.target.value }))}
            />
            <Input
              placeholder="City"
              value={addForm.city}
              onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddCampus} disabled={addLoading} className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full">
              {addLoading ? "Adding..." : "Add Campus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
