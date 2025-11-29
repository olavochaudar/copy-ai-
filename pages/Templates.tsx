import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutTemplate, 
  ArrowRight, 
  Mail, 
  ShoppingCart, 
  Video, 
  FileText, 
  Search, 
  Filter, 
  BarChart2, 
  Clock, 
  Zap, 
  CheckCircle2, 
  X,
  Target,
  Users
} from 'lucide-react';
import { Button } from '../components/Button';

// Definição de Tipos para os Templates Ricos
interface TemplateMetrics {
  kpi: string;
  value: string;
  label: string;
}

interface TemplateStep {
  title: string;
  desc: string;
}

interface Template {
  id: number;
  title: string;
  category: 'Lançamentos' | 'E-mail Marketing' | 'Redes Sociais' | 'Ads & Tráfego' | 'Vendas';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  timeEstimate: string;
  icon: React.ElementType;
  shortDesc: string;
  fullDesc: string;
  metrics: TemplateMetrics[];
  structure: TemplateStep[];
  promptContext: string; // O que será enviado para a IA
}

// Dados Mockados (Simulando uma biblioteca real de estratégias)
const TEMPLATES_DB: Template[] = [
  { 
    id: 1, 
    title: 'Funil Semente (Seed Launch)', 
    category: 'Lançamentos', 
    difficulty: 'Intermediário',
    timeEstimate: '7 Dias',
    icon: ShoppingCart, 
    shortDesc: 'A estratégia clássica para validar ofertas sem produto pronto.',
    fullDesc: 'O Funil Semente é focado em criar uma lista de interessados, entregar valor massivo através de um evento ou série de lives, e vender a promessa do produto (Beta) para cocriação.',
    metrics: [
      { kpi: 'Conv.', value: '2-5%', label: 'Taxa de Conversão' },
      { kpi: 'ROI', value: '5x', label: 'Retorno Médio' }
    ],
    structure: [
      { title: 'Pesquisa', desc: 'E-mail para levantar dores da audiência.' },
      { title: 'Aquecimento', desc: '3 dias de conteúdo quebrando objeções.' },
      { title: 'Webinar', desc: 'Roteiro de Vendas da aula ao vivo.' },
      { title: 'Follow-up', desc: 'Sequência de 4 e-mails de fechamento.' }
    ],
    promptContext: 'Crie toda a copy para um Lançamento Semente de [PRODUTO].'
  },
  { 
    id: 2, 
    title: 'Sequência de Boas-vindas (Soap Opera)', 
    category: 'E-mail Marketing', 
    difficulty: 'Iniciante',
    timeEstimate: '3 Dias',
    icon: Mail, 
    shortDesc: 'Conecte-se emocionalmente com novos leads usando storytelling.',
    fullDesc: 'Baseado na técnica "Soap Opera Sequence" de Andre Chaperon, esta sequência cria um arco dramático que vicia o leitor e estabelece autoridade imediata.',
    metrics: [
      { kpi: 'Open', value: '45%+', label: 'Abertura Média' },
      { kpi: 'CTR', value: '12%', label: 'Cliques no Link' }
    ],
    structure: [
      { title: 'O Palco', desc: 'Apresentação e abertura de um loop curioso.' },
      { title: 'O Drama', desc: 'A história de origem (Jornada do Herói).' },
      { title: 'A Epifania', desc: 'A descoberta do método/solução.' },
      { title: 'A Oferta', desc: 'Soft-sell do produto principal.' }
    ],
    promptContext: 'Escreva uma Sequência Soap Opera de 4 emails para [NICHO].'
  },
  { 
    id: 3, 
    title: 'Roteiro de VSL High-Ticket', 
    category: 'Vendas', 
    difficulty: 'Avançado',
    timeEstimate: '20 Min (Vídeo)',
    icon: Video, 
    shortDesc: 'Carta de vendas em vídeo para produtos acima de R$ 997.',
    fullDesc: 'Uma estrutura psicológica densa projetada para filtrar curiosos e vender apenas para clientes qualificados. Foca pesadamente em quebra de crenças limitantes.',
    metrics: [
      { kpi: 'Retenção', value: '35%', label: 'Até o Pitch' },
      { kpi: 'Ticket', value: '1k+', label: 'Valor Ideal' }
    ],
    structure: [
      { title: 'O Gancho', desc: 'Promessa ousada nos primeiros 30s.' },
      { title: 'O Problema', desc: 'Agitação da dor e invalidação de outras soluções.' },
      { title: 'O Mecanismo Único', desc: 'Apresentação da sua metodologia exclusiva.' },
      { title: 'O Fechamento', desc: 'Oferta irresistível e garantia.' }
    ],
    promptContext: 'Crie um roteiro de VSL para vender [PRODUTO] de alto valor.'
  },
  { 
    id: 4, 
    title: 'Artigo "Pilar" para SEO', 
    category: 'Redes Sociais', 
    difficulty: 'Intermediário',
    timeEstimate: '2000 Palavras',
    icon: FileText, 
    shortDesc: 'Domine a primeira página do Google com conteúdo denso.',
    fullDesc: 'O formato "Skyscraper" (Arranha-céu). O objetivo é criar o guia mais completo da internet sobre um tópico específico, atraindo backlinks naturalmente.',
    metrics: [
      { kpi: 'Tráfego', value: 'Alto', label: 'Orgânico' },
      { kpi: 'Tempo', value: '4m', label: 'Na Página' }
    ],
    structure: [
      { title: 'Intro', desc: 'Gancho APP (Agree, Promise, Preview).' },
      { title: 'O "O Que É"', desc: 'Definições para Snippet do Google.' },
      { title: 'Tutorial', desc: 'Passo a passo detalhado (How-to).' },
      { title: 'FAQ', desc: 'Perguntas frequentes mapeadas.' }
    ],
    promptContext: 'Escreva um Artigo Pilar de 2000 palavras sobre [TÓPICO].'
  },
  { 
    id: 5, 
    title: 'Anúncios Facebook (Método 3-3-3)', 
    category: 'Ads & Tráfego', 
    difficulty: 'Iniciante',
    timeEstimate: 'Instantâneo',
    icon: Target, 
    shortDesc: 'Teste rápido de criativos para encontrar o vencedor.',
    fullDesc: 'Estrutura para testar 3 Ganchos (Hooks), 3 Corpos de Texto e 3 CTAs diferentes para identificar rapidamente qual combinação traz o lead mais barato.',
    metrics: [
      { kpi: 'CTR', value: '2%+', label: 'Taxa de Clique' },
      { kpi: 'CPL', value: 'Baixo', label: 'Custo/Lead' }
    ],
    structure: [
      { title: 'Hook Visual', desc: 'Imagem/Vídeo que para o scroll.' },
      { title: 'Hook Textual', desc: 'Primeira frase impactante.' },
      { title: 'Retenção', desc: 'Corpo que gera desejo.' },
      { title: 'CTA', desc: 'Chamada clara para o clique.' }
    ],
    promptContext: 'Crie 3 variações de Ad Copy para Facebook sobre [OFERTA].'
  },
  { 
    id: 6, 
    title: 'Calendário Editorial (30 Dias)', 
    category: 'Redes Sociais', 
    difficulty: 'Iniciante',
    timeEstimate: 'Mês todo',
    icon: Users, 
    shortDesc: 'Planejamento de conteúdo infinito para Instagram.',
    fullDesc: 'Um mix balanceado de conteúdo de Autoridade, Conexão, Quebra de Objeção e Venda Direta (80/20). Nunca mais fique sem saber o que postar.',
    metrics: [
      { kpi: 'Engaj.', value: 'Alto', label: 'Consistência' },
      { kpi: 'Vendas', value: 'Recor.', label: 'Venda Diária' }
    ],
    structure: [
      { title: 'Semana 1', desc: 'Foco em Autoridade e Ensino.' },
      { title: 'Semana 2', desc: 'Foco em Conexão e Bastidores.' },
      { title: 'Semana 3', desc: 'Foco em Prova Social e Cases.' },
      { title: 'Semana 4', desc: 'Foco em Oferta e Escassez.' }
    ],
    promptContext: 'Crie um calendário de 30 ideias de post para [NICHO].'
  }
];

const CATEGORIES = ['Todos', 'Lançamentos', 'E-mail Marketing', 'Redes Sociais', 'Ads & Tráfego', 'Vendas'];

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Filtragem
  const filteredTemplates = TEMPLATES_DB.filter(template => {
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Simulação: Navega para a Magic Box com o contexto preenchido
      // Em um app real, passariamos isso via estado global ou query params
      navigate('/magicbox'); 
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Iniciante': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediário': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Avançado': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Biblioteca de Estratégias</h1>
           <p className="text-gray-400 max-w-2xl">
             Não comece do zero. Use nossas estruturas validadas com dados de mercado para acelerar seus resultados.
           </p>
        </div>
        
        {/* Barra de Busca */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
           <input 
              type="text" 
              placeholder="Buscar template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none"
           />
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
              selectedCategory === cat 
              ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-[0_0_10px_#FF8C00]/30' 
              : 'bg-brand-surface border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
           <div 
              key={template.id} 
              onClick={() => setSelectedTemplate(template)}
              className="bg-brand-surface border border-gray-800 rounded-xl p-6 hover:border-[#FF8C00]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
           >
              {/* Badge de Dificuldade */}
              <div className={`absolute top-4 right-4 text-[10px] uppercase font-bold px-2 py-1 rounded border ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty}
              </div>

              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-[#FF8C00] mb-4 group-hover:bg-[#FF8C00] group-hover:text-white transition-colors border border-gray-800">
                 <template.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2">{template.shortDesc}</p>
              
              {/* Mini Dados no Card */}
              <div className="flex gap-4 mb-6 pt-4 border-t border-gray-800">
                {template.metrics.slice(0, 2).map((m, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-sm font-bold text-white">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-[#FF8C00] text-sm font-bold group-hover:gap-2 transition-all">
                 Ver Detalhes <ArrowRight size={16} className="ml-1" />
              </div>
           </div>
        ))}
      </div>

      {/* MODAL DE DETALHES (RAIO-X) */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
            
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-900/50 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Coluna Esquerda: Visão Geral */}
            <div className="w-full md:w-2/5 bg-brand-surface p-8 border-r border-gray-800 flex flex-col">
               <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-[#FF8C00] mb-6 border border-gray-700">
                  <selectedTemplate.icon size={32} />
               </div>
               
               <h2 className="text-2xl font-bold text-white mb-2">{selectedTemplate.title}</h2>
               <div className="flex flex-wrap gap-2 mb-6">
                 <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                   {selectedTemplate.difficulty}
                 </span>
                 <span className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 flex items-center gap-1">
                   <Clock size={10} /> {selectedTemplate.timeEstimate}
                 </span>
               </div>

               <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                 {selectedTemplate.fullDesc}
               </p>

               <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                 <h4 className="text-xs font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">
                   <BarChart2 size={12} /> Performance Esperada
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                   {selectedTemplate.metrics.map((m, i) => (
                     <div key={i}>
                       <p className="text-[10px] text-gray-500 uppercase">{m.label}</p>
                       <p className="text-lg font-bold text-[#FF8C00]">{m.value}</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* Coluna Direita: Estrutura e Ação */}
            <div className="w-full md:w-3/5 p-8 bg-[#0f172a] flex flex-col">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <LayoutTemplate size={20} className="text-[#FF8C00]" /> Estrutura do Template
               </h3>

               <div className="space-y-6 relative mb-8">
                 {/* Linha conectora */}
                 <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-800"></div>

                 {selectedTemplate.structure.map((step, idx) => (
                   <div key={idx} className="relative flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0 z-10">
                       {idx + 1}
                     </div>
                     <div>
                       <h4 className="text-white font-medium text-sm">{step.title}</h4>
                       <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-6 border-t border-gray-800">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Pronto para começar?</span>
                    <span className="text-xs text-[#FF8C00] flex items-center gap-1">
                      <Zap size={12} /> IA configurada
                    </span>
                 </div>
                 <Button onClick={handleUseTemplate} className="w-full py-4 text-base shadow-lg">
                   Usar Este Template
                 </Button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};