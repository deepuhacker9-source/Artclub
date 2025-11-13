import { useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";

export default function RequestPage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!name || !email) return setMsg("Please fill name and email.");
    setLoading(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("event_date", eventDate || "");
    fd.append("address", address);
    fd.append("notes", notes);
    if (photo) fd.append("photo", photo);
    if (user?.id) fd.append("customer_id", user.id);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Upload failed");
      else {
        setMsg("Request submitted ✅");
        setName(""); setEmail(""); setAddress(""); setNotes(""); setPhoto(null);
      }
    } catch (err) {
      console.error(err);
      setMsg("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Request a Portrait</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="Full name" />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="Email" />
          <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <textarea value={address} onChange={e=>setAddress(e.target.value)} rows="2" className="w-full p-2 border rounded mb-3" placeholder="Address" />
          <input type="file" accept="image/*" onChange={(e)=>setPhoto(e.target.files[0])} className="mb-3" />
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows="4" className="w-full p-2 border rounded mb-3" placeholder="Notes for artist" />
          <button type="submit" disabled={loading} className="bg-[#C56A47] text-white px-4 py-2 rounded">{loading ? "Submitting..." : "Submit Request"}</button>
          {msg && <p className="mt-3">{msg}</p>}
        </form>
      </div>
    </>
  );
}