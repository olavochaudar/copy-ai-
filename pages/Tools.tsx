
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart, Search, MessageSquare, Bot, Mail, Target, Sparkles, Filter } from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: 'Marketing' | 'SEO' | 'Vendas' | 'Pesquisa' | 'Email';
  icon: React.ElementType;
  prompt: string;
  placeholder: string;
  model: string;
  inputLabel: string; // New field for specific label
  hint: string;       // New field for specific guidance
}

export const tools: Tool[] = [
  {
    id: '1',
    title: 'Gerador de Teste A/B',
    description: 'Crie 5 variações de headline focadas em diferentes ângulos psicológicos.',
    category: 'Marketing',
    icon: BarChart,
    prompt: 'Atue como um Especialista em CRO...',
    placeholder: 'Ex: Landing page para um curso de inglês online com foco em profissionais ocupados que precisam de fluência rápida.',
    model: 'Gemini 2.5 Flash-Lite',
    inputLabel: 'Descrição do Produto/Oferta',
    hint: 'Descreva o que você está vendendo e qual é o benefício principal.'
  },
  {
    id: '2',
    title: 'Mapeamento de Intenção (SEO)',
    description: 'Descubra o que seu cliente está perguntando antes de comprar.',
    category: 'SEO',
    icon: Search,
    prompt: 'Atue como um Especialista em SEO...',
    placeholder: 'Ex: Software de gestão financeira para pequenas empresas',
    model: 'Gemini 2.5 Flash',
    inputLabel: 'Tópico ou Palavra-Chave Principal',
    hint: 'Insira o tema central que você deseja dominar no Google.'
  },
  {
    id: '3',
    title: 'Mineração de Objeções',
    description: 'Analise a mente do cliente para criar copy à prova de balas.',
    category: 'Pesquisa',
    icon: MessageSquare,
    prompt: 'Atue como um Pesquisador de Mercado...',
    placeholder: 'Ex: Suplemento de proteína vegano com preço 2x maior que o mercado.',
    model: 'Gemini 2.5 Flash',
    inputLabel: 'Detalhes da Oferta',
    hint: 'O que pode fazer o cliente hesitar? Preço? Confiança? Tempo?'
  },
  {
    id: '4',
    title: 'Roteiro de Chatbot de Vendas',
    description: 'Automatize o atendimento inicial com script persuasivo.',
    category: 'Vendas',
    icon: Bot,
    prompt: 'Crie um roteiro de conversa...',
    placeholder: 'Ex: Imobiliária vendendo apartamentos de alto padrão na planta.',
    model: 'Gemini 2.5 Flash-Lite',
    inputLabel: 'Cenário de Vendas',
    hint: 'Quem é o cliente e qual é o objetivo final da conversa (agendar, comprar)?'
  },
  {
    id: '5',
    title: 'Sequência de E-mail de Resgate',
    description: 'Recupere carrinhos abandonados com copy emocional.',
    category: 'Email',
    icon: Mail,
    prompt: 'Escreva um e-mail para recuperação...',
    placeholder: 'Ex: Tênis de corrida de alta performance no carrinho (Valor: R$ 500,00).',
    model: 'Gemini 2.5 Flash',
    inputLabel: 'Produto Abandonado',
    hint: 'Qual item foi deixado para trás e qual oferta podemos fazer?'
  },
  {
    id: '6',
    title: 'Definição de Avatar (ICP)',
    description: 'Crie a persona detalhada do seu comprador ideal.',
    category: 'Marketing',
    icon: Target,
    prompt: 'Descreva as dores e desejos...',
    placeholder: 'Ex: Aplicativo de meditação focado em executivos com burnout.',
    model: 'Gemini 3 Pro (Thinking)',
    inputLabel: 'Descrição do Negócio',
    hint: 'O que você vende e quem você *acha* que é seu cliente hoje?'
  }
];

const CATEGORIES = ['Todos', 'Marketing', 'SEO', 'Vendas', 'Pesquisa', 'Email'];

export const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todos');

  const filteredTools = filter === 'Todos' 
    ? tools 
    : tools.filter(t => t.category === filter);

  return (
    <div className="relative min-h-[calc(100vh-100px)]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-[#FF8C00]" size={28} /> Biblioteca de IA
            </h1>
            <p className="text-gray-400 max-w-xl">
              Escolha uma ferramenta especializada. Cada módulo abaixo foi treinado para executar uma tarefa de marketing específica.
            </p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar bg-gray-900/50 p-1.5 rounded-full border border-gray-800">
            {CATEGORIES.map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        filter === cat 
                        ? 'bg-[#FF8C00] text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn pb-20">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
              <div 
                  key={tool.id} 
                  onClick={() => navigate(`/tools/${tool.id}`)}
                  className="group relative bg-brand-surface border border-gray-800 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden hover:border-[#FF8C00]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
              >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/0 to-[#FF8C00]/0 group-hover:from-[#FF8C00]/5 group-hover:to-purple-500/5 transition-all duration-500"></div>

                  <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-5">
                          <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-400 group-hover:text-[#FF8C00] group-hover:border-[#FF8C00]/30 transition-all duration-300">
                              <tool.icon size={24} />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800 flex items-center gap-1">
                              <Filter size={10} /> {tool.category}
                          </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF8C00] transition-colors">
                          {tool.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
                          {tool.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                          <span className="font-mono opacity-70 flex items-center gap-1">
                            <Sparkles size={10} /> {tool.model}
                          </span>
                          <div className="flex items-center text-[#FF8C00] font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                            Acessar Área <ArrowRight size={14} className="ml-1" />
                          </div>
                      </div>
                  </div>
              </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
            <Search className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-gray-400 font-medium">Nenhuma ferramenta encontrada nesta categoria.</h3>
            <button onClick={() => setFilter('Todos')} className="text-[#FF8C00] text-sm mt-2 hover:underline">Limpar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};
