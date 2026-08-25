// Factor de emisión de la red eléctrica argentina (kg CO2e por kWh)
export const ELECTRICITY_FACTOR = 0.35;

export type ItemType = "ingredient" | "packaging";

export type CarbonItem = {
  name: string;
  type: ItemType;
  grams: number;
  factor: number; // kg CO2e por kg
};

export type EnergyInput = {
  kwhPerBatch: number;
  unitsPerBatch: number;
};

export type Contributor = {
  name: string;
  stage: "ingredients" | "packaging" | "manufacturing";
  emissions: number; // kg CO2e por unidad funcional
};

export type CarbonResult = {
  total: number;
  breakdown: {
    ingredients: number;
    packaging: number;
    manufacturing: number;
  };
  contributors: Contributor[];
  top3: Contributor[];
};

/**
 * Convierte gramos a kilos y multiplica por el factor.
 * El anexo define los factores en kg CO2e/kg, pero la app carga gramos.
 * Esta division por 1000 es el unico lugar donde se hace la conversion.
 */
function itemEmissions(grams: number, factor: number): number {
  return (grams / 1000) * factor;
}

/**
 * Emisiones de manufactura prorrateadas por unidad.
 * (kWh del lote x 0.35) / unidades del lote
 */
function manufacturingEmissions({ kwhPerBatch, unitsPerBatch }: EnergyInput): number {
  if (!unitsPerBatch || unitsPerBatch <= 0) return 0;
  return (kwhPerBatch * ELECTRICITY_FACTOR) / unitsPerBatch;
}

export function calculateFootprint(
  items: CarbonItem[],
  energy: EnergyInput
): CarbonResult {
  const contributors: Contributor[] = items.map((item) => ({
    name: item.name,
    stage: item.type === "ingredient" ? "ingredients" : "packaging",
    emissions: itemEmissions(item.grams, item.factor),
  }));

  const manufacturing = manufacturingEmissions(energy);

  if (manufacturing > 0) {
    contributors.push({
      name: "Manufactura (electricidad)",
      stage: "manufacturing",
      emissions: manufacturing,
    });
  }

  const sumStage = (stage: Contributor["stage"]) =>
    contributors
      .filter((c) => c.stage === stage)
      .reduce((acc, c) => acc + c.emissions, 0);

  const breakdown = {
    ingredients: sumStage("ingredients"),
    packaging: sumStage("packaging"),
    manufacturing,
  };

  const sorted = [...contributors].sort((a, b) => b.emissions - a.emissions);

  return {
    total: breakdown.ingredients + breakdown.packaging + breakdown.manufacturing,
    breakdown,
    contributors: sorted,
    top3: sorted.slice(0, 3),
  };
}