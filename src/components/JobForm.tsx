import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "../services/api";
import { z } from "zod";

// ✅ Schema (follow_up_date removed, applied_date optional)
const jobSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  status: z.enum(["applied", "interviewing", "rejected", "offer"]).default("applied").optional(),
  applied_date: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  onJobAdded: () => void;
  jobId?: number;
  initialValues?: Partial<JobFormData>;
}

export default function JobForm({ onJobAdded, jobId, initialValues }: JobFormProps) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: initialValues?.company || "",
      position: initialValues?.position || "",
      status: initialValues?.status || "applied",
      applied_date: initialValues?.applied_date || "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (jobId) {
        // Edit Job
        await api.put(`/jobs/${jobId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job updated successfully ✅");
      } else {
        // Add Job
        await api.post("/jobs", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job added successfully ✅");
      }

      form.reset();
      onJobAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save job ❌");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Company */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Position */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Job Position" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Applied Date (optional) */}
        <FormField
          control={form.control}
          name="applied_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applied Date (optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="border rounded-md p-2 w-full"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#111827]">
          {jobId ? "Update Job" : "Add Job"}
        </Button>
      </form>
    </Form>
  );
}
