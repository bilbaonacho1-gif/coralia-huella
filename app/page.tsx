export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-semibold text-cream">Prueba de tokens</h1>
      <p className="text-muted">Texto secundario</p>
      <div className="bg-surface border border-line rounded-card p-6">
        <p className="text-accent">Card sobre superficie</p>
      </div>
      <button className="bg-accent-strong text-bg px-6 py-3 rounded-pill font-medium">
        Botón de acción
      </button>
    </main>
  );
}