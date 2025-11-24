import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fix for mobile browsers
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(userProfile || null);
      setLoading(false);
    };

    load();

    supabase.auth.onAuthStateChange(() => load());
  }, []);

  return (
    <UserContext.Provider value={{ profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}