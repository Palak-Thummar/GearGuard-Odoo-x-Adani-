import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, AlertTriangle, User, Package, Wrench, Users, Calendar } from 'lucide-react'
import clsx from 'clsx'

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
        'bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border mb-3',
        request.overdue ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-blue-300'
      )}
    >
      {/* Card Title */}
      <h4 className="font-semibold text-sm text-slate-900 mb-3 leading-tight">{request.name}</h4>
      
      {/* Metadata Section */}
      <div className="space-y-2 text-xs">
        {/* Equipment */}
        {request.equipment && (
          <div className="flex items-center gap-2 text-slate-600">
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{request.equipment.name}</span>
          </div>
        )}
        
        {/* Team */}
        {request.team && (
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{request.team.name}</span>
          </div>
        )}
        
        {/* Date */}
        {request.scheduledDate && (
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      {/* Tags Section */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Type Badge */}
        <span className={clsx(
          'px-2 py-0.5 rounded-full text-[10px] font-medium',
          request.type === 'preventive' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
        )}>
          {request.type === 'preventive' ? 'Preventive' : 'Corrective'}
        </span>
        
        {/* Overdue Badge */}
        {request.overdue && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
            Overdue
          </span>
        )}
      </div>
    </div>
  )
}
