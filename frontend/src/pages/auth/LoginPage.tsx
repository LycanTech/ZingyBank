import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-bank-bg">
      {/* Left panel — Apple Aurora branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-[#06060E]">
        {/* Aurora base */}
        <div className="absolute inset-0 apple-aurora-bg" />

        {/* Floating orbs */}
        <div className="absolute top-[12%] right-[8%] w-80 h-80 rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="absolute bottom-[12%] left-[8%] w-72 h-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-indigo-600/10 blur-[140px]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 login-grid-overlay" />

        {/* Top shimmer line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-400/40 to-transparent" />

        <div className="relative z-10 text-center px-10">
          {/* Logo mark */}
          <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(139,92,246,0.60)] ring-1 ring-white/20">
            <span className="text-white font-bold text-5xl tracking-tight">Z</span>
          </div>

          <h1 className="text-5xl font-bold mb-3 gradient-text tracking-tight">ZingyBank</h1>
          <p className="text-lg text-white/45 mb-12 tracking-wide">Banking Reimagined</p>

          {/* Feature pills — glass */}
          <div className="flex flex-col items-center gap-3">
            {['256-bit Encryption', 'Real-time Transfers', 'AI-Powered Insights'].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-surface text-sm text-white/65 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-violet-400 to-fuchsia-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-bank-bg relative">
        {/* Subtle violet tint */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-950/15 to-transparent pointer-events-none" />

        {/* Mobile header */}
        <div className="lg:hidden px-6 py-4 flex items-center gap-3 border-b border-white/6 relative">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.5)]">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">ZingyBank</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
