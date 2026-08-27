export const dynamic = "force-dynamic";
import Link from "next/link";
import { getProducts, getReviewHistory } from "@/lib/queries";
import { PageShell } from "@/components/PageShell";

const dateFormat = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export default async function ConsultorPage() {
    const [products, history] = await Promise.all([
        getProducts(),
        getReviewHistory(),
    ]);

    const pending = products.filter((p) => p.status === "pending_review");

    return (
        <PageShell background="/hojas.webp">
            <main className="flex-1 px-6 py-8 lg:px-12 w-full max-w-md lg:max-w-6xl mx-auto lg:mx-0 pb-24">
                <Link href="/" className="text-muted text-sm hover:text-cream">
                    ← Inicio
                </Link>

                <header className="mt-6 mb-8">
                    <h1 className="text-3xl lg:text-4xl font-semibold text-cream">
                        Pendientes
                    </h1>
                    <p className="text-muted mt-2">
                        {pending.length === 0
                            ? "No hay productos esperando revisión."
                            : `${pending.length} ${pending.length === 1
                                ? "producto espera"
                                : "productos esperan"
                            } tu revisión.`}
                    </p>
                </header>

                {pending.length > 0 && (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {pending.map((p) => (
                            <li key={p.id}>
                                <Link
                                    href={`/consultor/${p.id}`}
                                    className="group flex h-full flex-col bg-surface border border-line rounded-card p-6
                             transition-colors hover:bg-surface-2
                             focus-visible:outline-2 focus-visible:outline-accent-strong"
                                >
                                    <h2 className="text-cream font-medium lg:text-lg truncate">
                                        {p.name}
                                    </h2>
                                    <p className="text-muted text-sm mt-1 truncate">
                                        {p.functional_unit}
                                    </p>
                                    <span
                                        aria-hidden="true"
                                        className="mt-auto pt-6 text-muted text-sm self-end transition-transform group-hover:translate-x-1"
                                    >
                                        Revisar →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <details className="group lg:max-w-4xl">
                    <summary
                        className="cursor-pointer list-none inline-flex items-center gap-2
                       bg-surface border border-line rounded-pill px-5 py-3
                       text-cream text-sm transition-colors hover:bg-surface-2
                       focus-visible:outline-2 focus-visible:outline-accent-strong"
                    >
                        <span
                            aria-hidden="true"
                            className="text-accent transition-transform group-open:rotate-90"
                        >
                            ›
                        </span>
                        Ver historial
                        {history.length > 0 && (
                            <span className="text-muted">({history.length})</span>
                        )}
                    </summary>

                    <div className="mt-6">
                        {history.length === 0 ? (
                            <p className="text-muted text-sm">
                                Todavía no revisaste ningún producto.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {history.map((r) => (
                                    <li
                                        key={r.id}
                                        className="bg-surface border border-line rounded-card p-5 lg:p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/consultor/${r.product_id}`}
                                                    className="text-cream font-medium hover:text-accent transition-colors"
                                                >
                                                    {r.product_name}
                                                </Link>
                                                <p className="text-muted text-sm mt-1">
                                                    {r.functional_unit}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-pill ${r.action === "approved"
                                                        ? "bg-accent-strong/20 text-accent-strong"
                                                        : "bg-amber-950/40 text-amber-200"
                                                        }`}
                                                >
                                                    {r.action === "approved"
                                                        ? "Aprobado"
                                                        : "Devuelto"}
                                                </span>
                                                <p className="text-muted text-xs mt-2 tabular-nums">
                                                    {dateFormat.format(new Date(r.created_at))}
                                                </p>
                                            </div>
                                        </div>

                                        {r.comment && (
                                            <p className="text-muted text-sm mt-4 pt-4 border-t border-line leading-relaxed">
                                                {r.comment}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </details>
            </main>
        </PageShell>
    );
}