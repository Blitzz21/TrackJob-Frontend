import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "../services/api";

interface FollowUpModalProps {
  open: boolean;
  onClose: () => void;
  jobId: number | null;
  company?: string;
  position?: string;
}

export default function FollowUpModal({ open, onClose, jobId, company, position }: FollowUpModalProps) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch follow-up history
  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!jobId) return;
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await api.get(`/followups/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch {
        console.error("Failed to fetch follow-ups");
      }
    };
    if (open) fetchFollowUps();
  }, [jobId, open]);

  const handleSend = async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      await api.put(
        `/jobs/followup/${jobId}`,
        {
          follow_up_date: new Date(),
          emailContent: message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // also log it in followups table
      await api.post(
        `/followups`,
        {
          job_id: jobId,
          follow_up_date: new Date(),
          type: "email",
          content: message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Follow-up saved ✅");
      setMessage("");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send follow-up ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Follow-up with {company}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mb-3">
          Position: <strong>{position}</strong>
        </p>

        <Textarea
          placeholder="Write your follow-up message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />

        <Button
          onClick={handleSend}
          disabled={loading}
          className="mt-4 w-full bg-[#111827] text-white"
        >
          {loading ? "Sending..." : "Send Follow-Up"}
        </Button>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Previous Follow-Ups:</h4>
            <ul className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
              {history.map((f) => (
                <li key={f.id}>
                  📅 {new Date(f.follow_up_date).toLocaleDateString()} — {f.content}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
