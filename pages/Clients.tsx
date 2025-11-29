
import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Client } from '../types';
import { Search, Filter, Mail, Users, UserCheck, CreditCard, TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from '../components/Button';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    supabaseService.from('clients').select().then(({ data }) => {
        if (data) setClients(data as Client[]);
    });
  }, []);

  const getPlanBadge = (plan: string) => {
      switch(plan) {
          case 'Professional':
              return <span className="px-3 py-1 rounded bg-[#3B1F50] border border-[#6B2F99] text-[#C084FC] text-xs font-medium">Professional</span>;
          case 'Enterprise':
              return <span className="px-3 py-1 rounded bg-[#3D2213] border border-[#853C10] text-[#FF8C00] text-xs font-medium">Enterprise</span>;
          case 'Starter':
              return <span className="px-3 py-1 rounded bg-[#102A43] border border-[#1E4E75] text-[#62B0E8] text-xs font-medium">Starter</span>;
          default: // Free
              return <span className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400 text-xs font-medium">Free</span>;
      }
  };

  const getStatusBadge = (status: string) => {
      if (status === 'active') {
          return <div className="flex items-center gap-2 text-xs font-medium text-gray-300"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Ativo</div>
      } else if (status === 'pending') {
          return <div className="flex items-center gap-2 text-xs font-medium text-gray-300"><div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div> Pendente</div>
      } else {
          return <div className="flex items-center gap-2 text-xs font-medium text-gray-300"><div className="w-2 h-2 rounded-full bg-red-500"></div> Inativo</div>
      }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-gray-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                <Users size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Total de Clientes</p>
                <h3 className="text-2xl font-bold text-white">10</h3>
            </div>
        </div>
        <div className="bg-brand-surface border border-gray-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
                <UserCheck size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Clientes Ativos</p>
                <h3 className="text-2xl font-bold text-white">7</h3>
            </div>
        </div>
        <div className="bg-brand-surface border border-gray-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                <CreditCard size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Planos Pro+</p>
                <h3 className="text-2xl font-bold text-white">6</h3>
            </div>
        </div>
        <div className="bg-brand-surface border border-gray-800 p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 text-[#FF8C00] rounded-lg">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">MRR Estimado</p>
                <h3 className="text-2xl font-bold text-white">R$ 992</h3>
            </div>
        </div>
      </div>

      <div className="bg-brand-surface border border-gray-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar clientes..."
                        className="bg-gray-900 border border-gray-700 text-sm rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:ring-[#FF8C00] focus:outline-none text-white focus:border-[#FF8C00]"
                    />
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800 hover:text-white transition-colors">
                    <Filter size={14} /> Todos Status
                </div>
                 <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800 hover:text-white transition-colors">
                    Todos Planos
                </div>
            </div>
            
            <Button className="w-full md:w-auto text-sm font-bold bg-[#FF8C00] hover:bg-orange-600 text-white shadow-none border-0">
                + Adicionar Cliente
            </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 text-xs font-semibold text-gray-500 border-b border-gray-800">
                    <tr>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Empresa</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Plano</th>
                        <th className="px-6 py-4">Projetos</th>
                        <th className="px-6 py-4">Cadastro</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 flex items-center justify-center font-bold text-xs uppercase">
                                        {client.name.match(/\b(\w)/g)?.join('').substring(0,2) || client.name.substring(0,2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{client.name}</div>
                                        <div className="text-xs text-gray-500">{client.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{client.company}</td>
                            <td className="px-6 py-4">
                                {getStatusBadge(client.status)}
                            </td>
                            <td className="px-6 py-4">
                                {getPlanBadge(client.plan)}
                            </td>
                            <td className="px-6 py-4 text-gray-300">{client.projects_count}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                                {new Date(client.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-800">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};