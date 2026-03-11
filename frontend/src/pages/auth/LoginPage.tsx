import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-zingy-600 to-zingy-900 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-[-15%] left-[-10%] w-80 h-80 rounded-full bg-white/5" />

        <div className="text-center z-10 px-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-zingy-600 font-bold text-5xl">Z</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">ZingyBank</h1>
          <p className="text-xl text-zingy-100">Banking Made Simple</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-zingy-700 px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-zingy-600 font-bold text-xl">Z</span>
          </div>
          <span className="text-lg font-bold text-white">ZingyBank</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
