import Link from "next/link";
import { useUser } from "../lib/UserContext";

export default function Navbar() {
  const { user, loading } = useUser();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link href="/" className="text-2xl font-semibold text-[#C56A47]">
        Art Club
      </Link>

      <div className="flex gap-6 items-center">

        <Link href="/request" className="hover:text-[#C56A47]">
          Request
        </Link>

        <Link href="/track" className="hover:text-[#C56A47]">
          Track
        </Link>

        <Link href="/artists" className="hover:text-[#C56A47]">
          Artists
        </Link>

        {!loading && (
          user ? (
            <>
              <Link href="/profile" className="hover:text-[#C56A47]">
                Profile
              </Link>

              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-1 bg-[#C56A47] text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1 bg-[#C56A47] text-white rounded"
            >
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}