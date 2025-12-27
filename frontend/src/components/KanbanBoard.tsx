import { useState, useEffect } from 'react'
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AlertCircle, Clock } from 'lucide-react'
import RequestCard from './RequestCard.tsx'
import NewRequestModal from './NewRequestModal.tsx'

const API_BASE = 'http://localhost:8081/api'

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="space-y-4 min-h-[500px]">
      {children}
    </div>
  )
}

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
          stage: { id: newStageId }
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
    <div className="p-8 bg-[#F5F7FA] min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Maintenance Requests</h1>
            <p className="text-sm text-slate-600">Drag and drop cards to update their status</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <span className="text-base font-semibold">+</span>
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
          {stages.map((stage, idx) => {
            const stageColors = [
              { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-600', text: 'text-slate-700' },
              { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-600', text: 'text-amber-900' },
              { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-600', text: 'text-green-900' },
              { bg: 'bg-slate-50', border: 'border-slate-300', badge: 'bg-slate-500', text: 'text-slate-700' }
            ][idx] || stages[0];
            
            return (
            <div key={stage.id} className={`${stageColors.bg} rounded-lg p-4 border ${stageColors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold text-sm ${stageColors.text}`}>{stage.name}</h3>
                <span className={`${stageColors.badge} text-white px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                  {requests.filter(r => r.stage?.id === stage.id).length}
                </span>
              </div>

              <SortableContext
                id={stage.id.toString()}
                items={requests.filter(r => r.stage?.id === stage.id).map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn id={stage.id.toString()}>
                  {requests
                    .filter(r => r.stage?.id === stage.id)
                    .map(request => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                </DroppableColumn>
              </SortableContext>
            </div>
            );
          })}
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
