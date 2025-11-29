
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, ShieldAlert, Zap, Grid, X, LayoutTemplate, Box, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const links = [
    { path: '/', icon: LayoutDashboard, label: 'Visão Geral' },
    { path: '/magicbox', icon: Box, label: 'Magic Box' },
    { path: '/tools', icon: Zap, label: 'Ferramentas IA' },
    { path: '/templates', icon: LayoutTemplate, label: 'Modelos' },
    { path: '/projects', icon: FolderKanban, label: 'Projetos' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ];

  // Conditional links for admin
  if (user?.role === 'admin') {
      // Insert before Settings (which is now at index 5)
      links.splice(5, 0, { path: '/clients', icon: Users, label: 'Clientes' });
      links.splice(6, 0, { path: '/reports', icon: BarChart3, label: 'Relatórios' });
  }

  const adminLinks = [
    { path: '/admin', icon: ShieldAlert, label: 'Painel Admin' },
  ];

  return (
    <>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out flex flex-col 
          h-[100dvh] md:h-screen
          md:translate-x-0 md:sticky md:top-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex-shrink-0 flex justify-between items-center h-20">
          <Logo size="md" />
          <button 
            onClick={onClose} 
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1 focus:outline-none"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => onClose()} // Close sidebar on mobile when link is clicked
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}
                `}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF8C00] rounded-r-full shadow-[0_0_10px_#FF8C00]"></div>
                )}
                <link.icon size={20} className={`transition-colors ${isActive ? 'text-[#FF8C00]' : 'text-gray-500 group-hover:text-white'}`} />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            );
          })}

          {user?.role === 'admin' && (
              <>
                  <div className="my-4 border-t border-gray-800 mx-2"></div>
                  <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Administração</div>
                  {adminLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                          <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => onClose()}
                          className={({ isActive }) => `
                              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                              ${isActive 
                              ? 'bg-red-900/20 text-red-400 border border-red-900/50' 
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}
                          `}
                          >
                          <link.icon size={20} className={`transition-colors ${isActive ? 'text-red-400' : 'text-gray-500 group-hover:text-white'}`} />
                          <span className="font-medium">{link.label}</span>
                          </NavLink>
                      );
                  })}
              </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800 flex-shrink-0">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
           >
             <LogOut size={20} />
             <span className="font-medium">Sair</span>
           </button>
        </div>
      </aside>
    </>
  );
};
