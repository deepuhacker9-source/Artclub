import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const { profile, loading: profileLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    orders: 0,
    wishlist: 0,
    saved: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // if profile not loaded yet — wait
    if (profileLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const userId = profile.id;

    // run counts in parallel
    const pOrders = supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const pWishlist = supabase
      .from("wishlist")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const pSaved = supabase
      .from("saved_artworks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    Promise.all([pOrders, pWishlist, pSaved])
      .then(([ordersRes, wishlistRes, savedRes]) => {
        if (cancelled) return;
        const oCount = ordersRes?.count ?? 0;
        const wCount = wishlistRes?.count ?? 0;
        const sCount = savedRes?.count ?? 0;

        setCounts({ orders: oCount, wishlist: wCount, saved: sCount });
      })
      .catch((err) => {
        console.error("Dashboard counts error:", err);
        if (!cancelled) setError("Failed to load stats.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profileLoading, profile]);

  // UX: show spinner while profile loading or stats loading
  if (profileLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#EFE4D9] flex items-center justify-center">
          <div className="text-lg font-medium text-gray-700">Loading your dashboard...</div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#EFE4D9] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">You are not logged in</h2>
            <p className="mt-2 text-gray-600">Please <a className="text-pink-600 underline" href="/login">login</a> to view your dashboard.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#EFE4D9] py-8">
        <div className="max-w-4xl mx-auto px-4">

          {/* Profile header */}
          <section className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-36 bg-gradient-to-r from-pink-300 to-orange-300 relative"></div>

            <div className="p-6 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  <img
                    src={
                      profile.avatar_path ||
                      profile.raw_user_meta_data?.avatar_url ||
                      "/placeholder-avatar.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold text-gray-900">{profile.name || "Anonymous"}</h1>
                  <div className="text-sm mt-1 text-gray-600">{(profile.role || "customer").toUpperCase()}</div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/profile"
                    className="px-4 py-2 rounded-md bg-white border shadow-sm text-sm font-semibold hover:shadow-md"
                  >
                    View Profile
                  </a>

                  <a
                    href="/profile#edit"
                    className="px-4 py-2 rounded-md bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700"
                  >
                    Edit
                  </a>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{profile.bio || "No bio yet. Write something to introduce yourself."}</p>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card label="Orders" value={counts.orders} />
                <Card label="Wishlist" value={counts.wishlist} />
                <Card label="Saved" value={counts.saved} />
              </div>

              <div className="mt-6 text-xs text-gray-400">
                Joined: {new Date(profile.created_at).toLocaleDateString()}
              </div>

            </div>
          </section>

          {/* Suggestion area (optional) */}
          <section className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold">Quick actions</h3>
              <div className="mt-3 flex gap-3">
                <a href="/request" className="px-3 py-2 rounded-md border text-sm">Create Request</a>
                <a href="/artists" className="px-3 py-2 rounded-md border text-sm">Explore Artists</a>
                <a href="/upgrade" className="px-3 py-2 rounded-md bg-yellow-100 text-sm font-semibold">Upgrade to Artist</a>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

// small presentational card
function Card({ label, value }) {
  return (
    <div className="bg-[#FEF6F4] rounded-lg p-4 text-center shadow">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}