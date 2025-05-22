import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Header from '@/components/Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`w-64 md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;