import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-amber-600">NIXCON</h1>
          <p className="text-gray-600 mt-2">Portal de Contabilidade</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;