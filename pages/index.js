import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const { profile } = useUser();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("artworks")
        .select("id,title,storage_path,artist_id,created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(10);

      setArtworks(data || []);
    }
    load();
  }, []);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* HERO SECTION */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold" style={{ color: "#3B2D2F" }}>
            Frame your memories
          </h1>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            A place where talented artists turn your photos into timeless portraits.
          </p>

          {/* FIXED BUTTONS → now responsive on all screens */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request"
              className="px-6 py-3 rounded-full shadow-md text-white"
              style={{ background: "#C56A47" }}
            >
              Request a Portrait
            </Link>

            <Link
              href="/track"
              className="px-6 py-3 rounded-full border"
              style={{ borderColor: "#C56A47", color: "#C56A47" }}
            >
              Track Order
            </Link>

            {!profile && (
              <Link
                href="/login"
                className="px-6 py-3 rounded-full"
                style={{ color: "#3B2D2F" }}
              >
                Login / Signup
              </Link>
            )}
          </div>
        </section>

        {/* ARTWORK SCROLLER */}
        <section>
          <h2 className="text-2xl mb-4" style={{ color: "#3B2D2F" }}>
            Latest Portraits
          </h2>

          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-6">
              {artworks.length === 0 && (
                <p className="text-gray-500">No artworks yet.</p>
              )}

              {artworks.map((a) => (
                <div
                  key={a.id}
                  className="min-w-[260px] rounded-lg overflow-hidden shadow-md bg-white"
                >
                  <img
                    src={`${base}/artworks/${a.storage_path}`}
                    alt={a.title || "artwork"}
                    className="w-full h-56 object-cover rounded-t"
                  />

                  <div className="p-3">
                    <p className="font-semibold">{a.title || "Untitled"}</p>

                    <Link
                      href={`/artist/${a.artist_id}`}
                      className="text-sm text-gray-600"
                    >
                      View Artist
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARTIST DASHBOARD FOR ARTIST/ADMIN */}
        {profile && (profile.role === "artist" || profile.role === "admin") && (
          <section className="mt-10 p-4 rounded-lg border">
            <h3 className="font-semibold">Welcome back, {profile.name}</h3>

            <div className="mt-3 flex gap-3">
              <Link
                href="/artist/dashboard"
                className="px-4 py-2 rounded text-white"
                style={{ background: "#C56A47" }}
              >
                Artist Dashboard
              </Link>

              <Link
                href="/upload"
                className="px-4 py-2 rounded border"
                style={{ borderColor: "#C56A47" }}
              >
                Upload Artwork
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}