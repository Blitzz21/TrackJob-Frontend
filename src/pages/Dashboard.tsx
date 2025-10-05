import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardHeader from "../components/DashboardHeader";
import JobFilters from "../components/JobFilters";
import JobCard from "../components/JobCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JobForm from "../components/JobForm";
import FollowUpModal from "../components/FollowUpModal";

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddJob, setShowAddJob] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleFollowUp = (job: any) => {
  setSelectedJob(job);
  setFollowUpOpen(true);
  };

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

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter = filter === "all" || job.status === filter;
    const company = job.company?.toLowerCase() || "";
    const position = job.position?.toLowerCase() || "";
    const matchesSearch =
      company.includes(search.toLowerCase()) ||
      position.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            onDelete={async (id) => {
              const token = localStorage.getItem("token") || sessionStorage.getItem("token");
              await api.delete(`/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchJobs();
            }}
            onFollowUp={() => handleFollowUp(job)}
            onEdit={(id) => {
              setEditingJob(jobs.find((j) => j.id === id));
              setShowEditJob(true);
            }}
          />
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-gray-500 text-sm">No jobs found.</p>
        )}
      </div>

      {/* Add Job Modal */}
      <Dialog open={showAddJob} onOpenChange={setShowAddJob}>
        <DialogContent aria-describedby="edit-job-description" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Job</DialogTitle>
          </DialogHeader>
          <p id="edit-job-description" className="sr-only">
            Fill in the form below to add your job application details.
          </p>
          <JobForm onJobAdded={fetchJobs} />
        </DialogContent>
      </Dialog>

      <FollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        jobId={selectedJob?.id}
        company={selectedJob?.company}
        position={selectedJob?.position}
      />

      {/* Edit Job Modal */}
      <Dialog open={showEditJob} onOpenChange={setShowEditJob}>
        <DialogContent aria-describedby="edit-job-description" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          <p id="edit-job-description" className="sr-only">
            Update your job application details.
          </p>
          {editingJob && (
            <JobForm
              jobId={editingJob.id}
              initialValues={editingJob}
              onJobAdded={fetchJobs}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
