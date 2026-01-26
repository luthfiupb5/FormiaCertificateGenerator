import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                // Upsert email into public.profiles
                try {
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        email: user.email,
                        updated_at: new Date().toISOString(),
                    });
                } catch (err) {
                    console.error('Error updating user profile:', err);
                    // Continue with redirect even if profile update fails
                }
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
