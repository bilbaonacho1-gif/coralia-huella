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