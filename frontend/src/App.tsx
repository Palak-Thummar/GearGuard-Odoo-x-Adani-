import { useState } from 'react'
import { Layout, Wrench, Calendar as CalendarIcon, Users, Boxes } from 'lucide-react'
import KanbanBoard from './components/KanbanBoard.tsx'
import EquipmentManager from './components/EquipmentManager.tsx'
import TeamManager from './components/TeamManager.tsx'
import CalendarView from './components/CalendarView.tsx'

type View = 'kanban' | 'equipment' | 'teams' | 'calendar'

function App() {
  const [currentView, setCurrentView] = useState<View>('kanban')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-600 via-blue-600 to-blue-700 text-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GearGuard</h1>
              <p className="text-xs text-blue-100 font-medium">Maintenance Pro</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'kanban' 
                ? 'bg-white text-blue-700 shadow-xl scale-105' 
                : 'hover:bg-white/10 hover:scale-102 active:scale-98'
            }`}
          >
            <Layout className="w-6 h-6" />
            <span className="text-base">Kanban Board</span>
          </button>
          
          <button
            onClick={() => setCurrentView('equipment')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'equipment' 
                ? 'bg-white text-blue-700 shadow-xl scale-105' 
                : 'hover:bg-white/10 hover:scale-102 active:scale-98'
            }`}
          >
            <Boxes className="w-6 h-6" />
            <span className="text-base">Equipment</span>
          </button>
          
          <button
            onClick={() => setCurrentView('teams')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'teams' 
                ? 'bg-white text-blue-700 shadow-xl scale-105' 
                : 'hover:bg-white/10 hover:scale-102 active:scale-98'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-base">Teams</span>
          </button>
          
          <button
            onClick={() => setCurrentView('calendar')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'calendar' 
                ? 'bg-white text-blue-700 shadow-xl scale-105' 
                : 'hover:bg-white/10 hover:scale-102 active:scale-98'
            }`}
          >
            <CalendarIcon className="w-6 h-6" />
            <span className="text-base">Calendar</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-semibold text-white/90">System Status</p>
            <p className="text-xs text-blue-100 mt-1">All systems operational</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Connected</span>
            </div>
          </div>
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
