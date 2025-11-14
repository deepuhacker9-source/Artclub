import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signupEmail = async () => {
  setMsg("sending...");

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: { data: { full_name: name } }
  });

  // SHOW RAW ERROR ON SCREEN
  if (error) {
    setMsg("RAW ERROR → " + error.message);
    return;
  }

  // If no signup error, show the raw data to confirm
  setMsg("SIGNUP OK → " + JSON.stringify(data));

  // Insert into profiles
  await supabase.from("profiles").upsert({
    id: data.user.id,
    auth_id: data.user.id,
    name,
    email,
    role: "customer"
  });

  router.push("/");
};
  const signupGoogle = async () => {
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
          <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>
          <input className="w-full p-3 border rounded mb-3" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full p-3 border rounded mb-6" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button onClick={signupEmail} className="w-full px-4 py-3 rounded shadow-md" style={{ background: "#C56A47", color: "#fff" }}>Sign up</button>
          <button onClick={signupGoogle} className="w-full mt-3 px-4 py-3 rounded border">Continue with Google</button>
          {msg && <p className="text-red-600 mt-3">{msg}</p>}
          <p className="text-center mt-4">Already have an account? <a href="/login" className="text-pink-700">Login</a></p>
        </div>
      </div>
    </>
  );
}