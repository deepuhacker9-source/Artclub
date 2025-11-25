import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {

  useEffect(() => {
    const finish = async () => {

      // Fix mobile "#"
      if (window.location.hash === "#") {
        window.location.replace(window.location.pathname);
        return;
      }

      // Wait for Supabase to finish auth
      let tries = 0;
      while (tries < 15) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) break;

        await new Promise((r) => setTimeout(r, 300));
        tries++;
      }

      // If still no session → fail gracefully
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        window.location.href = "/login?error=session_not_ready";
        return;
      }

      // SUCCESS
      window.location.href = "/dashboard";
    };

    finish();
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