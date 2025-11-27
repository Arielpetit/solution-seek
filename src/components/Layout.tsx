import React from 'react';
import Sidebar from './Sidebar';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;