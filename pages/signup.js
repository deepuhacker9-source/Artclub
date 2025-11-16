const signupEmail = async () => {
  setMsg("");
  const emailTrim = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: emailTrim,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { full_name: name }
    }
  });

  if (error) {
    setMsg("RAW ERROR → " + error.message);
    return;
  }

  if (data?.user?.id) {
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        auth_id: data.user.id,
        name,
        email: emailTrim,
        role: "customer"
      });

    if (upsertErr) {
      setMsg("Database error saving new user → " + upsertErr.message);
      return;
    }
  }

  router.push("/");
};