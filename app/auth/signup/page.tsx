import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 border-white/10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/20 mx-auto mb-4">
                        F
                    </div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-neutral-400 text-sm mt-2">Join thousands of creators using Formia</p>
                </div>

                <div className="space-y-4">
                    <button className="w-full h-12 bg-white text-black font-medium rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0e0e0e] px-2 text-neutral-500">Or sign up with email</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                            <input type="text" placeholder="Full Name" className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 outline-none focus:border-primary/50 transition-colors text-sm" />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                            <input type="email" placeholder="Email Address" className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 outline-none focus:border-primary/50 transition-colors text-sm" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                            <input type="password" placeholder="Create Password" className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 outline-none focus:border-primary/50 transition-colors text-sm" />
                        </div>
                    </div>

                    <Link href="/dashboard" className="w-full h-12 bg-secondary hover:bg-pink-600 text-white font-medium rounded-lg flex items-center justify-center transition-all shadow-lg shadow-secondary/20">
                        Create Account
                    </Link>
                </div>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
