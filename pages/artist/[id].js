import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";

export default function ArtistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data: p } = await supabase.from("profiles").select("id,name,bio,avatar_path,verified,avg_rating").eq("id", id).single();
      setArtist(p);
      const { data: arts } = await supabase.from("artworks").select("id,title,storage_path,created_at").eq("artist_id", id).eq("approved", true).order("created_at", { ascending: false });
      setArtworks(arts || []);
      const { data: revs } = await supabase.from("reviews").select("id,rating,comment,created_at,customer_id").eq("artist_id", id).order("created_at",{ascending:false}).limit(20);
      setReviews(revs || []);
    }
    load();
  }, [id]);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {!artist && <p>Loading...</p>}
        {artist && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img src={artist.avatar_path ? `${base}/profiles/${artist.avatar_path}` : "/placeholder.png"} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold">{artist.name} {artist.verified && <span className="text-green-600">✔</span>}</h2>
                <p className="text-gray-600">Rating: {artist.avg_rating ? Number(artist.avg_rating).toFixed(1) : "—"}</p>
                <p className="mt-2 text-gray-700">{artist.bio}</p>
              </div>
            </div>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Portfolio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {artworks.map(a => (
                  <div key={a.id} className="bg-white rounded overflow-hidden shadow">
                    <img src={`${base}/artworks/${a.storage_path}`} className="w-full h-48 object-cover" />
                    <div className="p-3">
                      <p className="font-semibold">{a.title}</p>
                    </div>
                  </div>
                ))}
                {artworks.length === 0 && <p className="text-gray-500">No approved artworks yet.</p>}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Reviews</h3>
              {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{r.rating} ★</p>
                        <p className="text-gray-600 text-sm">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}