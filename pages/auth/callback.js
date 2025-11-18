import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      if (!router.isReady) return;

      const { code, error } = router.query;

      if (error) {
        console.error("Google OAuth error:", error);
        router.replace("/login");
        return;
      }

      if (!code) return;

      // PKCE step — exchange ?code for session
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Failed exchanging code:", exchangeError);
        router.replace("/login");
        return;
      }

      // SUCCESS — session stored automatically
      router.replace("/dashboard");
    };

    run();
  }, [router]);

  return (
    <p style={{ padding: 20 }}>Signing in…</p>
  );
}