import { useState, useEffect } from 'react'
import { Plus, Users as UsersIcon } from 'lucide-react'

const API_BASE = 'http://localhost:8081/api'

interface Team { id: number; name: string; members?: string }

export default function TeamManager() {
  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', members: '' })

  useEffect(() => { loadTeams() }, [])

  const loadTeams = async () => {
    const res = await fetch(`${API_BASE}/teams`)
    setTeams(await res.json())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', members: '' })
    setShowForm(false)
    loadTeams()
  }

  return (
    <div className="p-8 min-h-screen bg-[#F5F7FA]">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Maintenance Teams</h1>
            <p className="text-sm text-slate-600">Manage specialized teams and members</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Team
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 transform transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Team</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input required placeholder="Team Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <input placeholder="Members (comma-separated)" value={form.members} onChange={e => setForm({...form, members: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">Create Team</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2.5 rounded-lg">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-base text-slate-900">{team.name}</h3>
            </div>
            {team.members && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="font-medium text-sm text-slate-700 mb-2">
                  Team Members
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{team.members}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
