import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md mx-auto w-full">
      <header className="mb-12">
        <p className="text-accent text-sm tracking-widest uppercase mb-3">
          Coralia
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-cream">
          Huella de carbono
          <br />
          de producto
        </h1>
        <p className="text-muted mt-4 leading-relaxed">
          Calculá el impacto de tus fórmulas y enviálas a revisión.
        </p>
      </header>

      <nav className="space-y-4" aria-label="Seleccionar rol">
        <RoleCard
          href="/empresa"
          title="Soy empresa"
          description="Cargá tu producto, sus ingredientes y calculá su huella."
        />
        <RoleCard
          href="/consultor"
          title="Soy consultor"
          description="Revisá los productos pendientes y aprobalos o devolvelos."
        />
      </nav>
    </main>
  );
}

function RoleCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-surface border border-line rounded-card p-6
                 transition-colors hover:bg-surface-2
                 focus-visible:outline-2 focus-visible:outline-accent-strong"
    >
      <h2 className="text-xl font-medium text-cream mb-2">{title}</h2>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </Link>
  );
}