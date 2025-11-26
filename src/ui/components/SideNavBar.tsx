import React from 'react';
import { NavLink } from 'react-router-dom';

export function SideNavBar() {
  return (
    <aside className="flex w-64 flex-col gap-8 border-r border-[#324467]/30 bg-background-light dark:bg-background-dark p-4">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="rounded-lg bg-primary p-2 text-white">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>swap_horiz</span>
        </div>
        <h1 className="text-xl font-bold text-black dark:text-white">FileDrop</h1>
      </div>
      <div className="flex h-full flex-col justify-between">
        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? 'bg-primary/20 text-primary dark:text-white dark:bg-primary' : 'text-black dark:text-white'}`
            }
          >
            <span className="material-symbols-outlined text-black/60 dark:text-white/60">grid_view</span>
            <p className="text-sm font-medium">Dashboard</p>
          </NavLink>
          <NavLink 
            to="/transfers" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? 'bg-primary/20 text-primary dark:text-white dark:bg-primary' : 'text-black dark:text-white'}`
            }
          >
            <span className="material-symbols-outlined text-black/60 dark:text-white/60">swap_horiz</span>
            <p className="text-sm font-medium">Transfers</p>
          </NavLink>
          <NavLink 
            to="/devices" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? 'bg-primary/20 text-primary dark:text-white dark:bg-primary' : 'text-black dark:text-white'}`
            }
          >
            <span className="material-symbols-outlined text-black/60 dark:text-white/60">devices</span>
            <p className="text-sm font-medium">Devices</p>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? 'bg-primary/20 text-primary dark:text-white dark:bg-primary' : 'text-black dark:text-white'}`
            }
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            <p className="text-sm font-medium">Settings</p>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
