import { useEffect, useState } from 'react'

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section style={{ border: '1px solid #ddd', padding: 16, marginBottom: 16 }}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

type Equipment = { id: number, name: string, serialNo?: string, category?: string, location?: string, scrapped: boolean }

type Request = { id: number, name: string, type: string, equipment: { id: number }, stage?: { id: number }, overdue: boolean }

const API = 'http://localhost:8080/api'

export default function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [eqForm, setEqForm] = useState({ name: '', serialNo: '', category: '', location: '' })

  const [requests, setRequests] = useState<Request[]>([])
  const [reqForm, setReqForm] = useState({ name: '', type: 'corrective', equipmentId: 1 })

  useEffect(() => {
    fetch(`${API}/equipment`).then(r => r.json()).then(setEquipment).catch(console.error)
    fetch(`${API}/requests`).then(r => r.json()).then(setRequests).catch(console.error)
  }, [])

  const createEq = async () => {
    const res = await fetch(`${API}/equipment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eqForm) })
    const data = await res.json()
    setEquipment(prev => [...prev, data])
    setEqForm({ name: '', serialNo: '', category: '', location: '' })
  }

  const createReq = async () => {
    const payload = { name: reqForm.name, type: reqForm.type, equipment: { id: reqForm.equipmentId } }
    const res = await fetch(`${API}/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    setRequests(prev => [...prev, data])
    setReqForm({ name: '', type: 'corrective', equipmentId: 1 })
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>GearGuard: Maintenance Tracker</h1>

      <Section title="Equipment">
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <h3>Create</h3>
            <input placeholder="Name" value={eqForm.name} onChange={e => setEqForm({ ...eqForm, name: e.target.value })} />
            <input placeholder="Serial" value={eqForm.serialNo} onChange={e => setEqForm({ ...eqForm, serialNo: e.target.value })} />
            <input placeholder="Category" value={eqForm.category} onChange={e => setEqForm({ ...eqForm, category: e.target.value })} />
            <input placeholder="Location" value={eqForm.location} onChange={e => setEqForm({ ...eqForm, location: e.target.value })} />
            <button onClick={createEq}>Create</button>
          </div>
          <div>
            <h3>List</h3>
            <ul>
              {equipment.map(it => (
                <li key={it.id}>{it.name} ({it.serialNo}) - {it.category} @ {it.location} {it.scrapped ? ' [SCRAPPED]' : ''}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Requests">
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <h3>Create</h3>
            <input placeholder="Name" value={reqForm.name} onChange={e => setReqForm({ ...reqForm, name: e.target.value })} />
            <select value={reqForm.type} onChange={e => setReqForm({ ...reqForm, type: e.target.value })}>
              <option value="corrective">Corrective</option>
              <option value="preventive">Preventive</option>
            </select>
            <input type="number" placeholder="Equipment ID" value={reqForm.equipmentId} onChange={e => setReqForm({ ...reqForm, equipmentId: Number(e.target.value) })} />
            <button onClick={createReq}>Create</button>
          </div>
          <div>
            <h3>List</h3>
            <ul>
              {requests.map(it => (
                <li key={it.id}>{it.name} [{it.type}] {it.overdue ? 'OVERDUE' : ''} (Eq: {it.equipment?.id}) Stage: {it.stage?.id ?? 'New'}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  )
}
