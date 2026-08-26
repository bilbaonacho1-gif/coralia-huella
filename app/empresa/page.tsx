import { getProducts } from "@/lib/queries";

export default async function EmpresaPage() {
    const products = await getProducts();

    return (
        <main className="p-6">
            <h1 className="text-2xl text-cream mb-4">Productos: {products.length}</h1>
            <pre className="text-muted text-xs">{JSON.stringify(products, null, 2)}</pre>
        </main>
    );
}