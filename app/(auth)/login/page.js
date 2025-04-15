"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "../../../components/auth/LoginForm";
import useAuthStore from "../../../store/authStore";
import tokenStorage from "../../../lib/tokenStorage";

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
          <p className="mt-2 text-gray-600">Log in to continue your conversation</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;