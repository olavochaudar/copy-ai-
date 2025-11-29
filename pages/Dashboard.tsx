import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { KpiData, ChartData } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Sparkles, Box, Zap, LayoutTemplate, ArrowRight, Lock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Criador');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    // Lógica de Saudação Dinâmica
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bom dia');
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const fetchData = async () => {
      const userSession = supabaseService.auth.getSession();
      if (userSession) {
          if (userSession.name) setUserName(userSession.name.split(' ')[0]);
          if (userSession.role) setUserRole(userSession.role);
      }

      const kpiRes = await supabaseService.from('kpis').select();
      const chartRes = await supabaseService.from('analytics').select();
      if (kpiRes.data) setKpis(kpiRes.data as KpiData[]);
      if (chartRes.data) setChartData(chartRes.data as ChartData[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
      return <div className="text-center py-20 text-gray-500">Carregando Magic Box...</div>;
  }

  return (
    <div className="space-y-10 pb-10">
      
      {/* SEÇÃO 1: Boas-vindas e Propósito */}
      <div className="bg-gradient-to-r from-brand-surface to-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        {/* Elementos Decorativos de Fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8C00] opacity-5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-3">
                {greeting}, <span className="text-[#FF8C00]">{userName}</span>!
            </h1>
            <p className="text-xl text-gray-200 font-medium mb-4">
                Sua máquina de conteúdo está ligada.
            </p>
            
            <div className="bg-gray-800/50 border-l-4 border-[#FF8C00] p-4 rounded-r-lg backdrop-blur-sm">
                <p className="text-gray-400 text-sm leading-relaxed">
                    A <strong className="text-white">Magic Box</strong> não serve apenas para gerar texto rápido. 
                    Ela existe para eliminar o "achismo". Transforme sua estratégia em execução sênior instantaneamente, 
                    valide suas ideias com dados e escale seus resultados com a precisão da IA.
                </p>
            </div>
        </div>
      </div>

      {/* SEÇÃO 2: Módulos de Ação (O Núcleo Magic Box) */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[#FF8C00]" />
            Por onde começar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Módulo 1: Magic Box (Criar) */}
            <div 
                onClick={() => navigate('/magicbox')}
                className="group cursor-pointer bg-brand-surface border border-gray-800 p-6 rounded-2xl hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Box size={80} />
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-[#FF8C00] mb-4 group-hover:bg-[#FF8C00] group-hover:text-white transition-colors">
                    <Box size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Magic Box</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                    Comece um novo projeto (Site, Imagem ou E-book) com nosso motor de criação imediata.
                </p>
                <div className="flex items-center text-sm font-bold text-[#FF8C00] group-hover:translate-x-2 transition-transform">
                    Quero criar algo do zero <ArrowRight size={16} className="ml-2"/>
                </div>
            </div>

            {/* Módulo 2: Boosters (Otimizar) */}
            <div 
                onClick={() => navigate('/tools')}
                className="group cursor-pointer bg-brand-surface border border-gray-800 p-6 rounded-2xl hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Zap size={80} />
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Boosters</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                    Meu conteúdo não converte? Use ferramentas cirúrgicas para quebrar objeções e otimizar.
                </p>
                <div className="flex items-center text-sm font-bold text-blue-400 group-hover:translate-x-2 transition-transform">
                    Resolver problema específico <ArrowRight size={16} className="ml-2"/>
                </div>
            </div>

            {/* Módulo 3: Templates (Escalar) */}
            <div 
                onClick={() => navigate('/templates')}
                className="group cursor-pointer bg-brand-surface border border-gray-800 p-6 rounded-2xl hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <LayoutTemplate size={80} />
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <LayoutTemplate size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Modelos</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                    Acesse fluxos prontos para funis, e-mails de resgate e lançamentos completos.
                </p>
                <div className="flex items-center text-sm font-bold text-purple-400 group-hover:translate-x-2 transition-transform">
                    Copiar funil validado <ArrowRight size={16} className="ml-2"/>
                </div>
            </div>

        </div>
      </div>

      {/* SEÇÃO 3: Visão Geral (Apenas Admin) */}
      {userRole === 'admin' ? (
          <div className="pt-4 border-t border-gray-800">
             <h2 className="text-lg font-bold text-white mb-6">Visão Geral da Performance</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de KPI */}
                <div className="space-y-4">
                    {kpis.slice(0, 3).map((kpi, idx) => (
                        <div key={idx} className="bg-brand-surface border border-gray-800 p-5 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{kpi.label === 'Words Generated' ? 'Palavras Geradas' : kpi.label === 'Active Projects' ? 'Projetos Ativos' : 'Taxa de Conversão'}</p>
                                <h4 className="text-2xl font-bold text-white">{kpi.value}</h4>
                            </div>
                            <div className={`flex flex-col items-end ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {kpi.trend === 'up' ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
                                <span className="text-xs font-bold">{Math.abs(kpi.change)}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coluna do Gráfico */}
                <div className="lg:col-span-2 bg-brand-surface border border-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-gray-300">Volume de Produção (Últimos 7 dias)</h3>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#FF8C00" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorValue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
             </div>
          </div>
      ) : (
        <div className="pt-4 border-t border-gray-800">
            <div className="bg-gray-800/30 border border-gray-700 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-gray-800 rounded-full mb-4">
                    <Lock size={24} className="text-gray-500" />
                </div>
                <h3 className="text-gray-300 font-semibold mb-2">Relatórios Avançados</h3>
                <p className="text-sm text-gray-500 max-w-md">
                    O acesso a métricas detalhadas de performance e ROI está disponível apenas para administradores. 
                    Foque na criação de conteúdo incrível!
                </p>
            </div>
        </div>
      )}

    </div>
  );
};