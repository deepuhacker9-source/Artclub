import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const loginEmail = async () => {
    setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    router.push("/");
  };

  const loginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: process.env.NEXT_PUBLIC_APP_URL }
    });
    if (error) setMsg(error.message);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h1>
          <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded mb-6" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button onClick={loginEmail} className="w-full px-4 py-3 rounded shadow-md" style={{ background: "#C56A47", color: "#fff" }}>Login</button>
          <button onClick={loginGoogle} className="w-full mt-3 px-4 py-3 rounded border">Continue with Google</button>
          {msg && <p className="text-red-600 mt-3">{msg}</p>}
          <p className="text-center mt-4">Don’t have an account? <a href="/signup" className="text-pink-700">Sign up</a></p>
        </div>
      </div>
    </>
  );
}