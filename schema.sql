-- Esquema de la base para la mini app de huella de carbono.
-- Correr entero en el SQL Editor de un proyecto Supabase nuevo.
--
-- Nota sobre los tipos: todas las cantidades y factores usan numeric y no
-- double precision. El agua desmineralizada tiene factor 0,0004 y la app
-- muestra cuatro decimales, así que los redondeos de punto flotante serían
-- visibles en el resultado.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table if not exists emission_factors (
    id       uuid primary key default gen_random_uuid(),
    name     text    not null,
    category text    not null check (category in ('ingredient', 'packaging', 'energy')),
    factor   numeric not null,
    unit     text    not null
);

create table if not exists products (
    id              uuid        primary key default gen_random_uuid(),
    name            text        not null,
    functional_unit text        not null,
    status          text        not null default 'draft'
                    check (status in ('draft', 'pending_review', 'approved', 'rejected')),
    kwh_per_batch   numeric,
    units_per_batch numeric,
    created_at      timestamptz not null default now()
);

-- Ingredientes y packaging viven en la misma tabla, con un discriminador:
-- mismas columnas, mismo cálculo, misma validación.
--
-- factor_snapshot congela el factor vigente al momento de cargar el ítem. Si
-- mañana cambia el factor en emission_factors, una revisión ya aprobada sigue
-- siendo auditable con el número que se usó.
create table if not exists product_items (
    id                 uuid    primary key default gen_random_uuid(),
    product_id         uuid    not null references products(id) on delete cascade,
    emission_factor_id uuid    not null references emission_factors(id),
    type               text    not null check (type in ('ingredient', 'packaging')),
    grams              numeric not null check (grams > 0),
    factor_snapshot    numeric not null
);

-- Historial de revisiones. Es una tabla aparte y no una columna en products
-- para que quede el rastro de cada devolución, no solo de la última.
create table if not exists reviews (
    id         uuid        primary key default gen_random_uuid(),
    product_id uuid        not null references products(id) on delete cascade,
    action     text        not null check (action in ('approved', 'rejected')),
    comment    text,
    created_at timestamptz not null default now()
);

create index if not exists product_items_product_id_idx on product_items (product_id);
create index if not exists reviews_product_id_idx       on reviews (product_id);

-- ---------------------------------------------------------------------------
-- Factores de emisión (anexo de la consigna)
-- Valores ilustrativos y aproximados, solo para este ejercicio.
-- ---------------------------------------------------------------------------

insert into emission_factors (name, category, factor, unit) values
    ('Agua desmineralizada',       'ingredient', 0.0004, 'kg CO2e/kg'),
    ('Glicerina vegetal',          'ingredient', 1.80,   'kg CO2e/kg'),
    ('Alcohol cetílico',           'ingredient', 2.50,   'kg CO2e/kg'),
    ('Aceite de girasol',          'ingredient', 1.50,   'kg CO2e/kg'),
    ('Manteca de karité',          'ingredient', 2.00,   'kg CO2e/kg'),
    ('Cera de abeja',              'ingredient', 3.00,   'kg CO2e/kg'),
    ('Ácido cítrico',              'ingredient', 1.40,   'kg CO2e/kg'),
    ('Goma xantana',               'ingredient', 3.20,   'kg CO2e/kg'),
    ('Dióxido de titanio',         'ingredient', 8.50,   'kg CO2e/kg'),
    ('Fenoxietanol (conservante)', 'ingredient', 3.50,   'kg CO2e/kg'),
    ('Fragancia',                  'ingredient', 4.00,   'kg CO2e/kg'),

    ('PET virgen',                 'packaging',  3.40,   'kg CO2e/kg'),
    ('PET reciclado',              'packaging',  1.70,   'kg CO2e/kg'),
    ('Vidrio',                     'packaging',  1.20,   'kg CO2e/kg'),
    ('Polipropileno (tapa)',       'packaging',  2.00,   'kg CO2e/kg'),
    ('Cartón corrugado',           'packaging',  0.90,   'kg CO2e/kg'),

    ('Electricidad — red argentina', 'energy',   0.35,   'kg CO2e/kWh');

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
-- Queda desactivado a propósito. La app no tiene autenticación, así que no hay
-- usuarios contra los cuales escribir políticas, y el único cliente que toca la
-- base es el servidor con la secret key (las credenciales nunca llegan al
-- navegador). Con auth real, el orden sería el inverso.
