import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:min-h-dvh relative">
      {/* Imagen: fondo completo en mobile, mitad izquierda en desktop */}
      <div className="absolute inset-0 lg:relative lg:inset-auto">
        <Image
          src="/bosque.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40
                     lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg"
        />
        {/* Logo sobre la foto, solo desktop */}
        <Image
          src="/coralia.avif"
          alt="Coralia Environmental"
          width={96}
          height={107}
          className="hidden lg:block absolute top-10 left-10 z-10"
        />
      </div>

      {/* Contenido */}
      <main className="relative flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-20 min-h-dvh lg:min-h-0">
        <div className="max-w-md w-full mx-auto lg:mx-0 lg:max-w-2xl">
          <header className="mb-10 lg:mb-14">
            <p className="text-accent text-sm tracking-widest uppercase mb-4">
              Coralia
            </p>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] text-cream">
              Huella de carbono
              <br />
              de producto
            </h1>
            <p className="text-muted mt-5 lg:mt-7 lg:text-xl leading-relaxed">
              Medí el impacto ambiental de tus productos y tomá decisiones con
              información real.
            </p>
          </header>

          <nav className="space-y-4 lg:space-y-5" aria-label="Seleccionar rol">
            <RoleCard
              href="/empresa"
              title="Soy empresa"
              description="Calculá y gestioná la huella de tus productos."
              icon={<BuildingIcon />}
            />
            <RoleCard
              href="/consultor"
              title="Soy consultor"
              description="Revisá y aprobá productos pendientes."
              icon={<PersonIcon />}
            />
          </nav>
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 bg-surface/70 backdrop-blur-md
                 border border-line rounded-card p-6 lg:p-10
                 transition-colors hover:bg-surface-2/80
                 focus-visible:outline-2 focus-visible:outline-accent-strong"
    >
      <span
        aria-hidden="true"
        className="hidden lg:grid shrink-0 place-items-center w-16 h-16 rounded-full
                   border border-accent/30 text-accent"
      >
        {icon}
      </span>

      <span className="flex-1">
        <span className="block text-xl lg:text-2xl font-medium text-cream mb-1">
          {title}
        </span>
        <span className="block text-muted text-sm lg:text-base leading-relaxed lg:max-w-xs">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 grid place-items-center w-10 h-10 lg:w-12 lg:h-12
                   rounded-full bg-accent-strong text-bg
                   transition-transform group-hover:translate-x-1"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="11" height="18" rx="1" />
      <line x1="7.5" y1="7" x2="8.5" y2="7" />
      <line x1="11" y1="7" x2="12" y2="7" />
      <line x1="7.5" y1="11" x2="8.5" y2="11" />
      <line x1="11" y1="11" x2="12" y2="11" />
      <line x1="7.5" y1="15" x2="8.5" y2="15" />
      <path d="M18 21c2.5 0 4-2 4-4.5 0-2-1.5-3.5-4-3.5v8z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="8" r="3.5" />
      <path d="M4.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M19 14c1.7 0 3-1.3 3-3 0-1.4-1.1-2.5-3-2.5V14z" />
    </svg>
  );
}