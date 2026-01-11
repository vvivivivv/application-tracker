import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { STATUS_OPTIONS } from '../../constants/appConstants';

export default function ApplicationItem({ job, onEdit, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = async (newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus, updated_at: new Date() })
      .eq('id', job.id);
    
    if (!error) onRefresh();
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete ${job.job_title} at ${job.company}?`)) {
      const { error } = await supabase.from('applications').delete().eq('id', job.id);
      if (!error) onRefresh();
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Interview': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Offer': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden transition-all hover:shadow-lg hover:border-blue-100 mb-4 group">
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-black text-xl text-slate-800">{job.job_title}</h3>
            {job.tags?.map(tag => (
              <span key={tag} className="text-[9px] font-black uppercase bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-slate-500 font-bold mb-3">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1">Date Applied: {job.date_applied}</span>
            {job.closing_date && <span className="text-orange-500 flex items-center gap-1">Closes: {job.closing_date}</span>}
            {job.interview_date && <span className="text-blue-500 flex items-center gap-1">Interview: {job.interview_date}</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select 
            value={job.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 cursor-pointer transition-all outline-none ${getStatusStyles(job.status)}`}
          >
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(job)} className="p-2 text-slate-300 hover:text-blue-500 transition-colors" title="Edit">
              Edit
            </button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              {isExpanded ? 'Collapse ▲' : 'Details ▼'}
            </button>
            <button onClick={handleDelete} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-slate-50/30 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Job Description</label>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {job.job_description || "No description provided."}
            </p>
            {job.job_url && (
              <a href={job.job_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-bold text-blue-500 hover:underline">
                View Original Posting ↗
              </a>
            )}
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">My Notes</label>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed italic">
              {job.notes || "No notes yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}