export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductItems, getEmissionFactors } from "@/lib/queries";
import { calculateFootprint } from "@/lib/carbon";
import { Breakdown } from "@/components/Breakdown";
import { ReviewForm } from "@/components/ReviewForm";

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
        <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full pb-24">
            <Link href="/consultor" className="text-muted text-sm hover:text-cream">
                ← Pendientes
            </Link>

            <header className="mt-6 mb-8">
                <h1 className="text-3xl font-semibold text-cream leading-tight">
                    {product.name}
                </h1>
                <p className="text-muted mt-2">{product.functional_unit}</p>
            </header>

            <section className="bg-surface border border-line rounded-card p-6 mb-6">
                <p className="text-muted text-sm mb-1">Huella total</p>
                <p className="text-4xl font-semibold text-accent">
                    {result.total.toFixed(4)}
                    <span className="text-base text-muted ml-2">kg CO₂e / unidad</span>
                </p>
            </section>

            <div className="mb-8">
                <Breakdown result={result} />
            </div>

            <section className="mb-8">
                <h2 className="text-lg font-medium text-cream mb-3">Receta cargada</h2>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-baseline bg-surface border border-line rounded-xl px-4 py-3"
                        >
                            <span className="text-cream text-sm">
                                {factorName(item.emission_factor_id)}
                                <span className="text-muted ml-2 text-xs">
                                    {item.type === "ingredient" ? "ingrediente" : "packaging"}
                                </span>
                            </span>
                            <span className="text-muted text-sm tabular-nums">
                                {item.grams} g × {item.factor_snapshot}
                            </span>
                        </li>
                    ))}
                    <li className="flex justify-between items-baseline bg-surface border border-line rounded-xl px-4 py-3">
                        <span className="text-cream text-sm">
                            Electricidad
                            <span className="text-muted ml-2 text-xs">manufactura</span>
                        </span>
                        <span className="text-muted text-sm tabular-nums">
                            {product.kwh_per_batch} kWh ÷ {product.units_per_batch} u.
                        </span>
                    </li>
                </ul>
            </section>

            <ReviewForm productId={id} status={product.status} />
        </main>
    );
}