import Link from "next/link";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { user, profile } = useUser();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="font-bold text-xl" style={{ color: "#C56A47" }}>
            Art Club
          </a>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/request"><a className="hover:underline">Request</a></Link>
          <Link href="/track"><a className="hover:underline">Track</a></Link>
          <Link href="/artists"><a className="hover:underline">Artists</a></Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">{profile?.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded shadow-sm"
                style={{ background: "white" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login"><a className="px-3 py-1 rounded" style={{ background: "#C56A47", color: "#fff" }}>Login</a></Link>
          )}
        </div>
      </div>
    </nav>
  );
}