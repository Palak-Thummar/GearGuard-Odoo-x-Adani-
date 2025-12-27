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
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2.5 rounded-lg">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GearGuard</h1>
              <p className="text-xs text-slate-400 font-medium">Maintenance Pro</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 ${
              currentView === 'kanban' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Layout className="w-5 h-5" />
            <span className="text-sm">Kanban Board</span>
          </button>
          
          <button
            onClick={() => setCurrentView('equipment')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 ${
              currentView === 'equipment' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Boxes className="w-5 h-5" />
            <span className="text-sm">Equipment</span>
          </button>
          
          <button
            onClick={() => setCurrentView('teams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 ${
              currentView === 'teams' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm">Teams</span>
          </button>
          
          <button
            onClick={() => setCurrentView('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-150 ${
              currentView === 'calendar' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-sm">Calendar</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-150 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
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
