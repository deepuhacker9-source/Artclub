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
    <nav className="bg-white shadow fixed top-0 left-0 w-full z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-pink-700">
          Art Club
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-gray-700 font-medium">
          <Link href="/request">Request</Link>
          <Link href="/track">Track</Link>
          <Link href="/artists">Artists</Link>

          {!loading && !profile && (
            <Link href="/login" className="text-pink-700 font-semibold">
              Login
            </Link>
          )}

          {!loading && profile && (
            <>
              <Link href="/profile" className="text-pink-700 font-semibold">
                {profile.name}
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1 rounded text-white"
                style={{ background: "#C56A47" }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white w-full shadow px-4 pb-4 text-gray-700 font-medium flex flex-col gap-4">

          <Link href="/request" onClick={() => setMenuOpen(false)}>Request</Link>
          <Link href="/track" onClick={() => setMenuOpen(false)}>Track</Link>
          <Link href="/artists" onClick={() => setMenuOpen(false)}>Artists</Link>

          {!loading && !profile && (
            <Link href="/login" className="text-pink-700 font-semibold" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}

          {!loading && profile && (
            <>
              <Link href="/profile" className="text-pink-700 font-semibold" onClick={() => setMenuOpen(false)}>
                {profile.name}
              </Link>

              <button
                onClick={logout}
                className="px-3 py-2 rounded text-white w-full text-left"
                style={{ background: "#C56A47" }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}