import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";

// Disable SSR completely for this page
export const getServerSideProps = async () => {
  return { props: {} };
};

function DashboardPage() {
  const { profile, loading } = useUser();

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-lg text-gray-600">
          Loading your dashboard…
        </div>
      </>
    );

  if (!profile)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-red-600 text-lg">
          You are not logged in.
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Welcome, {profile.name}</h1>
        <p className="text-gray-700 mt-2">Role: {profile.role}</p>
      </div>
    </>
  );
}

// Make sure this page runs ONLY on the client
export default dynamic(() => Promise.resolve(DashboardPage), {
  ssr: false,
});