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

export default function AddJobForm({ onJobAdded }: { onJobAdded: () => void }) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: "",
      position: "",
      email: "",
      status: "applied",
      applied_date: "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.post("/jobs", data, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Job added successfully ✅");
      form.reset();
      onJobAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add job ❌");
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
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
            <FormLabel>Applied Date (optional)</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full bg-[#111827] text-white">Add Job</Button>
      </form>
    </Form>
  );
}
