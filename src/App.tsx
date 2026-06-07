import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Courses } from './pages/Courses';
import { Channels } from './pages/Channels';
import { Finance } from './pages/Finance';
import { Teachers } from './pages/Teachers';
import { Reports } from './pages/Reports';

const pageTitles: Record<string, string> = {
  dashboard: '仪表盘',
  students: '学员管理',
  courses: '课程管理',
  channels: '渠道分析',
  finance: '财务管理',
  teachers: '教师管理',
  reports: '经营报表',
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'courses':
        return <Courses />;
      case 'channels':
        return <Channels />;
      case 'finance':
        return <Finance />;
      case 'teachers':
        return <Teachers />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header title={pageTitles[activePage] || '仪表盘'} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
