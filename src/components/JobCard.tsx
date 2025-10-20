import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, Trash2 } from "lucide-react";

interface JobCardProps {
  job: {
    id: number;
    company: string;
    position: string;
    email?: string;
    status: "applied" | "interviewing" | "rejected" | "offer";
    applied_date?: string;
  };
  onDelete?: (id: number) => void;
  onFollowUp?: (id: number) => void;
  onEdit?: (job: any) => void;
}

export default function JobCard({ job, onDelete, onFollowUp, onEdit }: JobCardProps) {
  const statusColors: Record<JobCardProps["job"]["status"], string> = {
    applied: "bg-blue-100 text-blue-700",
    interviewing: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    offer: "bg-green-100 text-green-700",
  };

  return (
    <Card className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border hover:shadow-md transition">
      {/* Left side */}
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
        {/* Company Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] text-white flex-shrink-0">
          <Building2 className="w-5 h-5" />
        </div>

        {/* Job Info */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-base">{job.company}</h3>
            <Badge className={`${statusColors[job.status]} capitalize`}>
              {job.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{job.position}</p>
          {job.applied_date && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              {new Date(job.applied_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Right side (buttons) */}
      <div
        className="
          flex flex-wrap sm:flex-nowrap
          items-center gap-2
          justify-start sm:justify-end
          w-full sm:w-auto
          md:opacity-0 sm:group-hover:opacity-100 sm:transition
        "
      >
        <Button
          variant="outline"
          size="sm"
          className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 w-full sm:w-auto"
          onClick={() => onEdit?.(job.id)}
        >
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
          onClick={() => onFollowUp?.(job.id)}
        >
          Follow up
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-full sm:w-9 sm:h-9 flex justify-center"
          onClick={() => onDelete?.(job.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}
