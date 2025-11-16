import Navbar from "../components/Navbar";
import { useUser } from "../lib/UserContext";

export default function Dashboard() {
  const { user, loading } = useUser();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
            <p className="mt-3 text-gray-600">User ID: {user.id}</p>
            {/* Add role-based UI here (artist / customer / admin) */}
          </>
        ) : (
          <p>Please login to access your dashboard.</p>
        )}
      </main>
    </>
  );
}