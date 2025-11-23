import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google"
      // DO NOT set `options.redirectTo` here — using single-callback flow
    });

    if (error) {
      console.error("Google login error:", error);
      alert("Login error: " + (error.message || error.code));
    }
    // The browser will be redirected to Google immediately; nothing else needed here
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login / Signup</h1>
          <button
            onClick={loginWithGoogle}
            className="w-full px-4 py-3 rounded border shadow"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}