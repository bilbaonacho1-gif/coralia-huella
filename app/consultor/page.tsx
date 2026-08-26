export const dynamic = "force-dynamic";
import Link from "next/link";
import { getProducts } from "@/lib/queries";

export default async function ConsultorPage() {
    const products = await getProducts();
    const pending = products.filter((p) => p.status === "pending_review");

    return (
        <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
            <Link href="/" className="text-muted text-sm hover:text-cream">
                ← Inicio
            </Link>

            <header className="mt-6 mb-8">
                <h1 className="text-3xl font-semibold text-cream">Pendientes</h1>
                <p className="text-muted mt-2">
                    {pending.length === 0
                        ? "No hay productos esperando revisión."
                        : `${pending.length} ${pending.length === 1 ? "producto espera" : "productos esperan"
                        } tu revisión.`}
                </p>
            </header>

            <ul className="space-y-3">
                {pending.map((p) => (
                    <li key={p.id}>
                        <Link
                            href={`/consultor/${p.id}`}
                            className="block bg-surface border border-line rounded-card p-5
                         transition-colors hover:bg-surface-2
                         focus-visible:outline-2 focus-visible:outline-accent-strong"
                        >
                            <h2 className="text-cream font-medium">{p.name}</h2>
                            <p className="text-muted text-sm mt-1">{p.functional_unit}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
