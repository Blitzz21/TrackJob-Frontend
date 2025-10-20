import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "../services/api";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const jobSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  email: z.string().email("Enter a valid email"),
  status: z.enum(["applied", "interviewing", "rejected", "offer"]),
  applied_date: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function EditJobForm({
  job,
  onJobUpdated,
}: {
  job: any;
  onJobUpdated: () => void;
}) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: job.company || "",
      position: job.position || "",
      email: job.email || "",
      status: job.status || "applied",
      applied_date: job.applied_date ? job.applied_date.split("T")[0] : "",
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        company: job.company || "",
        position: job.position || "",
        email: job.email || "",
        status: job.status || "applied",
        applied_date: job.applied_date ? job.applied_date.split("T")[0] : "",
      });
    }
  }, [job, form]);

  const onSubmit = async (data: JobFormData) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.put(`/jobs/${job.id}`, data, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Job updated successfully ✅");
      onJobUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update job ❌");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl><Input placeholder="Company Name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="position" render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl><Input placeholder="Job Position" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl><Input type="email" placeholder="hr@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="applied_date" render={({ field }) => (
          <FormItem>
            <FormLabel>Applied Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full bg-[#111827] text-white">Update Job</Button>
      </form>
    </Form>
  );
}
