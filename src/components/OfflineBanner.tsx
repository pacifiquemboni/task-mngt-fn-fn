import { useOnlineStatus } from "../hooks/usePwa";

/**
 * A thin banner pinned to the top of the viewport when the browser is offline.
 * It warns users that data may be stale and mutations cannot be saved.
 */
export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[200] flex items-center justify-center gap-2 bg-amber-500 text-black text-sm font-medium py-2 px-4 shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        You're offline — showing cached data. Changes won't be saved until you
        reconnect.
      </span>
    </div>
  );
}
