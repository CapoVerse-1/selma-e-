import React, { ReactNode } from 'react';
import Link from 'next/link';
import { FiHome, FiDollarSign, FiFileText, FiSettings } from 'react-icons/fi';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-primary">
                Selma Anwaltskanzlei
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm hidden md:block">
          <nav className="mt-5 px-2">
            <Link href="/" className="group flex items-center px-2 py-3 text-accent hover:bg-primary-50 hover:text-primary rounded-md">
              <FiHome className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/einnahmen" className="group flex items-center px-2 py-3 text-accent hover:bg-primary-50 hover:text-primary rounded-md">
              <FiDollarSign className="mr-3 h-5 w-5" />
              Einnahmen
            </Link>
            <Link href="/ausgaben" className="group flex items-center px-2 py-3 text-accent hover:bg-primary-50 hover:text-primary rounded-md">
              <FiDollarSign className="mr-3 h-5 w-5" />
              Ausgaben
            </Link>
            <Link href="/berichte" className="group flex items-center px-2 py-3 text-accent hover:bg-primary-50 hover:text-primary rounded-md">
              <FiFileText className="mr-3 h-5 w-5" />
              Berichte
            </Link>
            <Link href="/einstellungen" className="group flex items-center px-2 py-3 text-accent hover:bg-primary-50 hover:text-primary rounded-md">
              <FiSettings className="mr-3 h-5 w-5" />
              Einstellungen
            </Link>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 