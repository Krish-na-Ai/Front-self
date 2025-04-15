import React from "react";

export const metadata = {
  title: "Authentication - AI Chat Assistant",
  description: "Log in or sign up to use the AI Chat Assistant",
};

export default function AuthLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
    </div>
  );
}