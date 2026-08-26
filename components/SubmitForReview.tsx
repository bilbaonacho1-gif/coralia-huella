"use client";

import { useActionState } from "react";
import { submitForReview, type FormState } from "@/app/actions/products";
import type { ProductStatus } from "@/lib/types";

const initialState: FormState = {};

export function SubmitForReview({
    productId,
    status,
    lastComment,
}: {
    productId: string;
    status: ProductStatus;
    lastComment: string | null;
}) {
    const [state, formAction, isPending] = useActionState(
        submitForReview,
        initialState
    );

    if (status === "pending_review") {
        return (
            <div className="bg-surface border border-line rounded-card p-5 text-center">
                <p className="text-accent font-medium">En revisión</p>
                <p className="text-muted text-sm mt-1">
                    Un consultor va a revisar el cálculo.
                </p>
            </div>
        );
    }

    if (status === "approved") {
        return (
            <div className="bg-surface border border-accent-strong/40 rounded-card p-5 text-center">
                <p className="text-accent-strong font-medium">Aprobado</p>
                <p className="text-muted text-sm mt-1">
                    El cálculo fue validado por un consultor.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {status === "rejected" && lastComment && (
                <div className="bg-amber-950/30 border border-amber-900/50 rounded-card p-5">
                    <p className="text-amber-200 font-medium text-sm mb-2">
                        Devuelto para corregir
                    </p>
                    <p className="text-amber-100/80 text-sm leading-relaxed">
                        {lastComment}
                    </p>
                </div>
            )}

            <form action={formAction}>
                <input type="hidden" name="product_id" value={productId} />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-accent-strong text-bg font-medium py-4 rounded-pill
                     transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "Enviando…" : "Enviar a revisión"}
                </button>
                {state.error && (
                    <p role="alert" className="text-sm text-red-300 mt-3 text-center">
                        {state.error}
                    </p>
                )}
            </form>
        </div>
    );
}