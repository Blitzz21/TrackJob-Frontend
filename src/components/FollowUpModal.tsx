import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Loader2, Calendar, Send, Mail, Building2 } from "lucide-react";

interface FollowUpModalProps {
  jobId: number;
  company: string;
  email: string;
  open: boolean;
  onClose: () => void;
  onFollowUpSent: () => void;
}

export default function FollowUpModal({
  jobId,
  company,
  email,
  open,
  onClose,
  onFollowUpSent,
}: FollowUpModalProps) {
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [sendNow, setSendNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      if (!content.trim()) {
        toast.warning("Please enter your follow-up message.");
        return;
      }

      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const payload = {
        follow_up_date: sendNow ? new Date().toISOString() : date,
        content,
        sendNow,
      };

      await api.post(`/jobs/${jobId}/followup`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        sendNow
          ? "Follow-up email sent successfully ✅"
          : "Follow-up scheduled 📅"
      );
      onFollowUpSent();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send follow-up ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl bg-white/95 backdrop-blur-md border border-gray-100">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            ✉️ Send Follow-Up
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Send or schedule a follow-up for your job application.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 mt-3"
          >
            {/* Job Info */}
            <div className="flex flex-col gap-2 mb-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{company}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/30"
                rows={5}
                placeholder={`Write a follow-up message to ${company}...`}
              />
            </div>

            {/* Schedule Date */}
            <AnimatePresence>
              {!sendNow && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Schedule Date
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 border-gray-200 shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Controls */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendNow}
                  onChange={(e) => setSendNow(e.target.checked)}
                  className="accent-[#111827]"
                />
                Send Now
              </label>

              <Button
                onClick={handleSend}
                disabled={loading || (!sendNow && !date)}
                className="bg-[#111827] text-white hover:bg-[#1f2937] transition-all px-4 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sendNow ? "Send Now" : "Schedule"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
