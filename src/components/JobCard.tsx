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
    <Card className="group flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Company Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] text-white">
          <Building2 className="w-5 h-5" />
        </div>

        {/* Job Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
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

      {/* Right side (buttons, only show on hover) */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <Button
          variant="outline"
          size="sm"
          className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          onClick={() => onEdit?.(job.id)}
        >
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          onClick={() => onFollowUp?.(job.id)}
        >
          Follow up
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(job.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}
