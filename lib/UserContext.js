
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext({ user: null, profile: null, loading: true });

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(uid) {
    if (!uid) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data || null);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user ?? null;
      if (!mounted) return;
      setUser(currentUser);
      await fetchProfile(currentUser?.id);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const cu = session?.user ?? null;
      setUser(cu);
      await fetchProfile(cu?.id);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}