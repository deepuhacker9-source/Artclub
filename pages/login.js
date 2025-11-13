import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Logged in!");
      setTimeout(() => router.push("/"), 800);
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#f7f5f4] to-[#eae7e5] flex items-center justify-center px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 backdrop-blur-xl border border-white/70 shadow-sm p-8 rounded-2xl w-full max-w-sm"
      >
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          Art Club Login
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          
          <motion.input
            whileFocus={{ scale: 1.01 }}
            className="w-full p-3 rounded-lg bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-gray-500 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.input
            type="password"
            whileFocus={{ scale: 1.01 }}
            className="w-full p-3 rounded-lg bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-500 outline-none focus:border-gray-500 transition"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full p-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition"
            type="submit"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-gray-700 text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-gray-900 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
}