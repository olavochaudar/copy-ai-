import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { supabaseService } from '../services/supabaseService';
import { Lock, Mail, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';

// Componente de ícone do Google para o botão social
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('alex.creator@viralcopy.ai');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulação de delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500));

    const { data, error } = await supabaseService.auth.signInWithPassword(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data) {
      onLogin();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      
      {/* LADO ESQUERDO - Visual e Branding (Escondido em Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black overflow-hidden flex-col justify-between p-12 border-r border-gray-900">
        {/* Efeitos de Fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FF8C00] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
            <Logo size="lg" />
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Transforme ideias em <span className="text-[#FF8C00]">copy de alta conversão</span> em segundos.
            </h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={14} strokeWidth={3} /></div>
                    <span>Motor de IA v2.5 otimizado para vendas</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={14} strokeWidth={3} /></div>
                    <span>Biblioteca com +50 frameworks validados</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={14} strokeWidth={3} /></div>
                    <span>Segurança de dados Enterprise</span>
                </div>
            </div>
        </div>

        {/* Depoimento / Footer */}
        <div className="relative z-10 bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-300 italic mb-4">"O ViralCopy mudou completamente a forma como nossa agência opera. Reduzimos o tempo de escrita em 80% mantendo a qualidade sênior."</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF8C00] to-purple-600 p-[2px]">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="rounded-full w-full h-full object-cover border-2 border-black" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm">Sarah Martins</p>
                    <p className="text-gray-500 text-xs">CMO @ GrowthAgency</p>
                </div>
            </div>
        </div>
      </div>

      {/* LADO DIREITO - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#09090b]">
        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                    <Logo size="md" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
                <p className="mt-2 text-gray-400">
                    Entre com suas credenciais para acessar sua conta.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-fadeIn">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mail Corporativo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF8C00] transition-colors">
                                <Mail size={20} />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-[#FF8C00]/50 focus:border-[#FF8C00] transition-all outline-none"
                                placeholder="nome@empresa.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF8C00] transition-colors">
                                <Lock size={20} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-[#FF8C00]/50 focus:border-[#FF8C00] transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-[#FF8C00] focus:ring-[#FF8C00] focus:ring-offset-gray-900"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer select-none">
                            Lembrar de mim
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-[#FF8C00] hover:text-orange-400 transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full py-3.5 text-base font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all" 
                    isLoading={loading}
                >
                    Entrar na Plataforma <ArrowRight size={18} className="ml-2" />
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#09090b] text-gray-500">Ou continue com</span>
                </div>
            </div>

            <div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors">
                    <GoogleIcon />
                    <span className="text-sm font-medium">Google</span>
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-bold text-[#FF8C00] hover:text-orange-400 hover:underline transition-colors">
                    Crie sua conta grátis
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};