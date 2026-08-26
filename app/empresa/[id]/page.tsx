import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductItems, getEmissionFactors } from "@/lib/queries";
import { calculateFootprint } from "@/lib/carbon";
import { AddItemForm } from "@/components/AddItemForm";

export default async function ProductoPage({
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
            <Link href="/empresa" className="text-muted text-sm hover:text-cream">
                ← Mis productos
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

            <Section
                title="Ingredientes"
                items={items.filter((i) => i.type === "ingredient")}
                factorName={factorName}
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
                />
                <AddItemForm
                    productId={id}
                    type="packaging"
                    factors={factors.filter((f) => f.category === "packaging")}
                />
            </div>
        </main>
    );
}

function Section({
    title,
    items,
    factorName,
}: {
    title: string;
    items: {
        id: string;
        emission_factor_id: string;
        grams: number;
        factor_snapshot: number;
    }[];
    factorName: (id: string) => string;
}) {
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
                            <span className="text-muted text-sm tabular-nums">
                                {item.grams} g ·{" "}
                                <span className="text-accent">
                                    {((item.grams / 1000) * item.factor_snapshot).toFixed(4)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}