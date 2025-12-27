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
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Maintenance Teams</h2>
          <p className="text-gray-600 mt-1">Manage specialized teams and members</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Team
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Team Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input placeholder="Members (comma-separated)" value={form.members} onChange={e => setForm({...form, members: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">Create Team</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">{team.name}</h3>
            </div>
            {team.members && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Members:</p>
                <p>{team.members}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
