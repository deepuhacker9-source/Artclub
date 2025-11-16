import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      // Get session after redirect
      await supabase.auth.getSession();
      router.push("/"); // send user home
    };

    finish();
  }, []);

  return <p>Finishing login...</p>;
}