import type { CarbonResult } from "@/lib/carbon";

const STAGE_LABELS = {
    ingredients: "Ingredientes",
    packaging: "Packaging",
    manufacturing: "Manufactura",
} as const;

const EMPTY_MESSAGE =
    "Cargá ingredientes, packaging y consumo para ver el desglose.";

export function StageBreakdown({ result }: { result: CarbonResult }) {
    const { total, breakdown } = result;

    if (total === 0) {
        return (
            <>
                <h2 className="text-lg font-medium text-cream mb-3">
                    Desglose por etapa
                </h2>
                <p className="text-muted text-sm">{EMPTY_MESSAGE}</p>
            </>
        );
    }

    const stages = [
        { key: "ingredients", value: breakdown.ingredients },
        { key: "packaging", value: breakdown.packaging },
        { key: "manufacturing", value: breakdown.manufacturing },
    ] as const;

    return (
        <>
            <h2 className="text-lg font-medium text-cream mb-4">Desglose por etapa</h2>
            <ul className="space-y-4">
                {stages.map(({ key, value }) => {
                    const pct = (value / total) * 100;
                    return (
                        <li key={key}>
                            <div className="flex justify-between items-baseline mb-1.5 gap-2">
                                <span className="text-cream text-sm">{STAGE_LABELS[key]}</span>
                                <span className="text-muted text-sm tabular-nums shrink-0">
                                    {value.toFixed(4)}{" "}
                                    <span className="text-accent">({pct.toFixed(1)}%)</span>
                                </span>
                            </div>
                            <div
                                className="h-2 bg-surface-2 rounded-pill overflow-hidden"
                                role="img"
                                aria-label={`${STAGE_LABELS[key]}: ${pct.toFixed(1)} por ciento`}
                            >
                                <div
                                    className="h-full bg-accent-strong rounded-pill transition-all"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export function TopContributors({ result }: { result: CarbonResult }) {
    const { total, top3 } = result;

    if (total === 0) {
        return (
            <>
                <h2 className="text-lg font-medium text-cream mb-3">
                    Mayores contribuyentes
                </h2>
                <p className="text-muted text-sm">{EMPTY_MESSAGE}</p>
            </>
        );
    }

    return (
        <>
            <h2 className="text-lg font-medium text-cream mb-4">
                Mayores contribuyentes
            </h2>
            <ol className="space-y-2">
                {top3.map((c, i) => (
                    <li
                        key={`${c.name}-${i}`}
                        className="flex items-center gap-3 bg-surface-2 border border-line rounded-xl px-4 py-3"
                    >
                        <span className="text-accent font-semibold tabular-nums">
                            {i + 1}
                        </span>
                        <span className="text-cream text-sm flex-1 min-w-0 truncate">
                            {c.name}
                        </span>
                        <span className="text-muted text-sm tabular-nums shrink-0">
                            {c.emissions.toFixed(4)}
                        </span>
                    </li>
                ))}
            </ol>
        </>
    );
}