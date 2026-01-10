import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { PRESET_TAGS } from '../../constants/appConstants';

export default function ApplicationForm({ editingJob, onComplete, userId }) {
  const initialForm = {
    job_title: '',
    company: '',
    job_url: '',
    job_description: '',
    notes: '',
    status: 'Applied',
    closing_date: '',
    interview_date: '',
    reminder_date: '',
    tags: []
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form if editing an existing job
  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        closing_date: editingJob.closing_date || '',
        interview_date: editingJob.interview_date || '',
        reminder_date: editingJob.reminder_date || '',
        tags: editingJob.tags || []
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingJob]);

  const toggleTag = (tag) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.job_title || !formData.company) return alert("Title and Company are required!");

    setIsSaving(true);

    const payload = {
      ...formData,
      user_id: userId,
      closing_date: formData.closing_date || null,
      interview_date: formData.interview_date || null,
      reminder_date: formData.reminder_date || null,
      updated_at: new Date()
    };

    let error;
    if (editingJob) {
      // Update existing record
      const { error: err } = await supabase
        .from('applications')
        .update(payload)
        .eq('id', editingJob.id);
      error = err;

    } else {
        // Insert new record
      const { error: err } = await supabase
        .from('applications')
        .insert([payload]);
      error = err;
    }

    if (error) {
      alert("Error: " + error.message);
    } else {
      setFormData(initialForm);
      onComplete();
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 space-y-6 mb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">
          {editingJob ? 'Update Application' : 'Add Application'}
        </h2>
        {editingJob && (
          <button 
            type="button" 
            onClick={() => onComplete()} 
            className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Job information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          className="w-full border-2 border-slate-50 p-3 rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none" 
          placeholder="Company Name *" 
          value={formData.company} 
          onChange={e => setFormData({...formData, company: e.target.value})} 
          required 
        />
        <input 
          className="w-full border-2 border-slate-50 p-3 rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none" 
          placeholder="Job Title *" 
          value={formData.job_title} 
          onChange={e => setFormData({...formData, job_title: e.target.value})} 
          required 
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Tags / Categories</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                formData.tags.includes(tag) 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-105' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Dates and job URL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Job URL</label>
          <input className="w-full border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="https://..." value={formData.job_url} onChange={e => setFormData({...formData, job_url: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Closing Date</label>
          <input type="date" className="w-full border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" value={formData.closing_date} onChange={e => setFormData({...formData, closing_date: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Reminder</label>
          <input type="date" className="w-full border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" value={formData.reminder_date} onChange={e => setFormData({...formData, reminder_date: e.target.value})} />
        </div>
      </div>

      {/* Description and notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea className="w-full border-2 border-slate-50 p-4 rounded-2xl bg-slate-50 h-32" placeholder="Job Description Highlights..." value={formData.job_description} onChange={e => setFormData({...formData, job_description: e.target.value})} />
        <textarea className="w-full border-2 border-slate-50 p-4 rounded-2xl bg-slate-50 h-32" placeholder="Personal Notes..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[20px] font-black text-xl transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-slate-300"
      >
        {isSaving ? 'Processing...' : (editingJob ? 'Update Application' : 'Save Application')}
      </button>
    </form>
  );
}