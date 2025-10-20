import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  filter: string;
  setFilter: (f: string) => void;
  jobs: any[];
  search: string;
  setSearch: (s: string) => void;
}

export default function JobFilters({
  filter,
  setFilter,
  jobs,
  search,
  setSearch,
}: Props) {
  const counts = {
    all: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interviewing: jobs.filter((j) => j.status === "interviewing").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    offer: jobs.filter((j) => j.status === "offer").length,
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "applied", label: "Applied" },
    { key: "interviewing", label: "Interviewing" },
    { key: "rejected", label: "Rejected" },
    { key: "offer", label: "Offer" },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
      {/* Search box */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 w-full rounded-lg border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              filter === key
                ? "bg-[#111827] text-white border-transparent shadow-sm"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {label}{" "}
            <span
              className={`ml-1 text-xs ${
                filter === key ? "text-gray-200" : "text-gray-500"
              }`}
            >
              ({counts[key]})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
