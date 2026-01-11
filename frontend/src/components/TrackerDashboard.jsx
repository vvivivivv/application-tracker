import { useState } from 'react';
import { useApplications } from '../hooks/useApplications';
import StatsCard from './Dashboard/StatsCard';
import ActivityChart from './Dashboard/ActivityChart';
import ApplicationForm from './Forms/ApplicationForm';
import ApplicationList from './List/ApplicationList';
import { exportToCSV } from '../utils/csvExport';
import { supabase } from '../services/supabaseClient';

export default function TrackerDashboard({ session }) {
  const { jobs, fetchJobs, stats, reminders, loading } = useApplications(session);
  const [editingJob, setEditingJob] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm font-medium">Welcome back, {session.user.email.split('@')[0]}</p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => exportToCSV(jobs)} 
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 cursor-pointer text-sm"
            >
              Export CSV
            </button>
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="text-slate-400 text-xs font-bold hover:text-red-500 transition uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <StatsCard 
            label="Total Applications" 
            value={loading ? "..." : stats.total} 
          />
          <StatsCard 
            label="Interview Rate" 
            value={loading ? "..." : `${stats.rate}%`} 
            colorClass="text-blue-600" 
          />
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">Activity</p>
             {!loading ? <ActivityChart weeklyData={stats.weeklyData} /> : <div className="h-32 bg-slate-50 animate-pulse rounded-xl" />}
          </div>
        </div>

        {/* Reminders */}
        {!loading && reminders.length > 0 && (
          <div className="mb-10 space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Reminders</h3>
            {reminders.map(r => (
              <div key={r.id} className={`p-4 rounded-2xl border flex gap-3 items-center ${r.isOverdue ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                <span className="text-lg">{r.isOverdue ? '⚠️' : '🔔'}</span>
                <div>
                  <p className="text-xs font-black uppercase leading-none mb-1">{r.isOverdue ? 'Overdue' : 'Upcoming Follow-up'}</p>
                  <p className="text-sm font-bold opacity-80">{r.job_title} @ {r.company} (Due: {r.reminder_date})</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Input Form */}
        <ApplicationForm 
          userId={session.user.id} 
          editingJob={editingJob} 
          onComplete={() => { fetchJobs(); setEditingJob(null); }} 
        />

        {/* Main List */}
        <div className="mt-12">
          {loading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
             </div>
          ) : (
            <ApplicationList 
              jobs={jobs} 
              onEdit={(j) => { setEditingJob(j); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              onRefresh={fetchJobs} 
            />
          )}
        </div>

      </div>
    </div>
  );
}