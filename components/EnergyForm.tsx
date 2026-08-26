"use client";

import { useActionState } from "react";
import { updateEnergy, type FormState } from "@/app/actions/products";

const initialState: FormState = {};

export function EnergyForm({
    productId,
    kwh,
    units,
}: {
    productId: string;
    kwh: number | null;
    units: number | null;
}) {
    const [state, formAction, isPending] = useActionState(
        updateEnergy,
        initialState
    );

    return (
        <form
            action={formAction}
            className="bg-surface border border-line rounded-2xl p-4 space-y-3"
        >
            <input type="hidden" name="product_id" value={productId} />

            <div className="flex gap-3">
                <label className="flex-1">
                    <span className="block text-xs text-muted mb-1">kWh por lote</span>
                    <input
                        name="kwh_per_batch"
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        defaultValue={kwh ?? ""}
                        placeholder="10"
                        required
                        className="w-full bg-surface-2 border border-line rounded-xl px-3 py-3
                       text-cream placeholder:text-muted/60
                       focus:outline-2 focus:outline-accent-strong"
                    />
                </label>
                <label className="flex-1">
                    <span className="block text-xs text-muted mb-1">Unidades por lote</span>
                    <input
                        name="units_per_batch"
                        type="number"
                        step="1"
                        min="1"
                        inputMode="numeric"
                        defaultValue={units ?? ""}
                        placeholder="500"
                        required
                        className="w-full bg-surface-2 border border-line rounded-xl px-3 py-3
                       text-cream placeholder:text-muted/60
                       focus:outline-2 focus:outline-accent-strong"
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent-strong text-bg font-medium py-3 rounded-xl
                   transition-opacity hover:opacity-90 disabled:opacity-50"
            >
                {isPending ? "Guardando…" : "Guardar consumo"}
            </button>

            {state.error && (
                <p role="alert" className="text-sm text-red-300">
                    {state.error}
                </p>
            )}
        </form>
    );
}