"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { profile, loading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-lg bg-white/60
        border-b border-white/40
      ">
        <div className="
          max-w-5xl mx-auto px-4 h-14
          flex items-center justify-between
        ">
          
          {/* LOGO */}
          <Link href="/" className="text-xl font-bold text-pink-700 tracking-wide">
            Art Club
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button 
            className="md:hidden text-3xl font-bold text-gray-700"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8 text-gray-800 font-semibold items-center">

            <Link href="/request">Request</Link>
            <Link href="/track">Track</Link>
            <Link href="/artists">Artists</Link>

            {!loading && !profile && (
              <Link href="/login" className="text-pink-700 font-bold">
                Login
              </Link>
            )}

            {!loading && profile && (
              <>
                <Link href="/profile" className="text-pink-700 font-bold">
                  {profile.name}
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-1 rounded text-white font-semibold"
                  style={{ background: "#C56A47" }}
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </nav>

      {/* MOBILE FULL-SCREEN DRAWER */}
      {menuOpen && (
        <div className="
          fixed inset-0 bg-white/95 backdrop-blur-xl
          z-50 flex flex-col text-lg font-semibold
          animate-fadeIn
        ">

          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              className="text-4xl font-bold text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col gap-6 px-6 mt-4 text-gray-800">

            <Link href="/request" onClick={() => setMenuOpen(false)}>Request</Link>
            <Link href="/track" onClick={() => setMenuOpen(false)}>Track</Link>
            <Link href="/artists" onClick={() => setMenuOpen(false)}>Artists</Link>

            {!loading && !profile && (
              <Link 
                href="/login"
                className="text-pink-700 font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}

            {!loading && profile && (
              <>
                <Link 
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-pink-700 font-bold"
                >
                  {profile.name}
                </Link>

                <button
                  onClick={logout}
                  className="mt-2 px-4 py-3 rounded text-white font-bold text-left"
                  style={{ background: "#C56A47" }}
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}