export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductItems, getEmissionFactors } from "@/lib/queries";
import { calculateFootprint } from "@/lib/carbon";
import { StageBreakdown, TopContributors } from "@/components/Breakdown";
import { ReviewForm } from "@/components/ReviewForm";
import { PageShell } from "@/components/PageShell";

export default async function RevisarPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await getProduct(id);
    if (!product) notFound();

    const [items, factors] = await Promise.all([
        getProductItems(id),
        getEmissionFactors(),
    ]);

    const factorName = (factorId: string) =>
        factors.find((f) => f.id === factorId)?.name ?? "Desconocido";

    const result = calculateFootprint(
        items.map((item) => ({
            name: factorName(item.emission_factor_id),
            type: item.type,
            grams: item.grams,
            factor: item.factor_snapshot,
        })),
        {
            kwhPerBatch: product.kwh_per_batch ?? 0,
            unitsPerBatch: product.units_per_batch ?? 0,
        }
    );

    return (
        <PageShell background="/hojas.webp">
            <main className="flex-1 px-6 py-8 lg:px-12 w-full max-w-md lg:max-w-7xl mx-auto lg:mx-0 pb-24">
                <Link href="/consultor" className="text-muted text-sm hover:text-cream">
                    ← Pendientes
                </Link>

                {/* Fila 1: producto + desglose + top 3 */}
                <div className="mt-6 grid gap-4 lg:grid-cols-3 mb-4">
                    <section className="bg-surface border border-line rounded-card p-6 flex flex-col justify-center">
                        <h1 className="text-2xl font-semibold text-cream leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-muted text-sm mt-1 mb-6">
                            {product.functional_unit}
                        </p>

                        <p className="text-muted text-sm mb-2">Huella total</p>
                        <p className="text-4xl font-semibold text-accent leading-none">
                            {result.total.toFixed(4)}
                        </p>
                        <p className="text-muted text-sm mt-2">kg CO₂e / unidad</p>
                    </section>

                    <section className="bg-surface border border-line rounded-card p-6">
                        <StageBreakdown result={result} />
                    </section>

                    <section className="bg-surface border border-line rounded-card p-6">
                        <TopContributors result={result} />
                    </section>
                </div>

                {/* Fila 2: receta + formulario de revisión */}
                <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                    <section className="bg-surface border border-line rounded-card p-6">
                        <h2 className="text-lg font-medium text-cream mb-4">
                            Receta cargada
                        </h2>
                        <ul className="space-y-2">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex justify-between items-baseline gap-3 bg-surface-2 border border-line rounded-xl px-4 py-3"
                                >
                                    <span className="text-cream text-sm min-w-0">
                                        {factorName(item.emission_factor_id)}
                                        <span className="text-muted ml-2 text-xs">
                                            {item.type === "ingredient"
                                                ? "ingrediente"
                                                : "packaging"}
                                        </span>
                                    </span>
                                    <span className="text-muted text-sm tabular-nums shrink-0">
                                        {item.grams} g × {item.factor_snapshot}
                                    </span>
                                </li>
                            ))}
                            <li className="flex justify-between items-baseline gap-3 bg-surface-2 border border-line rounded-xl px-4 py-3">
                                <span className="text-cream text-sm">
                                    Electricidad
                                    <span className="text-muted ml-2 text-xs">manufactura</span>
                                </span>
                                <span className="text-muted text-sm tabular-nums shrink-0">
                                    {product.kwh_per_batch} kWh ÷ {product.units_per_batch} u.
                                </span>
                            </li>
                        </ul>
                    </section>

                    <div>
                        <ReviewForm productId={id} status={product.status} />
                    </div>
                </div>
            </main>
        </PageShell>
    );
}