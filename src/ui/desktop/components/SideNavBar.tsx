import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SideNavBar() {
  const { t } = useTranslation();

  const menuItems = [
    { path: '/', icon: 'grid_view', label: 'sidebar.dashboard', disabled: false },
    { path: '/transfers', icon: 'swap_horiz', label: 'sidebar.transfers', disabled: true },
    { path: '/devices', icon: 'devices', label: 'sidebar.devices', disabled: true },
    { path: '/settings', icon: 'settings', label: 'sidebar.settings', iconStyle: { fontVariationSettings: "'FILL' 1" }, disabled: false }
  ];

  return (
    <aside className="flex w-64 flex-col gap-6 border-r border-white/5 bg-background-dark/50 backdrop-blur-xl p-4">
      <div className="px-4 py-8">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-accent-gradient opacity-80">{t('sidebar.menu')}</h2>
      </div>
      
      <div className="flex h-full flex-col justify-between">
        <nav className="flex flex-col gap-3">
          {menuItems.map((item, index) => {
            if (item.disabled) {
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 text-white/20 cursor-not-allowed border border-transparent"
                >
                  <span className="material-symbols-outlined text-2xl" style={item.iconStyle}>{item.icon}</span>
                  <p className="text-xs font-bold uppercase tracking-widest">{t(item.label)}</p>
                </div>
              );
            }
            return (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center gap-4 rounded-xl px-4 py-3 transition-all border ${
                    isActive 
                      ? 'bg-primary/10 border-primary/20 text-primary-light shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'text-text-medium border-transparent hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-2xl" style={item.iconStyle}>{item.icon}</span>
                <p className="text-xs font-bold uppercase tracking-widest">{t(item.label)}</p>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
