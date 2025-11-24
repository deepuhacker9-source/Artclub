import Link from "next/link";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { profile, loading } = useUser();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="backdrop-blur-md bg-white/60 shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/" className="font-extrabold text-xl text-pink-700 tracking-tight">
          Art Club
        </Link>

        <div className="flex gap-4 items-center text-gray-700 font-medium">

          <Link href="/request" className="hidden sm:block">Request</Link>
          <Link href="/track" className="hidden sm:block">Track</Link>
          <Link href="/artists" className="hidden sm:block">Artists</Link>

          {!loading && !profile && (
            <Link href="/login" className="text-pink-700 font-semibold">
              Login
            </Link>
          )}

          {!loading && profile && (
            <>
              <Link href="/profile" className="font-semibold text-pink-700">
                {profile.name?.split(" ")[0] || "Profile"}
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1 rounded-lg text-white bg-gradient-to-r from-pink-600 to-orange-500 shadow-sm"
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