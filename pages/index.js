import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function Home({ artworks }) {
  return (
    <div className="min-h-screen bg-[#f2e8dc] text-[#4a3f35]">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4">
          Frame your memories
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          A place where talented artists turn your photos into timeless portraits.
        </p>

        {/* FIXED BUTTONS (NO OVERLAP) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/request"
            className="bg-[#C96A46] text-white px-8 py-3 rounded-full text-lg font-medium shadow-md w-full sm:w-auto text-center"
          >
            Request a Portrait
          </Link>

          <Link
            href="/track"
            className="border border-[#C96A46] text-[#C96A46] px-8 py-3 rounded-full text-lg font-medium w-full sm:w-auto text-center"
          >
            Track Order
          </Link>
        </div>

        {/* Login / Signup */}
        <div className="mt-6">
          <Link href="/login" className="text-[#b4457f] font-semibold">
            Login / Signup
          </Link>
        </div>

        {/* Latest Artworks Section */}
        <h2 className="text-3xl font-semibold mt-14 mb-4">Latest Portraits</h2>

        {artworks.length === 0 ? (
          <p className="text-gray-600">No artworks yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {artworks.map((art) => (
              <div key={art.id} className="bg-white p-2 rounded shadow">
                <img
                  src={supabase.storage.from("artworks").getPublicUrl(art.storage_path).data.publicUrl}
                  alt="Artwork"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase
    .from("artworks")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return {
    props: {
      artworks: data || [],
    },
  };
}