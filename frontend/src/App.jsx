import { useEffect } from 'react'
import { supabase } from './services/supabaseClient'

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('applications').select('*').limit(1)
      if (error) {
        console.error("Connection Error:", error.message)
      } else {
        console.log("Supabase Connected! Data:", data)
      }
    }
    testConnection()
  }, [])

  return <div>Check your Browser Console (F12) to see if Supabase connected!</div>
}
export default App