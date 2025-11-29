
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Project } from '../types';
import { Button } from '../components/Button';
import { Plus, MoreHorizontal, Calendar, FileText, Loader2, Edit, Copy, Trash2, X, AlertCircle } from 'lucide-react';

const PROJECT_CATEGORIES = [
  'Email Marketing',
  'Redes Sociais',
  'Copy para Site',
  'Artigo de Blog',
  'Anúncios (Ads)',
  'Roteiro de Vídeo',
  'Copy Geral'
];

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Unified Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form State
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Email Marketing');
  const [projectStatus, setProjectStatus] = useState<Project['status']>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Search Param State (basic implementation to read from URL if needed in future)
  const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    fetchProjects();

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (activeMenuId && !(event.target as Element).closest('.project-menu-container')) {
            setActiveMenuId(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabaseService.from('projects').select();
    if (data) {
        let filteredData = data as Project[];
        if (searchQuery) {
            filteredData = filteredData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setProjects(filteredData);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
      setEditingProject(null);
      setProjectName('');
      setProjectType('Email Marketing');
      setProjectStatus('draft');
      setFormError('');
      setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();
      setActiveMenuId(null);
      setEditingProject(project);
      setProjectName(project.name);
      setProjectType(project.type);
      setProjectStatus(project.status);
      setFormError('');
      setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!projectName.trim()) {
        setFormError('O nome do projeto é obrigatório.');
        return;
    }
    if (!projectStatus) {
        setFormError('Selecione um status válido.');
        return;
    }

    setIsSaving(true);
    
    if (editingProject) {
        // Edit Logic
        const updatedProjects = projects.map(p => 
            p.id === editingProject.id 
                ? { ...p, name: projectName, type: projectType, status: projectStatus } 
                : p
        );
        
        // Simulate network delay and update
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app: await supabaseService.from('projects').update({ ... }).eq('id', editingProject.id);
        
        setProjects(updatedProjects);
    } else {
        // Create Logic
        const { data } = await supabaseService.from('projects').insert([{
            name: projectName,
            type: projectType,
            status: projectStatus,
        }]);
    
        if (data) {
            setProjects([...projects, ...data as Project[]]);
        }
    }

    setIsModalOpen(false);
    setIsSaving(false);
  };

  const handleDuplicate = async (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();
      setActiveMenuId(null);
      
      const newProject = {
          name: `Cópia de ${project.name}`,
          type: project.type,
          status: 'draft',
      };

      const { data } = await supabaseService.from('projects').insert([newProject]);
      if (data) {
          setProjects([...projects, ...data as Project[]]);
      }
  };

  const handleDelete = async (id: string) => {
      setProjects(projects.filter(p => p.id !== id));
      await supabaseService.from('projects').eq('id', id).delete();
      setActiveMenuId(null);
  }

  const toggleMenu = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setActiveMenuId(activeMenuId === id ? null : id);
  }

  const renderStatusBadge = (status: string) => {
      switch(status) {
          case 'completed':
              return (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-lg shadow-emerald-500/20">
                      Concluído
                  </div>
              );
          case 'generating':
              return (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8C00] text-white text-[11px] font-bold shadow-lg shadow-orange-500/20">
                      <Loader2 size={10} className="animate-spin" />
                      Gerando
                  </div>
              );
          default: // draft
              return (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-[11px] font-bold">
                      Rascunho
                  </div>
              );
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">Projetos</h1>
            <p className="text-gray-400">Gerencie suas campanhas de copy.</p>
        </div>
        <Button onClick={handleOpenCreate}>
            <Plus size={18} className="mr-2" /> Novo Projeto
        </Button>
      </div>

      {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-800 rounded-xl"></div>)}
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="relative bg-brand-surface border border-gray-800 rounded-xl p-6 hover:border-[#FF8C00]/40 hover:bg-gray-800/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm cursor-pointer animate-slideUp flex flex-col h-full"
                >
                    
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-[#FF8C00]/10 transition-colors">
                            <FileText size={24} className="text-gray-400 group-hover:text-[#FF8C00]" />
                        </div>
                        
                        {/* Quick Actions Menu */}
                        <div className="relative project-menu-container">
                            <button 
                                onClick={(e) => toggleMenu(e, project.id)} 
                                className={`p-1.5 rounded-full transition-colors ${activeMenuId === project.id ? 'bg-gray-700 text-white' : 'text-gray-600 hover:text-white hover:bg-gray-800'}`}
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {activeMenuId === project.id && (
                                <div className="absolute right-0 top-8 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn origin-top-right">
                                    <div className="py-1">
                                        <button 
                                            onClick={(e) => handleOpenEdit(e, project)} 
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 transition-colors"
                                        >
                                            <Edit size={14} /> Editar
                                        </button>
                                        <button 
                                            onClick={(e) => handleDuplicate(e, project)} 
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 transition-colors"
                                        >
                                            <Copy size={14} /> Duplicar
                                        </button>
                                        <div className="h-px bg-gray-800 my-1"></div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} 
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold text-white mb-1 truncate pr-2">{project.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{project.type}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-800 mt-auto">
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Calendar size={14} />
                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        {renderStatusBadge(project.status)}
                    </div>
                </div>
            ))}
            
            {projects.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                    <p>Nenhum projeto encontrado. Crie o primeiro!</p>
                </div>
            )}
        </div>
      )}

      {/* Unified Create/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">
                    {editingProject ? 'Editar Projeto' : 'Criar Novo Projeto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveProject} className="space-y-4">
                
                {/* Error Message */}
                {formError && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
                        <AlertCircle size={16} />
                        {formError}
                    </div>
                )}

                {/* Project Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Projeto <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={`w-full bg-gray-800 border rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:outline-none transition-all ${
                            formError && !projectName.trim() ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Ex: E-mails de Black Friday"
                        autoFocus
                    />
                </div>

                {/* Project Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
                    <select 
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:outline-none transition-all appearance-none"
                    >
                        {PROJECT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Project Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select 
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value as Project['status'])}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-[#FF8C00] focus:outline-none transition-all appearance-none"
                    >
                        <option value="draft">Rascunho</option>
                        <option value="generating">Gerando</option>
                        <option value="completed">Concluído</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" isLoading={isSaving}>
                        {editingProject ? 'Salvar Alterações' : 'Criar Projeto'}
                    </Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};