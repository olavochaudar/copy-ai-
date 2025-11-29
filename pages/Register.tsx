
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { supabaseService } from '../services/supabaseService';
import { Lock, Mail, User, CheckCircle2, Star, ArrowRight } from 'lucide-react';

export const Register: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Passing name to the service
    const { data } = await supabaseService.auth.signUp(email, password, name);
    if (data) {
        onLogin();
        navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      
      {/* LADO ESQUERDO - Visual e Benefícios (Escondido em Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black overflow-hidden flex-col justify-between p-12 border-r border-gray-900">
        {/* Efeitos de Fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-[#FF8C00] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
            <Logo size="lg" />
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 max-w-lg space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-700 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover"/>
                             </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Junte-se a <span className="text-white font-bold">+5.000</span> copywriters
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Comece a escrever copy <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-orange-400">que vende milhões.</span>
                </h2>
                <p className="text-gray-400 text-lg">
                    Crie sua conta gratuita hoje e tenha acesso imediato à tecnologia que as maiores agências do mundo estão usando.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                    <div className="p-2 bg-[#FF8C00]/10 rounded-lg text-[#FF8C00]">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">10.000 palavras gratuitas/mês</h4>
                        <p className="text-sm text-gray-500">Teste todo o poder da nossa IA sem pagar nada.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Star size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Acesso à Magic Box</h4>
                        <p className="text-sm text-gray-500">Gere estratégias completas em segundos.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-gray-500 flex gap-6">
            <span>&copy; 2024 ViralCopy AI</span>
            <span className="flex items-center gap-1 text-gray-400"><Star size={12} fill="currentColor" className="text-[#FF8C00]" /> 4.9/5 Avaliação Média</span>
        </div>
      </div>

      {/* LADO DIREITO - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#09090b]">
        <div className="w-full max-w-md space-y-8">
            
            <div className="text-center lg:text-left">
                <div className="lg:hidden flex justify-center mb-6">
                    <Logo size="md" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Crie sua conta grátis</h2>
                <p className="mt-2 text-gray-400">
                    Preencha os dados abaixo. Não pedimos cartão de crédito.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Seu Nome</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF8C00] transition-colors">
                            <User size={20} />
                        </div>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-[#FF8C00]/50 focus:border-[#FF8C00] transition-all outline-none"
                            placeholder="Como devemos te chamar?"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Seu melhor E-mail</label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Crie uma Senha</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF8C00] transition-colors">
                            <Lock size={20} />
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-[#FF8C00]/50 focus:border-[#FF8C00] transition-all outline-none"
                            placeholder="Pelo menos 8 caracteres"
                            minLength={8}
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full py-3.5 text-base font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all" 
                        isLoading={loading}
                    >
                        Criar Conta Gratuita <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
                
                <p className="text-xs text-center text-gray-500">
                    Ao criar uma conta, você concorda com nossos <a href="#" className="underline hover:text-white">Termos de Serviço</a> e <a href="#" className="underline hover:text-white">Política de Privacidade</a>.
                </p>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
            </div>

            <p className="text-center text-sm text-gray-500">
                Já é um membro?{' '}
                <Link to="/login" className="font-bold text-[#FF8C00] hover:text-orange-400 hover:underline transition-colors">
                    Fazer Login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};
