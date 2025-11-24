import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 px-4">
        <div className="backdrop-blur-xl bg-white/70 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/40">

          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
            Welcome Back
          </h1>

          <p className="text-sm text-center text-gray-600 mb-8">
            Sign in to continue exploring Art Club
          </p>

          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-semibold text-gray-800">Continue with Google</span>
          </button>

          <div className="mt-10 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy.
          </div>
        </div>
      </div>
    </>
  );
}