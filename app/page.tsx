import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-dvh flex flex-col">
      {/* Foto de fondo, pantalla completa */}
      <Image
        src="/bosque.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/50
                      lg:bg-gradient-to-r lg:from-bg/90 lg:via-bg/50 lg:to-bg/20" />

      {/* Logo arriba a la derecha */}
      <Link
        href="/"
        className="relative self-end p-6 lg:p-10 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/coralia.avif"
          alt="Coralia Environmental"
          width={120}
          height={130}
          className="h-auto"
        />
      </Link>

      {/* Contenido */}
      <main className="relative flex-1 flex flex-col justify-center px-6 pb-12 lg:px-16 xl:px-20">
        <div className="w-full max-w-md mx-auto lg:max-w-3xl">
          <header className="mb-8 lg:mb-10">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.1] text-cream">
              Medí el impacto{" "}
              <span className="text-accent-strong">ambiental</span> de tus
              productos y tomá decisiones con información real.
            </h1>
            <p className="text-muted mt-6 lg:mt-8 lg:text-lg leading-relaxed lg:max-w-md">
              Calculá y gestioná la huella ambiental de tus productos de forma
              simple y confiable.
            </p>
          </header>

          <nav
            className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl"
            aria-label="Seleccionar rol"
          >
            <RoleCard
              href="/empresa"
              title="SOY EMPRESA"
              description="Calculá y gestioná la huella de tus productos."
              icon={<BuildingIcon />}
            />
            <RoleCard
              href="/consultor"
              title="SOY CONSULTOR "
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
      className="group flex items-start gap-4 bg-surface/70 backdrop-blur-md
                 border border-line rounded-card p-5 lg:p-6
                 transition-colors hover:bg-surface-2/80
                 focus-visible:outline-2 focus-visible:outline-accent-strong"
    >
      <span
        aria-hidden="true"
        className="hidden lg:grid shrink-0 place-items-center w-12 h-12 rounded-full
                   border border-accent/30 text-accent"
      >
        {icon}
      </span>

      <span className="flex-1">
        <span className="block text-lg font-medium text-cream mb-0.5">
          {title}
        </span>
        <span className="block text-muted text-sm leading-relaxed">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 grid place-items-center w-10 h-10
                   rounded-full bg-accent-strong text-bg
                   transition-transform group-hover:translate-x-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="8" r="3.5" />
      <path d="M4.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M19 14c1.7 0 3-1.3 3-3 0-1.4-1.1-2.5-3-2.5V14z" />
    </svg>
  );
}