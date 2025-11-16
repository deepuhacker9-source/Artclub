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
    setMsg("");
    const emailTrim = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: emailTrim,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: { full_name: name }
      }
    });

    if (error) {
  console.log("SIGNUP ERROR:", error);
  setMsg("SIGNUP ERROR → " + JSON.stringify(error, null, 2));
  return;
}

    if (data?.user?.id) {
      const { error: upsertErr } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          auth_id: data.user.id,
          name,
          email: emailTrim,
          role: "customer"
        });

      if (upsertErr) {
  console.log("UPSERT ERROR:", upsertErr);
  setMsg("UPSERT ERROR → " + JSON.stringify(upsertErr, null, 2));
  return;
}
    }

    router.push("/");
  };

  const signupGoogle = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: process.env.NEXT_PUBLIC_APP_URL }
    });
    if (error) setMsg("RAW ERROR → " + error.message);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>

          <input
            className="w-full p-3 border rounded mb-3"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded mb-6"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signupEmail}
            className="w-full px-4 py-3 rounded shadow-md"
            style={{ background: "#C56A47", color: "#fff" }}
          >
            Sign up
          </button>

          <button
            onClick={signupGoogle}
            className="w-full mt-3 px-4 py-3 rounded border"
          >
            Continue with Google
          </button>

          {msg && <p className="text-red-600 mt-3">{msg}</p>}

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