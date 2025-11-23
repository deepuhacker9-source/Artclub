import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {

  const signupWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google"
      // No redirectTo — using single-callback flow
    });

    if (error) {
      console.error("Google signup error:", error);
      alert("Signup error: " + (error.message || error.code));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h1>

          <button
            onClick={signupWithGoogle}
            className="w-full px-4 py-3 rounded border shadow"
          >
            Sign up with Google
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-pink-700">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}