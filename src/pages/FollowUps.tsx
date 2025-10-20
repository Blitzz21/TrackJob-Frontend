import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Calendar, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
      toast.success("Follow-up deleted 🗑️");
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

  const scheduled = followUps.filter(
    (f) => new Date(f.follow_up_date) > new Date()
  );
  const sent = followUps.filter(
    (f) =>
      f.follow_up_date && new Date(f.follow_up_date).getFullYear() !== 1970
  );

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Follow-ups
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage and review your upcoming and sent follow-ups with clarity.
        </p>
      </div>

      {/* Scheduled Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Follow-ups
          </h2>
          <Badge variant="secondary" className="text-gray-600">
            {scheduled.length} scheduled
          </Badge>
        </div>

        {scheduled.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
            No scheduled follow-ups yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {scheduled.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">
                            {f.company}
                          </h3>
                        </div>
                        <Badge className="bg-blue-50 text-blue-700">
                          Scheduled
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{f.email}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(f.follow_up_date).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(f.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* Sent Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sent Follow-ups
          </h2>
          <Badge variant="secondary" className="text-gray-600">
            {sent.length} sent
          </Badge>
        </div>

        {sent.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
            No sent follow-ups.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sent.map((f) => (
              <Card
                key={f.id}
                className="p-5 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">
                      {f.company}
                    </h3>
                  </div>
                  <Badge className="bg-green-50 text-green-700">Sent</Badge>
                </div>

                <p className="text-sm text-gray-500">{f.email}</p>
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Sent on {new Date(f.follow_up_date).toLocaleDateString()}
                </div>

                {f.content && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed border-t border-gray-100 pt-3">
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
