import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const pending = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // central loader: safe, idempotent
  const loadProfile = async () => {
    if (pending.current) return; // avoid overlapping loads
    pending.current = true;
    try {
      setLoading(true);

      // 1) try to get session & user from supabase
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session ?? null;

      if (!session) {
        // no session -> ensure UI shows logged out
        if (mounted.current) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const user = session.user ?? (await supabase.auth.getUser()).data?.user;
      if (!user) {
        if (mounted.current) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const userId = user.id;

      // 2) fetch profile. try id first, then auth_id as fallback
      let { data: userProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        // if select by id fails, try by auth_id (some schemas use auth_id)
        const fallback = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", userId)
          .maybeSingle();
        userProfile = fallback.data ?? null;
      }

      if (mounted.current) {
        setProfile(userProfile ?? null);
        setLoading(false);
      }
    } catch (err) {
      // Always stop loading on errors so UI doesn't hang
      if (mounted.current) {
        console.error("loadProfile error:", err);
        setProfile(null);
        setLoading(false);
      }
    } finally {
      pending.current = false;
    }
  };

  useEffect(() => {
    // initial load
    loadProfile();

    // subscribe to auth events
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // common events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
      // we reload profile after these events.
      // give supabase a moment to persist session on redirect flows:
      setTimeout(() => loadProfile(), 250);
    });

    return () => {
      // cleanup subscription
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        // older sdk shape fallback:
        if (listener?.unsubscribe) listener.unsubscribe();
      }
    };
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