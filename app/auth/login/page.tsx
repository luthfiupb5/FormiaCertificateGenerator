"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Info } from 'lucide-react';

export default function LoginPage() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (email === 'demo@formia.com' && password === 'demo123') {
         // Mock persist login
         const user = { name: 'Demo User', email: email };
         localStorage.setItem('formia_user', JSON.stringify(user));
         // Redirect to the main app (Editor)
         router.push('/canvas');
      } else {
         setError('Invalid credentials. Try the demo account.');
      }
   };

   return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
         {/* Background */}
         <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />

         <Link href="/" className="absolute top-8 left-8 text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
         </Link>

         <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 border-white/10">
            <div className="text-center mb-8">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 mx-auto mb-4">
                  F
               </div>
               <h2 className="text-2xl font-bold">Welcome Back</h2>
               <p className="text-neutral-400 text-sm mt-2">Sign in to continue automating your certificates</p>
            </div>

            <div className="space-y-4">
               {/* Demo Credentials Hint */}
               <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-primary flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                     <p className="font-semibold">Demo Credentials:</p>
                     <p>Email: <code className="bg-black/20 px-1 rounded">demo@formia.com</code></p>
                     <p>Password: <code className="bg-black/20 px-1 rounded">demo123</code></p>
                  </div>
               </div>

               <button className="w-full h-12 bg-white text-black font-medium rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
               </button>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-[#0e0e0e] px-2 text-neutral-500">Or continue with</span>
                  </div>
               </div>

               <form onSubmit={handleLogin} className="space-y-3">
                  <div className="relative">
                     <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                     <input
                        type="email"
                        placeholder="Email"
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 outline-none focus:border-primary/50 transition-colors text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                     <input
                        type="password"
                        placeholder="Password"
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 outline-none focus:border-primary/50 transition-colors text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  {error && <p className="text-xs text-red-500 ml-1">{error}</p>}

                  <button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg flex items-center justify-center transition-all shadow-lg shadow-primary/20">
                     Sign In
                  </button>
               </form>
            </div>

            <div className="mt-6 text-center text-sm text-neutral-400">
               New to Formia?{" "}
               <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Create an account
               </Link>
            </div>
         </div>
      </div>
   );
}
