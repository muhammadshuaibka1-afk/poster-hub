import { Poster } from '../types/poster';

const DB_NAME = 'PosterHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'posters';
const STORAGE_KEY = 'poster_hub_posters_fallback';

export const INITIAL_POSTERS: Poster[] = [
  {
    id: 'poster-1',
    title: 'Neon Odyssey 2099',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    description: 'A neon-drenched metropolis bathed in violet mist and towering holographic megastructures.',
    tags: ['Sci-Fi', 'Cyberpunk', 'Futuristic', 'Neon'],
    created: Date.now() - 1000 * 60 * 60 * 24 * 5,
    author: 'Studio V',
    likes: 142,
    featured: true,
  },
  {
    id: 'poster-2',
    title: 'Celestial Horizon',
    category: 'Sci-Fi',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep space anomaly casting cosmic radiance across the planetary rings of a forgotten system.',
    tags: ['Space', 'Galaxy', 'Astronomy', 'Cinema'],
    created: Date.now() - 1000 * 60 * 60 * 24 * 4,
    author: 'Astra Design Lab',
    likes: 98,
    featured: true,
  },
  {
    id: 'poster-3',
    title: 'Tokyo Rain & Reflections',
    category: 'Cinematic',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Shinjuku alleyway after midnight rain, illuminated by vintage neon signs and deep shadows.',
    tags: ['City', 'Cinematic', 'Street', 'Rain'],
    created: Date.now() - 1000 * 60 * 60 * 24 * 3,
    author: 'Kenji Sato',
    likes: 125,
    featured: false,
  },
  {
    id: 'poster-4',
    title: 'Solar Eclipse Reverie',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    description: 'Minimalist geometric abstraction of the total solar corona during peak totality.',
    tags: ['Minimal', 'Solar', 'Modern', 'Abstract'],
    created: Date.now() - 1000 * 60 * 60 * 24 * 2,
    author: 'Nova Studio',
    likes: 84,
    featured: false,
  },
  {
    id: 'poster-5',
    title: 'Echoes of the Void',
    category: 'Sci-Fi',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'Monolithic geometric structure adrift in an alien interstellar vacuum.',
    tags: ['Sci-Fi', 'Void', 'Cinema', 'Dark'],
    created: Date.now() - 1000 * 60 * 60 * 36,
    author: 'Echo Arts',
    likes: 110,
    featured: true,
  },
  {
    id: 'poster-6',
    title: 'Synthwave Sunset Highway',
    category: 'Retro',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    description: 'Vibrant 80s aesthetic landscape glowing under an orange and purple retro-futuristic sun.',
    tags: ['Synthwave', 'Retro', '80s', 'Gradient'],
    created: Date.now() - 1000 * 60 * 60 * 28,
    author: 'Retrowave Collective',
    likes: 215,
    featured: true,
  },
  {
    id: 'poster-7',
    title: 'Alpine Monolith Peak',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    description: 'Majestic jagged mountain peaks shrouded in morning mist and warm golden sunlight.',
    tags: ['Nature', 'Mountains', 'Landscape', 'Ethereal'],
    created: Date.now() - 1000 * 60 * 60 * 20,
    author: 'Mountain Film Co.',
    likes: 76,
    featured: false,
  },
  {
    id: 'poster-8',
    title: 'Prism Geometry 04',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Fluid optical refraction and chromatic dispersion creating vibrant 3D waves.',
    tags: ['Abstract', 'Fluid', 'Prism', '3D'],
    created: Date.now() - 1000 * 60 * 60 * 14,
    author: 'Spectrum Visuals',
    likes: 93,
    featured: false,
  },
  {
    id: 'poster-9',
    title: 'Cyber Ronin: Final Protocol',
    category: 'Anime',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    description: 'Cybernetic warrior standing vigil atop a neo-gothic skyscraper in the year 2140.',
    tags: ['Anime', 'Cyberpunk', 'Concept Art', 'Action'],
    created: Date.now() - 1000 * 60 * 60 * 8,
    author: 'Neo Manga Studio',
    likes: 167,
    featured: true,
  },
  {
    id: 'poster-10',
    title: 'Brutalist Monolith II',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Monumental concrete curves and harsh shadows highlighting brutalist architectural forms.',
    tags: ['Architecture', 'Brutalism', 'Minimal', 'Shadows'],
    created: Date.now() - 1000 * 60 * 60 * 4,
    author: 'Atelier Form',
    likes: 62,
    featured: false,
  },
  {
    id: 'poster-11',
    title: 'Nebula Genesis: Part 1',
    category: 'Sci-Fi',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'High-resolution stellar nurseries igniting new stellar cores across ionized gas clouds.',
    tags: ['Space', 'Cinema', 'Stars', 'Sci-Fi'],
    created: Date.now() - 1000 * 60 * 60 * 2,
    author: 'Cosmic Vision',
    likes: 189,
    featured: true,
  },
  {
    id: 'poster-12',
    title: 'Neon Dunes: Mojave 3000',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'Bioluminescent sand dunes rippling under an ultraviolet night sky.',
    tags: ['Cyberpunk', 'Desert', 'Neon', 'Surreal'],
    created: Date.now() - 1000 * 60 * 30,
    author: 'Vapor Studio',
    likes: 133,
    featured: false,
  },
];

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('created', 'created', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get all posters
export async function getPosters(): Promise<Poster[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as Poster[];
        if (!results || results.length === 0) {
          // Initialize with default posters
          saveMultiplePosters(INITIAL_POSTERS).then(() => {
            resolve(INITIAL_POSTERS);
          });
        } else {
          // Sort by creation date descending
          results.sort((a, b) => b.created - a.created);
          resolve(results);
        }
      };

      request.onerror = () => {
        resolve(getFallbackPosters());
      };
    });
  } catch {
    return getFallbackPosters();
  }
}

// Fallback to LocalStorage
function getFallbackPosters(): Poster[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
  return INITIAL_POSTERS;
}

function saveFallbackPosters(posters: Poster[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posters));
  } catch (err) {
    console.warn('LocalStorage save error (likely quota exceeded for large images):', err);
  }
}

// Save a single poster
export async function savePoster(poster: Poster): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(poster);

      request.onsuccess = () => {
        // Also update fallback cache
        getPosters().then(all => saveFallbackPosters(all));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = getFallbackPosters();
    const updated = [poster, ...current.filter(p => p.id !== poster.id)];
    saveFallbackPosters(updated);
  }
}

// Save multiple posters
export async function saveMultiplePosters(posters: Poster[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      posters.forEach(poster => store.put(poster));

      tx.oncomplete = () => {
        saveFallbackPosters(posters);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    saveFallbackPosters(posters);
  }
}

// Delete a poster
export async function deletePoster(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        getPosters().then(all => saveFallbackPosters(all));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const current = getFallbackPosters();
    const updated = current.filter(p => p.id !== id);
    saveFallbackPosters(updated);
  }
}

// Delete multiple posters in one click
export async function deleteMultiplePosters(ids: string[]): Promise<number> {
  if (!ids.length) return 0;
  const idSet = new Set(ids);
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      ids.forEach(id => store.delete(id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback
  }
  const current = getFallbackPosters();
  const updated = current.filter(p => !idSet.has(p.id));
  saveFallbackPosters(updated);
  return ids.length;
}

// Delete an entire category and all its posters in one click
export async function deleteCategory(categoryName: string): Promise<number> {
  const all = await getPosters();
  const targets = all.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
  const idsToDelete = targets.map(p => p.id);
  
  if (idsToDelete.length > 0) {
    await deleteMultiplePosters(idsToDelete);
  }

  // Also remove from custom categories if present
  try {
    const custom = getCustomCategories().filter(c => c.toLowerCase() !== categoryName.toLowerCase());
    localStorage.setItem('poster_hub_custom_categories', JSON.stringify(custom));
    // Record in deleted categories blacklist so it never auto-seeds
    const deleted = getDeletedCategories();
    if (!deleted.includes(categoryName)) {
      deleted.push(categoryName);
      localStorage.setItem('poster_hub_deleted_categories', JSON.stringify(deleted));
    }
  } catch {}

  return targets.length;
}

export function getCustomCategories(): string[] {
  try {
    const saved = localStorage.getItem('poster_hub_custom_categories');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategory(category: string): void {
  const current = getCustomCategories();
  if (!current.some(c => c.toLowerCase() === category.toLowerCase())) {
    current.push(category);
    localStorage.setItem('poster_hub_custom_categories', JSON.stringify(current));
  }
}

export function getDeletedCategories(): string[] {
  try {
    const saved = localStorage.getItem('poster_hub_deleted_categories');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}


// Update a poster
export async function updatePoster(id: string, updates: Partial<Poster>): Promise<Poster | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const existing = getReq.result as Poster | undefined;
        if (!existing) {
          resolve(null);
          return;
        }
        const updated: Poster = { ...existing, ...updates };
        const putReq = store.put(updated);
        putReq.onsuccess = () => {
          getPosters().then(all => saveFallbackPosters(all));
          resolve(updated);
        };
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch {
    const current = getFallbackPosters();
    const idx = current.findIndex(p => p.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      saveFallbackPosters(current);
      return current[idx];
    }
    return null;
  }
}

// Reset collection to initial curated set
export async function resetToDefaultPosters(): Promise<Poster[]> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch {
    // ignore
  }

  await saveMultiplePosters(INITIAL_POSTERS);
  return INITIAL_POSTERS;
}

// Like a poster
export async function toggleLikePoster(id: string): Promise<number> {
  const all = await getPosters();
  const poster = all.find(p => p.id === id);
  if (!poster) return 0;

  const currentLikes = poster.likes || 0;
  const newLikes = currentLikes + 1;
  await updatePoster(id, { likes: newLikes });
  return newLikes;
}
