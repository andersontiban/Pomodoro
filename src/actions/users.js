'use server';

import { createClient} from "../../utils/supabase/server";

export async function createAccountAction(formData) {
    try {

        const supabase = await createClient()

        const email = formData.get('email');
        const password = formData.get('password');

        const { error } = await supabase.auth.signUp(data)

        // const { data, error } = supabase.auth.signUp({
        //     email,
        //     password,
        //     options: {
        //       emailRedirectTo: 'https://music-translator.vercel.app/login/',
        //     },
        //   })

        if (error) {
            return { errorMessage: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error during sign up:", error);
        return { errorMessage: "An unexpected error occurred." };
    }
}

export async function loginAction(formData) {

    const supabase = await createClient()

        const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
    }

    const {data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
 
}