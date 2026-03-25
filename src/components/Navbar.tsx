import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import InstallButton from "./InstallButton";

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLink = (path: string, label: string, icon: string) => (
    <Link
      to={path}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive(path) ? "bg-amber-500/15 text-amber-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}
      `}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-amber-500/25">
              T
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline group-hover:text-amber-600 transition-colors">
              TaskFlow
            </span>
          </Link>

          {/* Center nav */}
          <div className="flex items-center gap-1">
            {navLink("/", "Dashboard", "📋")}
            {navLink("/calendar", "Calendar", "📅")}
            {navLink("/tags", "Tags", "🏷️")}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <InstallButton />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
