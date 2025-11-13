import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../lib/UserContext";
import Navbar from "../components/Navbar";

export default function TrackPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      setLoading(true);

      // Fetch user profile to know role
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("auth_id", user.id)
        .single();

      let query = supabase.from("requests").select("*").order("created_at", { ascending: false });

      // Role-based filtering
      if (profile.role === "customer") {
        query = query.eq("customer_id", profile.id);
      } else if (profile.role === "artist") {
        query = query.eq("assigned_artist", profile.id);
      }
      // Admin sees all

      const { data } = await query;
      setOrders(data || []);
      setLoading(false);
    }

    loadOrders();
  }, [user]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Track Your Orders</h1>

        {loading && <p className="text-gray-600">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-amber-200"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-amber-900">{o.name || "Portrait Request"}</h2>

                {/* STATUS BADGE */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                      o.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : o.status === "assigned"
                        ? "bg-blue-200 text-blue-800"
                        : o.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }
                  `}
                >
                  {o.status}
                </span>
              </div>

              <p className="text-gray-700 mt-2">
                <strong>Event:</strong> {o.event_date || "—"}
              </p>

              <p className="text-gray-700"><strong>Address:</strong> {o.address || "—"}</p>
              <p className="text-gray-700"><strong>Notes:</strong> {o.notes || "—"}</p>

              {/* PRICE + PAYMENT */}
              <div className="mt-3 flex items-center gap-4">
                <p className="text-amber-900 font-semibold">
                  ₹{o.price}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm 
                    ${
                      o.payment_status === "pending"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-green-200 text-green-800"
                    }
                  `}
                >
                  {o.payment_status}
                </span>
              </div>

              {/* CUSTOMER UPLOADED PHOTO */}
              {o.photo_path && (
                <div className="mt-4">
                  <p className="font-medium text-amber-900 mb-1">Uploaded Photo:</p>
                  <img
                    src={`${storageBase}/requests/${o.photo_path}`}
                    className="w-full max-w-sm rounded-lg shadow"
                    alt="Uploaded reference"
                  />
                </div>
              )}

              {/* ARTIST FINAL ARTWORK (optional future) */}
              {o.storage_path && (
                <div className="mt-4">
                  <p className="font-medium text-green-700 mb-1">Final Artwork:</p>
                  <img
                    src={`${storageBase}/artworks/${o.storage_path}`}
                    className="w-full max-w-sm rounded-lg shadow"
                    alt="Final Artwork"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}