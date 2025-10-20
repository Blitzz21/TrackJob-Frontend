import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import DashboardHeader from "../components/DashboardHeader";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FollowUpModal from "../components/FollowUpModal";
import AddJobForm from "../components/AddJobForm";
import EditJobForm from "../components/EditJobForm";

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  /** ✅ Fetch all jobs for logged-in user */
  const fetchJobs = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await api.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch jobs:", err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /** ✅ Derived filtered list (memoized for performance) */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesFilter = filter === "all" || job.status === filter;
      const company = job.company?.toLowerCase() || "";
      const position = job.position?.toLowerCase() || "";
      const matchesSearch =
        company.includes(search.toLowerCase()) ||
        position.includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [jobs, filter, search]);

  /** ✅ Follow-up modal trigger */
  const handleFollowUp = (jobId: number) => {
    setSelectedJobId(jobId);
    setShowFollowUpModal(true);
  };

  /** ✅ Delete handler */
  const handleDelete = async (id: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error("❌ Failed to delete job:", err);
    }
  };

  /** ✅ Get selected job for follow-up */
  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId),
    [jobs, selectedJobId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* === Dashboard Header === */}
        <DashboardHeader jobs={jobs} />

        {/* === Applications Section === */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Section Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Applications
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage and track your job applications easily
              </p>
            </div>
            <button
              onClick={() => setShowAddJob(true)}
              className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl 
                         hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Application
            </button>
          </header>

          {/* Filters */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50/60 border-b border-slate-100">
            <JobFilters
              filter={filter}
              setFilter={setFilter}
              jobs={jobs}
              search={search}
              setSearch={setSearch}
            />
          </div>

          {/* Job List */}
          <div className="p-5 sm:p-6">
            {filteredJobs.length > 0 ? (
              <div className="space-y-3">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <JobCard
                      job={job}
                      onDelete={handleDelete}
                      onFollowUp={handleFollowUp}
                      onEdit={() => setEditingJob(job)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  No applications found
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  {search || filter !== "all"
                    ? "Try adjusting your filters or search query."
                    : "Get started by adding your first job application."}
                </p>
                {!search && filter === "all" && (
                  <button
                    onClick={() => setShowAddJob(true)}
                    className="mt-6 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 
                               hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    Add Your First Application
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* === Add Job Modal === */}
        <Dialog open={showAddJob} onOpenChange={setShowAddJob}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Job</DialogTitle>
            </DialogHeader>
            <AddJobForm onJobAdded={fetchJobs} />
          </DialogContent>
        </Dialog>

        {/* === Edit Job Modal === */}
        {editingJob && (
          <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Job</DialogTitle>
              </DialogHeader>
              <EditJobForm job={editingJob} onJobUpdated={fetchJobs} />
            </DialogContent>
          </Dialog>
        )}

        {/* === Follow-Up Modal === */}
        {selectedJob && (
          <FollowUpModal
            jobId={selectedJob.id}
            company={selectedJob.company}
            email={selectedJob.email}
            open={showFollowUpModal}
            onClose={() => {
              setShowFollowUpModal(false);
              setSelectedJobId(null);
            }}
            onFollowUpSent={fetchJobs}
          />
        )}
      </div>
    </div>
  );
}
