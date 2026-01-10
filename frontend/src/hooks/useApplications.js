import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { addDays, isBefore, isAfter, parseISO, startOfWeek, format } from 'date-fns';

export function useApplications(session) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [session]);

  const stats = useMemo(() => {
    const interviewCount = jobs.filter(j => ['Interview', 'Offer'].includes(j.status)).length;
    const rate = jobs.length > 0 ? ((interviewCount / jobs.length) * 100).toFixed(1) : 0;
    const weeklyData = {};
    jobs.forEach(j => {
      const week = format(startOfWeek(parseISO(j.date_applied)), 'MMM dd');
      weeklyData[week] = (weeklyData[week] || 0) + 1;
    });
    return { total: jobs.length, rate, weeklyData };
  }, [jobs]);

  const reminders = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return jobs.filter(j => j.reminder_date).map(j => {
      const rDate = parseISO(j.reminder_date);
      return {
        ...j,
        isOverdue: isBefore(rDate, today) && j.status !== 'Rejected',
        isUpcoming: isAfter(rDate, today) && isBefore(rDate, nextWeek)
      };
    }).filter(j => j.isOverdue || j.isUpcoming);
  }, [jobs]);

  return { jobs, fetchJobs, stats, reminders, loading };
}