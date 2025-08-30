'use server';

import { createClient } from "../../utils/supabase/server";

export async function createAccountAction(formData) {
  try {
    // Use the Service Role key to create users server-side
    const supabaseAdmin = await createClient({ useServiceRole: true });

    const email = formData.get('email');
    const password = formData.get('password');

    // Create user with email auto-confirmed
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // <-- auto-confirm email
    });

    if (error) {
      return { errorMessage: error.message };
    }

    return { success: true, user: data };
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { errorMessage: "An unexpected error occurred." };
  }
}

export async function loginAction(formData) {
  const supabase = await createClient(); // regular client for login

  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}
