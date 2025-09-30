import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { addFollowUp } from "../services/followupService";

export default function FollowUpModal({ job, open, onClose, onFollowUpAdded }: any) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("email");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      await addFollowUp({
        jobId: job.id,
        follow_up_date: date,
        type,
        content,
      });

      toast.success("Follow-up saved ✅");
      onFollowUpAdded(); // refresh follow-ups
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save follow-up ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Follow Up: {job.company}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Follow-up Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-2 py-2"
            >
              <option value="email">Email</option>
              <option value="reminder">Reminder</option>
              <option value="status">Status Update</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Email / Notes</label>
            <Textarea
              placeholder="Write your follow-up email or notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#111827] text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
