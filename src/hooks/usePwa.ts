import { useEffect, useState, useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// useOnlineStatus — reactive hook that tracks navigator.onLine
// Uses useSyncExternalStore for tear-free reads in concurrent mode.
// ---------------------------------------------------------------------------
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

/**
 * Returns `true` when the browser has network connectivity.
 * Automatically re-renders when the status changes.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}

// ---------------------------------------------------------------------------
// useInstallPrompt — captures the `beforeinstallprompt` event so we can
// trigger the native install dialog from a custom button.
// ---------------------------------------------------------------------------
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches
  );

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the default mini-infobar on mobile.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect when the user installs.
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    const { outcome } = await deferredPrompt.prompt();
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    return outcome === "accepted";
  };

  return {
    /** Whether the browser has a deferred install prompt ready */
    canInstall: !!deferredPrompt && !isInstalled,
    /** Whether the app is already installed */
    isInstalled,
    /** Call to show the native install dialog. Returns true if accepted. */
    promptInstall,
  };
}
