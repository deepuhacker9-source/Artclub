import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../lib/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");

  // redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // load profile
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role, bio, avatar_path, created_at")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 can be "No rows" - ignore if null
        setError("Failed loading profile: " + error.message);
        return;
      }

      if (mounted) {
        setProfile(data || null);
        setName((data && data.name) || (user.user_metadata?.full_name || ""));
        setBio((data && data.bio) || "");
        // preview image: prefer profile.avatar_path else user metadata picture
        if (data?.avatar_path) {
          setAvatarPreview(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data.avatar_path}`
          );
        } else if (user.user_metadata?.avatar_url || user.user_metadata?.picture) {
          setAvatarPreview(user.user_metadata?.avatar_url || user.user_metadata?.picture);
        } else {
          setAvatarPreview(null);
        }
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  // helper - upload avatar file
  async function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const filename = `avatar-${Date.now()}.${ext}`;
      const path = `${user.id}/${filename}`; // avatars/{userId}/{file}
      // ensure bucket name is 'avatars' and it's public
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: true });

      if (upErr) throw upErr;

      // get public url
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData?.publicUrl || null;

      // update profiles table
      const { error: updErr } = await supabase
        .from("profiles")
        .upsert({ id: user.id, auth_id: user.id, avatar_path: `${user.id}/${filename}` });

      if (updErr) throw updErr;

      setAvatarPreview(publicUrl);
    } catch (err) {
      console.error("Avatar upload error", err);
      setError("Avatar upload failed: " + (err.message || JSON.stringify(err)));
    } finally {
      setAvatarUploading(false);
    }
  }

  // save profile
  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        id: user.id,
        auth_id: user.id,
        name: name || user.user_metadata?.full_name || "",
        bio: bio || null,
      };
      const { error: upsertErr } = await supabase.from("profiles").upsert(payload);
      if (upsertErr) throw upsertErr;
      // refresh local state
      setProfile((p) => ({ ...(p || {}), ...payload }));
    } catch (err) {
      console.error("Save profile error", err);
      setError("Save failed: " + (err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="p-6 max-w-2xl mx-auto">
          <p className="text-center text-gray-600">Loading profile…</p>
        </div>
      </>
    );
  }

  // computed avatar shown
  const avatarSrc =
    avatarPreview ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    "/placeholder.png";

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-200">
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: "#3B2D2F" }}>
                {name || user.user_metadata?.full_name || "Your Name"}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 text-sm text-gray-500">Role: <span className="font-medium">{profile?.role || "customer"}</span></p>

              <div className="mt-4 flex gap-3">
                {profile?.role === "artist" && (
                  <button
                    onClick={() => router.push("/artist/dashboard")}
                    className="px-4 py-2 rounded"
                    style={{ background: "#C56A47", color: "#fff" }}
                  >
                    Artist Dashboard
                  </button>
                )}
                {profile?.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="px-4 py-2 rounded border"
                    style={{ borderColor: "#C56A47" }}
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <label className="text-sm text-gray-600">Change avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="text-xs"
                disabled={avatarUploading}
              />
              {avatarUploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
            </div>
          </div>

          <hr className="my-6" />

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <div className="font-medium text-gray-700">Full name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded mt-1"
                />
              </label>

              <label className="block">
                <div className="font-medium text-gray-700">Bio</div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="w-full p-3 border rounded mt-1"
                />
              </label>

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded"
                  style={{ background: "#C56A47", color: "#fff" }}
                >
                  {saving ? "Saving…" : "Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName(profile?.name || user.user_metadata?.full_name || "");
                    setBio(profile?.bio || "");
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="mt-8 text-sm text-gray-600">
          <p>
            Member since: <span className="font-medium">{new Date(profile?.created_at || user.created_at).toLocaleDateString()}</span>
          </p>
        </section>
      </main>
    </>
  );
}