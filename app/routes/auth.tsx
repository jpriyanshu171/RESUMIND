"use client";
import React, { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { User, LogIn, LogOut } from "lucide-react";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = (): React.ReactElement => {
  const { isLoading, auth, puterReady } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  if (!puterReady) return <p>Loading Puter.js...</p>;

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover bg-center min-h-screen flex items-center justify-center font-ovo">
      <div className="rounded-2xl shadow-2xl p-1 gradient-border">
        <section className="flex flex-col gap-6 bg-white rounded-2xl p-10 w-80 sm:w-96 items-center text-center">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <User className="w-12 h-12 text-amber-500" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <h2 className="text-gray-600 text-sm sm:text-base">
              Log in to continue your job journey
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Get smart feedback and track your applications effortlessly
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full mt-4">
            {isLoading ? (
              <button className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg bg-amber-500 text-white font-semibold animate-pulse">
                <LogIn className="w-5 h-5" />
                Signing you in...
              </button>
            ) : auth.isAuthenticated ? (
              <button
                onClick={auth.signOut}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            ) : (
              <button
                onClick={auth.signIn}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
              >
                <LogIn className="w-5 h-5" />
                Log in
              </button>
            )}
          </div>

        </section>
      </div>
    </main>
  );
};

export default Auth;
