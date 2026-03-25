import { useEffect, useState, lazy, Suspense } from "react";
import api from "../api/axios";
import type { Tag } from "../types";
import TagBadge from "../components/TagBadge";
import Navbar from "../components/Navbar";

// ── Lazy-load react-colorful (only needed when the picker is open) ────
const HexColorPicker = lazy(() =>
  import("react-colorful").then((m) => ({ default: m.HexColorPicker }))
);

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    const res = await api.get("/tags");
    setTags(res.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Tag name is required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/tags", { name: name.trim(), color });
      setName("");
      setColor("#6366f1");
      setShowPicker(false);
      fetchTags();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to create tag");
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id: string) => {
    await api.delete(`/tags/${id}`);
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const presetColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#06b6d4", "#3b82f6", "#6366f1", "#a855f7",
    "#ec4899", "#f43f5e",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tags</h1>

        {/* Create tag form */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Create New Tag</h2>

          <form onSubmit={createTag} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tag name..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />

              {/* Color button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="h-full px-4 rounded-lg border border-gray-200 flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  Color
                </button>

                {showPicker && (
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl p-3 shadow-xl">
                    <Suspense fallback={<div className="w-[200px] h-[200px] bg-gray-100 rounded-lg animate-pulse" />}>
                      <HexColorPicker color={color} onChange={setColor} />
                    </Suspense>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {presetColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setColor(c); setShowPicker(false); }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                            ${c === color ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {name.trim() && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Preview:</span>
                <TagBadge tag={{ id: "preview", name: name.trim(), color, userId: "" }} />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg
                transition-colors disabled:opacity-50 shadow-lg shadow-amber-500/25"
            >
              {loading ? "Creating..." : "Create Tag"}
            </button>
          </form>
        </div>

        {/* Tag list */}
        <div className="space-y-2">
          {tags.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏷️</div>
              <p className="text-gray-400 text-sm">No tags yet. Create one above!</p>
            </div>
          )}

          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 group"
            >
              <TagBadge tag={tag} />
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
