import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles, AlertCircle, WifiOff, Trash2, Tag } from 'lucide-react';
import { Header } from './components/Header';
import { PosterCard } from './components/PosterCard';
import { LightboxModal } from './components/LightboxModal';
import { AdminDashboard } from './components/AdminDashboard';
import { EditModal } from './components/EditModal';
import { InstallModal } from './components/InstallModal';
import { Toast } from './components/Toast';
import { Poster, SortOption } from './types/poster';
import {
  getPosters,
  saveMultiplePosters,
  deletePoster,
  deleteCategory,
  deleteMultiplePosters,
  getCustomCategories,
  updatePoster,
  resetToDefaultPosters,
  toggleLikePoster,
} from './services/posterStorage';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export default function App() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shop' | 'admin'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modals & Dashboard state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('poster_hub_admin_unlocked') === 'true';
  });
  const [lightboxPoster, setLightboxPoster] = useState<Poster | null>(null);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isOnline = useOnlineStatus();

  // Show toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Load posters on mount
  useEffect(() => {
    let isMounted = true;
    getPosters().then((data) => {
      if (isMounted) {
        setPosters(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync admin unlock state to storage
  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    localStorage.setItem('poster_hub_admin_unlocked', 'true');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('poster_hub_admin_unlocked');
    showToast('Admin locked');
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    posters.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    getCustomCategories().forEach((c) => set.add(c));
    return ['All', ...Array.from(set).sort()];
  }, [posters]);

  // Filter and sort posters
  const filteredPosters = useMemo(() => {
    let result = posters.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'All' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') return b.created - a.created;
      if (sortOption === 'oldest') return a.created - b.created;
      if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
      if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
      if (sortOption === 'likes') return (b.likes || 0) - (a.likes || 0);
      return 0;
    });

    return result;
  }, [posters, searchQuery, selectedCategory, sortOption]);

  // Handle upload
  const handleUploadPosters = async (newItems: Omit<Poster, 'id' | 'created'>[]) => {
    const createdPosters: Poster[] = newItems.map((item, index) => ({
      ...item,
      id: `poster-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      created: Date.now() + index,
    }));

    await saveMultiplePosters(createdPosters);
    const updated = await getPosters();
    setPosters(updated);
  };

  // Handle edit save
  const handleSaveEdit = async (id: string, updates: Partial<Poster>) => {
    await updatePoster(id, updates);
    const updated = await getPosters();
    setPosters(updated);
    showToast('Poster updated');
  };

  // 1-Click Delete single poster (no confirm dialog)
  const handleDeletePoster = async (poster: Poster) => {
    // Instant optimistic UI update
    setPosters((prev) => prev.filter((p) => p.id !== poster.id));
    await deletePoster(poster.id);
    showToast(`Deleted "${poster.title}" (1-click)`);
  };

  // 1-Click Delete multiple posters
  const handleDeleteMultiple = async (ids: string[]) => {
    const idSet = new Set(ids);
    setPosters((prev) => prev.filter((p) => !idSet.has(p.id)));
    await deleteMultiplePosters(ids);
    showToast(`Deleted ${ids.length} poster(s) in 1-click`);
  };

  // 1-Click Delete entire category and all its posters
  const handleDeleteCategory = async (categoryName: string) => {
    if (!categoryName || categoryName === 'All') return;
    
    // Instant optimistic update
    const count = posters.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
    setPosters((prev) =>
      prev.filter((p) => p.category.toLowerCase() !== categoryName.toLowerCase())
    );

    if (selectedCategory.toLowerCase() === categoryName.toLowerCase()) {
      setSelectedCategory('All');
    }

    await deleteCategory(categoryName);
    showToast(`Deleted category "${categoryName}" and ${count} poster(s) in 1-click`);
  };

  // Handle like toggle
  const handleLikePoster = async (poster: Poster) => {
    const count = await toggleLikePoster(poster.id);
    setPosters((prev) =>
      prev.map((p) => (p.id === poster.id ? { ...p, likes: count } : p))
    );
  };

  // Handle reset defaults
  const handleResetDefaults = async () => {
    const defaults = await resetToDefaultPosters();
    setPosters(defaults);
    showToast('Catalog restored to default posters');
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posters, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `poster_hub_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Catalog exported as JSON backup');
  };

  // Import JSON
  const handleImportJSON = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await saveMultiplePosters(parsed);
        const updated = await getPosters();
        setPosters(updated);
        showToast(`Imported ${parsed.length} posters from backup`);
      } else {
        showToast('Invalid JSON file format');
      }
    } catch {
      showToast('Failed to parse backup JSON file');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0b14] text-[#ece8f7]">
      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode — Browsing locally cached posters and offline library.</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        isAdminUnlocked={isAdminUnlocked}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {activeTab === 'shop' ? (
          <section className="space-y-6">
            {/* Hero Banner */}
            <div className="pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-xs font-semibold text-[#c084fc] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Official Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Poster Hub — Official Poster Collection
              </h1>
              <p className="text-sm sm:text-base text-[#9a93b3] mt-2 max-w-2xl leading-relaxed">
                Browse our curated posters, search by title or aesthetic, zoom into high-definition detail, or 1-click delete posters and categories.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-3.5 bg-[#171322]/80 border border-[#2e2745] p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#9a93b3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posters by title, artist, or tag…"
                    className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-2xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-[#9a93b3]/50 outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a93b3] hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#9a93b3] whitespace-nowrap">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b5cf6]" />
                    <span className="hidden sm:inline">Sort:</span>
                  </div>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none transition cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="likes">Most Popular</option>
                    <option value="title-asc">Title (A - Z)</option>
                    <option value="title-desc">Title (Z - A)</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Category Pills with 1-Click Delete */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
                {categories.map((cat) => {
                  const count = cat === 'All' ? posters.length : posters.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <div
                      key={cat}
                      className="inline-flex items-center rounded-full bg-[#1f1a2e] border border-[#2e2745] p-0.5"
                    >
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                          selectedCategory === cat
                            ? 'bg-[#8b5cf6] text-white shadow-[0_2px_12px_rgba(139,92,246,0.4)]'
                            : 'text-[#9a93b3] hover:text-white'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] opacity-75 bg-black/40 px-1.5 py-0.2 rounded-full font-mono">
                          {count}
                        </span>
                      </button>

                      {/* 1-Click Delete Category Button right on the pill */}
                      {cat !== 'All' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat);
                          }}
                          title={`1-Click Delete "${cat}" category and its posters`}
                          className="mr-1 p-1 rounded-full text-[#9a93b3] hover:text-white hover:bg-[#f43f5e] transition cursor-pointer active:scale-90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collection Count & Active Filter Indicator + 1-Click Delete Category Button */}
            <div className="flex items-center justify-between text-xs text-[#9a93b3] px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing <strong className="text-white">{filteredPosters.length}</strong> {filteredPosters.length === 1 ? 'poster' : 'posters'}
                  {selectedCategory !== 'All' && <span> in <strong className="text-[#c084fc]">{selectedCategory}</strong></span>}
                  {searchQuery && <span> matching &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;</span>}
                </span>

                {/* 1-Click Delete Current Category Button */}
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => handleDeleteCategory(selectedCategory)}
                    title={`1-Click Delete "${selectedCategory}" category`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#3b1220] hover:bg-[#f43f5e] text-[#fda4af] hover:text-white border border-[#6b1d34] transition cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>1-Click Delete &ldquo;{selectedCategory}&rdquo; Category</span>
                  </button>
                )}
              </div>

              {(selectedCategory !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-[#c084fc] hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Poster Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 py-8">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-2xl bg-[#171322] border border-[#2e2745] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredPosters.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredPosters.map((poster) => (
                  <PosterCard
                    key={poster.id}
                    poster={poster}
                    isAdmin={isAdminUnlocked}
                    onView={(p) => setLightboxPoster(p)}
                    onEdit={(p) => setEditingPoster(p)}
                    onDelete={handleDeletePoster}
                    onLike={handleLikePoster}
                    onShare={(p) => {
                      navigator.clipboard.writeText(p.url);
                      showToast('Poster link copied to clipboard');
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-20 text-center bg-[#171322]/50 border border-[#2e2745] rounded-3xl p-8">
                <AlertCircle className="w-12 h-12 text-[#9a93b3] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-white">No posters found</h3>
                <p className="text-sm text-[#9a93b3] mt-1 max-w-sm mx-auto">
                  No posters matched your search or category filter. Try clearing your filters or upload new posters in the Admin panel.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-white border border-[#2e2745] transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white transition cursor-pointer"
                  >
                    Go to Admin Upload
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          /* Admin Dashboard Section */
          <AdminDashboard
            posters={posters}
            isUnlocked={isAdminUnlocked}
            onUnlock={handleUnlockAdmin}
            onLock={handleLockAdmin}
            onUploadPosters={handleUploadPosters}
            onEditPoster={(p) => setEditingPoster(p)}
            onDeletePoster={handleDeletePoster}
            onDeleteCategory={handleDeleteCategory}
            onDeleteMultiple={handleDeleteMultiple}
            onResetDefaults={handleResetDefaults}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2e2745] py-8 px-4 text-center text-xs text-[#9a93b3]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🖼️</span>
            <span className="font-bold text-white">Poster Hub</span>
            <span>• Official Poster Collection</span>
          </div>
          <div>© {new Date().getFullYear()} Poster Hub. 1-Click Management Enabled.</div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <LightboxModal
        poster={lightboxPoster}
        posters={filteredPosters.length > 0 ? filteredPosters : posters}
        onClose={() => setLightboxPoster(null)}
        onSelectPoster={(p) => setLightboxPoster(p)}
        onToast={showToast}
      />

      {/* Edit Poster Modal */}
      <EditModal
        poster={editingPoster}
        onClose={() => setEditingPoster(null)}
        onSave={handleSaveEdit}
      />

      {/* Install Help Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
