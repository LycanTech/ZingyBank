import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-bank-bg">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zingy-950 via-[#160d2e] to-[#0a0f2e]" />

        {/* Decorative orbs */}
        <div className="absolute top-[-8%] right-[-8%] w-96 h-96 rounded-full bg-zingy-600/20 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[-8%] w-80 h-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-zingy-700/10 blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] login-grid-overlay" />

        <div className="relative z-10 text-center px-8">
          {/* Logo */}
          <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-zingy-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(147,51,234,0.5)]">
            <span className="text-white font-bold text-5xl">Z</span>
          </div>

          <h1 className="text-5xl font-bold mb-3 gradient-text">ZingyBank</h1>
          <p className="text-lg text-bank-muted mb-10">Banking Reimagined</p>

          {/* Feature pills */}
          <div className="flex flex-col items-center gap-3">
            {['256-bit Encryption', 'Real-time Transfers', 'AI-Powered Insights'].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-zingy-800/60 bg-zingy-900/40 text-sm text-zingy-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zingy-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-bank-card">
        {/* Mobile header */}
        <div className="lg:hidden px-6 py-4 flex items-center gap-3 border-b border-bank-border">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-zingy-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <span className="text-lg font-bold gradient-text">ZingyBank</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
