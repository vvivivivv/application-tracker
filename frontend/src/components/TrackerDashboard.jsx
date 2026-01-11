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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Application <span className="text-blue-600">Tracker</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Connected as <span className="text-slate-600 font-bold">{session.user.email}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => exportToCSV(jobs)} 
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 cursor-pointer flex items-center gap-2"
            >
              Export Excel
            </button>
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="bg-white border border-slate-200 text-slate-400 px-6 py-2.5 rounded-2xl font-bold hover:text-red-500 hover:border-red-100 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          <StatsCard label="Total" value={loading ? "..." : stats?.total || 0} />
          <StatsCard label="Applied" value={loading ? "..." : stats?.applied || 0} colorClass="text-blue-500" />
          <StatsCard label="Interview" value={loading ? "..." : stats?.interviewing || 0} colorClass="text-amber-500" />
          <StatsCard label="Rejected" value={loading ? "..." : stats?.rejected || 0} colorClass="text-rose-500" />
          <StatsCard label="Offers" value={loading ? "..." : stats?.offers || 0} colorClass="text-emerald-500" />
          <StatsCard label="Rate" value={loading ? "..." : `${stats?.interview_rate || 0}%`} colorClass="text-blue-600 font-black" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Reminders */}
          <div className="lg:col-span-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Deadlines & Reminders</h3>
             <div className="space-y-3">
               {loading ? (
                 <div className="h-20 bg-white rounded-3xl animate-pulse border border-slate-100" />
               ) : reminders.length > 0 ? (
                 reminders.map(r => (
                   <div key={r.id} className={`p-4 rounded-[24px] border flex gap-3 items-center transition hover:scale-[1.02] ${r.isOverdue ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                     <span className="text-xl">{r.isOverdue ? '⚠️' : '🔔'}</span>
                     <div className="overflow-hidden">
                       <p className="text-[10px] font-black uppercase leading-none mb-1">
                         {r.isOverdue ? 'Overdue Action' : 'Upcoming Deadline'}
                       </p>
                       <p className="text-sm font-bold truncate">{r.job_title} @ {r.company}</p>
                       <p className="text-[10px] font-medium opacity-70">Due: {r.closing_date || r.reminder_date}</p>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="py-8 text-center bg-white rounded-[24px] border border-dashed border-slate-200 text-slate-300 text-xs font-bold uppercase tracking-widest">
                   No upcoming deadlines or reminders
                 </div>
               )}
             </div>
          </div>

          {/* Activity */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Application Activity</p>
                <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded-md font-bold">LAST 14 DAYS</span>
             </div>
             {!loading ? (
               <ActivityChart weeklyData={stats?.weeklyData || {}} />
             ) : (
               <div className="h-40 bg-slate-50 animate-pulse rounded-2xl" />
             )}
          </div>
        </div>

        {/* Application form */}
        <div className="mb-12">
          <ApplicationForm 
            userId={session.user.id} 
            editingJob={editingJob} 
            onComplete={() => { fetchJobs(); setEditingJob(null); }} 
          />
        </div>

        {/* Application list */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-6 ml-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Applications</h2>
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
          </div>
          
          <ApplicationList 
            jobs={jobs} 
            onEdit={(j) => { setEditingJob(j); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
            onRefresh={fetchJobs} 
          />
        </div>

      </div>
    </div>
  );
}