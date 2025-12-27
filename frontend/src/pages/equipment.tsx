import { useEffect, useState } from 'react';

interface Equipment {
  id: number; name: string; serial_no?: string; category?: string; location?: string; is_scrapped: boolean;
}

export default function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [form, setForm] = useState({ name: '', serial_no: '', category: '', location: '' });

  useEffect(() => {
    fetch('http://localhost:8000/api/equipment/')
      .then(r => r.json()).then(setItems)
      .catch(console.error);
  }, []);

  const create = async () => {
    const res = await fetch('http://localhost:8000/api/equipment/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const eq = await res.json();
    setItems(prev => [...prev, eq]);
    setForm({ name: '', serial_no: '', category: '', location: '' });
  };

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h2>Equipment</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <h3>Create</h3>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Serial" value={form.serial_no} onChange={e => setForm({ ...form, serial_no: e.target.value })} />
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <button onClick={create}>Create</button>
        </div>
        <div>
          <h3>List</h3>
          <ul>
            {items.map(it => (
              <li key={it.id}>
                {it.name} ({it.serial_no}) - {it.category} @ {it.location} {it.is_scrapped ? ' [SCRAPPED]' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
