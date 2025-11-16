import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        // Force Supabase to read the session from URL hash
        const { data } = await supabase.auth.getSession();

        // If session exists → redirect to dashboard
        if (data?.session) {
          router.replace("/dashboard");
        } else {
          // No session yet → try again after small delay
          setTimeout(completeLogin, 400);
        }
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/login");
      }
    };

    completeLogin();
  }, [router]);

  return (
    <div style={{ padding: "2rem" }}>
      <p>Finishing sign-in…</p>
    </div>
  );
}