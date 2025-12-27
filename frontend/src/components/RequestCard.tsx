import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, AlertTriangle, User, Package } from 'lucide-react'
import { clsx } from 'clsx'

interface Equipment {
  id: number
  name: string
  category?: string
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
  stage?: { id: number; name: string }
  team?: { id: number; name: string }
}

interface Props {
  request: MaintenanceRequest
  isDragging?: boolean
}

export default function RequestCard({ request, isDragging }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: request.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'bg-white rounded-xl p-5 shadow-medium hover:shadow-large transition-all duration-200 cursor-grab active:cursor-grabbing border-2',
        request.overdue ? 'border-red-400 bg-red-50/50' : 'border-transparent hover:border-blue-200'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-900 flex-1 text-base leading-snug">{request.name}</h4>
        {request.overdue && (
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 ml-2" />
        )}
      </div>

      {request.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{request.description}</p>
      )}

      <div className="space-y-2.5 text-sm mb-4">
        <div className="flex items-center gap-2.5 text-gray-700">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <span className="truncate font-medium">{request.equipment.name}</span>
        </div>

        {request.technician && (
          <div className="flex items-center gap-2.5 text-gray-700">
            <div className="bg-purple-100 p-1.5 rounded-lg">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium">{request.technician}</span>
          </div>
        )}

        {request.scheduledDate && (
          <div className="flex items-center gap-2.5 text-gray-700">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">{new Date(request.scheduledDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className={clsx(
          'px-3 py-1.5 rounded-lg text-xs font-bold',
          request.type === 'Preventive' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
        )}>
          {request.type}
        </span>
        
        {request.category && (
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            {request.category}
          </span>
        )}
      </div>

      {request.duration && (
        <div className="mt-3 text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
          Duration: {request.duration}h
        </div>
      )}
    </div>
  )
}
