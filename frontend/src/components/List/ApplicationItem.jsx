import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { STATUS_OPTIONS } from '../../constants/appConstants';
import { format } from 'date-fns';

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
    if (window.confirm(`Delete ${job.job_title}?`)) {
      await supabase.from('applications').delete().eq('id', job.id);
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mb-4 hover:shadow-lg transition-all">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-black text-xl text-slate-800">{job.job_title}</h3>
              {job.tags?.map(tag => (
                <span key={tag} className="text-[9px] font-black uppercase bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">{tag}</span>
              ))}
              
              {job.reminder_date && (
                <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    Remind: {job.reminder_date}
                </span>
              )}
            </div>
            
            <p className="text-slate-500 font-bold mb-3">{job.company}</p>
            
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <span>Date Applied: {job.date_applied}</span>
              {job.closing_date && <span className="text-orange-500">Closes: {job.closing_date}</span>}
              {job.interview_date && <span className="text-blue-500">Interview: {job.interview_date}</span>}
              
              <span className="italic text-slate-300">
                Last Edit: {job.updated_at ? format(new Date(job.updated_at), 'MMM dd, p') : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={job.status} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-slate-50 border-2 border-transparent cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-300 hover:text-slate-600 font-bold text-xs">{isExpanded ? 'Hide' : 'Details'}</button>
            <button onClick={() => onEdit(job)} className="text-blue-500 font-bold text-xs">Edit</button>
            <button onClick={handleDelete} className="text-slate-200 hover:text-red-500 font-bold">✕</button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase block mb-2">Description</label>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{job.job_description || "..."}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase block mb-2">Notes</label>
              <p className="text-sm text-slate-600 whitespace-pre-wrap italic">{job.notes || "..."}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}