'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const isPasswordValid = password.length >= 6;

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // For email confirmation flows, usually check for session or show "Check email" message.
            // Assuming auto-confirm or session created for now, or redirect to dashboard (will be guarded by middleware/auth state)
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h2 className="text-3xl font-serif font-bold text-center mb-8">Create Account</h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors pr-10"
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors pr-10"
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Password Match Indicator Bar */}
                        <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${passwordsMatch
                                        ? 'bg-green-500 w-full'
                                        : confirmPassword.length > 0
                                            ? 'bg-red-500 w-1/2'
                                            : 'w-0'
                                    }`}
                            />
                        </div>
                        {confirmPassword.length > 0 && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Sign Up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#171717] text-neutral-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                                redirectTo: `${location.origin}/auth/callback`,
                            },
                        });
                    }}
                    className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </button>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-primary hover:text-primary-hover">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
