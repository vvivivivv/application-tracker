import { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import AuthComponent from './components/Auth';
import TrackerDashboard from './components/TrackerDashboard';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Verifying Session</p>
        </div>
      </div>
    );
  }

  return !session ? <AuthComponent /> : <TrackerDashboard session={session} />;
}