import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const completeLogin = async () => {
      // Wait for Supabase session to finish creating user
      let tries = 0;

      while (tries < 10) {
        const { data } = await supabase.auth.getSession();
        if (data.session) break;

        // wait 300ms before trying again
        await new Promise((r) => setTimeout(r, 300));
        tries++;
      }

      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        router.replace("/login?error=session");
        return;
      }

      // SUCCESS: Redirect smoothly
      router.replace("/dashboard");
    };

    completeLogin();
   useEffect(() => {
  console.log("Callback JS is executing…");
  // your login code...
}, []);

  return (
    <div style={{
      padding: "40px",
      fontSize: "20px",
      fontWeight: "600",
      textAlign: "center"
    }}>
      Finishing login…
    </div>
  );
}