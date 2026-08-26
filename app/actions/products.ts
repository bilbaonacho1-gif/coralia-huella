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