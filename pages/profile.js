import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Profile() {
  const { profile, loading } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {});
  const [saving, setSaving] = useState(false);

  if (loading || !profile) return <p className="p-6">Loading...</p>;

  const saveProfile = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        bio: form.bio,
        avatar_path: form.avatar_path
      })
      .eq("id", profile.id);

    setSaving(false);
    if (!error) {
      setEditing(false);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE4D9] p-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="h-40 bg-gradient-to-r from-pink-300 to-orange-300 relative">
          <div className="absolute -bottom-12 left-6">
            <img
              src={profile.avatar_path || profile.raw_user_meta_data?.avatar_url}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        <div className="pt-16 px-6 pb-6">

          {/* NAME */}
          {!editing ? (
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          ) : (
            <input
              className="border p-2 rounded w-full mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          {/* ROLE */}
          <p className="text-sm text-gray-600 mt-1">
            {profile.role?.toUpperCase()}
          </p>

          {/* BIO */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Bio</h3>

            {!editing ? (
              <p className="text-gray-700 mt-1">
                {profile.bio || "No bio added yet."}
              </p>
            ) : (
              <textarea
                className="border p-2 rounded w-full"
                rows="3"
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              ></textarea>
            )}
          </div>

          {/* RATING */}
          <div className="mt-6 flex gap-4">
            <div>
              <h3 className="font-semibold text-gray-800">Rating</h3>
              <p className="text-gray-700">{profile.avg_rating}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Verified</h3>
              <p className="text-gray-700">
                {profile.verified ? "Yes" : "Not Verified"}
              </p>
            </div>
          </div>

          {/* JOIN DATE */}
          <p className="text-xs text-gray-500 mt-6">
            Joined: {new Date(profile.created_at).toLocaleDateString()}
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            {!editing ? (
              <button
                className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}