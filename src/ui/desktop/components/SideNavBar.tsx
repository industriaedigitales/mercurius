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
    <aside className="flex w-64 flex-col gap-8 border-r border-[#324467]/30 bg-background-light dark:bg-background-dark p-4">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="rounded-lg bg-primary p-2 text-white">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>swap_horiz</span>
        </div>
        <h1 className="text-xl font-bold text-black dark:text-white">{t('common.appName')}</h1>
      </div>
      <div className="flex h-full flex-col justify-between">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => {
            if (item.disabled) {
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 rounded-full px-3 py-2 text-black/30 dark:text-white/30 cursor-not-allowed"
                >
                  <span className="material-symbols-outlined" style={item.iconStyle}>{item.icon}</span>
                  <p className="text-sm font-medium">{t(item.label)}</p>
                </div>
              );
            }
            return (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? 'bg-primary/20 text-primary dark:text-white dark:bg-primary' : 'text-black dark:text-white'}`
                }
              >
                <span className="material-symbols-outlined text-black/60 dark:text-white/60" style={item.iconStyle}>{item.icon}</span>
                <p className="text-sm font-medium">{t(item.label)}</p>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
