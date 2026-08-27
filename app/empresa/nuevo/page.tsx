"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProduct, type FormState } from "@/app/actions/products";

const initialState: FormState = {};

export default function NuevoProductoPage() {
    const [state, formAction, isPending] = useActionState(
        createProduct,
        initialState
    );

    return (
        <main className="flex-1 flex flex-col justify-center px-6 py-8 lg:py-12 max-w-md mx-auto w-full">
            <Link href="/empresa" className="text-muted text-sm hover:text-cream">
                ← Volver
            </Link>

            <h1 className="text-3xl font-semibold text-cream mt-6 mb-2">
                Nuevo producto
            </h1>
            <p className="text-muted mb-8 leading-relaxed">
                Empezá con el nombre y la unidad funcional. Después vas a poder cargar
                ingredientes, packaging y energía.
            </p>

            <form action={formAction} className="space-y-6">
                <Field
                    label="Nombre del producto"
                    name="name"
                    placeholder="Crema hidratante facial"
                />
                <Field
                    label="Unidad funcional"
                    name="functional_unit"
                    placeholder="1 envase de 200 ml"
                    hint="La cantidad de producto sobre la que se calcula la huella."
                />

                {state.error && (
                    <p
                        role="alert"
                        className="text-sm text-red-300 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3"
                    >
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-accent-strong text-bg font-medium py-4 rounded-pill
                     transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "Creando…" : "Crear producto"}
                </button>
            </form>
        </main>
    );
}

function Field({
    label,
    name,
    placeholder,
    hint,
}: {
    label: string;
    name: string;
    placeholder: string;
    hint?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm text-cream mb-2">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="text"
                placeholder={placeholder}
                className="w-full bg-surface border border-line rounded-2xl px-4 py-3
                   text-cream placeholder:text-muted/60
                   focus:outline-2 focus:outline-accent-strong"
            />
            {hint && <p className="text-xs text-muted mt-2">{hint}</p>}
        </div>
    );
}
