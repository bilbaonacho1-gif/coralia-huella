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
import { Breakdown } from "@/components/Breakdown";
import { SubmitForReview } from "@/components/SubmitForReview";
import { deleteItem } from "@/app/actions/products";
import { isEditable, type ProductStatus } from "@/lib/types";

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
        <main className="flex-1 px-6 py-8 w-full max-w-md lg:max-w-5xl mx-auto pb-24">
            <Link href="/empresa" className="text-muted text-sm hover:text-cream">
                ← Mis productos
            </Link>

            <header className="mt-6 mb-8">
                <h1 className="text-3xl font-semibold text-cream leading-tight">
                    {product.name}
                </h1>
                <p className="text-muted mt-2">{product.functional_unit}</p>
            </header>

            <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-10 lg:items-start">
                {/* Columna izquierda: resultado */}
                <div className="lg:sticky lg:top-8">
                    <section className="bg-surface border border-line rounded-card p-6 mb-6">
                        <p className="text-muted text-sm mb-1">Huella total</p>
                        <p className="text-4xl font-semibold text-accent">
                            {result.total.toFixed(4)}
                            <span className="text-base text-muted ml-2">
                                kg CO₂e / unidad
                            </span>
                        </p>
                    </section>

                    <div className="mb-8">
                        <Breakdown result={result} />
                    </div>
                </div>

                {/* Columna derecha: carga de datos */}
                <div>
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

                    <div className="mt-8">
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
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-cream mb-1">Manufactura</h2>
                        <p className="text-muted text-sm mb-3">
                            Consumo eléctrico del lote. Se prorratea entre las unidades
                            producidas.
                        </p>
                        <EnergyForm
                            productId={id}
                            kwh={product.kwh_per_batch}
                            units={product.units_per_batch}
                        />
                    </div>

                    <div className="mt-10">
                        <SubmitForReview
                            productId={id}
                            status={product.status}
                            lastComment={lastReview?.comment ?? null}
                        />
                    </div>
                </div>
            </div>
        </main>
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
        <section className="mb-3">
            <h2 className="text-lg font-medium text-cream mb-3">{title}</h2>
            {items.length === 0 ? (
                <p className="text-muted text-sm mb-3">Todavía no cargaste ninguno.</p>
            ) : (
                <ul className="space-y-2 mb-3">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-baseline bg-surface border border-line rounded-xl px-4 py-3"
                        >
                            <span className="text-cream text-sm">
                                {factorName(item.emission_factor_id)}
                            </span>
                            <span className="flex items-baseline gap-3">
                                <span className="text-muted text-sm tabular-nums">
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