import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
