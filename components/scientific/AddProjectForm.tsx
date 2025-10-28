import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScientificDataService } from '@/services/scientificData';
import type { ProjectFormData } from '@/types/scientific';

const initialState: ProjectFormData = {
  title: '',
  description: '',
  collaborators: [],
  startDate: new Date().toISOString().slice(0, 10),
  endDate: undefined,
  tags: [],
  progress: 0,
  milestones: [],
};

interface AddProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: any; // ResearchProject with Firestore types
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose, onSuccess, projectToEdit }) => {
  const { user } = useAuth();
  const [form, setForm] = useState<ProjectFormData>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Load project data if editing
  useEffect(() => {
    if (projectToEdit) {
      setForm({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        collaborators: projectToEdit.collaborators || [],
        startDate: projectToEdit.startDate ? (
          typeof projectToEdit.startDate === 'string'
            ? projectToEdit.startDate
            : projectToEdit.startDate.toISOString().split('T')[0]
        ) : new Date().toISOString().slice(0, 10),
        endDate: projectToEdit.endDate ? (
          typeof projectToEdit.endDate === 'string'
            ? projectToEdit.endDate
            : projectToEdit.endDate.toISOString().split('T')[0]
        ) : undefined,
        tags: projectToEdit.tags || [],
        progress: projectToEdit.progress || 0,
        milestones: projectToEdit.milestones || [],
      });
    }
  }, [projectToEdit]);

  const set = (field: keyof ProjectFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (field === 'collaborators') {
      setForm(prev => ({ ...prev, collaborators: v.split(',').map(s => s.trim()).filter(Boolean) }));
    } else if (field === 'tags') {
      setForm(prev => ({ ...prev, tags: v.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setForm(prev => ({ ...prev, [field]: v } as ProjectFormData));
    }
  };

  const addMilestone = () => {
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      dueDate: undefined,
      completed: false,
    };
    setForm(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone]
    }));
  };

  const updateMilestone = (id: string, field: 'title' | 'description' | 'dueDate' | 'completed', value: any) => {
    setForm(prev => ({
      ...prev,
      milestones: prev.milestones?.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  const removeMilestone = (id: string) => {
    setForm(prev => ({
      ...prev,
      milestones: prev.milestones?.filter(m => m.id !== id)
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) { setError('Title is required'); return; }
    try {
      setSaving(true);
      
      const projectData = {
        title: form.title.trim(),
        description: form.description.trim(),
        ownerId: user.id,
        collaborators: form.collaborators,
        status: projectToEdit?.status || 'planning',
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        tags: form.tags,
        progress: form.progress || 0,
        milestones: form.milestones || [],
      };

      if (projectToEdit?.id) {
        // Edit mode
        await ScientificDataService.updateProject(projectToEdit.id, projectData);
      } else {
        // Create mode
        await ScientificDataService.createProject(projectData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(projectToEdit ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 py-8 md:py-12 landscape:py-4 landscape:p-2 z-50 backdrop-blur-sm">
      <div className={`bg-linear-to-br from-white to-slate-50/50 rounded-3xl landscape:rounded-2xl p-6 pt-10 md:p-10 md:pt-12 landscape:p-4 landscape:pt-6 max-w-3xl w-full max-h-[85vh] md:max-h-[88vh] landscape:max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200/60 relative transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -z-10" />

        <div className="mb-6 md:mb-8 landscape:mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 landscape:gap-2 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 landscape:w-8 landscape:h-8 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-2xl landscape:rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 landscape:w-4 landscape:h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl landscape:text-lg font-bold text-slate-900 tracking-tight truncate">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6 landscape:space-y-3">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
              <svg className="w-5 h-5 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-rose-700">{error}</span>
            </div>
          )}

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Title *
            </span>
            <input value={form.title} onChange={set('title')} className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200" required />
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </span>
            <textarea value={form.description} onChange={set('description')} rows={4} className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200 resize-none landscape:rows-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Start Date
              </span>
              <input type="date" value={form.startDate} onChange={set('startDate')} className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200" />
            </div>
            <div className="flex flex-col group">
              <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                End Date
              </span>
              <input type="date" value={form.endDate || ''} onChange={set('endDate')} className="px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200" />
            </div>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.545 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Collaborators
            </span>
            <input placeholder="Enter email addresses separated by commas" onChange={set('collaborators')} className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200" />
            <p className="text-xs text-slate-500 mt-1">Add multiple emails separated by commas (e.g., email1@example.com, email2@example.com)</p>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Progress
            </span>
            <div className="space-y-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={form.progress || 0} 
                onChange={(e) => setForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${form.progress || 0}%, rgb(226, 232, 240) ${form.progress || 0}%, rgb(226, 232, 240) 100%)`
                }}
              />
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>0%</span>
                <span className="font-semibold text-slate-900">{form.progress || 0}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col group">
            <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </span>
            <input placeholder="Enter tags separated by commas" onChange={set('tags')} className="px-4 landscape:px-3 py-3 landscape:py-2 border border-slate-200 rounded-xl landscape:rounded-lg text-slate-900 landscape:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-slate-300 transition-all duration-200" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="submit" disabled={saving} className="group inline-flex items-center justify-center gap-3 flex-1 px-8 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 font-semibold">
              {saving ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {projectToEdit ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-4 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;
