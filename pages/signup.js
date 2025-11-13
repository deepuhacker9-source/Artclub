import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Account created!");
      setTimeout(() => router.push("/login"), 800);
    }
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Floating animated background shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600 blur-3xl opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-700 blur-3xl opacity-20 rounded-full animate-pulse"></div>

      <div className="flex items-center justify-center h-full relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="backdrop-blur-xl bg-white/10 shadow-xl border border-white/20 p-8 rounded-2xl w-[380px]"
        >
          <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
            Create Account
          </h1>

          <form className="space-y-4" onSubmit={handleSignup}>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 outline-none"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <motion.input
              type="password"
              whileFocus={{ scale: 1.02 }}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 outline-none"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full p-3 bg-pink-700 text-white rounded-lg font-semibold shadow-lg hover:bg-pink-800 transition"
              type="submit"
            >
              Sign Up
            </motion.button>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-center font-medium ${
                message.startsWith("❌") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </motion.p>
          )}

          <p className="text-gray-300 text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-pink-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </motion.div>

      </div>
    </div>
  );
}