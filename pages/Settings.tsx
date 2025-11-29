
import React, { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { supabaseService } from '../services/supabaseService';
import { User } from '../types';
import { Camera, Sparkles, Bell, Shield, CreditCard, User as UserIcon, Check, Zap } from 'lucide-react';

interface SettingsProps {
    user: User | null;
    onUserUpdate: (updatedUser: Partial<User>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      
      const updates = { name, company, phone };
      
      await supabaseService.auth.updateUser(updates);
      onUserUpdate(updates);
      
      setMessage('Perfil atualizado com sucesso!');
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Update immediately
            supabaseService.auth.updateUser({ avatar_url: base64String });
            onUserUpdate({ avatar_url: base64String });
        };
        reader.readAsDataURL(file);
    }
  };

  // Get Initials for Avatar Fallback
  const getInitials = (name: string) => {
      return name
          .split(' ')
          .map(part => part[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie seus dados e preferências da plataforma.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {[
            { id: 'perfil', label: 'Perfil', icon: UserIcon },
            { id: 'seguranca', label: 'Segurança', icon: Shield },
            { id: 'cobranca', label: 'Cobrança', icon: CreditCard },
            { id: 'notificacoes', label: 'Notificações', icon: Bell },
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-brand-surface border border-gray-800 rounded-xl p-6 md:p-8 animate-fadeIn">
          
          {activeTab === 'perfil' && (
            <>
                <div className="mb-8 border-b border-gray-800 pb-6">
                    <h2 className="text-lg font-bold text-white mb-1">Informações do Perfil</h2>
                    <p className="text-sm text-gray-500">Atualize suas informações pessoais e corporativas.</p>
                </div>
                
                <form onSubmit={handleSave} className="space-y-8">
                    
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="h-24 w-24 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center group-hover:border-[#FF8C00] transition-colors">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-[#FF8C00]">{getInitials(name)}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-[#FF8C00] p-2 rounded-full text-white border-2 border-[#09090b] shadow-lg group-hover:scale-110 transition-transform">
                                <Camera size={16} />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{name || 'Usuário'}</h3>
                            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF8C00]/10 border border-[#FF8C00]/20 text-[#FF8C00] text-xs font-bold uppercase tracking-wide">
                                <Sparkles size={10} /> Professional
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-800"></div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Nome Completo</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all placeholder-gray-600"
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                            <input 
                                type="email" 
                                value={user?.email}
                                disabled
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Empresa</label>
                            <input 
                                type="text" 
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all placeholder-gray-600"
                                placeholder="Nome da empresa"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Telefone</label>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all placeholder-gray-600"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        {message && (
                            <span className="text-green-500 text-sm font-medium animate-fadeIn bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                                {message}
                            </span>
                        )}
                        <Button type="submit" isLoading={saving} className="px-8">
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </>
          )}
          
          {activeTab === 'cobranca' && (
             <div className="max-w-4xl mx-auto animate-fadeIn">
                <div className="mb-8 border-b border-gray-800 pb-6">
                    <h2 className="text-lg font-bold text-white mb-1">Cobrança e Planos</h2>
                    <p className="text-sm text-gray-500">Gerencie sua assinatura e visualize os recursos do seu plano.</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-[#FF8C00]/30 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#FF8C00] transform translate-x-10 -translate-y-10">
                        <CreditCard size={200} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8">
                        {/* Plan Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="inline-block bg-[#FF8C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                                    Mais Popular
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/20 text-[#FF8C00] text-xs font-bold uppercase tracking-wide">
                                        <Zap size={12} fill="currentColor" /> Plano Ativo
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Plano Pro</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    O plano ideal para criadores de conteúdo e copywriters que buscam profissionalizar sua entrega.
                                </p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">R$ 99</span>
                                <span className="text-gray-500 font-medium">/mês</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" className="border border-gray-700 bg-gray-800 hover:bg-gray-700">
                                    Gerenciar Assinatura
                                </Button>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="flex-1 bg-black/20 rounded-xl p-6 border border-gray-800/50">
                             <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Shield size={14} className="text-[#FF8C00]" /> Recursos Inclusos
                             </h4>
                             <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Geração de Palavras <span className="ml-2 text-xs font-normal text-[#FF8C00] bg-[#FF8C00]/10 px-1.5 py-0.5 rounded">10.000 palavras/mês</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Acesso ao Motor de IA (v2.5) para gerar Textos (Headlines, E-mails, VSLs e Artigos).</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Biblioteca de IA <span className="ml-2 text-xs font-normal text-[#FF8C00] bg-[#FF8C00]/10 px-1.5 py-0.5 rounded">Acesso Completo</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Acesso a ferramentas de alta conversão (Gerador de Teste A/B, Mapeamento de Intenção, Mineração de Objeções, Roteiro de Chatbot, etc.)</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Modelos Estratégicos <span className="ml-2 text-xs font-normal text-[#FF8C00] bg-[#FF8C00]/10 px-1.5 py-0.5 rounded">Acesso Completo</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Acesso a modelos predefinidos (Funil Semente, Sequência de Boas-vindas, Artigo "Pilar", Anúncios Facebook, Calendário Editorial).</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Nível dos Modelos <span className="ml-2 text-xs font-normal text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded">Exclui Modelos Avançados</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Inclui acesso a modelos de nível Iniciante e Intermediário.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Modo Turbo <span className="ml-2 text-xs font-normal text-[#FF8C00] bg-[#FF8C00]/10 px-1.5 py-0.5 rounded">Incluso</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Acelera o processamento de grandes pedidos de copy e roteiros.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#FF8C00] rounded-full p-0.5 shrink-0">
                                        <Check size={10} className="text-black stroke-[3]" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-200">Suporte por E-mail <span className="ml-2 text-xs font-normal text-gray-300 bg-gray-800 px-1.5 py-0.5 rounded">Prioridade Padrão</span></span>
                                        <span className="block text-xs text-gray-500 mt-0.5">Resposta a dúvidas técnicas e de uso da plataforma.</span>
                                    </div>
                                </li>
                             </ul>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {activeTab !== 'perfil' && activeTab !== 'cobranca' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-4 bg-gray-900 rounded-full mb-4">
                      <Shield size={32} className="text-gray-600" />
                  </div>
                  <h3 className="text-gray-300 font-medium mb-1">Área em Construção</h3>
                  <p className="text-gray-500 text-sm">As configurações de {activeTab} estarão disponíveis em breve.</p>
              </div>
          )}
      </div>
    </div>
  );
};