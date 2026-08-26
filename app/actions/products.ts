"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre es demasiado largo"),
    functional_unit: z
        .string()
        .trim()
        .min(2, "La unidad funcional es obligatoria")
        .max(100, "La unidad funcional es demasiado larga"),
});

export type FormState = { error?: string };

export async function createProduct(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = createProductSchema.safeParse({
        name: formData.get("name"),
        functional_unit: formData.get("functional_unit"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { data, error } = await supabase
        .from("products")
        .insert({ ...parsed.data, status: "draft" })
        .select("id")
        .single();

    if (error) {
        return { error: "No se pudo crear el producto. Intentá de nuevo." };
    }

    revalidatePath("/empresa");
    redirect(`/empresa/${data.id}`);
}
const addItemSchema = z.object({
    product_id: z.string().uuid(),
    emission_factor_id: z.string().uuid("Elegí un material de la lista"),
    type: z.enum(["ingredient", "packaging"]),
    grams: z.coerce
        .number()
        .positive("La cantidad debe ser mayor a cero")
        .max(1000000, "La cantidad es demasiado grande"),
});

export async function addItem(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = addItemSchema.safeParse({
        product_id: formData.get("product_id"),
        emission_factor_id: formData.get("emission_factor_id"),
        type: formData.get("type"),
        grams: formData.get("grams"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { product_id, emission_factor_id, type, grams } = parsed.data;

    // Buscamos el factor actual para congelarlo en el item
    const { data: factor, error: factorError } = await supabase
        .from("emission_factors")
        .select("factor")
        .eq("id", emission_factor_id)
        .single();

    if (factorError || !factor) {
        return { error: "El material seleccionado no existe." };
    }

    const { error } = await supabase.from("product_items").insert({
        product_id,
        emission_factor_id,
        type,
        grams,
        factor_snapshot: factor.factor,
    });

    if (error) {
        return { error: "No se pudo agregar el item. Intentá de nuevo." };
    }

    revalidatePath(`/empresa/${product_id}`);
    return {};
}
const energySchema = z.object({
    product_id: z.string().uuid(),
    kwh_per_batch: z.coerce
        .number()
        .nonnegative("El consumo no puede ser negativo")
        .max(1000000, "El valor es demasiado grande"),
    units_per_batch: z.coerce
        .number()
        .int("Las unidades deben ser un número entero")
        .positive("Las unidades por lote deben ser mayores a cero"),
});

export async function updateEnergy(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = energySchema.safeParse({
        product_id: formData.get("product_id"),
        kwh_per_batch: formData.get("kwh_per_batch"),
        units_per_batch: formData.get("units_per_batch"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { product_id, kwh_per_batch, units_per_batch } = parsed.data;

    const { error } = await supabase
        .from("products")
        .update({ kwh_per_batch, units_per_batch })
        .eq("id", product_id);

    if (error) {
        return { error: "No se pudo guardar el consumo. Intentá de nuevo." };
    }

    revalidatePath(`/empresa/${product_id}`);
    return {};
}
export async function submitForReview(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const productId = formData.get("product_id");
    if (typeof productId !== "string") {
        return { error: "Producto inválido." };
    }

    // Verificamos que el producto este listo para enviarse
    const [{ data: product }, { count }] = await Promise.all([
        supabase
            .from("products")
            .select("kwh_per_batch, units_per_batch, status")
            .eq("id", productId)
            .single(),
        supabase
            .from("product_items")
            .select("*", { count: "exact", head: true })
            .eq("product_id", productId),
    ]);

    if (!product) return { error: "El producto no existe." };

    if (product.status === "pending_review") {
        return { error: "El producto ya está en revisión." };
    }

    if (!count) {
        return { error: "Agregá al menos un ingrediente o packaging antes de enviar." };
    }

    if (product.units_per_batch === null) {
        return { error: "Cargá el consumo eléctrico antes de enviar." };
    }

    const { error } = await supabase
        .from("products")
        .update({ status: "pending_review" })
        .eq("id", productId);

    if (error) {
        return { error: "No se pudo enviar a revisión. Intentá de nuevo." };
    }

    revalidatePath(`/empresa/${productId}`);
    revalidatePath("/empresa");
    revalidatePath("/consultor");
    return {};
}
const reviewSchema = z.object({
    product_id: z.string().uuid(),
    action: z.enum(["approved", "rejected"]),
    comment: z.string().trim().max(500, "El comentario es demasiado largo"),
});

export async function reviewProduct(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = reviewSchema.safeParse({
        product_id: formData.get("product_id"),
        action: formData.get("action"),
        comment: formData.get("comment") ?? "",
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { product_id, action, comment } = parsed.data;

    // La consigna exige comentario obligatorio al devolver
    if (action === "rejected" && comment.length < 5) {
        return { error: "Escribí un comentario explicando qué corregir." };
    }

    const { data: product } = await supabase
        .from("products")
        .select("status")
        .eq("id", product_id)
        .single();

    if (!product) return { error: "El producto no existe." };
    if (product.status !== "pending_review") {
        return { error: "Este producto no está en revisión." };
    }

    const { error: reviewError } = await supabase.from("reviews").insert({
        product_id,
        action,
        comment: comment || null,
    });

    if (reviewError) {
        return { error: "No se pudo guardar la revisión. Intentá de nuevo." };
    }

    const { error: statusError } = await supabase
        .from("products")
        .update({ status: action })
        .eq("id", product_id);

    if (statusError) {
        return { error: "No se pudo actualizar el estado. Intentá de nuevo." };
    }

    revalidatePath("/consultor");
    revalidatePath("/empresa");
    revalidatePath(`/empresa/${product_id}`);
    redirect("/consultor");
}