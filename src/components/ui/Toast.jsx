import { useEffect, useState, useCallback } from 'react';
import { ToastIcon } from './Icons';

export default function Toast({ message, onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // Corresponds to animation duration
  }, [onClose]);

  useEffect(() => {
    const closeTimer = setTimeout(handleClose, duration);

    return () => clearTimeout(closeTimer);
  }, [duration, handleClose]);

  return (
    <div
      className="fixed left-1/2 top-[32px] z-50 w-[500px] -translate-x-1/2 overflow-hidden rounded-[var(--border-radius-md,6px)] border border-solid border-[var(--alpha-70,rgba(255,255,255,0.30))] bg-[var(--tailwind-colors-green-700,#15803D)] shadow-[0_0_0_4px_rgba(21,128,61,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.05)]"
      style={{
        animation: isExiting
          ? 'toast-out 0.3s ease-in forwards'
          : 'toast-in 0.3s ease-out forwards',
      }}
    >
      <div className="flex w-full items-center gap-[var(--Gap-2,8px)] px-[var(--Gap-4,16px)] py-[var(--Gap-3-5,14px)]">
        <ToastIcon />
        <span className="flex-1 text-[color:var(--base-primary-foreground,#FAFAFA)] font-[family-name:var(--typography-font-family-font-sans,Inter)] text-[length:var(--typography-base-sizes-small-font-size,14px)] font-[number:var(--font-weight-semibold,600)] leading-[var(--typography-base-sizes-small-line-height,20px)]">
          {message}
        </span>
        <button onClick={handleClose} className="ml-auto pl-4 text-white/80 hover:text-white">
          ×
        </button>
      </div>
      <div className="h-[2px] w-full bg-blue-500/20">
        <div
          className="h-full bg-blue-500"
          style={{ animation: `progress ${duration / 1000}s linear forwards` }}
        />
      </div>
      <style>{`
        @keyframes toast-in {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes toast-out {
          from {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}