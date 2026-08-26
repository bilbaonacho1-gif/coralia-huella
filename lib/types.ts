export type ProductStatus = "draft" | "pending_review" | "approved" | "rejected";

export type EmissionFactor = {
    id: string;
    name: string;
    category: "ingredient" | "packaging" | "energy";
    factor: number;
    unit: string;
};

export type Product = {
    id: string;
    name: string;
    functional_unit: string;
    status: ProductStatus;
    kwh_per_batch: number | null;
    units_per_batch: number | null;
    created_at: string;
};

export type ProductItem = {
    id: string;
    product_id: string;
    emission_factor_id: string;
    type: "ingredient" | "packaging";
    grams: number;
    factor_snapshot: number;
};

export type Review = {
    id: string;
    product_id: string;
    action: "approved" | "rejected";
    comment: string | null;
    created_at: string;
};