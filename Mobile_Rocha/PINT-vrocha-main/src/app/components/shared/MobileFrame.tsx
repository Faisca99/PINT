import React, { useState, useEffect } from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => { window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 50%, #0066cc 100%)" }}>
      <div
        className="relative bg-slate-50 overflow-hidden flex flex-col"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 12px #1a1a2e, 0 0 0 14px #2a2a3e",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-transparent absolute top-0 left-0 right-0 z-50">
          <span className="text-xs font-semibold text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>9:41</span>
          <div className="w-28 h-6 rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-0" />
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.9"><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y="1" width="2.5" height="11" rx="1" opacity="0.3"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.9"><path d="M8 2C5.5 2 3.3 3 1.7 4.6L0 3C2 1.1 4.8 0 8 0s6 1.1 8 3l-1.7 1.6C12.7 3 10.5 2 8 2z"/><path d="M8 6c-1.4 0-2.7.6-3.5 1.5L3 6c1.2-1.3 2.9-2 5-2s3.8.7 5 2l-1.5 1.5C10.7 6.6 9.4 6 8 6z"/><circle cx="8" cy="10" r="2"/></svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 border border-white rounded-sm flex items-center p-px opacity-90">
                <div className="w-4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>
        </div>
        {/* Offline banner */}
        {isOffline && (
          <div className="absolute top-10 left-0 right-0 z-50 mx-4 mt-1">
            <div className="bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <span>📵</span>
              <span>Sem ligação à internet</span>
            </div>
          </div>
        )}
        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
