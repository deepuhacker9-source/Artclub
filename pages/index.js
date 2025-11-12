import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Home() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("artworks")
        .select("id, title, storage_path, created_at, artist_id, profiles(name, verified)")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) {
        console.error("fetch artworks err:", error);
        return;
      }
      setArtworks(data || []);
    }
    load();
  }, []);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-12">
        <section className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Welcome to <span className="text-pink-700">Art Club</span></h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Discover hand-painted portraits crafted by verified Indian artists.</p>
          <Link href="/request"><button className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-full shadow">Request a Portrait</button></Link>
        </section>

        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Featured Portraits</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {artworks.map(a => {
              const url = `${base}/artworks/${a.storage_path}`;
              return (
                <div key={a.id} className="min-w-[260px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
                  <img src={url} alt={a.title} className="w-full h-64 object-cover" />
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{a.profiles?.name || 'Artist'}</p>
                      {a.profiles?.verified && <span className="text-blue-500">✔</span>}
                    </div>
                    <p className="text-gray-500 mt-1">{a.title}</p>
                  </div>
                </div>
              );
            })}
            {artworks.length === 0 && <p className="text-gray-500">No artworks yet — ask artists to upload samples.</p>}
          </div>
        </section>
      </main>
    </>
  );
}
