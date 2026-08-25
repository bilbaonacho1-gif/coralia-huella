import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("emission_factors")
    .select("name, category, factor")
    .order("category")
    .order("name");

  if (error) {
    return <p className="p-8 text-red-600">Error: {error.message}</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Factores de emisión ({data.length})
      </h1>
      <ul className="space-y-1">
        {data.map((f) => (
          <li key={f.name}>
            {f.name} — {f.category} — {f.factor}
          </li>
        ))}
      </ul>
    </main>
  );
}