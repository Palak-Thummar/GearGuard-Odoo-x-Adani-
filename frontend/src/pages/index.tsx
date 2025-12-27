import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>GearGuard Maintenance</h1>
      <p>Full-stack demo (Next.js + FastAPI).</p>
      <ul>
        <li><Link href="/equipment">Equipment</Link></li>
        <li><Link href="/requests">Requests</Link></li>
      </ul>
      <p style={{ marginTop: 16 }}>Backend: http://localhost:8000</p>
    </main>
  );
}
