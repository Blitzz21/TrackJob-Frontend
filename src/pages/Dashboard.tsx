import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardHeader from "../components/DashboardHeader";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JobForm from "../components/JobForm";
import FollowUpModal from "../components/FollowUpModal"; // ✅ make sure this exists

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [showAddJob, setShowAddJob] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ follow-up modal state
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await api.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter + search jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === "all" || job.status === filter;
    const company = job.company?.toLowerCase() || "";
    const position = job.position?.toLowerCase() || "";
    const matchesSearch =
      company.includes(search.toLowerCase()) ||
      position.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // ✅ When Follow Up button is clicked
  const handleFollowUp = (jobId: number) => {
    setSelectedJobId(jobId);
    setShowFollowUpModal(true);
  };

  // ✅ When Delete button is clicked
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  return (
    <div className="p-6">
      <DashboardHeader jobs={jobs} />

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Applications</h2>
        <button
          className="px-4 py-2 bg-[#111827] text-white rounded-lg"
          onClick={() => setShowAddJob(true)}
        >
          + Add Job
        </button>
      </div>

      {/* Filters */}
      <JobFilters
        filter={filter}
        setFilter={setFilter}
        jobs={jobs}
        search={search}
        setSearch={setSearch}
      />

      {/* Job List */}
      <div className="mt-4 space-y-3">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onFollowUp={handleFollowUp}
          />
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-gray-500 text-sm">No jobs found.</p>
        )}
      </div>

      {/* Add Job Modal */}
      <Dialog open={showAddJob} onOpenChange={setShowAddJob}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Job</DialogTitle>
          </DialogHeader>
          <JobForm onJobAdded={fetchJobs} />
        </DialogContent>
      </Dialog>

      {/* ✅ Follow Up Modal */}
      {selectedJobId && (() => {
        const selectedJob = jobs.find(job => job.id === selectedJobId);
        if (!selectedJob) return null;
        return (
          <FollowUpModal
            jobId={selectedJobId}
            company={selectedJob.company}
            email={selectedJob.email}
            open={showFollowUpModal}
            onClose={() => {
              setShowFollowUpModal(false);
              setSelectedJobId(null);
            }}
            onFollowUpSent={fetchJobs}
          />
        );
      })()}
    </div>
  );
}
