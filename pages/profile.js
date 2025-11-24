import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) console.log(error);
    setProfile(data);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

        {/* Avatar */}
        <div className="mb-4">
          <img
            src={profile.avatar_path || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border"
          />
        </div>

        {/* Name */}
        <div className="mb-2">
          <span className="font-semibold">Name: </span>
          {profile.name}
        </div>

        {/* Email */}
        <div className="mb-2">
          <span className="font-semibold">Email: </span>
          {profile.email}
        </div>

        {/* Role */}
        <div className="mb-2">
          <span className="font-semibold">Role: </span>
          {profile.role}
        </div>

        {/* Bio */}
        <div className="mb-2">
          <span className="font-semibold">Bio: </span>
          {profile.bio || "No bio yet."}
        </div>

        {/* Rating */}
        <div className="mb-2">
          <span className="font-semibold">Rating: </span>
          {profile.avg_rating}
        </div>

        {/* Verified */}
        <div className="mb-2">
          <span className="font-semibold">Verified: </span>
          {profile.verified ? "Yes" : "No"}
        </div>

        {/* Account Created */}
        <div className="mb-2">
          <span className="font-semibold">Joined: </span>
          {new Date(profile.created_at).toLocaleDateString()}
        </div>

      </div>
    </>
  );
}