import Link from "next/link";
import { getProducts } from "@/lib/queries";
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
    const products = await getProducts();

    return (
        <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
            <Link href="/" className="text-muted text-sm hover:text-cream">
                ← Inicio
            </Link>

            <header className="mt-6 mb-8">
                <h1 className="text-3xl font-semibold text-cream">Mis productos</h1>
                <p className="text-muted mt-2">
                    {products.length === 0
                        ? "Todavía no creaste ninguno."
                        : "Tocá un producto para ver o editar su huella."}
                </p>
            </header>

            <ul className="space-y-3 mb-8">
                {products.map((p) => (
                    <li key={p.id}>
                        <Link
                            href={`/empresa/${p.id}`}
                            className="block bg-surface border border-line rounded-card p-5
                         transition-colors hover:bg-surface-2
                         focus-visible:outline-2 focus-visible:outline-accent-strong"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-cream font-medium truncate">{p.name}</h2>
                                    <p className="text-muted text-sm mt-1 truncate">
                                        {p.functional_unit}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 text-xs px-3 py-1 rounded-pill ${STATUS_STYLES[p.status]
                                        }`}
                                >
                                    {STATUS_LABELS[p.status]}
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link
                href="/empresa/nuevo"
                className="block w-full text-center bg-accent-strong text-bg font-medium
                   py-4 rounded-pill transition-opacity hover:opacity-90"
            >
                Nuevo producto
            </Link>
        </main>
    );
}