import React from 'react';
import { Download, Lock, Settings, LayoutGrid, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: 'shop' | 'admin';
  onSelectTab: (tab: 'shop' | 'admin') => void;
  isAdminUnlocked: boolean;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isAdminUnlocked,
  onOpenInstallModal,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isInstalled) {
      onOpenInstallModal();
      return;
    }
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        onOpenInstallModal();
      }
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#2e2745] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectTab('shop')}
          className="flex items-center gap-2.5 text-left group transition cursor-pointer"
        >
          <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">🖼️</span>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-purple-200 transition">
              Poster <span className="bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent">Hub</span>
            </span>
            <span className="ml-2 inline-flex items-center text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full border border-[#8b5cf6]/60 text-[#c084fc] bg-[#8b5cf6]/10 align-middle">
              Official
            </span>
          </div>
        </button>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Gallery View Tab */}
          <button
            onClick={() => onSelectTab('shop')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              currentTab === 'shop'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)]'
                : 'bg-[#1f1a2e] text-[#9a93b3] hover:text-white hover:bg-[#2e2745] border border-[#2e2745]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Gallery</span>
          </button>

          {/* Install PWA Button */}
          <button
            onClick={handleInstallClick}
            aria-label="Install app"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] hover:shadow-[0_4px_18px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer shadow-sm"
          >
            {isInstalled ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <b>Installed</b>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 animate-bounce" />
                <b>Install App</b>
              </>
            )}
          </button>

          {/* Admin Tab */}
          <button
            onClick={() => onSelectTab('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              currentTab === 'admin'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)]'
                : isAdminUnlocked
                ? 'bg-[#1f1a2e] text-[#c084fc] hover:bg-[#2e2745] border border-[#8b5cf6]/40'
                : 'bg-[#1f1a2e] text-[#9a93b3] hover:text-white hover:bg-[#2e2745] border border-[#2e2745]'
            }`}
          >
            {isAdminUnlocked ? (
              <>
                <Settings className="w-4 h-4 text-[#c084fc]" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#9a93b3]" />
                <span>Admin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
