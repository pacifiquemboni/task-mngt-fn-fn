import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";

// ── Lazy-loaded pages ─────────────────────────────────────────────────
// Each page becomes a separate chunk; only the active route is downloaded.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const Tags = lazy(() => import("./pages/Tags"));

// ── Lightweight page-level skeleton (renders instantly → fast LCP) ────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar placeholder */}
      <div className="sticky top-0 z-50 h-14 bg-white/80 border-b border-gray-200 backdrop-blur" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Heading skeleton */}
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse mb-6" />

        {/* Card grid skeleton: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-50 border border-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <Tags />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global offline indicator — shown above everything */}
        <OfflineBanner />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}