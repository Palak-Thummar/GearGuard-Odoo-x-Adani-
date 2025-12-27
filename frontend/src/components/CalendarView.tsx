import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

const API_BASE = 'http://localhost:8081/api'

interface MaintenanceRequest {
  id: number
  name: string
  scheduledDate?: string
  type: string
  equipment: { name: string }
}

export default function CalendarView() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])

  useEffect(() => { loadRequests() }, [])

  const loadRequests = async () => {
    const res = await fetch(`${API_BASE}/requests`)
    setRequests(await res.json())
  }

  const events = requests
    .filter(r => r.scheduledDate && r.type === 'Preventive')
    .map(r => ({
      id: r.id,
      title: `${r.name} (${r.equipment.name})`,
      start: new Date(r.scheduledDate!),
      end: new Date(r.scheduledDate!),
      resource: r
    }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h2>
        <p className="text-gray-600 mt-1">Scheduled preventive maintenance</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6" style={{ height: 'calc(100vh - 250px)' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>
    </div>
  )
}
