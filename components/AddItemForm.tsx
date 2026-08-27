"use client";

import { useActionState, useRef, useEffect } from "react";
import { addItem, type FormState } from "@/app/actions/products";
import type { EmissionFactor } from "@/lib/types";

const initialState: FormState = {};

export function AddItemForm({
    productId,
    type,
    factors,
}: {
    productId: string;
    type: "ingredient" | "packaging";
    factors: EmissionFactor[];
}) {
    const [state, formAction, isPending] = useActionState(addItem, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // Limpiamos el formulario despues de un guardado exitoso
    useEffect(() => {
        if (!isPending && !state.error) formRef.current?.reset();
    }, [isPending, state]);

    const label = type === "ingredient" ? "ingrediente" : "material";

    return (
        <form
            ref={formRef}
            action={formAction}
            className="bg-surface border border-line rounded-2xl p-4 space-y-3"
        >
            <input type="hidden" name="product_id" value={productId} />
            <input type="hidden" name="type" value={type} />

            <select
                name="emission_factor_id"
                defaultValue=""
                required
                className="w-full bg-surface-2 border border-line rounded-xl px-3 py-3
                   text-cream focus:outline-2 focus:outline-accent-strong"
            >
                <option value="" disabled>
                    Elegí un {label}…
                </option>
                {factors.map((f) => (
                    <option key={f.id} value={f.id}>
                        {f.name} — {f.factor} kg CO₂e/kg
                    </option>
                ))}
            </select>

            <div className="flex gap-2">
                <input
                    name="grams"
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputMode="decimal"
                    placeholder="Gramos"
                    required
                    className="flex-1 min-w-0 bg-surface-2 border border-line rounded-xl px-3 py-3
                     text-cream placeholder:text-muted/60
                     focus:outline-2 focus:outline-accent-strong"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 bg-accent-strong text-bg font-medium px-4 rounded-xl
                     transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "…" : "Agregar"}
                </button>
            </div>

            {state.error && (
                <p role="alert" className="text-sm text-red-300">
                    {state.error}
                </p>
            )}
        </form>
    );
}