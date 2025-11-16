import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      try {
        // ensures session is available on client after redirect
        await supabase.auth.getSession();
      } catch (err) {
        console.error("callback getSession error", err);
      } finally {
        // landing page after login (you can change to "/" or "/profile")
        router.replace("/dashboard");
      }
    };

    finish();
  }, [router]);

  return <p style={{ padding: 24 }}>Finishing login…</p>;
}