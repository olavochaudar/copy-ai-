
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Project } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Save, Calendar, Tag, CheckCircle2, FileText, PenTool, Layout } from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Editable Fields
  const [brief, setBrief] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Project['status']>('draft');

  const [activeTab, setActiveTab] = useState<'content' | 'brief'>('content');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const { data } = await supabaseService.from('projects').eq('id', id).select();
      if (data && data[0]) {
        const p = data[0] as Project;
        setProject(p);
        setBrief(p.brief || '');
        setContent(p.content || '');
        setStatus(p.status);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    
    // Simulate API update
    await supabaseService.from('projects').update({
        brief,
        content,
        status
    }).eq('id', project.id);
    
    // Update local state to reflect "saved"
    setProject(prev => prev ? ({ ...prev, brief, content, status }) : null);
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[50vh] text-gray-500">Carregando projeto...</div>;
  }

  if (!project) {
    return <div className="text-center text-gray-500 mt-20">Projeto não encontrado.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {project.name}
              <span className={`text-xs px-2 py-1 rounded-full border ${
                  status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  status === 'generating' ? 'bg-[#FF8C00]/10 border-[#FF8C00]/30 text-[#FF8C00]' :
                  'bg-gray-700 border-gray-600 text-gray-400'
              }`}>
                  {status === 'completed' ? 'Concluído' : status === 'generating' ? 'Em Progresso' : 'Rascunho'}
              </span>
            </h1>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
               <span className="flex items-center gap-1"><Tag size={12}/> {project.type}</span>
               <span className="flex items-center gap-1"><Calendar size={12}/> Criado em {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as Project['status'])}
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg p-2.5 focus:ring-[#FF8C00] outline-none"
          >
            <option value="draft">Rascunho</option>
            <option value="generating">Em Progresso</option>
            <option value="completed">Concluído</option>
          </select>
          <Button onClick={handleSave} isLoading={saving} className="flex items-center gap-2">
            <Save size={16} /> Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Sidebar Navigation (Tabs) */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
            <button 
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'content' 
                    ? 'bg-[#FF8C00]/10 text-[#FF8C00] border border-[#FF8C00]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                <FileText size={18} /> Editor de Conteúdo
            </button>
            <button 
                onClick={() => setActiveTab('brief')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'brief' 
                    ? 'bg-[#FF8C00]/10 text-[#FF8C00] border border-[#FF8C00]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
                <Layout size={18} /> Briefing & Notas
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-brand-surface border border-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col relative">
            
            {/* Editor Toolbar */}
            <div className="bg-gray-900/50 border-b border-gray-800 p-3 flex items-center gap-4 text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">
                    {activeTab === 'content' ? 'Documento Principal' : 'Briefing do Projeto'}
                </span>
                {saving && <span className="text-xs text-[#FF8C00] animate-pulse">Salvando...</span>}
            </div>

            {/* Editor Input */}
            <textarea
                value={activeTab === 'content' ? content : brief}
                onChange={(e) => activeTab === 'content' ? setContent(e.target.value) : setBrief(e.target.value)}
                placeholder={activeTab === 'content' ? "Comece a escrever ou cole o conteúdo gerado pela IA aqui..." : "Descreva os objetivos, público-alvo e notas importantes para este projeto..."}
                className="flex-1 w-full bg-[#0B1120] p-6 text-gray-200 resize-none focus:outline-none custom-scrollbar leading-relaxed font-mono text-sm md:text-base"
                spellCheck={false}
            />

            {/* Floating Action for AI (Magic Box integration suggestion) */}
            {activeTab === 'content' && !content && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-50 pointer-events-none">
                    <PenTool size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-500">O documento está vazio.</p>
                    <p className="text-xs text-gray-600 mt-2">Use a Magic Box ou Ferramentas para gerar o rascunho inicial.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
