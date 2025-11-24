import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session and profile safely on mobile
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Wait for Supabase session to hydrate (mobile fix)
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch user’s profile
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      setProfile(userProfile || null);
      setLoading(false);
    };

    load();

    // Listen for login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(() => load());

    return () => authListener.subscription.unsubscribe();
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