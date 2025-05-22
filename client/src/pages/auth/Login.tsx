import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('Erro de login:', signInError);
        setError(signInError.message || 'Falha ao fazer login, verifique suas credenciais');
        return;
      }
      
      // Redireciona para o dashboard após login bem-sucedido
      setLocation('/dashboard');
    } catch (err) {
      console.error('Erro inesperado durante login:', err);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-600">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="********"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>
          
          <Link href="/forgot-password" className="text-sm font-medium text-brand-gold hover:text-brand-gold/80">
            Esqueceu a senha?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-brand-gold hover:bg-brand-gold/90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <span>Não tem uma conta? </span>
        <Link href="/register" className="font-medium text-brand-gold hover:text-brand-gold/80">
          Cadastre-se
        </Link>
      </div>
      
      {/* Login de emergência para desenvolvimento */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Login de Desenvolvimento</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              setEmail('superadmin@example.com');
              setPassword('senha123');
            }}
            className="w-full py-1 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
          >
            Superadmin
          </button>
          <button
            onClick={() => {
              setEmail('admin@example.com');
              setPassword('senha123');
            }}
            className="w-full py-1 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
          >
            Admin
          </button>
          <button
            onClick={() => {
              setEmail('user@example.com');
              setPassword('senha123');
            }}
            className="w-full py-1 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
          >
            Usuário Regular
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;