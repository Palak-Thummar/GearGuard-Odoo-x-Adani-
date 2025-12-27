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
    <div className="p-8 min-h-screen bg-[#F5F7FA]">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Equipment Management</h1>
            <p className="text-sm text-slate-600">Track and manage all company assets</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 transform transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Equipment</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input required placeholder="Equipment Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <input placeholder="Serial Number" value={form.serialNo} onChange={e => setForm({...form, serialNo: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <input placeholder="Default Technician" value={form.defaultTechnician} onChange={e => setForm({...form, defaultTechnician: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition" />
            <select value={form.maintenanceTeamId} onChange={e => setForm({...form, maintenanceTeamId: e.target.value})} className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition">
              <option value="">Select Team...</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold col-span-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">Create Equipment</button>
          </form>
        </div>
      )}

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search equipment by name or category..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filtered.map(eq => (
          <div key={eq.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2.5 rounded-lg">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-900">{eq.name}</h3>
                  {eq.serialNo && <p className="text-xs text-slate-500 mt-0.5">SN: {eq.serialNo}</p>}
                </div>
              </div>
              {eq.scrapped && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="space-y-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {eq.category && <p><span className="font-medium text-slate-700">Category:</span> {eq.category}</p>}
              {eq.location && <p><span className="font-medium text-slate-700">Location:</span> {eq.location}</p>}
              {eq.defaultTechnician && <p><span className="font-medium text-slate-700">Technician:</span> {eq.defaultTechnician}</p>}
              {eq.maintenanceTeam && <p><span className="font-medium text-slate-700">Team:</span> {eq.maintenanceTeam.name}</p>}
            </div>
            <button
              onClick={() => setSelectedEquipmentId(eq.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Eye className="w-4 h-4" />
              View Details
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
