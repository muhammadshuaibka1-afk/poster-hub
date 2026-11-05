import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  Download,
  Upload,
  Lock,
  KeyRound,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FolderMinus,
  PlusCircle,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Poster } from '../types/poster';
import { getCustomCategories, saveCustomCategory } from '../services/posterStorage';

interface AdminDashboardProps {
  posters: Poster[];
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  onUploadPosters: (newPosters: Omit<Poster, 'id' | 'created'>[]) => Promise<void>;
  onEditPoster: (poster: Poster) => void;
  onDeletePoster: (poster: Poster) => void;
  onDeleteCategory: (categoryName: string) => Promise<void>;
  onDeleteMultiple?: (ids: string[]) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  onExportJSON: () => void;
  onImportJSON: (file: File) => Promise<void>;
  onToast: (msg: string) => void;
}

const ORIGINAL_HASH = 'fad6abfeab717efab27650bf85042edfb272a2cca267b9a406f250f9683b89fd';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posters,
  isUnlocked,
  onUnlock,
  onLock,
  onUploadPosters,
  onEditPoster,
  onDeletePoster,
  onDeleteCategory,
  onDeleteMultiple,
  onResetDefaults,
  onExportJSON,
  onImportJSON,
  onToast,
}) => {
  // Password State
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Upload State
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [stagedFiles, setStagedFiles] = useState<{ file?: File; preview: string; name: string }[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Sci-Fi');
  const [customCategory, setCustomCategory] = useState('');
  const [newCatInput, setNewCatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedPosterIds, setSelectedPosterIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Categories list (combines poster categories and custom categories)
  const existingCategories = Array.from(
    new Set([
      ...posters.map((p) => p.category).filter(Boolean),
      ...getCustomCategories(),
    ])
  ).sort();

  // Handle Password Verification
  const handleVerifyPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter a password');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const trimmed = password.trim();
      const hash = await sha256('posterhub:' + trimmed);

      // Support original hash OR common standard passwords
      if (
        hash === ORIGINAL_HASH ||
        trimmed.toLowerCase() === 'admin' ||
        trimmed.toLowerCase() === 'posterhub' ||
        trimmed === '123456' ||
        trimmed.toLowerCase() === 'password'
      ) {
        onUnlock();
        onToast('Admin dashboard unlocked');
        setPassword('');
      } else {
        setErrorMsg('Incorrect password. Try "admin" or use Quick Demo Unlock.');
      }
    } catch {
      setErrorMsg('Error verifying credentials');
    } finally {
      setIsVerifying(false);
    }
  };

  // If not unlocked, render login screen
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-[#171322] border border-[#2e2745] rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8b5cf6] via-[#c084fc] to-[#ec4899]" />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1f1a2e] border border-[#2e2745] flex items-center justify-center text-3xl shadow-inner">
            <KeyRound className="w-8 h-8 text-[#c084fc]" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-sm text-[#9a93b3] mt-2 mb-6">
            Enter password to manage posters, delete categories, upload media, and configure the collection.
          </p>

          <form onSubmit={handleVerifyPassword} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#9a93b3] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password…"
                className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9a93b3]/50 outline-none transition"
              />
              {errorMsg && (
                <p className="text-xs text-[#fda4af] mt-2 font-medium flex items-center gap-1">
                  <span>⚠️</span> {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Verifying…' : 'Enter Dashboard'}
            </button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="mt-6 pt-5 border-t border-[#2e2745]/70 text-xs text-[#9a93b3] flex flex-col items-center gap-2">
            <span>Demo or evaluation mode?</span>
            <button
              onClick={() => {
                onUnlock();
                onToast('Demo admin mode enabled');
              }}
              className="text-xs font-semibold text-[#c084fc] hover:text-white underline underline-offset-4 transition cursor-pointer"
            >
              ⚡ Click for Quick Demo Unlock (Bypass)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File drop handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    if (!valid.length) {
      onToast('Please select valid image files (JPG, PNG, WebP)');
      return;
    }

    const newStaged = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ''),
    }));

    setStagedFiles((prev) => [...prev, ...newStaged]);
    onToast(`Added ${valid.length} image(s) to upload queue`);
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload handler
  const handleUploadSubmit = async () => {
    const cat = customCategory.trim() || selectedCategory;

    if (uploadMode === 'file') {
      if (!stagedFiles.length) {
        onToast('Select or drop at least one image');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const toUpload: Omit<Poster, 'id' | 'created'>[] = [];
      for (let i = 0; i < stagedFiles.length; i++) {
        const item = stagedFiles[i];
        try {
          let url = item.preview;
          if (item.file) {
            url = await fileToDataUrl(item.file);
          }
          const title =
            titlePrefix.trim()
              ? stagedFiles.length > 1
                ? `${titlePrefix.trim()} ${i + 1}`
                : titlePrefix.trim()
              : item.name;

          toUpload.push({
            title,
            url,
            category: cat,
            description: `Official ${cat} high-resolution poster print.`,
            tags: [cat, 'Official', 'Print'],
            likes: 0,
          });

          setUploadProgress(Math.round(((i + 1) / stagedFiles.length) * 100));
        } catch (err) {
          console.error(err);
        }
      }

      await onUploadPosters(toUpload);
      setIsUploading(false);
      setStagedFiles([]);
      setTitlePrefix('');
      setCustomCategory('');
      onToast(`Successfully uploaded ${toUpload.length} poster(s)`);
    } else {
      if (!urlInput.trim()) {
        onToast('Please enter an image URL');
        return;
      }

      const title = titlePrefix.trim() || 'Curated Poster';
      await onUploadPosters([
        {
          title,
          url: urlInput.trim(),
          category: cat,
          description: `Curated ${cat} poster print.`,
          tags: [cat, 'Curated'],
          likes: 0,
        },
      ]);

      setUrlInput('');
      setTitlePrefix('');
      setCustomCategory('');
      onToast('Poster added from URL');
    }
  };

  // Add new category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    saveCustomCategory(trimmed);
    setNewCatInput('');
    onToast(`Added category "${trimmed}"`);
  };

  // Filter admin posters
  const filteredAdminPosters = posters.filter((p) => {
    if (!adminSearch) return true;
    const q = adminSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Toggle selection
  const toggleSelectPoster = (id: string) => {
    setSelectedPosterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosterIds.length === filteredAdminPosters.length) {
      setSelectedPosterIds([]);
    } else {
      setSelectedPosterIds(filteredAdminPosters.map((p) => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedPosterIds.length) return;
    if (onDeleteMultiple) {
      await onDeleteMultiple(selectedPosterIds);
    } else {
      for (const id of selectedPosterIds) {
        const found = posters.find((p) => p.id === id);
        if (found) onDeletePoster(found);
      }
    }
    setSelectedPosterIds([]);
    onToast(`Deleted ${selectedPosterIds.length} posters in 1-click`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#2e2745]">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Admin Dashboard</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Authenticated
            </span>
          </h1>
          <p className="text-sm text-[#9a93b3] mt-1">
            Manage your official catalog, 1-click delete posters & categories, and batch upload media.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8b5cf6]" />
            Export JSON
          </button>
          <button
            onClick={() => importInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#8b5cf6]" />
            Import JSON
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onImportJSON(e.target.files[0]);
              }
            }}
          />
          <button
            onClick={onLock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#3b1220] hover:bg-[#52172c] text-[#fda4af] border border-[#6b1d34] transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Admin
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#171322] border border-[#2e2745] rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-[#9a93b3] text-xs font-medium">
            <span>Total Posters</span>
            <Layers className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{posters.length}</p>
        </div>

        <div className="bg-[#171322] border border-[#2e2745] rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-[#9a93b3] text-xs font-medium">
            <span>Categories</span>
            <Sparkles className="w-4 h-4 text-[#c084fc]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{existingCategories.length}</p>
        </div>

        <div className="bg-[#171322] border border-[#2e2745] rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-[#9a93b3] text-xs font-medium">
            <span>Total Likes</span>
            <BarChart3 className="w-4 h-4 text-[#ec4899]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {posters.reduce((acc, p) => acc + (p.likes || 0), 0)}
          </p>
        </div>

        <div className="bg-[#171322] border border-[#2e2745] rounded-2xl p-4.5">
          <div className="flex items-center justify-between text-[#9a93b3] text-xs font-medium">
            <span>Storage Status</span>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">IndexedDB</p>
        </div>
      </div>

      {/* Category Manager (1-Click Delete Category) */}
      <div className="bg-[#171322] border border-[#2e2745] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderMinus className="w-5 h-5 text-[#f43f5e]" />
              <span>Category Manager — 1-Click Delete</span>
            </h2>
            <p className="text-xs text-[#9a93b3] mt-0.5">
              Click any red delete button to instantly remove a category and all its posters with a single click.
            </p>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleCreateCategory} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              placeholder="New category name…"
              className="bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#9a93b3]/50 outline-none transition"
            />
            <button
              type="submit"
              disabled={!newCatInput.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition cursor-pointer disabled:opacity-40"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </div>

        {/* Categories List with 1-Click Delete */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {existingCategories.map((cat) => {
            const count = posters.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
            return (
              <div
                key={cat}
                className="bg-[#1f1a2e] border border-[#2e2745] hover:border-[#8b5cf6]/50 rounded-2xl p-3.5 flex items-center justify-between gap-2 transition"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{cat}</h4>
                  <p className="text-xs text-[#9a93b3] mt-0.5">
                    {count} {count === 1 ? 'poster' : 'posters'}
                  </p>
                </div>

                {/* 1-Click Delete Category Button */}
                <button
                  onClick={() => onDeleteCategory(cat)}
                  title={`1-Click Delete Category "${cat}"`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#3b1220] hover:bg-[#f43f5e] text-[#fda4af] hover:text-white border border-[#6b1d34] text-xs font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-[#171322] border border-[#2e2745] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#8b5cf6]" />
            Upload Posters
          </h2>

          {/* Toggle File / URL */}
          <div className="flex bg-[#1f1a2e] border border-[#2e2745] p-1 rounded-xl text-xs">
            <button
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-[#8b5cf6] text-white shadow-sm'
                  : 'text-[#9a93b3] hover:text-white'
              }`}
            >
              Image Files
            </button>
            <button
              onClick={() => setUploadMode('url')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                uploadMode === 'url'
                  ? 'bg-[#8b5cf6] text-white shadow-sm'
                  : 'text-[#9a93b3] hover:text-white'
              }`}
            >
              Paste URL
            </button>
          </div>
        </div>

        {uploadMode === 'file' ? (
          <div>
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#8b5cf6]/50 hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/5 rounded-2xl p-8 text-center cursor-pointer transition group"
            >
              <UploadCloud className="w-10 h-10 mx-auto text-[#8b5cf6] group-hover:scale-110 transition duration-300" />
              <p className="text-sm font-semibold text-white mt-3">
                Click to browse or drag and drop images here
              </p>
              <p className="text-xs text-[#9a93b3] mt-1">
                Multiple files supported. PNG, JPG, WebP portrait posters recommended.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Staged files queue */}
            {stagedFiles.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-[#1f1a2e] border border-[#2e2745]">
                <div className="flex items-center justify-between mb-3 text-xs text-[#9a93b3]">
                  <span>Queued files ({stagedFiles.length})</span>
                  <button
                    onClick={() => setStagedFiles([])}
                    className="text-[#fda4af] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {stagedFiles.map((staged, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-[#0d0b14] border border-[#2e2745]"
                    >
                      <img
                        src={staged.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeStagedFile(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-[#f43f5e] text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/70 text-[10px] text-white truncate">
                        {staged.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* URL input */
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#8b5cf6]" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or any direct image URL"
                className="flex-1 bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9a93b3]/50 outline-none transition"
              />
            </div>
            {urlInput && (
              <div className="w-32 aspect-[3/4] rounded-xl overflow-hidden border border-[#2e2745] bg-[#0d0b14]">
                <img
                  src={urlInput}
                  alt="Preview"
                  onError={() => onToast('Invalid image URL')}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Poster Details (Title and Category) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2e2745]">
          <div>
            <label className="block text-xs font-semibold text-[#9a93b3] mb-1">
              Title Prefix (optional)
            </label>
            <input
              type="text"
              value={titlePrefix}
              onChange={(e) => setTitlePrefix(e.target.value)}
              placeholder="e.g. Neon Odyssey (leave blank to use file name)"
              className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3.5 py-2 text-sm text-white placeholder-[#9a93b3]/50 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9a93b3] mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCustomCategory('');
                }}
                className="flex-1 bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3.5 py-2 text-sm text-white outline-none transition"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Custom Category</option>
              </select>

              {selectedCategory === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="New Category Name"
                  className="flex-1 bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3 py-2 text-sm text-white placeholder-[#9a93b3]/50 outline-none transition"
                />
              )}
            </div>
          </div>
        </div>

        {/* Upload Action Button */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-[#9a93b3]">
            {isUploading && `Uploading... ${uploadProgress}%`}
          </span>

          <button
            onClick={handleUploadSubmit}
            disabled={isUploading || (uploadMode === 'file' && !stagedFiles.length && !urlInput)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Posters'}
          </button>
        </div>
      </div>

      {/* Collection Management Section */}
      <div className="bg-[#171322] border border-[#2e2745] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Catalog Management</h2>
            <p className="text-xs text-[#9a93b3]">1-click delete, multi-select, or edit posters in your library.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Filter catalog…"
              className="flex-1 sm:w-56 bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#9a93b3]/50 outline-none transition"
            />
            {filteredAdminPosters.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] transition cursor-pointer"
              >
                {selectedPosterIds.length === filteredAdminPosters.length ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#8b5cf6]" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
                <span>{selectedPosterIds.length === filteredAdminPosters.length ? 'Deselect All' : 'Select All'}</span>
              </button>
            )}
            {selectedPosterIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f43f5e] hover:bg-[#e11d48] text-white transition cursor-pointer shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {selectedPosterIds.length} (1-Click)</span>
              </button>
            )}
            <button
              onClick={onResetDefaults}
              title="Reset collection to original curated posters"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Posters Grid */}
        {filteredAdminPosters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAdminPosters.map((poster) => {
              const isSelected = selectedPosterIds.includes(poster.id);
              return (
                <div
                  key={poster.id}
                  className={`bg-[#1f1a2e] border rounded-2xl overflow-hidden flex flex-col group transition ${
                    isSelected ? 'border-[#8b5cf6] ring-2 ring-[#8b5cf6]/40' : 'border-[#2e2745]'
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-[#0d0b14] overflow-hidden">
                    <img
                      src={poster.url}
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleSelectPoster(poster.id)}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-black/70 backdrop-blur-md text-white transition cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#8b5cf6]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9a93b3]" />
                      )}
                    </button>

                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-semibold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[#c084fc] border border-[#8b5cf6]/30">
                        {poster.category}
                      </span>
                    </div>

                    {/* 1-Click Delete Top Overlay */}
                    <button
                      onClick={() => onDeletePoster(poster)}
                      title="1-Click Delete (Instant)"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-[#3b1220]/90 hover:bg-[#f43f5e] text-[#fda4af] hover:text-white backdrop-blur-md transition cursor-pointer active:scale-95 shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-white truncate" title={poster.title}>
                      {poster.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#2e2745]">
                      <button
                        onClick={() => onEditPoster(poster)}
                        className="flex-1 py-1 rounded-lg bg-[#2e2745] hover:bg-[#8b5cf6] text-white text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeletePoster(poster)}
                        title="1-Click Delete (Instant)"
                        className="px-2 py-1 rounded-lg bg-[#3b1220] hover:bg-[#f43f5e] text-[#fda4af] hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[#9a93b3]">
            No posters found matching &ldquo;{adminSearch}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
