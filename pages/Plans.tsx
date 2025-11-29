
import React from 'react';
import { Check, Star, Zap, Shield, Crown, X, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';

export const Plans: React.FC = () => {
  const plans = [
    {
      name: 'Plano Essencial',
      price: 'R$ 97',
      period: '/mês',
      description: 'Para quem está começando a escalar.',
      target: 'Iniciantes e Microempresas',
      features: [
        { text: '20.000 palavras/mês', included: true },
        { text: 'Modelos Iniciante/Intermediário', included: true },
        { text: 'Motor de IA Padrão', included: true },
        { text: 'Relatórios Básicos de Uso', included: true },
        { text: 'Suporte por E-mail', included: true },
        { text: 'Geração de Imagens', included: false },
        { text: 'Gerador de Teste A/B', included: false },
        { text: 'Roteiro VSL High-Ticket', included: false },
      ],
      icon: Zap,
      variant: 'standard' as const,
      buttonText: 'Assinar Essencial'
    },
    {
      name: 'Plano Pro',
      price: 'R$ 169',
      period: '/mês',
      description: 'Estratégia e otimização para crescimento.',
      target: 'Agências e Profissionais',
      features: [
        { text: '50.000 palavras/mês', included: true },
        { text: '50 imagens/mês', included: true },
        { text: 'Modelos + SEO/Pesquisa', included: true },
        { text: 'Gerador de Teste A/B', included: true },
        { text: 'Relatórios Detalhados', included: true },
        { text: 'Suporte por E-mail', included: true },
        { text: 'Motor de IA Padrão', included: true },
        { text: 'Roteiro VSL High-Ticket', included: false },
      ],
      icon: Star,
      variant: 'popular' as const,
      buttonText: 'Assinar Pro'
    },
    {
      name: 'Plano Premium',
      price: 'R$ 259',
      period: '/mês',
      description: 'Poder máximo para alta escala.',
      target: 'Heavy-users e Grandes Empresas',
      features: [
        { text: '100.000 palavras/mês (Ilimitado)', included: true },
        { text: '100 imagens/mês', included: true },
        { text: 'TODOS os modelos', included: true },
        { text: 'Roteiro VSL High-Ticket', included: true },
        { text: 'Novo Motor de IA V2.5', included: true },
        { text: 'Modo Turbo', included: true },
        { text: 'Relatórios Avançados', included: false },
        { text: 'Suporte Prioritário', included: true },
      ],
      icon: Crown,
      variant: 'premium' as const,
      buttonText: 'Garantir Acesso Total'
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Planos e Preços</h1>
        <p className="text-gray-400 text-lg">
          Escolha a potência ideal para sua máquina de vendas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 items-start">
        {plans.map((plan, index) => {
          const isPopular = plan.variant === 'popular';
          const isPremium = plan.variant === 'premium';
          
          return (
            <div 
              key={index}
              className={`
                relative rounded-2xl p-8 flex flex-col border transition-all duration-300
                ${isPopular 
                  ? 'bg-brand-surface border-[#FF8C00] shadow-[0_0_30px_rgba(255,140,0,0.15)] scale-105 z-10' 
                  : isPremium
                    ? 'bg-gradient-to-b from-[#1a1025] to-brand-surface border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:border-purple-400'
                    : 'bg-brand-surface border-gray-800 hover:border-gray-700'
                }
              `}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF8C00] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wide whitespace-nowrap">
                  Mais Popular
                </div>
              )}
              
              {isPremium && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide flex items-center gap-1 whitespace-nowrap border border-purple-400">
                  <Sparkles size={10} fill="currentColor" /> Oferta Definitiva
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 
                ${isPopular ? 'bg-[#FF8C00]/10 text-[#FF8C00]' : 
                  isPremium ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-800 text-gray-400'}
              `}>
                <plan.icon size={24} />
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isPremium ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-4xl font-bold ${isPremium ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                {plan.description}
              </p>

              <div className={`border-t my-6 ${isPremium ? 'border-purple-900/50' : 'border-gray-800'}`}></div>

              <div className="space-y-4 flex-1 mb-8">
                <p className={`text-xs font-bold uppercase tracking-wider ${isPremium ? 'text-purple-400' : 'text-gray-500'}`}>Recursos:</p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                      feature.included 
                        ? (isPopular ? 'bg-[#FF8C00] text-white' : 
                           isPremium ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-gray-800 text-gray-400')
                        : 'bg-transparent text-gray-600'
                    }`}>
                      {feature.included ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <p className="text-xs text-center text-gray-500 mb-3">
                  Público: <span className="text-gray-300">{plan.target}</span>
                </p>
                <Button 
                  variant={isPopular ? 'primary' : 'secondary'} 
                  className={`w-full py-3 text-base ${isPremium ? 'bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-[0_0_20px_rgba(147,51,234,0.3)]' : ''}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-10 border-t border-gray-800 mt-10">
        <p className="text-gray-500 flex items-center justify-center gap-2">
            <Shield size={16} /> Pagamento 100% seguro. Garantia de 7 dias.
        </p>
      </div>
    </div>
  );
};
