import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      // Fix session load for mobile (desktop view toggle issue)
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(userProfile || null);
      setLoading(false);
    };

    loadUser();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => listener.subscription.unsubscribe();
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