import React from 'react';
import { X, Smartphone, Globe, Monitor, Apple, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlatformInfo {
  type: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const getUserAgentInfo = (): PlatformInfo => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        title: 'Desktop Browser',
        icon: Monitor,
        steps: ['Install the progressive web app through your browser menu.'],
      };
    }
    const ua = navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isEdge = /Edg\//.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    if (isIos) {
      return {
        type: 'ios',
        title: 'Install on iPhone & iPad',
        icon: Apple,
        steps: [
          'Open this app in Safari.',
          'Tap the Share icon (square with arrow pointing up) at the bottom.',
          'Scroll down and tap "Add to Home Screen".',
          'Tap "Add" in the top right to complete.',
        ],
      };
    }
    if (isAndroid) {
      return {
        type: 'android',
        title: 'Install on Android',
        icon: Smartphone,
        steps: [
          'Tap the browser menu icon (⋮) in the top-right corner of Chrome.',
          'Tap "Install app" or "Add to Home screen".',
          'Confirm installation when prompted.',
        ],
      };
    }
    if (isEdge) {
      return {
        type: 'edge',
        title: 'Install in Microsoft Edge',
        icon: Monitor,
        steps: [
          'Click the App available icon in the address bar, or open the menu (…)',
          'Select "Apps" > "Install this site as an app".',
          'Click "Install" to create desktop shortcut.',
        ],
      };
    }
    if (isSafari) {
      return {
        type: 'safari',
        title: 'Install in macOS Safari',
        icon: Apple,
        steps: [
          'Click File in the menu bar.',
          'Select "Add to Dock…".',
          'Launch Poster Hub right from your Dock.',
        ],
      };
    }
    if (isFirefox) {
      return {
        type: 'firefox',
        title: 'Firefox Desktop',
        icon: Globe,
        steps: [
          'Firefox desktop does not support progressive web app installation directly.',
          'For the full offline app experience, open in Chrome, Edge, or bookmark this URL.',
        ],
      };
    }
    return {
      type: 'chrome',
      title: 'Install in Google Chrome',
      icon: Monitor,
      steps: [
        'Click the Install icon (computer with down arrow) in the address bar.',
        'Or click the menu (⋮) > "Save and share" > "Install Poster Hub…"',
        'Enjoy instant fullscreen access from your desktop apps.',
      ],
    };
  };

  const info = getUserAgentInfo();
  const IconComponent = info.icon;

  const handlePromptInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
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
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#c084fc]">
              <IconComponent className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">{info.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#9a93b3] hover:text-white hover:bg-[#2e2745] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-emerald-300">Poster Hub is already installed!</p>
            <p className="text-xs text-[#9a93b3] mt-1">
              You are running the official Progressive Web App with offline caching support.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            {isInstallable && (
              <div className="p-4 rounded-2xl bg-[#1f1a2e] border border-[#8b5cf6]/40 text-center">
                <p className="text-sm text-white font-medium mb-3">
                  Quick Install available for this browser:
                </p>
                <button
                  onClick={handlePromptInstall}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] hover:shadow-[0_4px_18px_rgba(6,182,212,0.4)] transition cursor-pointer"
                >
                  🚀 Install Poster Hub Now
                </button>
              </div>
            )}

            <div className="bg-[#1f1a2e] border border-[#2e2745] rounded-2xl p-4">
              <h4 className="text-xs font-bold text-[#c084fc] uppercase tracking-wider mb-2.5">
                Manual Instructions:
              </h4>
              <ol className="space-y-2 text-xs text-[#ece8f7]/90 list-decimal list-inside leading-relaxed">
                {info.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-[11px] text-[#9a93b3] text-center">
              Installing saves a dedicated launcher icon to your device and caches posters for lightning-fast offline browsing.
            </p>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-[#2e2745] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-[0_4px_16px_rgba(139,92,246,0.35)] transition cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
