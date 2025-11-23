import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      try {
        if (supabase.auth.exchangeCodeForSession) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        } else {
          await supabase.auth.getSessionFromUrl({ storeSession: true });
        }

        router.replace("/dashboard");
      } catch (e) {
        console.error("OAuth callback error:", e);
        router.replace("/login?error=auth_failed");
      }
    }

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Setting up your account...
    </div>
  );
}