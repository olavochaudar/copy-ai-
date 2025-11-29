import React, { useState, useEffect } from 'react';
// Importações necessárias do lucide-react (mantidas e utilizadas nos mocks)
import { ArrowLeft, Sparkles, Copy, Check, History, Share2, Info, Loader2 } from 'lucide-react';


// ====================================================================
// --- SIMULAÇÕES PARA AMBIENTE DE ARQUIVO ÚNICO (MOCKS) ---
// ====================================================================

// 1. Simulação dos Hooks do React Router
const useParams = () => ({ id: 'headline-generator' });
const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

// 2. Simulação do Componente Button (para resolver a dependência "../components/Button")
const Button = ({ children, onClick, className = '', variant = 'primary', isLoading = false, disabled = false, ...props }) => {
    const baseClasses = "flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
        primary: "bg-[#FF8C00] text-white hover:bg-[#E07B00] shadow-md hover:shadow-lg",
        ghost: "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="opacity-0">{children}</span> 
                </div>
            ) : (
                children
            )}
        </button>
    );
};

// 3. Simulação dos Dados de Ferramentas (para resolver a dependência "./Tools")
const tools = [
    {
        id: 'headline-generator',
        title: 'Gerador de Títulos Irresistíveis',
        description: 'Cria títulos chamativos para blogs, emails e redes sociais.',
        category: 'Marketing',
        icon: Sparkles,
        model: 'gemini-2.5-flash',
        inputLabel: 'Qual é o tema principal do seu conteúdo?',
        hint: 'Descreva seu produto ou tópico em uma ou duas frases.',
        placeholder: 'Ex: "Novo curso sobre como aprender React em 7 dias."',
    },
    {
        id: 'product-description',
        title: 'Descrição de Produto E-commerce',
        description: 'Gera descrições otimizadas para conversão (AIDA/PAS).',
        category: 'Vendas',
        icon: Info,
        model: 'gemini-2.5-flash',
        inputLabel: 'Fatos e benefícios do produto',
        hint: 'Liste as características principais e o público-alvo.',
        placeholder: 'Ex: "Tênis de corrida, leve, solado de espuma, para maratonistas iniciantes."',
    },
];

// 4. Simulação do Serviço de IA (para resolver a dependência "../services/ai")
const mockResponseText = `
# Título Gerado com Sucesso!

Aqui está a sua nova cópia. Eu usei a estrutura AIDA (Atenção, Interesse, Desejo, Ação) para garantir o máximo de engajamento.

**Atenção:** "Pare de Perder Tempo: O Segredo dos Especialistas para Escrever em 5 Minutos!"

*Benefícios Chave:*
* Aumento de 300% na taxa de cliques.
* Mais tempo livre para focar em estratégia.
* Conteúdo que se conecta emocionalmente.

**Ação:** Clique para saber mais sobre o nosso curso!
`;

const aiService = {
    generateCopy: (toolId, input) => new Promise(resolve => {
        // Simula latência de rede
        setTimeout(() => {
            if (input.toLowerCase().includes('erro')) {
                resolve({ error: 'Input inválido detectado. Tente novamente.' });
            } else {
                resolve({ text: mockResponseText });
            }
        }, 3000);
    }),
};

// ====================================================================
// --- FUNÇÕES UTILITÁRIAS ---
// ====================================================================

const LOADING_PHRASES = [
  "Analisando o contexto...",
  "Identificando o público-alvo...",
  "Consultando frameworks...",
  "Escrevendo o rascunho...",
  "Aplicando gatilhos mentais...",
  "Refinando a persuasão...",
  "Polindo o texto final..."
];

/**
 * Função utilitária para converter Markdown básico (títulos, negrito, listas) 
 * em HTML, permitindo que as classes 'prose' do Tailwind funcionem.
 */
const formatMarkdownToHTML = (markdownText) => {
    if (!markdownText) return { __html: '' };

    let html = markdownText;

    // 1. Tratamento de Markdown Básico: Negrito (**) e Itálico (*)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 2. Títulos (H1 a H4)
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 3. Listas (linhas começando com - ou *)
    const listRegex = /^(?:[\t ]*([-\*]|\d+\.)[\t ]+.*(?:\n|$))+/gm;
    html = html.replace(listRegex, (match) => {
        // Verifica se é uma lista não ordenada (-) ou (*)
        if (match.trim().startsWith('-') || match.trim().startsWith('*')) {
            const listItems = match.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[\t ]*([-\*]|\d+\.)[\t ]+/, '').trim())
                .map(content => `<li>${content}</li>`)
                .join('');
            return `<ul>${listItems}</ul>\n\n`; 
        }
        // Para listas ordenadas (1. 2. 3.)
        if (match.trim().match(/^\d+\./)) {
             const listItems = match.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[\t ]*\d+\.[\t ]+/, '').trim())
                .map(content => `<li>${content}</li>`)
                .join('');
            return `<ol>${listItems}</ol>\n\n`;
        }
        return match;
    });

    // 4. Parágrafos e Quebras de Linha
    html = html.split(/\n{2,}/)
        .map(block => block.trim())
        .filter(block => block.length > 0)
        .map(block => {
            // Não envolve blocos que já são HTML (títulos, listas) em <p>
            if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol')) {
                return block; 
            }
            // Substitui quebras de linha simples por <br> dentro de parágrafos
            const processedBlock = block.replace(/\n/g, '<br />');
            return `<p>${processedBlock}</p>`;
        })
        .join('');

    return { __html: html };
};


// ====================================================================
// --- COMPONENTE PRINCIPAL ---
// ====================================================================

export const ToolWorkspace = () => {
    // Usamos o mock useParams, que retorna id: 'headline-generator'
    const { id } = useParams(); 
    const navigate = useNavigate();
    // Encontrando a ferramenta com base no ID mockado
    const tool = tools.find(t => t.id === id); 

    const [inputText, setInputText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [loadingText, setLoadingText] = useState(LOADING_PHRASES[0]);

    // Toast State for Notifications
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let interval;
        if (isGenerating) {
            let i = 0;
            setLoadingText(LOADING_PHRASES[0]);
            interval = setInterval(() => {
                i = (i + 1) % LOADING_PHRASES.length;
                setLoadingText(LOADING_PHRASES[i]);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (!tool) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h2 className="text-xl font-bold text-white mb-2">Ferramenta não encontrada</h2>
                <Button onClick={() => navigate('/tools')}>Voltar para Biblioteca</Button>
            </div>
        );
    }

    const handleGenerate = async () => {
        if (!inputText.trim()) return;
        
        setIsGenerating(true);
        setResult('');
        
        try {
            const response = await aiService.generateCopy(tool.id, inputText);
            
            if (response.error) {
                setResult(`Erro: ${response.error}`);
                showNotification('Falha ao gerar conteúdo.', 'error');
            } else {
                setResult(response.text);
                showNotification('Conteúdo gerado com sucesso!', 'success');
            }
        } catch (e) {
            console.error("AI Generation Error:", e);
            setResult(`Erro: Falha na conexão com o serviço de IA.`);
            showNotification('Erro interno do servidor de IA.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        // Fallback para ambientes restritos a iFrame (como o Canvas)
        try {
            const textarea = document.createElement('textarea');
            textarea.value = result;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch (err) {
            console.error('Falha ao copiar usando execCommand:', err);
            // Tenta usar a API moderna como fallback secundário
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(result).catch(e => console.error('Falha ao copiar usando clipboard API:', e));
            }
        }

        setCopied(true);
        showNotification('Texto copiado para a área de transferência.', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col relative">
            
            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-2xl border flex items-center gap-3 animate-slideDown ${
                    notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-200' :
                    notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-200' :
                    'bg-blue-900/90 border-blue-500 text-blue-200'
                }`}>
                    {notification.type === 'success' && <Check size={18} />}
                    {notification.type === 'info' && <Sparkles size={18} />}
                    {notification.type === 'error' && <Info size={18} />}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            {/* Workspace Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/tools')}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                        title="Voltar para Biblioteca"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-[#FF8C00]/10 text-[#FF8C00] border border-[#FF8C00]/20">
                            <tool.icon size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">{tool.title}</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                Área de Trabalho: {tool.category}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="hidden md:flex gap-2">
                        <History size={16} /> Histórico
                    </Button>
                </div>
            </div>

            {/* Main Workspace (Split View) */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                
                {/* Left Panel: Specialized Input */}
                <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-brand-surface border border-gray-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col">
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-white mb-1">
                                {tool.inputLabel}
                            </label>
                            <p className="text-xs text-gray-500 flex items-start gap-1.5 leading-relaxed">
                                <Info size={12} className="mt-0.5 shrink-0" /> {tool.hint}
                            </p>
                        </div>
                        
                        <textarea 
                            className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed mb-4"
                            placeholder={tool.placeholder}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            autoFocus
                        />
                        
                        <Button 
                            className="w-full py-3 text-base font-bold shadow-lg transition-all duration-300" 
                            onClick={handleGenerate} 
                            isLoading={isGenerating}
                            disabled={!inputText.trim()}
                        >
                            {isGenerating ? (
                                <span className="animate-pulse">{loadingText}</span>
                            ) : (
                                <>
                                    <Sparkles size={18} className="mr-2" /> Gerar Conteúdo
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Modelo de IA Ativo</h3>
                        <div className="flex items-center gap-2 text-xs text-[#FF8C00]">
                            <Sparkles size={12} />
                            <span className="font-mono">{tool.model}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="lg:w-2/3 flex flex-col bg-[#0B1120] border border-gray-800 rounded-xl shadow-inner overflow-hidden relative">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            Resultado Gerado
                            {isGenerating && (
                                <span className="text-xs text-[#FF8C00] font-normal animate-pulse flex items-center gap-1">
                                    — {loadingText}
                                </span>
                            )}
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={copyToClipboard}
                                disabled={!result}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                                    copied 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent'
                                }`}
                                title="Copiar Texto"
                            >
                                <div className={`transition-transform duration-300 ${copied ? 'scale-110' : ''}`}>
                                    {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                                </div>
                                <span className={copied ? 'font-bold' : ''}>{copied ? 'Copiado!' : 'Copiar'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {result ? (
                            // Utiliza dangerouslySetInnerHTML com a função de conversão para renderizar o Markdown como HTML
                            <div 
                                className="prose prose-invert prose-orange max-w-none text-sm md:text-base leading-7 font-sans text-gray-200 animate-fadeIn"
                                dangerouslySetInnerHTML={formatMarkdownToHTML(result)}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="p-4 bg-[#FF8C00]/10 rounded-full mb-4 relative">
                                            <Sparkles size={32} className="text-[#FF8C00] animate-spin-slow" />
                                            <div className="absolute inset-0 bg-[#FF8C00] blur-xl opacity-20 rounded-full"></div>
                                        </div>
                                        <p className="text-sm font-medium text-[#FF8C00]">{loadingText}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-gray-900/50 rounded-full">
                                            <Sparkles size={32} className="opacity-20" />
                                        </div>
                                        <p className="text-sm">O conteúdo gerado pela IA aparecerá aqui.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};