import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useApplications(session) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const { data: jobList, error: jobError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (jobError) throw jobError;

      const { data: statsData, error: statsError } = await supabase.rpc('get_application_stats');
      if (statsError) throw statsError;

      const { data: remindersData, error: remError } = await supabase.rpc('get_application_reminders');
      if (remError) throw remError;

      setJobs(jobList || []);
      setStats(statsData);
      setReminders(remindersData || []);
    } catch (err) {
      console.error("Error fetching application data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  return { jobs, fetchJobs: fetchData, stats, reminders, loading };
}