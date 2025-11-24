// pages/auth/callback.js

import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {

  // 🔥 Fix the broken "#" hash problem
  useEffect(() => {
    if (window.location.hash === "#") {
      window.location.replace(window.location.pathname);
    }
  }, []);

  // 🔥 Finish Supabase login and redirect
  useEffect(() => {
    const finishLogin = async () => {
      // Force Supabase to resolve the session
      await supabase.auth.getSession();

      // Hard redirect to dashboard (mobile safe)
      window.location.href = "/dashboard";
    };

    finishLogin();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "26px",
      fontWeight: "700",
      color: "#6A4330"
    }}>
      Finishing login…
    </div>
  );
}