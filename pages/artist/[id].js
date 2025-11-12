import { uimport { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function ArtistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      setLoading(true);
      try {
        // Fetch artist profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, bio, avatar_path, verified, avg_rating")
          .eq("id", id)
          .single();

        if (profileError) console.error(profileError);
        setArtist(profile);

        // Fetch approved artworks
        const { data: arts, error: artsError } = await supabase
          .from("artworks")
          .select("id, title, storage_path, created_at")
          .eq("artist_id", id)
          .eq("approved", true)
          .order("created_at", { ascending: false });

        if (artsError) console.error(artsError);
        setArtworks(arts || []);

        // Fetch reviews
        const { data: revs, error: revError } = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at, customer_id")
          .eq("artist_id", id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (revError) console.error(revError);
        setReviews(revs || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <p>Loading artist details...</p>
        </div>
      </>
    );
  }

  if (!artist) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <p className="text-red-600">Artist not found or data missing.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              artist.avatar_path
                ? `${base}/profiles/${artist.avatar_path}`
                : "/placeholder.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {artist.name}{" "}
              {artist.verified && (
                <span className="text-blue-500" title="Verified artist">
                  ✔
                </span>
              )}
            </h2>
            <p className="text-gray-600">
              Rating:{" "}
              {artist.avg_rating
                ? Number(artist.avg_rating).toFixed(1)
                : "—"}
            </p>
            <p className="mt-2 text-gray-700">{artist.bio}</p>
            <Link href="/request">
              <button className="mt-3 bg-pink-700 text-white px-4 py-2 rounded">
                Request from this artist
              </button>
            </Link>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.length > 0 ? (
              artworks.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded overflow-hidden shadow"
                >
                  <img
                    src={`${base}/artworks/${a.storage_path}`}
                    alt={a.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold">{a.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No approved artworks yet.</p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.rating} ★</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}￼Enter
