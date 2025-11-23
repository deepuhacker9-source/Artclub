import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";

export default function Dashboard() {
  const { profile, loading } = useUser();

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

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
        <p className="text-gray-700 mt-2">Role: {profile.role}</p>
      </div>
    </>
  );
}