import React from 'react';

export function TopNavBar() {
  return (
    <header className="flex flex-none items-center justify-between whitespace-nowrap border-b border-solid border-b-[#232f48] px-4 py-3 drag-region">
      <div className="flex items-center gap-2 text-white">
        <div className="h-5 w-5 text-[#E0E0E0]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
            </g>
            <defs><clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath></defs>
          </svg>
        </div>
        <h2 className="text-text-light text-base font-bold leading-tight tracking-[-0.015em]">QuickDrop</h2>
      </div>
      <div className="flex gap-2 no-drag">
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#232f48] text-white transition-colors hover:bg-white/20">
          <span className="material-symbols-outlined text-base">remove</span>
        </button>
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#232f48] text-white transition-colors hover:bg-white/20">
          <span className="material-symbols-outlined text-base">crop_square</span>
        </button>
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#232f48] text-white transition-colors hover:bg-red-500/80">
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </header>
  );
}
