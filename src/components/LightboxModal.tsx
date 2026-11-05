import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Download, Share2, Tag, Calendar, User } from 'lucide-react';
import { Poster } from '../types/poster';

interface LightboxModalProps {
  poster: Poster | null;
  posters: Poster[];
  onClose: () => void;
  onSelectPoster: (poster: Poster) => void;
  onToast: (msg: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  poster,
  posters,
  onClose,
  onSelectPoster,
  onToast,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset zoom when poster changes
  useEffect(() => {
    setZoomLevel(1);
  }, [poster?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!poster) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        navigate(1);
      } else if (e.key === 'ArrowLeft') {
        navigate(-1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(z + 0.25, 3));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(z - 0.25, 0.75));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [poster, posters]);

  if (!poster) return null;

  const currentIndex = posters.findIndex((p) => p.id === poster.id);

  const navigate = (direction: number) => {
    if (posters.length <= 1) return;
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = posters.length - 1;
    if (nextIndex >= posters.length) nextIndex = 0;
    onSelectPoster(posters[nextIndex]);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = poster.url;
    link.download = `${poster.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('Downloading high-resolution poster');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(poster.url);
      onToast('Image link copied to clipboard');
    } catch {
      onToast('Could not copy link');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 transition-all animate-fadeIn"
    >
      {/* Top Floating Control Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 inset-x-4 max-w-5xl mx-auto flex items-center justify-between pointer-events-auto z-20"
      >
        <div className="flex items-center gap-2 bg-[#171322]/80 backdrop-blur-md border border-[#2e2745] px-3.5 py-1.5 rounded-full text-xs text-[#9a93b3]">
          <span className="font-semibold text-white truncate max-w-[180px] sm:max-w-xs">{poster.title}</span>
          <span className="opacity-40">•</span>
          <span>{currentIndex + 1} of {posters.length}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#171322]/80 backdrop-blur-md border border-[#2e2745] p-1 rounded-full">
          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            title="Zoom Out (-)"
            className="p-1.5 rounded-full text-[#9a93b3] hover:text-white hover:bg-[#2e2745] transition cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-1.5 text-white">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
            title="Zoom In (+)"
            className="p-1.5 rounded-full text-[#9a93b3] hover:text-white hover:bg-[#2e2745] transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
              className="p-1.5 rounded-full text-[#c084fc] hover:bg-[#2e2745] transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="w-px h-4 bg-[#2e2745] mx-1" />

          {/* Download & Share */}
          <button
            onClick={handleDownload}
            title="Download Original"
            className="p-1.5 rounded-full text-[#9a93b3] hover:text-[#c084fc] hover:bg-[#2e2745] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLink}
            title="Copy Image Link"
            className="p-1.5 rounded-full text-[#9a93b3] hover:text-[#c084fc] hover:bg-[#2e2745] transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            title="Close Lightbox (Esc)"
            className="p-1.5 rounded-full bg-[#2e2745] hover:bg-[#8b5cf6] text-white transition cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prev / Next Buttons */}
      {posters.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            title="Previous Poster (Left Arrow)"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#171322]/80 hover:bg-[#8b5cf6] text-white border border-[#2e2745] transition shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            title="Next Poster (Right Arrow)"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#171322]/80 hover:bg-[#8b5cf6] text-white border border-[#2e2745] transition shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Center Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] max-w-[85vw] flex items-center justify-center overflow-auto rounded-xl p-2 select-none"
      >
        <img
          src={poster.url}
          alt={poster.title}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.15s ease-out',
          }}
          className="max-h-[75vh] max-w-full w-auto object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#2e2745]/60"
        />
      </div>

      {/* Bottom Floating Metadata Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-4 inset-x-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#171322]/90 backdrop-blur-md border border-[#2e2745] px-4 py-3 rounded-2xl z-20 shadow-xl"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span>{poster.title}</span>
            <span className="text-[11px] font-medium bg-[#8b5cf6]/20 text-[#c084fc] border border-[#8b5cf6]/30 px-2 py-0.5 rounded-full">
              {poster.category}
            </span>
          </h2>
          {poster.description && (
            <p className="text-xs text-[#9a93b3] mt-0.5 max-w-md line-clamp-1">
              {poster.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#9a93b3]">
          {poster.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#8b5cf6]" />
              {poster.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#8b5cf6]" />
            {new Date(poster.created).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
