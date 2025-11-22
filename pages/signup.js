import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const signupGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
  provider: "google"
});

      if (error) {
        alert("Google Auth Error → " + error.message);
      }
    } catch (err) {
      alert("Unexpected Error → " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Continue with Google
          </h1>

          <button
            onClick={signupGoogle}
            className="w-full px-4 py-3 rounded border shadow"
          >
            Login / Signup with Google
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-pink-700">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}