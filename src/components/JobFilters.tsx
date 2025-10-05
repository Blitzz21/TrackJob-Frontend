import { Input } from "@/components/ui/input";

interface Props {
  filter: string;
  setFilter: (f: string) => void;
  jobs: any[];
  search: string;
  setSearch: (s: string) => void;
}

export default function JobFilters({ filter, setFilter, jobs, search, setSearch }: Props) {
  const counts = {
    all: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interviewing: jobs.filter((j) => j.status === "interviewing").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    offer: jobs.filter((j) => j.status === "offer").length,
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
      {/* Search box */}
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {(["all", "applied", "interviewing", "rejected", "offer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
              filter === tab
                ? "bg-[#111827] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>
    </div>
  );
}
