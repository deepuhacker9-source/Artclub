import Link from "next/link";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // optional: you can redirect client after signOut
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <span className="font-bold text-xl text-pink-700">Art Club</span>
        </Link>

        <div className="flex gap-4 font-medium text-gray-700 items-center">
          <Link href="/request">Request</Link>
          <Link href="/track">Track</Link>
          <Link href="/artists">Artists</Link>

          {!loading && (
            user ? (
              <>
                <Link href="/dashboard">Profile</Link>
                <button onClick={handleSignOut} className="px-3 py-1 bg-pink-700 text-white rounded">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1 bg-pink-700 text-white rounded">
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}