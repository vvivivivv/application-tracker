import { useState, useMemo } from 'react';
import ApplicationItem from './ApplicationItem';
import { STATUS_OPTIONS } from '../../constants/appConstants';

export default function ApplicationList({ jobs, onEdit, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date_applied');

  // Logic to filter and sort the listed jobs
  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter(j => filterStatus === 'All' || j.status === filterStatus)
      .sort((a, b) => {
        if (sortBy === 'closing_date') {
          // Sort by date, but handle nulls (no closing date goes to the end)
          return new Date(a.closing_date || '9999-12-31') - new Date(b.closing_date || '9999-12-31');
        }
        // Default: sort by Date Applied (descending)
        return new Date(b.date_applied) - new Date(a.date_applied);
      });
  }, [jobs, filterStatus, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${filterStatus === 'All' ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            All ({jobs.length})
          </button>
          {STATUS_OPTIONS.map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${filterStatus === status ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-slate-100 p-2 rounded-xl text-xs font-bold outline-none text-slate-500 cursor-pointer"
        >
          <option value="date_applied">Sort: Recently Applied</option>
          <option value="closing_date">Sort: Deadline</option>
        </select>
      </div>

      <div className="mt-4">
        {filteredAndSortedJobs.length > 0 ? (
          filteredAndSortedJobs.map(job => (
            <ApplicationItem 
              key={job.id} 
              job={job} 
              onEdit={onEdit} 
              onRefresh={onRefresh} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-300">
            <p className="font-bold uppercase tracking-widest text-xs">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}