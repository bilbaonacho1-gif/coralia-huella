export const dynamic = "force-dynamic";
import Link from "next/link";
import { getProductsWithFootprint } from "@/lib/queries";
import type { ProductStatus } from "@/lib/types";

const STATUS_LABELS: Record<ProductStatus, string> = {
    draft: "Borrador",
    pending_review: "En revisión",
    approved: "Aprobado",
    rejected: "Devuelto",
};

const STATUS_STYLES: Record<ProductStatus, string> = {
    draft: "bg-surface-2 text-muted",
    pending_review: "bg-accent/15 text-accent",
    approved: "bg-accent-strong/20 text-accent-strong",
    rejected: "bg-amber-950/40 text-amber-200",
};

export default async function EmpresaPage() {
    const products = await getProductsWithFootprint();

    return (
        <main className="flex-1 px-6 py-8 lg:px-12 lg:py-12 max-w-md mx-auto lg:max-w-none lg:mx-0 w-full">
            <Link href="/" className="text-muted text-sm hover:text-cream">
                ← Inicio
            </Link>

            <header className="mt-6 mb-8 lg:mb-10 lg:flex lg:items-end lg:justify-between lg:gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-semibold text-cream">
                        Productos
                    </h1>
                    <p className="text-muted mt-2">
                        {products.length === 0
                            ? "Todavía no creaste ninguno."
                            : "Tocá un producto para ver o editar su huella."}
                    </p>
                </div>

                <Link
                    href="/empresa/nuevo"
                    className="hidden lg:inline-flex items-center gap-2 shrink-0
                     bg-accent-strong text-bg font-medium px-6 py-3 rounded-pill
                     transition-opacity hover:opacity-90
                     focus-visible:outline-2 focus-visible:outline-accent-strong"
                >
                    <span aria-hidden="true" className="text-lg leading-none">
                        +
                    </span>
                    Nuevo producto
                </Link>
            </header>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {products.map((p) => (
                    <li key={p.id}>
                        <Link
                            href={`/empresa/${p.id}`}
                            className="group flex h-full flex-col bg-surface border border-line rounded-card
                         p-6 transition-colors hover:bg-surface-2
                         focus-visible:outline-2 focus-visible:outline-accent-strong"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-cream font-medium lg:text-lg min-w-0 truncate">
                                    {p.name}
                                </h2>
                                <span
                                    className={`shrink-0 text-xs px-3 py-1 rounded-pill ${STATUS_STYLES[p.status]}`}
                                >
                                    {STATUS_LABELS[p.status]}
                                </span>
                            </div>

                            <p className="text-muted text-sm mt-2 truncate">
                                {p.functional_unit}
                            </p>

                            <div className="mt-auto pt-6 border-t border-line flex items-center justify-end gap-3">
                                <span className="text-accent text-sm tabular-nums">
                                    {p.footprint.toFixed(4)}
                                    <span className="text-muted ml-1">kg CO₂e / u</span>
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="text-muted transition-transform group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link
                href="/empresa/nuevo"
                className="block lg:hidden w-full text-center bg-accent-strong text-bg font-medium
                   py-4 rounded-pill transition-opacity hover:opacity-90"
            >
                Nuevo producto
            </Link>
        </main>
    );
}
