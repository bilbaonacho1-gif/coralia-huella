export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getProduct,
    getProductItems,
    getEmissionFactors,
    getLastReview,
} from "@/lib/queries";
import { calculateFootprint } from "@/lib/carbon";
import { AddItemForm } from "@/components/AddItemForm";
import { EnergyForm } from "@/components/EnergyForm";
import { StageBreakdown, TopContributors } from "@/components/Breakdown";
import { SubmitForReview } from "@/components/SubmitForReview";
import { deleteItem } from "@/app/actions/products";
import { isEditable, type ProductStatus } from "@/lib/types";
import { PageShell } from "@/components/PageShell";

export default async function ProductoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await getProduct(id);
    if (!product) notFound();

    const [items, factors, lastReview] = await Promise.all([
        getProductItems(id),
        getEmissionFactors(),
        getLastReview(id),
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
        <PageShell>
            <main className="flex-1 px-6 py-8 lg:px-12 w-full max-w-md lg:max-w-7xl mx-auto lg:mx-0 pb-24">
                <Link href="/empresa" className="text-muted text-sm hover:text-cream">
                    ← Mis productos
                </Link>

                {/* Fila 1: producto + desglose + top 3 */}
                <div className="mt-5 grid gap-3 lg:gap-4 lg:grid-cols-3 mb-3 lg:mb-4">
                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6 lg:flex lg:flex-col lg:justify-center">
                        <h1 className="text-xl lg:text-2xl font-semibold text-cream leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-muted text-sm mt-1 mb-4 lg:mb-6">
                            {product.functional_unit}
                        </p>

                        <p className="text-muted text-sm mb-1 lg:mb-2">Huella total</p>
                        <p className="text-3xl lg:text-4xl font-semibold text-accent leading-none">
                            {result.total.toFixed(4)}
                        </p>
                        <p className="text-muted text-sm mt-2">kg CO₂e / unidad</p>
                    </section>

                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6">
                        <StageBreakdown result={result} />
                    </section>

                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6">
                        <TopContributors result={result} />
                    </section>
                </div>

                {/* Fila 2: carga de datos en tres columnas */}
                <div className="grid gap-3 lg:gap-4 lg:grid-cols-3 mb-3 lg:mb-4">
                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6">
                        <Section
                            title="Ingredientes"
                            items={items.filter((i) => i.type === "ingredient")}
                            factorName={factorName}
                            status={product.status}
                        />
                        <AddItemForm
                            productId={id}
                            type="ingredient"
                            factors={factors.filter((f) => f.category === "ingredient")}
                        />
                    </section>

                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6">
                        <Section
                            title="Packaging"
                            items={items.filter((i) => i.type === "packaging")}
                            factorName={factorName}
                            status={product.status}
                        />
                        <AddItemForm
                            productId={id}
                            type="packaging"
                            factors={factors.filter((f) => f.category === "packaging")}
                        />
                    </section>

                    <section className="bg-surface border border-line rounded-card p-5 lg:p-6">
                        <h2 className="text-lg font-medium text-cream mb-1">Manufactura</h2>
                        <p className="text-muted text-sm mb-4">
                            Consumo eléctrico del lote. Se prorratea entre las unidades
                            producidas.
                        </p>
                        <EnergyForm
                            productId={id}
                            kwh={product.kwh_per_batch}
                            units={product.units_per_batch}
                        />
                    </section>
                </div>

                {/* Fila 3: estado y revisión */}
                <div>
                    <SubmitForReview
                        productId={id}
                        status={product.status}
                        lastComment={lastReview?.comment ?? null}
                    />
                </div>
            </main>
        </PageShell>
    );
}

function Section({
    title,
    items,
    factorName,
    status,
}: {
    title: string;
    items: {
        id: string;
        emission_factor_id: string;
        grams: number;
        factor_snapshot: number;
    }[];
    factorName: (id: string) => string;
    status: ProductStatus;
}) {
    const editable = isEditable(status);

    return (
        <section className="mb-4">
            <h2 className="text-lg font-medium text-cream mb-3">{title}</h2>
            {items.length === 0 ? (
                <p className="text-muted text-sm mb-3">Todavía no cargaste ninguno.</p>
            ) : (
                <ul className="space-y-2 mb-3">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-baseline gap-2 bg-surface-2 border border-line rounded-xl px-4 py-3"
                        >
                            <span className="text-cream text-sm min-w-0 truncate">
                                {factorName(item.emission_factor_id)}
                            </span>
                            <span className="flex items-baseline gap-2 shrink-0">
                                <span className="text-muted text-xs tabular-nums">
                                    {item.grams} g ·{" "}
                                    <span className="text-accent">
                                        {((item.grams / 1000) * item.factor_snapshot).toFixed(4)}
                                    </span>
                                </span>
                                {editable && (
                                    <form action={deleteItem}>
                                        <input type="hidden" name="itemId" value={item.id} />
                                        <button
                                            type="submit"
                                            aria-label={`Eliminar ${factorName(item.emission_factor_id)}`}
                                            className="text-muted hover:text-accent px-2 -mr-2 text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </form>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
