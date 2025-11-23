import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      try {
        // Supabase v2 -> exchange code for session; older lib variations exist
        // Try both methods safely: first attempt exchangeCodeForSession if available
        if (supabase.auth.exchangeCodeForSession) {
          const urlParams = new URL(window.location.href).searchParams;
          const error = urlParams.get("error");
          if (error) {
            console.error("OAuth error in URL:", error, urlParams.get("error_description"));
            router.replace("/login");
            return;
          }

          // This will set the client session
          await supabase.auth.exchangeCodeForSession(window.location.href);
        } else if (supabase.auth.getSessionFromUrl) {
          // fallback
          await supabase.auth.getSessionFromUrl({ storeSession: true });
        } else {
          console.warn("No compatible supabase auth exchange function found.");
        }

        // session now set in client — redirect to dashboard or where you want
        router.replace("/dashboard");
      } catch (err) {
        console.error("Auth callback exchange failed:", err);
        router.replace("/login?error=auth_exchange_failed");
      }
    }

    // only run in browser
    if (typeof window !== "undefined") handle();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Processing sign in…</div>;
}