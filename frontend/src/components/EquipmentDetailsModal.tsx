import { useState, useEffect } from 'react'
import { X, Wrench, Clock, AlertTriangle, TrendingUp } from 'lucide-react'

const API_BASE = 'http://localhost:8081/api'

interface MaintenanceRequest {
  id: number
  name: string
  type: string
  scheduledDate?: string
  stage?: { name: string; done: boolean }
  overdue: boolean
}

interface Equipment {
  id: number
  name: string
  category?: string
  serialNo?: string
  location?: string
  scrapped: boolean
}

interface Stats {
  totalRequests: number
  openRequests: number
  completedRequests: number
}

interface Props {
  equipmentId: number
  onClose: () => void
}

export default function EquipmentDetailsModal({ equipmentId, onClose }: Props) {
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [equipmentId])

  const loadData = async () => {
    try {
      const [eqRes, reqRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/equipment/${equipmentId}`),
        fetch(`${API_BASE}/equipment/${equipmentId}/maintenance-requests`),
        fetch(`${API_BASE}/equipment/${equipmentId}/stats`)
      ])
      setEquipment(await eqRes.json())
      setRequests(await reqRes.json())
      setStats(await statsRes.json())
      setLoading(false)
    } catch (error) {
      console.error('Failed to load equipment details:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!equipment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-bold">{equipment.name}</h3>
              {equipment.serialNo && <p className="text-sm text-blue-100">SN: {equipment.serialNo}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Equipment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-semibold text-gray-900">{equipment.category || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-semibold text-gray-900">{equipment.location || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold">{equipment.scrapped ? 
                <span className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Scrapped
                </span> : 
                <span className="text-green-600">Active</span>
              }</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="font-semibold text-gray-900 text-2xl">{stats?.totalRequests || 0}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">Total</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats?.totalRequests || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-orange-900">Open</p>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-900">{stats?.openRequests || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-900">Completed</p>
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">{stats?.completedRequests || 0}</p>
            </div>
          </div>

          {/* Maintenance Requests List */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Maintenance History</h4>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No maintenance requests yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {requests.map(req => (
                  <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900">{req.name}</h5>
                          {req.overdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="flex gap-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            req.type === 'Preventive' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {req.type}
                          </span>
                          {req.stage && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              req.stage.done ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {req.stage.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {req.scheduledDate && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(req.scheduledDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
