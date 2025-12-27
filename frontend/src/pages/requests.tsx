import { useEffect, useState } from 'react';

interface Request {
  id: number; name: string; type: string; equipment_id: number; stage_id?: number; is_overdue: boolean;
}

export default function RequestsPage() {
  const [items, setItems] = useState<Request[]>([]);
  const [form, setForm] = useState({ name: '', type: 'corrective', equipment_id: 1 });

  useEffect(() => {
    fetch('http://localhost:8000/api/requests/')
      .then(r => r.json()).then(setItems)
      .catch(console.error);
  }, []);

  const create = async () => {
    const res = await fetch('http://localhost:8000/api/requests/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const eq = await res.json();
    setItems(prev => [...prev, eq]);
    setForm({ name: '', type: 'corrective', equipment_id: 1 });
  };

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h2>Requests</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <h3>Create</h3>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="corrective">Corrective</option>
            <option value="preventive">Preventive</option>
          </select>
          <input type="number" placeholder="Equipment ID" value={form.equipment_id} onChange={e => setForm({ ...form, equipment_id: Number(e.target.value) })} />
          <button onClick={create}>Create</button>
        </div>
        <div>
          <h3>List</h3>
          <ul>
            {items.map(it => (
              <li key={it.id}>
                {it.name} [{it.type}] {it.is_overdue ? 'OVERDUE' : ''} (Eq: {it.equipment_id}) Stage: {it.stage_id ?? 'New'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
