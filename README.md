# Huella de carbono de producto — Coralia

Mini app para que una empresa cosmética calcule la huella de carbono de un producto
y un consultor la revise y apruebe.

**Demo:** https://coralia-huella.vercel.app

Stack: Next.js 16 (App Router) · Supabase (Postgres) · Tailwind 4 · Vercel.

## Cómo correrlo

Cloná el repo, corré `npm install` y después `npm run dev`.

Necesita un archivo `.env.local` en la raíz con dos variables de un proyecto de Supabase:
`SUPABASE_URL` con la URL del proyecto, y `SUPABASE_SECRET_KEY` con la secret key del proyecto.

El esquema de la base y los factores del anexo están en `schema.sql`: pegalo en el SQL Editor de un proyecto Supabase nuevo antes de arrancar la app.

## Decisiones

1. **El cálculo no se almacena.** `lib/carbon.ts` es una función pura que se ejecuta al leer. No hay totales guardados que puedan quedar desincronizados de sus ítems.
2. **`factor_snapshot`.** Cada ítem congela el factor de emisión vigente al cargarlo, para que una revisión aprobada siga siendo auditable aunque el factor cambie después.
3. **Ingredientes y packaging en una sola tabla** (`product_items`, con discriminador `type`): mismas columnas, mismo cálculo, misma validación.
4. **`numeric` en lugar de `float`.** El agua desmineralizada tiene factor 0,0004; con punto flotante los redondeos se vuelven visibles a cuatro decimales.
5. **Lectura por Server Components, escritura por Server Actions + Zod.** El navegador nunca habla con Supabase: las credenciales son server-only (sin `NEXT_PUBLIC_`).
6. **RLS desactivado, a propósito.** Sin autenticación no hay usuarios contra los cuales escribir políticas, y el único cliente que toca la base es el servidor con la clave privada. Con auth real, el orden sería el inverso.
7. **`force-dynamic` en las páginas que leen datos**, porque cada acción cambia lo que hay que mostrar y el caché estático daría números viejos.
8. **Borrar ítems solo en `draft` y `rejected`.** No es una función extra: sin poder corregir, el comentario del consultor no tendría salida. El guard está en la Server Action, no solo en la UI.
9. **Formulario de carga siempre visible** en vez de modal: el flujo es repetitivo y en mobile un panel colapsable pelea con el teclado.
10. **Mobile-first real.** Las clases base son las de celular; `lg:` agrega el desktop.

### Limitación conocida

Al aprobar, la inserción en `reviews` y el cambio de estado en `products` son dos operaciones separadas: Supabase no expone transacciones desde el cliente JS. Con más tiempo, iría en una función de Postgres.

## Alcance e interpretaciones

- **Cradle-to-gate**, según lo que excluye la consigna (transporte, uso, fin de vida).
- **Los gramos se interpretan por unidad funcional**; solo la energía se prorratea, que es lo único que el enunciado define explícitamente por lote. Esa asimetría es la ambigüedad principal que encontré.
- **Las cantidades van en gramos** y la conversión desde volumen queda del lado del usuario: las densidades no están en el anexo. Riesgo conocido: cargar ml como si fueran gramos (10 ml de glicerina son 12,6 g, un 26% de diferencia) y la app no puede detectarlo.
- **Sin multiempresa**, todos los productos pertenecen a la única empresa implícita. El selector de rol cambia la vista, no la identidad.
- Los factores del anexo son ilustrativos, no certificados.

Caso validado a mano: glicerina 20 g + PET reciclado 30 g + 10 kWh / 500 u = **0,0940 kg CO₂e por unidad**.

## Uso de IA

- **Antigravity IDE con Gemini** para escribir código.
- **Claude** como mentoría técnica en conversación: discutir decisiones de arquitectura, revisar criterios y encontrar errores antes de escribirlos.
- **ChatGPT** para generar las imágenes de fondo (`bosque.webp`, `hojas.webp`). El logo es el de Coralia, no generado.