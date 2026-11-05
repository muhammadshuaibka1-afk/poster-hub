import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1f1a2e]/95 text-white border border-[#8b5cf6] shadow-[0_10px_30px_rgba(139,92,246,0.3)] backdrop-blur-lg animate-fadeIn select-none text-xs sm:text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 text-[#c084fc] flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
