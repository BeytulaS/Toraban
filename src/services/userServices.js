import { supabase } from "../lib/supabase";

function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function OAuthSignIn(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export { signUp, signIn, OAuthSignIn };
