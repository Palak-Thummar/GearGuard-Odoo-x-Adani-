import { useState, useEffect } from 'react'
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AlertCircle, Clock } from 'lucide-react'
import RequestCard from './RequestCard.tsx'
import NewRequestModal from './NewRequestModal.tsx'

const API_BASE = 'http://localhost:8081/api'

interface Stage {
  id: number
  name: string
  sequence: number
  done: boolean
  scrap: boolean
}

interface Equipment {
  id: number
  name: string
  category?: string
  maintenanceTeam?: { id: number; name: string }
}

interface MaintenanceRequest {
  id: number
  name: string
  description?: string
  type: string
  category?: string
  scheduledDate?: string
  duration?: number
  technician?: string
  overdue: boolean
  equipment: Equipment
  stage?: Stage
  team?: { id: number; name: string }
}

export default function KanbanBoard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reqRes, stagesRes] = await Promise.all([
        fetch(`${API_BASE}/requests`),
        fetch(`${API_BASE}/stages`)
      ])
      const reqData = await reqRes.json()
      const stagesData = await stagesRes.json()
      
      setRequests(reqData)
      setStages(stagesData.sort((a: Stage, b: Stage) => a.sequence - b.sequence))
      setLoading(false)
    } catch (error) {
      console.error('Failed to load data:', error)
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const requestId = Number(active.id)
    const newStageId = Number(over.id)

    const request = requests.find(r => r.id === requestId)
    if (!request || request.stage?.id === newStageId) return

    try {
      const response = await fetch(`${API_BASE}/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          equipmentId: request.equipment.id,
          stageId: newStageId,
          teamId: request.team?.id
        })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to update request:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const activeRequest = activeId ? requests.find(r => r.id === activeId) : null

  return (
    <div className="p-10 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      <div className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Maintenance Requests</h2>
            <p className="text-lg text-gray-600 font-medium">Drag & drop cards to update status</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-3 text-lg hover:scale-105 active:scale-95"
          >
            <span className="text-2xl leading-none">+</span>
            <span>New Request</span>
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => setActiveId(Number(e.active.id))}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-6">
          {stages.map(stage => (
            <div key={stage.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-xl text-gray-900">{stage.name}</h3>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {requests.filter(r => r.stage?.id === stage.id).length}
                </span>
              </div>

              <SortableContext
                id={stage.id.toString()}
                items={requests.filter(r => r.stage?.id === stage.id).map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 min-h-[500px]" id={stage.id.toString()}>
                  {requests
                    .filter(r => r.stage?.id === stage.id)
                    .map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeRequest && <RequestCard request={activeRequest} isDragging />}
        </DragOverlay>
      </DndContext>

      {showModal && (
        <NewRequestModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}
