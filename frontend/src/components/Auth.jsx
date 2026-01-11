import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../services/supabaseClient'

export default function AuthComponent() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 mb-2 tracking-tight">ApplicationTracker</h1>
          <p className="text-slate-400 text-sm font-medium">Private career dashboard</p>
        </div>
        
        <Auth 
          supabaseClient={supabase} 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb', 
                  brandAccent: '#1d4ed8',
                },
                radii: {
                  buttonRadius: '12px',
                  inputRadius: '12px',
                }
              }
            }
          }}
          providers={[]}
        />
        
        <p className="mt-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Secure Cloud Storage Powered by Supabase
        </p>
      </div>
    </div>
  )
}