import { useEffect, useState } from "react";
import api from "../services/api";

interface Props {
  jobs: any[];
}

export default function DashboardHeader({ jobs }: Props) {
  const [userName, setUserName] = useState("User");

  // ✅ Fetch user name from profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.name) setUserName(res.data.name.split(" ")[0]); // first name only
      } catch (err) {
        console.error("❌ Failed to load user info:", err);
      }
    };
    fetchUser();
  }, []);

  // Job stats
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "applied").length;
  const interview = jobs.filter((j) => j.status === "interviewing").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Applied",
      value: applied,
      icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      label: "Interviewing",
      value: interview,
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "M6 18L18 6M6 6l12 12",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {getGreeting()}, {userName}{" "}
              <span className="inline-block ml-2 animate-wave origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-slate-600 mt-2 text-base">
              Track your progress and stay on top of your job search journey
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative bg-white rounded-2xl p-5 border border-slate-200/60 
                     hover:border-slate-300/60 transition-all duration-300 hover:shadow-lg
                     hover:-translate-y-1 cursor-default overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "backwards",
            }}
          >
            {/* Gradient Accent Bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} 
                          transform origin-left scale-x-0 group-hover:scale-x-100 
                          transition-transform duration-500`}
            />

            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl 
                          ${stat.bgColor} mb-4 transition-transform duration-300 
                          group-hover:scale-110`}
            >
              <svg
                className={`w-6 h-6 ${stat.textColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={stat.icon}
                />
              </svg>
            </div>

            {/* Content */}
            <div>
              <p className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>

            {/* Hover Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 
                          group-hover:opacity-[0.02] transition-opacity duration-300 -z-10`}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }
        .animate-wave {
          animation: wave 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
