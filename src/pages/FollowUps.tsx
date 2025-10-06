import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Calendar, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FollowUp {
  id: number;
  company: string;
  email: string;
  follow_up_date: string;
  content?: string;
  type?: string;
  created_at?: string;
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowUps = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await api.get("/followups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setFollowUps(res.data);
      } else {
        setFollowUps([]);
        console.warn("Unexpected follow-up response:", res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load follow-ups ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.delete(`/followups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Scheduled follow-up deleted 🗑️");
      fetchFollowUps();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete follow-up ❌");
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
      </div>
    );
  }

  // Split into scheduled and sent
  const scheduled = followUps.filter(
    (f) => new Date(f.follow_up_date) > new Date()
  );
  const sent = followUps.filter(
    (f) => new Date(f.follow_up_date) <= new Date()
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">📅 Follow-ups</h1>

      {/* Scheduled Follow-ups */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Scheduled Follow-ups
        </h2>
        {scheduled.length === 0 ? (
          <p className="text-gray-500 text-sm">No scheduled follow-ups.</p>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {scheduled.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-4 flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {f.company}
                      </div>
                      <p className="text-sm text-gray-500">{f.email}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(f.follow_up_date).toLocaleDateString()}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(f.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Sent Follow-ups */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Sent Follow-ups
        </h2>
        {sent.length === 0 ? (
          <p className="text-gray-500 text-sm">No sent follow-ups.</p>
        ) : (
          <div className="grid gap-3">
            {sent.map((f) => (
              <Card
                key={f.id}
                className="p-4 border border-gray-100 rounded-xl shadow-sm"
              >
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {f.company}
                </div>
                <p className="text-sm text-gray-500">{f.email}</p>
                <div className="text-xs text-gray-400 mt-1">
                  Sent on {new Date(f.follow_up_date).toLocaleDateString()}
                </div>
                {f.content && (
                  <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
                    {f.content}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
