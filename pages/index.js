import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5ede4]">
      {/* Hero Section */}
      <section className="text-center px-6 pt-16 pb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#4a332e] leading-tight">
          Frame your memories
        </h1>

        <p className="mt-4 text-lg text-[#6b524b] max-w-xl mx-auto">
          A place where talented artists turn your photos into timeless portraits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/request"
            className="px-8 py-3 rounded-full bg-[#c66c42] text-white font-medium shadow hover:bg-[#b65e39] transition"
          >
            Request a Portrait
          </Link>

          <Link
            href="/track"
            className="px-8 py-3 rounded-full border border-[#c66c42] text-[#c66c42] font-medium hover:bg-[#f3e5dd] transition"
          >
            Track Order
          </Link>

          <Link
            href="/login"
            className="px-8 py-3 rounded-full text-[#4a332e] font-medium hover:text-[#7b554d] transition"
          >
            Login / Signup
          </Link>
        </div>
      </section>

      {/* Latest Portraits Section */}
      <section className="px-6 pb-20">
        <h2 className="text-2xl font-semibold text-[#4a332e] mb-4">
          Latest Portraits
        </h2>

        <div className="text-[#7a6d66] italic">
          No artworks yet.
        </div>
      </section>
    </div>
  );
}