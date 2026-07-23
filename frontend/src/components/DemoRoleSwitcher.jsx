import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Truck, UserCheck, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

const DemoRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const roles = [
    {
      id: 'customer',
      label: 'Customer View',
      icon: UserCheck,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      path: '/'
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: Shield,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      path: '/admin'
    },
    {
      id: 'delivery',
      label: 'Delivery Driver',
      icon: Truck,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      path: '/delivery'
    }
  ];

  const handleRoleSelect = (roleId, path) => {
    switchRole(roleId);
    navigate(path);
  };

  const currentRole = user?.role || 'guest';

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start font-sans">
      <div className="rounded-2xl bg-gray-950/90 backdrop-blur-md border border-amber-500/30 shadow-2xl p-2.5 sm:p-3 transition-all duration-300 max-w-xs">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 text-xs font-semibold pb-1.5 border-b border-gray-800">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wide uppercase font-bold text-[10px]">Client Presentation Bar</span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Presentation Bar' : 'Minimize'}
          >
            {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-2.5 space-y-1.5">
            <p className="text-[10px] text-gray-400 mb-1">Instant 1-Click Role Switcher:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id, r.path)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      isActive
                        ? `${r.color} shadow-lg shadow-amber-500/10 scale-102`
                        : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span>{r.id.charAt(0).toUpperCase() + r.id.slice(1)}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-1 text-[9px] text-gray-500 flex justify-between items-center">
              <span>Current Persona:</span>
              <span className="font-mono text-amber-400 font-semibold">{user ? `${user.name} (${user.role})` : 'Not Logged In'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoRoleSwitcher;
