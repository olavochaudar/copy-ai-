import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/ai';
import { Sparkles, Image, Globe, Type, Paperclip, ArrowUp, Zap, Lock, Loader2, Copy, Check, X, RefreshCw, Layout as LayoutIcon } from 'lucide-react';

export const MagicBox: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await aiService.generateCopy('magic-box', prompt);
      if (response.error) {
        setResult(`Erro: ${response.error}`);
      } else {
        setResult(response.text);
      }
    } catch (error) {
      setResult("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearResult = () => {
    setResult(null);
    setPrompt('');
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-start pt-10 p-4 pb-20">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[#FF8C00] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600 opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl z-10 space-y-8 transition-all duration-500">
        
        {/* Header Section (Collapses slightly when result is present) */}
        <div className={`text-center space-y-4 transition-all duration-500 ${result ? 'mb-4' : 'mb-8'}`}>
          {!result && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-xs font-medium text-[#FF8C00] animate-fadeIn">
                <Sparkles size={12} />
                <span>Novo Motor de IA v2.5</span>
              </div>
          )}
          
          <h1 className={`font-bold tracking-tight text-white transition-all duration-500 ${result ? 'text-3xl' : 'text-5xl md:text-6xl'}`}>
            {result ? 'Resultado' : <>Crie algo <span className="bg-gradient-to-r from-[#FF8C00] to-purple-500 bg-clip-text text-transparent">Incrível</span></>}
          </h1>
          
          {!result && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Desenvolva copy, roteiros e estratégias conversando diretamente com nossa IA.
            </p>
          )}
        </div>

        {/* Main Input Box (Lovable Style) */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#FF8C00] to-purple-600 rounded-2xl opacity-30 blur transition duration-500 ${isGenerating ? 'opacity-70 animate-pulse' : 'group-hover:opacity-50'}`}></div>
          <form onSubmit={handleGenerate} className="relative bg-[#0f172a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden z-20">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Peça a ViralCopy para criar um blog sobre..."
              disabled={isGenerating}
              className={`w-full bg-transparent text-white text-lg p-6 focus:outline-none resize-none placeholder-gray-500 custom-scrollbar transition-all duration-300 ${result ? 'min-h-[80px] h-[100px]' : 'min-h-[120px]'}`}
            />
            
            <div className="px-4 py-3 bg-gray-900/50 flex justify-between items-center border-t border-gray-800">
              <div className="flex gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Paperclip size={18} /> <span className="hidden sm:inline">Anexar</span>
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Zap size={18} /> <span className="hidden sm:inline">Modo Turbo</span>
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                  {isGenerating && <span className="text-sm text-[#FF8C00] animate-pulse font-medium">Pensando...</span>}
                  <button 
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      prompt.trim() && !isGenerating
                        ? 'bg-[#FF8C00] text-white hover:bg-orange-600 shadow-[0_0_15px_rgba(255,140,0,0.4)]' 
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} />}
                  </button>
              </div>
            </div>
          </form>
        </div>

        {/* RESULT AREA (Replaces Feature Grid when active) */}
        {result && (
             <div className="animate-slideUp bg-brand-surface border border-gray-800 rounded-2xl shadow-2xl overflow-hidden mt-8">
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#FF8C00]" />
                        <span className="text-sm font-semibold text-gray-300">Conteúdo Gerado</span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={clearResult}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <RefreshCw size={14} /> Nova Busca
                        </button>
                        <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                copied 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-[#FF8C00]/10 text-[#FF8C00] hover:bg-[#FF8C00]/20 border border-[#FF8C00]/30'
                            }`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiado!' : 'Copiar Texto'}
                        </button>
                    </div>
                </div>
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="prose prose-invert prose-orange max-w-none text-base leading-7 whitespace-pre-wrap font-sans text-gray-200">
                        {result}
                    </div>
                </div>
             </div>
        )}

        {/* Feature Grid (Only shown when NO result) */}
        {!result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-fadeIn">
            
            {/* Active Card: Copywriting */}
            <div 
                onClick={() => navigate('/tools')}
                className="group cursor-pointer bg-brand-surface border border-gray-800 hover:border-[#FF8C00]/50 p-6 rounded-xl transition-all duration-300 hover:shadow-xl relative overflow-hidden"
            >
                <div className="w-10 h-10 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center text-[#FF8C00] mb-4">
                  <Type size={20} />
                </div>
                <h3 className="text-white font-semibold mb-1">Geração de Texto</h3>
                <p className="text-sm text-gray-400">Headlines, E-mails, VSLs e Artigos.</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUp size={16} className="text-[#FF8C00] rotate-45" />
                </div>
            </div>

            {/* Coming Soon: Images */}
            <div className="group relative bg-brand-surface border border-gray-800 p-6 rounded-xl transition-all duration-300 opacity-80 hover:opacity-100 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gray-950/60 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] text-xs font-bold border border-[#FF8C00]/30 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Lock size={10} /> Em Breve
                    </span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 grayscale group-hover:grayscale-0 transition-all">
                  <Image size={20} />
                </div>
                <h3 className="text-white font-semibold mb-1">Geração de Imagens</h3>
                <p className="text-sm text-gray-500">Crie visuais para ads e posts sociais.</p>
            </div>

            {/* Coming Soon: Sites */}
            <div className="group relative bg-brand-surface border border-gray-800 p-6 rounded-xl transition-all duration-300 opacity-80 hover:opacity-100 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gray-950/60 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] text-xs font-bold border border-[#FF8C00]/30 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Lock size={10} /> Em Breve
                    </span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 grayscale group-hover:grayscale-0 transition-all">
                  <LayoutIcon size={20} />
                </div>
                <h3 className="text-white font-semibold mb-1">Geração de Sites</h3>
                <p className="text-sm text-gray-500">Landing pages completas em segundos.</p>
            </div>

            </div>
        )}
      </div>
    </div>
  );
};