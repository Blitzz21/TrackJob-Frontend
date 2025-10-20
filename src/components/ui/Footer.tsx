import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-gray-600">&copy; {new Date().getFullYear()} TrackJob. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-sm text-gray-600 hover:underline">Privacy</Link>
          <Link to="/terms" className="text-sm text-gray-600 hover:underline">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
