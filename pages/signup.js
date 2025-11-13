import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signupEmail = async () => {
    setMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) return setMsg(error.message);

    // Create profile
    await supabase.from("profiles").upsert({
      id: data.user.id,
      auth_id: data.user.id,
      name: name,
      email: email,
      role: "customer"
    });

    router.push("/");
  };

  const signupGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://artclub-7yis24o4a-deepaks-projects-e5f3ec48.vercel.app"
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signupEmail}
          className="w-full bg-black text-white py-3 rounded mb-4"
        >
          Sign Up
        </button>

        <button
          onClick={signupGoogle}
          className="w-full bg-red-600 text-white py-3 rounded mb-4"
        >
          Continue with Google
        </button>

        {msg && <p className="text-red-600 text-center">{msg}</p>}

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-pink-700 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
}