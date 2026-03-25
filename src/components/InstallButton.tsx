import { useInstallPrompt } from "../hooks/usePwa";

/**
 * A small button shown in the Navbar (or elsewhere) that lets users
 * install the PWA. Only renders when the browser fires
 * `beforeinstallprompt` and the app is not already installed.
 */
export default function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      onClick={promptInstall}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
      title="Install TaskFlow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Install
    </button>
  );
}
