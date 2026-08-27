import { supabase } from "./supabase";
import { calculateFootprint } from "./carbon";
import type { EmissionFactor, Product, ProductItem, Review } from "./types";

export async function getEmissionFactors(): Promise<EmissionFactor[]> {
    const { data, error } = await supabase
        .from("emission_factors")
        .select("*")
        .neq("category", "energy")
        .order("category")
        .order("name");

    if (error) throw new Error(`No se pudieron leer los factores: ${error.message}`);
    return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(`No se pudieron leer los productos: ${error.message}`);
    return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw new Error(`No se pudo leer el producto: ${error.message}`);
    return data;
}

export async function getProductItems(productId: string): Promise<ProductItem[]> {
    const { data, error } = await supabase
        .from("product_items")
        .select("*")
        .eq("product_id", productId);

    if (error) throw new Error(`No se pudieron leer los items: ${error.message}`);
    return data ?? [];
}

export async function getLastReview(productId: string): Promise<Review | null> {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw new Error(`No se pudo leer la revisión: ${error.message}`);
    return data;
}

type ProductWithFootprint = Product & { footprint: number };

export async function getProductsWithFootprint(): Promise<ProductWithFootprint[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*, product_items(type, grams, factor_snapshot, emission_factors(name))")
        .order("created_at", { ascending: false });

    if (error)
        throw new Error(`No se pudieron leer los productos: ${error.message}`);

    return (data ?? []).map((product) => {
        const { product_items, ...rest } = product;

        const items = (product_items ?? []).map((item: {
            type: "ingredient" | "packaging";
            grams: number;
            factor_snapshot: number;
            emission_factors: { name: string } | { name: string }[] | null;
        }) => {
            const factor = Array.isArray(item.emission_factors)
                ? item.emission_factors[0]
                : item.emission_factors;

            return {
                name: factor?.name ?? "Desconocido",
                type: item.type,
                grams: item.grams,
                factor: item.factor_snapshot,
            };
        });

        const result = calculateFootprint(items, {
            kwhPerBatch: rest.kwh_per_batch ?? 0,
            unitsPerBatch: rest.units_per_batch ?? 0,
        });

        return { ...rest, footprint: result.total } as ProductWithFootprint;
    });
}