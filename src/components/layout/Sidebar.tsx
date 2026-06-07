import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  DollarSign,
  UserCircle,
  FileBarChart,
  Settings,
} from 'lucide-react';
import { cn } from '../../utils';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'students', label: '学员管理', icon: Users },
  { id: 'courses', label: '课程管理', icon: BookOpen },
  { id: 'channels', label: '渠道分析', icon: BarChart3 },
  { id: 'finance', label: '财务管理', icon: DollarSign },
  { id: 'teachers', label: '教师管理', icon: UserCircle },
  { id: 'reports', label: '经营报表', icon: FileBarChart },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">舞</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800">街舞工作室</h1>
            <p className="text-xs text-slate-500">经营管理系统</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    'sidebar-item w-full text-left',
                    activePage === item.id && 'sidebar-item-active'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <button className="sidebar-item w-full">
          <Settings className="w-5 h-5" />
          <span className="font-medium">系统设置</span>
        </button>
      </div>
    </aside>
  );
};
