import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  // if already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-c flex flex-col">
      {/* Hero */}
      <header className="flex-1 h-dvh">
        <div className="max-w-7xl m-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="h-full w-full flex flex-col items-center justify-center space-y-6">
              <h1 className="text-5xl md:text-7xl md:text-center font-extrabold leading-tight">
                Never lose track of a{" "}
                <span className="text-[#2563eb] drop-shadow md:text-center">job opportunity</span> again
              </h1>
              <p className="text-gray-600 max-w-xl">
                <strong>TrackJob</strong> helps you organize, track, and optimize your job search.
                Get hired faster with our intelligent application tracking system.
              </p>

              <div className="flex items-center gap-4 mt-6">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-md bg-[#0f1724] text-white font-medium shadow"
                >
                  Start Tracking for Free
                </Link>
                <a
                  href="#features"
                  className="text-sm text-gray-700 hover:underline"
                >
                  Learn more
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="p-4 border rounded-lg text-sm text-gray-700">
                  <div className="text-xs text-pink-500 font-medium inline-block px-2 py-1 border rounded-full bg-pink-50">The Problem</div>
                  <div className="mt-2">Job searching is chaotic and overwhelming.</div>
                </div>
                <div className="p-4 border rounded-lg text-sm text-gray-700">
                  <div className="font-medium">Organize applications</div>
                  <div className="mt-2 text-xs text-gray-500">Keep everything in one place</div>
                </div>
                <div className="p-4 border rounded-lg text-sm text-gray-700">
                  <div className="font-medium">Set reminders</div>
                  <div className="mt-2 text-xs text-gray-500">Never forget a follow-up</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section id="features" className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">One dashboard to rule them all</h2>
            <p className="text-gray-600 mb-6">
              TrackJob centralizes your entire job search process. Track applications, set reminders, analyze performance, and get hired faster.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li>✅ Track unlimited job applications</li>
              <li>✅ Automated follow-up reminders</li>
              <li>✅ Performance insights</li>
            </ul>

            <div className="mt-6">
              <Link to="/register" className="px-6 py-3 rounded-md bg-[#0f1724] text-white font-medium shadow">
                Get Started Now
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="font-semibold mb-3">Clean Dashboard</h3>
              <p className="text-sm text-gray-600 mb-4">See all your applications at a glance.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-xs text-gray-500">Interviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-600">&copy; {new Date().getFullYear()} TrackJob. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-gray-600 hover:underline">Privacy</Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
