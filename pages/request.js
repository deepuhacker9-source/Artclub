import { useState } from "react";
import Navbar from "../components/Navbar";

export default function RequestPage() {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", date: "", address: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!photo) return alert("Upload a photo first!");

    setLoading(true);
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    formData.append("photo", photo);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ Request submitted successfully! (check Supabase)");
        setForm({ name: "", email: "", date: "", address: "", notes: "" });
        setPhoto(null);
      } else {
        setMsg("❌ " + (data.error || "Error submitting request."));
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Unexpected error");
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
          <label className="block mb-3">
            <div className="font-medium">Full Name</div>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
          </label>

          <label className="block mb-3">
            <div className="font-medium">Email</div>
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border rounded" />
          </label>

          <label className="block mb-3">
            <div className="font-medium">Event Date</div>
            <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="w-full p-2 border rounded" />
          </label>

          <label className="block mb-3">
            <div className="font-medium">Address</div>
            <textarea value={form.address} onChange={e=>setForm({...form, address:e.target.value})} rows="2" className="w-full p-2 border rounded"></textarea>
          </label>

          <label className="block mb-3">
            <div className="font-medium">Upload Photo</div>
            <input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files[0])} />
          </label>

          <label className="block mb-3">
            <div className="font-medium">Notes</div>
            <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows="3" className="w-full p-2 border rounded"></textarea>
          </label>

          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {msg && <p className={`mt-4 ${msg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
        </form>
      </div>
    </>
  );
}
