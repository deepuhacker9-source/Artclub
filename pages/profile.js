import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const { profile, loading } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", avatar_path: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  // Keep form synced with profile when loaded
  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      bio: profile.bio || "",
      avatar_path: profile.avatar_path || ""
    });
  }, [profile]);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Loading...</div>
      </>
    );

  if (!profile)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Not logged in.</div>
      </>
    );

  // Validate bio length (200 chars)
  const onChange = (k, v) => {
    if (k === "bio" && v.length > 200) return;
    setForm((s) => ({ ...s, [k]: v }));
  };

  const startEdit = () => {
    setMsg("");
    setEditing(true);
    // scroll into view on mobile
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      name: profile.name || "",
      bio: profile.bio || "",
      avatar_path: profile.avatar_path || ""
    });
    setMsg("");
  };

  // Upload avatar directly using supabase storage
  const uploadAvatar = async (file) => {
    if (!file) return null;
    setUploading(true);
    setMsg("");
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`;
      const path = `${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      // Make public URL (if bucket public)
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setUploading(false);
      return data.publicUrl; // store this string in avatar_path
    } catch (e) {
      setUploading(false);
      setMsg("Upload failed: " + e.message);
      console.error("uploadAvatar", e);
      return null;
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMsg("");

    // If there's a file in the hidden input, upload first
    const file = fileRef.current?.files?.[0];
    if (file) {
      const publicUrl = await uploadAvatar(file);
      if (publicUrl) setForm((s) => ({ ...s, avatar_path: publicUrl }));
      else {
        setSaving(false);
        return;
      }
    }

    // Update profiles row
    const updates = {
      name: form.name || null,
      bio: form.bio || null,
      avatar_path: form.avatar_path || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    setSaving(false);
    if (error) {
      setMsg("Database error: " + error.message);
      console.error("saveProfile error", error);
      return;
    }

    // Reload profile client-side (quick hack: reload page)
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#EFE4D9] p-4">
        <div className="max-w-2xl mx-auto">

          {/* Card */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">

            {/* HEADER gradient + avatar */}
            <div className="h-40 bg-gradient-to-r from-pink-300 to-orange-300 relative">
              <div className="absolute -bottom-16 left-6">
                <img
                  src={form.avatar_path || profile.raw_user_meta_data?.avatar_url || "/placeholder.png"}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              {/* action buttons sit top-right */}
              <div className="absolute right-4 top-4 flex gap-3">
                <button
                  onClick={() => (window.location.href = "/upgrade")}
                  className="hidden sm:inline px-3 py-1 rounded-lg border font-medium"
                >
                  Upgrade
                </button>
                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="px-3 py-1 rounded-lg text-white bg-gradient-to-r from-pink-600 to-orange-500 shadow-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 rounded-lg border"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* CONTENT */}
            <div className="pt-20 px-6 pb-6">

              {/* NAME + ROLE */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {!editing ? profile.name : (
                      <input
                        className="border-b font-bold text-2xl pb-1"
                        value={form.name}
                        onChange={(e)=>onChange("name", e.target.value)}
                      />
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{(profile.role || "customer").toUpperCase()}</p>
                </div>
              </div>

              {/* BIO */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800">Bio</h3>

                {!editing ? (
                  <p className="text-gray-700 mt-1">{profile.bio || "No bio added yet."}</p>
                ) : (
                  <>
                    <textarea
                      className="border p-2 rounded w-full mt-2"
                      rows="4"
                      value={form.bio}
                      onChange={(e)=>onChange("bio", e.target.value)}
                      placeholder="Tell people about yourself (max 200 characters)"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">{form.bio.length}/200</div>

                    {/* Avatar upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Profile picture</label>
                      <input type="file" accept="image/*" ref={fileRef} className="mt-2" />
                      <div className="text-xs text-gray-500 mt-1">Recommended square image. Will be cropped to circle.</div>
                    </div>
                  </>
                )}
              </div>

              {/* Rating + Verified */}
              <div className="mt-6 flex gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Rating</h4>
                  <p className="text-gray-700">{profile.avg_rating}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Verified</h4>
                  <p className="text-gray-700">{profile.verified ? "Yes" : "Not Verified"}</p>
                </div>
              </div>

              {/* Joined */}
              <p className="text-xs text-gray-500 mt-6">
                Joined: {new Date(profile.created_at).toLocaleDateString()}
              </p>

              {/* Save / Upgrade buttons when editing */}
              <div className="mt-8 flex gap-4">
                {editing ? (
                  <>
                    <button
                      onClick={saveProfile}
                      disabled={saving || uploading}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
                    >
                      {saving ? "Saving..." : uploading ? "Uploading..." : "Save"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => (window.location.href = "/upgrade")}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Upgrade to Artist
                    </button>
                  </>
                )}
              </div>

              {msg && <div className="mt-4 text-red-600">{msg}</div>}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}