import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Poster } from '../types/poster';

interface EditModalProps {
  poster: Poster | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Poster>) => Promise<void>;
}

export const EditModal: React.FC<EditModalProps> = ({ poster, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (poster) {
      setTitle(poster.title || '');
      setCategory(poster.category || '');
      setDescription(poster.description || '');
    }
  }, [poster]);

  if (!poster) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    await onSave(poster.id, {
      title: title.trim(),
      category: category.trim() || 'General',
      description: description.trim(),
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#171322] border border-[#2e2745] rounded-3xl p-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2e2745]">
          <h3 className="text-lg font-bold text-white">Edit Poster Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#9a93b3] hover:text-white hover:bg-[#2e2745] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9a93b3] uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Poster title…"
              className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3.5 py-2 text-sm text-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9a93b3] uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Sci-Fi, Cyberpunk, Cinematic"
              className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3.5 py-2 text-sm text-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9a93b3] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or artistic synopsis…"
              className="w-full bg-[#1f1a2e] border border-[#2e2745] focus:border-[#8b5cf6] rounded-xl px-3.5 py-2 text-sm text-white outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2e2745]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:shadow-[0_4px_16px_rgba(139,92,246,0.4)] transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
