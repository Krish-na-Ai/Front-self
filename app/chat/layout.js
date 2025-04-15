// app/chat/layout.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from '../../components/chat/ChatSidebar';
import useAuthStore from '../../store/authStore';
import useMediaQuery from '../../hooks/useMediaQuery';
import tokenStorage from '../../lib/tokenStorage';

export default function ChatLayout({ children }) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated() && !tokenStorage.isTokenValid()) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router, isAuthenticated, token]);
  
  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {React.cloneElement(children, {
          onToggleSidebar: () => setSidebarOpen(!sidebarOpen)
        })}
      </main>
    </div>
  );
}