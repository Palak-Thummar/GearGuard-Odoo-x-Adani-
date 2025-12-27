import { useState, useEffect } from 'react'
import { Plus, Wrench, AlertTriangle, Search, Eye } from 'lucide-react'
import EquipmentDetailsModal from './EquipmentDetailsModal'

const API_BASE = 'http://localhost:8081/api'

interface Equipment {
  id: number
  name: string
  serialNo?: string
  category?: string
  location?: string
  defaultTechnician?: string
  scrapped: boolean
  maintenanceTeam?: { id: number; name: string }
}

interface Team { id: number; name: string }

export default function EquipmentManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', serialNo: '', category: '', location: '', defaultTechnician: '', maintenanceTeamId: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [eqRes, teamsRes] = await Promise.all([fetch(`${API_BASE}/equipment`), fetch(`${API_BASE}/teams`)])
    setEquipment(await eqRes.json())
    setTeams(await teamsRes.json())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`${API_BASE}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, maintenanceTeamId: form.maintenanceTeamId ? Number(form.maintenanceTeamId) : null })
    })
    setForm({ name: '', serialNo: '', category: '', location: '', defaultTechnician: '', maintenanceTeamId: '' })
    setShowForm(false)
    loadData()
  }

  const filtered = equipment.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Equipment Management</h2>
          <p className="text-gray-600 mt-1">Track and manage all company assets</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Equipment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input required placeholder="Equipment Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Serial Number" value={form.serialNo} onChange={e => setForm({...form, serialNo: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input placeholder="Default Technician" value={form.defaultTechnician} onChange={e => setForm({...form, defaultTechnician: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={form.maintenanceTeamId} onChange={e => setForm({...form, maintenanceTeamId: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option value="">Select Team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg col-span-3">Create Equipment</button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filtered.map(eq => (
          <div key={eq.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{eq.name}</h3>
                  {eq.serialNo && <p className="text-sm text-gray-500">SN: {eq.serialNo}</p>}
                </div>
              </div>
              {eq.scrapped && <AlertTriangle className="w-5 h-5 text-red-500" />}
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {eq.category && <p><span className="font-medium">Category:</span> {eq.category}</p>}
              {eq.location && <p><span className="font-medium">Location:</span> {eq.location}</p>}
              {eq.defaultTechnician && <p><span className="font-medium">Technician:</span> {eq.defaultTechnician}</p>}
              {eq.maintenanceTeam && <p><span className="font-medium">Team:</span> {eq.maintenanceTeam.name}</p>}
            </div>
            <button
              onClick={() => setSelectedEquipmentId(eq.id)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Maintenance
            </button>
          </div>
        ))}
      </div>

      {selectedEquipmentId && (
        <EquipmentDetailsModal
          equipmentId={selectedEquipmentId}
          onClose={() => setSelectedEquipmentId(null)}
        />
      )}
    </div>
  )
}
