import Link from "next/link";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { profile, loading } = useUser();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // full redirect
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <span className="font-bold text-xl text-pink-700">Art Club</span>
        </Link>

        {/* Right side links */}
        <div className="flex gap-4 font-medium text-gray-700 items-center">

          <Link href="/request">Request</Link>
          <Link href="/track">Track</Link>
          <Link href="/artists">Artists</Link>

          {/* If user NOT logged in */}
          {!loading && !profile && (
            <Link href="/login" className="text-pink-700 font-semibold">
              Login
            </Link>
          )}

          {/* If user logged in */}
          {!loading && profile && (
            <>
              {/* PROFILE LINK — FIXED */}
              <Link href="/profile">
                <span className="font-semibold text-pink-700">
                  {profile.name || "Profile"}
                </span>
              </Link>

              {/* Logout */}
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
    </nav>
  );
}