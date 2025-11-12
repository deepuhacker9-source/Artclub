components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/"><span className="font-bold text-xl text-pink-700">Art Club</span></Link>
        <div className="flex gap-4 font-medium text-gray-700">
          <Link href="/request">Request</Link>
          <Link href="/track">Track</Link>
          <Link href="/artists">Artists</Link>
        </div>
      </div>
    </nav>
  );
}
