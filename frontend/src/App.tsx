import { useState } from 'react'
import { Layout, Wrench, Calendar as CalendarIcon, Users, Boxes, LogOut, User } from 'lucide-react'
import KanbanBoard from './components/KanbanBoard.tsx'
import EquipmentManager from './components/EquipmentManager.tsx'
import TeamManager from './components/TeamManager.tsx'
import CalendarView from './components/CalendarView.tsx'
import Login from './components/Login.tsx'
import SignUp from './components/SignUp.tsx'
import { useAuth } from './context/AuthContext.tsx'

type View = 'kanban' | 'equipment' | 'teams' | 'calendar'
type AuthView = 'login' | 'signup'

function App() {
  const [currentView, setCurrentView] = useState<View>('kanban')
  const [authView, setAuthView] = useState<AuthView>('login')
  const { user, login, signup, logout, isAuthenticated } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      await signup(name, email, password)
    } catch (error) {
      console.error('Sign up failed:', error)
    }
  }

  // Show authentication screens if user is not logged in
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
    } else {
      return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => setAuthView('login')} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-2xl flex flex-col">
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">GearGuard</h1>
              <p className="text-xs text-slate-400 font-medium">Maintenance Pro</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm group ${
              currentView === 'kanban' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>
          
          <button
            onClick={() => setCurrentView('equipment')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm group ${
              currentView === 'equipment' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Equipment</span>
          </button>
          
          <button
            onClick={() => setCurrentView('teams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm group ${
              currentView === 'teams' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teams</span>
          </button>
          
          <button
            onClick={() => setCurrentView('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm group ${
              currentView === 'calendar' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-2.5 mb-2 backdrop-blur-sm border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all duration-200 font-medium border border-slate-700/50 hover:border-red-600 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentView === 'kanban' && <KanbanBoard />}
        {currentView === 'equipment' && <EquipmentManager />}
        {currentView === 'teams' && <TeamManager />}
        {currentView === 'calendar' && <CalendarView />}
      </main>
    </div>
  )
}

export default App
