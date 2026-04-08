"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getToken, removeToken, isLoggedIn, getAdminMe,
  adminUploadPhoto, adminDeletePhoto, adminGetPhotos,
} from "../../../../services/adminApi";
import { Photo } from "../../../../services/api";
import ThemeToggle from "../../../../components/ThemeToggle";

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-2xl border bg-white dark:bg-white/5 backdrop-blur-sm p-5 border-zinc-200 dark:border-white/10 flex items-center gap-4 shadow-sm dark:shadow-none`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        <p className="text-xs font-medium text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

// ── Upload panel ───────────────────────────────────────────────────────────
function UploadPanel({ token, onSuccess }: { token: string; onSuccess: (p: Photo) => void }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setError(null);
    setUploading(true);
    setSuccess(false);
    try {
      const photo = await adminUploadPhoto(token, { title: title.trim(), caption, tags, file });
      onSuccess(photo);
      setSuccess(true);
      setTitle(""); setCaption(""); setTags(""); setFile(null); setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Upload failed. Check the server.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
      <h2 className="mb-5 text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
        <svg className="h-5 w-5 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        Upload New Photo
      </h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          Photo uploaded successfully!
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/3 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5"
        >
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <>
              <svg className="mb-2 h-10 w-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-sm text-zinc-500">Drop image here or <span className="text-cyan-400">click to browse</span></p>
              <p className="mt-1 text-xs text-zinc-600">JPEG, PNG or WebP</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Fields */}
        {[
          { id: "title", label: "Title *", value: title, set: setTitle, placeholder: "E.g. Golden Hour at Patagonia", type: "text" },
          { id: "caption", label: "Caption", value: caption, set: setCaption, placeholder: "Optional description…", type: "text" },
          { id: "tags", label: "Tags", value: tags, set: setTags, placeholder: "nature, landscape, 4k (comma-separated)", type: "text" },
        ].map(({ id, label, value, set, placeholder, type }) => (
          <div key={id} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</label>
            <input
              id={id}
              type={type}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              required={id === "title"}
              className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={uploading || !file || !title.trim()}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-500 hover:to-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Uploading & Processing…
            </>
          ) : "Upload Photo"}
        </button>
      </form>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "upload" | "photos">("overview");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/admin"); return; }
    const tok = getToken()!;
    setToken(tok);
    getAdminMe(tok).then(setAdminUser).catch(() => { removeToken(); router.replace("/admin"); });
    loadPhotos(tok, 1);
  }, []);

  const loadPhotos = async (tok: string, p: number) => {
    setLoadingPhotos(true);
    try {
      const data = await adminGetPhotos(p, 20);
      setPhotos(data.results);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this photo permanently?")) return;
    setDeletingId(id);
    try {
      await adminDeletePhoto(token, id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => { removeToken(); router.replace("/admin"); };

  const tabs = [
    { key: "overview", label: "Overview", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { key: "upload", label: "Upload", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> },
    { key: "photos", label: "Manage Photos", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-white/10 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">Pixlume</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-500">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-zinc-100 dark:border-white/10 px-4 py-4 mt-auto">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 dark:bg-white/5 px-3 py-3 border border-zinc-200/50 dark:border-white/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 text-xs font-bold text-white shadow-sm">
              {adminUser?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-200">{adminUser?.email || "Admin"}</p>
              <p className="text-[10px] text-zinc-500 font-medium tracking-tight">Administrator</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-zinc-400 hover:text-red-500 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="pl-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 px-8 py-4 backdrop-blur-xl transition-all">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white capitalize">
              {activeTab === "overview" ? "Dashboard Overview" : activeTab === "upload" ? "Upload Photo" : "Manage Photos"}
            </h1>
            <p className="text-xs text-zinc-500">Pixlume Admin · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-white/5 px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 transition-all hover:bg-zinc-200 dark:hover:bg-white/10">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              View Site
            </a>
            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1" />
            <ThemeToggle />
            <button
              onClick={() => setActiveTab("upload")}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-cyan-500 active:scale-95 shadow-lg shadow-cyan-600/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              New Upload
            </button>
          </div>
        </header>

        <div className="p-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Total Photos" value={total} color="bg-cyan-500/15 text-cyan-400"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                />
                <StatCard label="Total Downloads" value={photos.reduce((a, p) => a + (p.downloads || 0), 0).toLocaleString()} color="bg-violet-500/15 text-violet-400"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>}
                />
                <StatCard label="4K Photos" value={photos.filter(p => p.image_4k_url).length} color="bg-amber-500/15 text-amber-400"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>}
                />
                <StatCard label="Admin" value={adminUser?.email?.split("@")[0] || "—"} color="bg-emerald-500/15 text-emerald-400"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                />
              </div>

              {/* Recent photos preview */}
              <div className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm dark:shadow-none transition-all">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-zinc-900 dark:text-white">Recent Photos</h2>
                  <button onClick={() => setActiveTab("photos")} className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300">View all →</button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 transition-all">
                  {photos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      {photo.thumbnail_url && (
                        <Image src={photo.thumbnail_url} alt={photo.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">{photo.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── UPLOAD TAB ── */}
          {activeTab === "upload" && token && (
            <div className="max-w-xl">
              <UploadPanel
                token={token}
                onSuccess={(photo) => {
                  setPhotos((prev) => [photo, ...prev]);
                  setTotal((t) => t + 1);
                }}
              />
            </div>
          )}

          {/* ── PHOTOS TAB ── */}
          {activeTab === "photos" && (
            <div>
              {loadingPhotos ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="skeleton-shimmer aspect-square rounded-2xl" />
                  ))}
                </div>
              ) : photos.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-600">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p>No photos yet</p>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-zinc-500">{total} total photos · Page {page}</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 transition-all">
                    {photos.map((photo) => (
                      <div key={photo.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none">
                        <div className="relative aspect-square">
                          {photo.thumbnail_url ? (
                            <Image src={photo.thumbnail_url} alt={photo.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                              <svg className="h-8 w-8 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleDelete(photo.id)}
                              disabled={deletingId === photo.id}
                              className="flex items-center gap-1.5 rounded-xl bg-red-500/90 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-red-500 active:scale-95 disabled:opacity-60"
                            >
                              {deletingId === photo.id ? (
                                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                              )}
                              Delete
                            </button>
                          </div>
                          {photo.image_4k_url && (
                            <span className="absolute top-2 left-2 rounded-full bg-cyan-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm">4K</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-200">{photo.title}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-600 font-medium">{photo.downloads || 0} downloads · {new Date(photo.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      disabled={page <= 1 || loadingPhotos}
                      onClick={() => token && loadPhotos(token, page - 1)}
                      className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium transition-all hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-40"
                    >← Prev</button>
                    <span className="text-sm text-zinc-500 font-medium">Page {page}</span>
                    <button
                      disabled={photos.length < 20 || loadingPhotos}
                      onClick={() => token && loadPhotos(token, page + 1)}
                      className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium transition-all hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-40"
                    >Next →</button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
