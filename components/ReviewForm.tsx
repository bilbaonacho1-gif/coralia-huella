"use client";

import { useActionState } from "react";
import { reviewProduct, type FormState } from "@/app/actions/products";
import type { ProductStatus } from "@/lib/types";

const initialState: FormState = {};

export function ReviewForm({
    productId,
    status,
}: {
    productId: string;
    status: ProductStatus;
}) {
    const [state, formAction, isPending] = useActionState(
        reviewProduct,
        initialState
    );

    if (status !== "pending_review") {
        return (
            <div className="bg-surface border border-line rounded-card p-5 text-center">
                <p className="text-muted text-sm">
                    Este producto ya fue revisado.
                </p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="product_id" value={productId} />

            <div>
                <label htmlFor="comment" className="block text-sm text-cream mb-2">
                    Comentario
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    maxLength={500}
                    placeholder="Obligatorio si devolvés el producto."
                    className="w-full bg-surface border border-line rounded-2xl px-4 py-3
                     text-cream placeholder:text-muted/60 resize-none
                     focus:outline-2 focus:outline-accent-strong"
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    name="action"
                    value="rejected"
                    disabled={isPending}
                    className="flex-1 border border-amber-700/60 text-amber-200 font-medium py-4
                     rounded-pill transition-colors hover:bg-amber-950/30
                     disabled:opacity-50"
                >
                    Devolver
                </button>
                <button
                    type="submit"
                    name="action"
                    value="approved"
                    disabled={isPending}
                    className="flex-1 bg-accent-strong text-bg font-medium py-4 rounded-pill
                     transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    Aprobar
                </button>
            </div>

            {state.error && (
                <p role="alert" className="text-sm text-red-300 text-center">
                    {state.error}
                </p>
            )}
        </form>
    );
}