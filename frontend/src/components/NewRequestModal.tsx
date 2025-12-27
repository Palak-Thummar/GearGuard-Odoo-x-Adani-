import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const API_BASE = 'http://localhost:8081/api'

interface Equipment {
  id: number
  name: string
  category?: string
  maintenanceTeam?: { id: number; name: string }
  defaultTechnician?: string
}

interface Team {
  id: number
  name: string
}

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function NewRequestModal({ onClose, onSuccess }: Props) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Corrective',
    equipmentId: '',
    scheduledDate: '',
    category: '',
    technician: '',
    teamId: ''
  })

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    try {
      const [equipRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE}/equipment`),
        fetch(`${API_BASE}/teams`)
      ])
      setEquipment(await equipRes.json())
      setTeams(await teamsRes.json())
    } catch (error) {
      console.error('Failed to load options:', error)
    }
  }

  const handleEquipmentChange = (eqId: string) => {
    setFormData(prev => ({ ...prev, equipmentId: eqId }))
    
    const selected = equipment.find(e => e.id === Number(eqId))
    if (selected) {
      setFormData(prev => ({
        ...prev,
        equipmentId: eqId,
        category: selected.category || prev.category,
        teamId: selected.maintenanceTeam?.id.toString() || prev.teamId,
        technician: selected.defaultTechnician || prev.technician
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.equipmentId || !formData.name) {
      alert('Please fill required fields')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          type: formData.type,
          category: formData.category || null,
          scheduledDate: formData.scheduledDate || null,
          technician: formData.technician || null,
          equipmentId: Number(formData.equipmentId),
          teamId: formData.teamId ? Number(formData.teamId) : null
        })
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to create request')
      }
    } catch (error) {
      console.error('Failed to create request:', error)
      alert('Failed to create request')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">New Maintenance Request</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Leaking Oil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment *
            </label>
            <select
              required
              value={formData.equipmentId}
              onChange={e => handleEquipmentChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select equipment...</option>
              {equipment.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} {eq.category && `(${eq.category})`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-filled or custom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={e => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technician
              </label>
              <input
                type="text"
                value={formData.technician}
                onChange={e => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Auto-filled from equipment"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team
            </label>
            <select
              value={formData.teamId}
              onChange={e => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select team...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Create Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
