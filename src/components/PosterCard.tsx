import React, { useState } from 'react';
import { Eye, Heart, Download, Share2, Edit3, Trash2 } from 'lucide-react';
import { Poster } from '../types/poster';

interface PosterCardProps {
  poster: Poster;
  isAdmin: boolean;
  onView: (poster: Poster) => void;
  onEdit?: (poster: Poster) => void;
  onDelete?: (poster: Poster) => void;
  onLike?: (poster: Poster) => void;
  onShare?: (poster: Poster) => void;
}

export const PosterCard: React.FC<PosterCardProps> = ({
  poster,
  isAdmin,
  onView,
  onEdit,
  onDelete,
  onLike,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(true);
    if (onLike) onLike(poster);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = poster.url;
    link.download = `${poster.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) onShare(poster);
  };

  return (
    <div className="group relative bg-[#171322] border border-[#2e2745] hover:border-[#8b5cf6] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(139,92,246,0.22)] flex flex-col">
      {/* Poster Image Container */}
      <div
        onClick={() => onView(poster)}
        className="relative aspect-[3/4] bg-[#0f0c18] overflow-hidden cursor-zoom-in"
      >
        {!imageError ? (
          <img
            src={poster.url}
            alt={poster.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1f1a2e] to-[#0d0b14] text-[#9a93b3]">
            <span className="text-3xl mb-2">🖼️</span>
            <p className="text-xs font-medium text-[#ece8f7]">{poster.title}</p>
            <p className="text-[10px] text-[#9a93b3] mt-1">Image Preview Unavailable</p>
          </div>
        )}

        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5">
          <div className="w-full flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Eye className="w-3.5 h-3.5 text-[#c084fc]" />
              Quick View
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownload}
                title="Download Poster"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-[#8b5cf6] text-white backdrop-blur-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleShare}
                title="Share Poster"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-[#8b5cf6] text-white backdrop-blur-md transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tag pill overlay (top left) */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-block text-[11px] font-medium tracking-wide bg-[#0d0b14]/80 backdrop-blur-md text-[#c084fc] border border-[#8b5cf6]/40 px-2.5 py-0.5 rounded-full shadow-sm">
            {poster.category || 'General'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onView(poster)}
            className="font-bold text-sm sm:text-base text-[#ece8f7] hover:text-[#c084fc] transition truncate cursor-pointer"
            title={poster.title}
          >
            {poster.title}
          </h3>
          {poster.description && (
            <p className="text-xs text-[#9a93b3] mt-1 line-clamp-2 leading-relaxed">
              {poster.description}
            </p>
          )}
        </div>

        {/* Footer info & Admin or Like buttons */}
        <div className="mt-3 pt-2.5 border-t border-[#2e2745]/60 flex items-center justify-between gap-2">
          {/* Like Heart Counter */}
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition cursor-pointer ${
              isLiked ? 'text-[#f43f5e]' : 'text-[#9a93b3] hover:text-[#f43f5e]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-[#f43f5e]' : ''}`} />
            <span>{(poster.likes || 0) + (isLiked ? 1 : 0)}</span>
          </button>

          {/* Admin Edit & Delete buttons */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(poster);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1f1a2e] hover:bg-[#2e2745] text-[#ece8f7] border border-[#2e2745] hover:border-[#8b5cf6] transition cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-[#c084fc]" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(poster);
                }}
                title="1-Click Delete (Instant)"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#3b1220] hover:bg-[#f43f5e] text-[#fda4af] hover:text-white border border-[#6b1d34] transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-[#9a93b3]">
              {poster.author ? `By ${poster.author}` : 'Official Poster'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
