import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Track() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function searchOrder(e) {
    e.preventDefault();
    setErr(""); setOrder(null);
    const { data, error } = await supabase
      .from("requests")
      .select(`id,status,customer_id,assigned_artist(id,name,verified,avg_rating)`)
      .eq("id", orderId)
      .single();
    if (error || !data) setErr("No order found with that ID.");
    else setOrder(data);
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!rating) return alert("Select rating");
    const { error } = await supabase.from("reviews").insert({
      artist_id: order.assigned_artist.id,
      customer_id: order.customer_id,
      rating,
      comment,
    });
    if (error) return alert("Could not submit review");
    await supabase.rpc("update_artist_rating", { artist_uuid: order.assigned_artist.id });
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-6">Track Your Order</h1>
        <form onSubmit={searchOrder} className="max-w-md mx-auto flex gap-2 mb-6">
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="Enter Order ID" className="flex-grow border rounded px-3 py-2" />
          <button className="bg-pink-700 text-white px-4 py-2 rounded">Search</button>
        </form>

        {err && <p className="text-center text-red-600">{err}</p>}
        {order && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> <span className="capitalize text-pink-600">{order.status}</span></p>
            <p><strong>Artist:</strong> {order.assigned_artist?.name || "Not assigned" } {order.assigned_artist?.verified && <span className="text-blue-500">✔</span>}</p>

            <div className="mt-6">
              <div className="flex justify-between">
                {["pending","in_progress","completed","shipped"].map((s,i)=>(
                  <div key={s} className={`flex-1 h-2 mx-1 rounded ${["pending","in_progress","completed","shipped"].indexOf(s) <= ["pending","in_progress","completed","shipped"].indexOf(order.status) ? "bg-pink-600" : "bg-gray-300"}`}></div>
                ))}
              </div>
              <p className="text-center mt-3">Current status: <strong className="capitalize">{order.status}</strong></p>
            </div>

            {order.status === "completed" && !submitted && (
              <form onSubmit={submitReview} className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Leave a Review</h3>
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setRating(s)} className={`text-2xl ${rating>=s?"text-yellow-400":"text-gray-300"}`}>★</button>
                  ))}
                </div>
                <textarea value={comment} onChange={e=>setComment(e.target.value)} rows="3" className="w-full border rounded p-2 mb-3" placeholder="Write a short review..."></textarea>
                <button className="bg-pink-700 text-white px-4 py-2 rounded">Submit</button>
              </form>
            )}

            {submitted && <p className="text-green-600 mt-3">Thanks — your review is posted.</p>}
          </div>
        )}
      </div>
    </>
  );
}
