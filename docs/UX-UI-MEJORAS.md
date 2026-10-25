# Informe UX/UI — DJ landing (responsive mobile + desktop)

> **Para la IA ejecutora:** este documento es una lista de tareas atómicas.
> Ejecutalas **en orden**, una por commit. Cada tarea indica archivo, líneas
> aproximadas (pueden variar ±5 tras ediciones previas), el cambio exacto y el
> criterio de aceptación. **No modifiques nada fuera de lo indicado.**
> No toques `src/lib/**/*Vanilla.ts` ni las variantes `.vue/.svelte/.solid/.preact`.

---

## 0. Contexto técnico (leer antes de empezar)

- Stack: **Next.js 16 (App Router) + React 19 + Tailwind CSS v4** (`@import "tailwindcss"` en `src/app/globals.css`, sin `tailwind.config`). Clases como `max-w-55`, `size-4.5`, `aspect-4/3` son válidas en v4.
- El proyecto es un fork de la plantilla **Canvas UI**. La web real del producto es **solo la home `/`**:
  - [`src/app/page.tsx`](../src/app/page.tsx) → renderiza `<HexFloat>` (efecto WebGL de hexágonos) envolviendo `<MockSite />`.
  - [`src/components/playground/mock-site.tsx`](../src/components/playground/mock-site.tsx) → todo el contenido de la landing (header, hero, features, pricing, footer). **Es un Server Component** (no tiene `"use client"`).
  - [`src/lib/HexFloat/HexFloat.tsx`](../src/lib/HexFloat/HexFloat.tsx) → wrapper React del efecto; contiene un **scroll custom** (wheel/touch/teclado/scrollbar falsa).
- `MockSite` también se usa en `/playground` (entries). Los cambios deben ser compatibles: **no cambies la firma de props** de `MockSite` (`heroMedia`, `heroBleed`, `copy`).
- El sitio está forzado a **modo oscuro** (`className="dark"` en `<html>`).
- El efecto html-in-canvas solo funciona en Chrome desktop con flag/origin-trial. **En mobile (Safari/Chrome Android) siempre se usa el fallback** (`native === false` en `HexFloat.tsx`). Esto es clave para la tarea P0-3.
- Verificación: `npm run dev` y revisar en DevTools con viewports **375×667, 390×844, 768×1024, 1280×800, 1440×900**. Al final correr `npm run lint` y `npm run build`.

## 0.1 Decisiones previas (el humano debe completar antes de ejecutar)

Si un valor no fue completado, usar el **default** indicado.

| Clave | Default | Valor elegido |
|---|---|---|
| `BRAND_NAME` (nombre único de marca) | `DJ EZe` | |
| `SITE_URL` (URL de producción de esta landing) | `https://free-ai-dj-mixing-console.vercel.app` | |
| `APP_URL` (URL de la consola a la que apuntan los CTA) | `https://free-ai-dj-mixing-console.vercel.app/` | |
| `CTA_NEW_TAB` (¿CTA abren pestaña nueva?) | `false` (misma pestaña) | |
| `PRESS_SECTION` (`remove` / `tech-badges`) | `tech-badges` | |
| `TEMPLATE_ROUTES` (`keep-noindex` / `delete`) | `keep-noindex` | |

---

## Diagnóstico resumido (evidencia de auditoría visual)

| # | Problema | Viewport | Severidad |
|---|---|---|---|
| 1 | Doble header en mobile: barra fija con logo **"Canvas UI"** + menú de docs de la plantilla, encima del header real "DJ Pulse AI" | Mobile/Tablet (<1024px) | 🔴 Crítico |
| 2 | Marca inconsistente: título "DJ EZe 🎧", logo "DJ Pulse AI", barra "Canvas UI", metadata/OG "Canvas UI" | Todos | 🔴 Crítico |
| 3 | Sin navegación en mobile: los links del header se ocultan `< md` y no hay menú hamburguesa | Mobile | 🔴 Crítico |
| 4 | Scroll custom duplica el desplazamiento en el fallback (wheel/touch se suman al scroll nativo) y la scrollbar falsa tapa 12px del borde derecho en touch | Mobile + Firefox/Safari | 🔴 Crítico |
| 5 | Links muertos: "Features", "Party Rooms", "Pricing", "Sign in" y casi todo el footer son `<button>` sin acción | Todos | 🟠 Alto |
| 6 | Card con borde + `rounded-3xl` + padding lateral desperdicia ~40px de ancho en mobile | Mobile | 🟠 Alto |
| 7 | Imagen hero (LCP) con `loading="lazy"` y alt "Showcase"; en mobile la captura de la consola es ilegible | Todos / Mobile | 🟠 Alto |
| 8 | Targets táctiles < 44px (botones header, links footer) | Mobile | 🟠 Alto |
| 9 | Stats en 1 columna con mucho espacio vacío; footer 3 columnas apretado | Mobile | 🟡 Medio |
| 10 | Sección "Featured in" con medios falsos (DJ Mag, Mixmag…) — riesgo legal/confianza | Todos | 🟡 Medio |
| 11 | Contraste bajo (`text-muted-foreground/70`) en press y fine print | Todos | 🟡 Medio |
| 12 | Pricing: "$0/month", sin badge en plan destacado, ícono ⚡ como check | Todos | 🟢 Bajo |
| 13 | Rutas de plantilla (/docs, /components, /playground, /celebrate, /privacy) siguen indexables | SEO | 🟢 Bajo |

---

## P0 — Críticos

### P0-1. Eliminar el header de plantilla "Canvas UI" de la home

**Archivo:** `src/app/page.tsx`

1. Borrar el bloque completo de las líneas ~21-33 (el `<div className="fixed top-0 right-0 left-0 z-40 ... lg:hidden">` con `<Image src="/logo.svg">` y `<DocsMobileNav />`).
2. Borrar los imports que quedan sin uso: `Image` (`next/image`), `Link` (`next/link`), `DocsMobileNav`, y el comentario `// import { DocsSidebar } ...` y `{/* <DocsSidebar /> */}`.
3. En el wrapper del contenido (línea ~56) cambiar:
   ```diff
   - <div className="min-h-full bg-background px-5 pt-20 pb-10 sm:px-8">
   + <div className="min-h-full bg-background pb-0 sm:px-8 sm:pt-8 sm:pb-10">
   ```

**Aceptación:** en 390px no aparece "Canvas UI" ni un segundo header; el primer elemento visible es el header de la marca. En desktop no cambia nada visualmente salvo el padding.

---

### P0-2. Unificar marca y metadata

**Archivo nuevo:** `src/config/site.ts`
```ts
export const SITE = {
  name: "<BRAND_NAME>",
  url: "<SITE_URL>",
  appUrl: "<APP_URL>",
  ctaNewTab: <CTA_NEW_TAB>,
  description:
    "Free AI DJ mixing console in your browser: real-time stem separation, harmonic beatmatching and live party rooms.",
} as const;
```

**Archivo:** `src/components/playground/mock-site.tsx`
- En `MOCK_SITE_COPY[0]` (línea ~341) cambiar `brand: "DJ Pulse AI"` → `brand: SITE.name` e importar `SITE`.
- En `footerFinePrint` (línea ~419) reemplazar `"© 2026 DJ Pulse AI. ..."` por `` `© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.` ``.
- Reemplazar **todas** las ocurrencias literales de `"https://free-ai-dj-mixing-console.vercel.app/"` por `SITE.appUrl`.
- **No** tocar `MOCK_SITE_COPY[1]` (lo usa el playground).

**Archivo:** `src/app/layout.tsx` (líneas ~10-64)
- `SITE_URL` → `SITE.url`; `DESCRIPTION` → `SITE.description`.
- `title.default` → `` `${SITE.name} — Free AI DJ Mixing Console` ``; `title.template` → `` `%s | ${SITE.name}` ``.
- `applicationName`, `openGraph.siteName`, `openGraph.images[0].alt` → `SITE.name`.
- `keywords` → reemplazar la lista por: `["ai dj", "dj mixing console", "online dj mixer", "stem separation", "beatmatching", "web dj", "free dj software"]`.
- Quitar `authors`, `creator`, `twitter.site`, `twitter.creator` (son del autor de la plantilla) o reemplazarlos por los del dueño.
- `viewport`: dejar un único `themeColor: "#0a0a0a"` (el sitio es siempre dark) y agregar `viewportFit: "cover"`.

**Archivo:** `src/app/page.tsx` — metadata (líneas ~10-14):
```ts
export const metadata: Metadata = {
  title: { absolute: `${SITE.name} 🎧 — Free AI DJ Mixing Console` },
  description: SITE.description,
  alternates: { canonical: "/" },
};
```

**Archivo:** `public/site.webmanifest` → `name`/`short_name` = `BRAND_NAME`, `theme_color`/`background_color` = `#0a0a0a`.

> ⚠️ `public/og.png`, `favicon.svg`, `logo.svg` son de Canvas UI. Dejar anotado como TODO para el humano (requiere diseño); no generarlos.

**Aceptación:** `grep -ri "canvas ui\|canvasui.dev\|DJ Pulse" src/app/layout.tsx src/app/page.tsx src/components/playground/mock-site.tsx` → sin resultados (excepto en `MOCK_SITE_COPY[1]` si aplica).

---

### P0-3. Arreglar el scroll custom de `HexFloat` (mobile y navegadores sin html-in-canvas)

**Archivo:** `src/lib/HexFloat/HexFloat.tsx`

Problemas actuales:
- Los handlers `onWheel` y `onTouchMove` hacen `content.scrollTop += dy` **además** del scroll nativo del `<div overflowY: auto>` → en el fallback (todo mobile) el scroll va al doble de velocidad y se pierde la inercia natural.
- `window.addEventListener("resize", () => ...)` y `content.addEventListener("scroll", () => ...)` usan funciones anónimas → **nunca se remueven** (leak).
- `thumbState.height` se lee dentro de un `useEffect(..., [])` → valor congelado (stale closure).
- `onKeyDown` hace `preventDefault()` en **Espacio** aunque el foco esté en un `<a>`/`<button>` → rompe la activación por teclado.
- La pista de la scrollbar (`fixed right-0 w-3 z-50`) intercepta toques en el borde derecho en pantallas táctiles.

Cambios:
1. Mover `native` a un ref para leerlo en el efecto, y **solo registrar `wheel`, `touchstart`, `touchmove` cuando `native === true`**. Agregar `native` a las deps del efecto de scroll (cambiar `}, []);` por `}, [native]);`).
2. Declarar handlers con nombre para scroll y resize:
   ```ts
   const onScroll = () => updateScrollbar(true);
   const onResize = () => updateScrollbar(false);
   content.addEventListener("scroll", onScroll, { passive: true });
   window.addEventListener("resize", onResize);
   // cleanup:
   content.removeEventListener("scroll", onScroll);
   window.removeEventListener("resize", onResize);
   ```
3. Reemplazar `thumbState.height` dentro del efecto por un `thumbHeightRef` (`useRef(48)`) actualizado en `updateScrollbar`.
4. En `onKeyDown`, salir temprano también si `active?.tagName` es `"BUTTON"` o `"A"`, o si `e.metaKey || e.ctrlKey || e.altKey`.
5. Ocultar la scrollbar falsa en dispositivos táctiles: en el `<div ref={trackRef}>` cambiar la clase a
   `"fixed top-0 right-0 bottom-0 z-50 hidden w-3 cursor-pointer select-none [@media(pointer:fine)]:block"`.
6. Agregar `scrollBehavior: "smooth"` y `overscrollBehavior: "contain"` al `style` de **ambos** `<div ref={contentRef}>` (necesario para P1-1 anchors).

**Aceptación:**
- En DevTools modo dispositivo (390×844, touch): un swipe desplaza lo mismo que en cualquier web normal, con inercia; no aparece scrollbar blanca.
- En Firefox desktop la rueda desplaza a velocidad normal (no doble).
- Tab hasta un botón + Espacio lo activa sin hacer scroll.

---

### P0-4. Menú de navegación mobile dentro de `MockSite`

**Archivo nuevo:** `src/components/site/mock-site-mobile-nav.tsx` (`"use client"`)

Requisitos:
- Props: `links: { label: string; href?: string }[]`, `cta: { label: string; href: string }`.
- Botón hamburguesa `md:hidden`, **44×44px** (`grid size-11 place-items-center rounded-full border border-border/70`), íconos `Menu`/`X` de `lucide-react`, `aria-expanded`, `aria-controls="mock-mobile-menu"`, `aria-label` dinámico.
- Panel **renderizado inline** (NO usar `createPortal`: el contenido vive dentro del canvas del efecto) con `absolute inset-x-0 top-full z-20` bajo el header, fondo `bg-background/95 backdrop-blur-xl`, borde inferior, links en columna con `min-h-11 px-6 text-base`, y el CTA a ancho completo al final.
- Cerrar al: clickear un link, presionar `Escape`, clickear fuera.
- Animación: reutilizar exactamente el patrón de transición de `src/components/landing/mobile-menu.tsx` (opacity + translate, `motion-reduce:transition-none`).

**Archivo:** `src/components/playground/mock-site.tsx` — header (líneas ~525-569):
- Agregar `relative` al `<header>`.
- Insertar `<MockSiteMobileNav links={...} cta={{ label: copy.navCta, href: SITE.appUrl }} />` como último hijo del `<div className="flex items-center gap-2">`.
- Los `href` de los links se definen en P1-1.

**Aceptación:** en 390px aparece el botón hamburguesa a la derecha del CTA; abre un panel con los 5 links + CTA; en ≥768px el botón no se ve y el nav desktop sigue igual.

---

## P1 — Altos

### P1-1. Convertir links muertos en anclas reales

**Archivo:** `src/components/playground/mock-site.tsx`

1. Agregar `id` + `scroll-mt-6` a las secciones:
   - Sección "showcase" (línea ~598) → `id="console"`
   - Sección features/"howEyebrow" (línea ~625) → `id="features"`
   - Sección gallery (línea ~689) → `id="community"`
   - Sección pricing (línea ~710) → `id="pricing"`
2. Crear un mapa único (arriba del componente) y usarlo tanto en desktop como en `MockSiteMobileNav`:
   ```ts
   const NAV_HREFS: Record<string, string> = {
     Console: SITE.appUrl, Studio: SITE.appUrl,
     "AI Stems": "#features", Features: "#features",
     "Party Rooms": "#community", Pricing: "#pricing",
   };
   ```
   Reemplazar los ternarios repetidos de las líneas ~536-549 por `href={NAV_HREFS[label]}`; `target`/`rel` solo si el href empieza con `http` **y** `SITE.ctaNewTab` es `true`.
3. "Sign in" (línea ~557): si no existe login, **eliminar** el elemento. Si existe, darle `href={SITE.appUrl}`.
4. Footer (líneas ~800-827): reemplazar los tres ternarios por un mapa `FOOTER_HREFS` (Console/AI Stems/Stem Extractor → `SITE.appUrl`, Party Rooms → `#community`, Documentation → `#features`, Discord → TODO). Los links **sin destino** deben renderizarse como `<span>` de texto (no `<button>`), con `text-muted-foreground/60`.
5. En `MockLink`, cuando no hay `href`, renderizar `<span>` en vez de `<button>` (un botón sin acción es un problema de accesibilidad).
6. Agregar a `MockLink` estados de foco: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground`.

**Aceptación:** click en "Pricing" hace scroll suave hasta la sección de precios (desktop y desde el menú mobile). Ningún `<button>` sin `onClick` queda en el DOM de la home.

---

### P1-2. Layout edge-to-edge en mobile

**Archivo:** `src/components/playground/mock-site.tsx` (línea ~521)
```diff
- className={`mx-auto w-full max-w-5xl rounded-3xl border border-border/60 bg-background shadow-sm ${
+ className={`mx-auto w-full max-w-5xl border-border/60 bg-background sm:rounded-3xl sm:border sm:shadow-sm ${
```
- Header (línea ~525): `px-6 py-4` → `px-5 py-3 sm:px-10 sm:py-4`. Agregar `pt-[max(0.75rem,env(safe-area-inset-top))]` para notch.
- Todas las secciones con `px-6` → `px-5` (mantener `sm:px-10`).
- Showcase (línea ~598): `px-4 sm:px-6` → `px-3 sm:px-6`.

**Aceptación:** en 390px el contenido usa todo el ancho, sin borde redondeado exterior; en ≥640px se ve la card igual que hoy.

---

### P1-3. Hero: CTAs, LCP y legibilidad

**Archivo:** `src/components/playground/mock-site.tsx`
1. H1 (línea ~572): `text-4xl` → `text-[2.5rem] leading-[1.05] sm:text-6xl`. Sección (línea ~571): `pt-16` → `pt-12 sm:pt-24`.
2. Contenedor CTAs (línea ~578): `flex flex-wrap items-center justify-center gap-3` → `flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center`. Ambos botones: agregar `min-h-12 sm:min-h-0` y `text-base sm:text-sm`.
3. Botón primario: agregar ícono `ArrowRight` (lucide, `size-4`, `aria-hidden`) después del texto con `gap-2`.
4. Imagen hero: `MockImage` hoy fuerza `loading="lazy"`. Agregar prop opcional `priority?: boolean`; si es `true` → `loading="eager"` y `fetchPriority="high"`. Usarla en la línea ~607: `<MockImage src={MOCK_IMAGES.hero} alt="AI DJ mixing console interface with two decks, mixer and waveforms" priority />`.
5. En mobile la captura de la consola es ilegible: superponer dentro del `<a>` del showcase un badge
   `absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur sm:bottom-5` con el texto "Open the console →". Cambiar `aspect-video` → `aspect-[4/3] sm:aspect-video` y agregar `object-left-top sm:object-center` a la imagen para mostrar un deck completo en mobile.

**Aceptación:** en 390px los CTAs son botones apilados de ancho completo y ≥48px de alto; la imagen hero carga sin esperar scroll (Lighthouse: LCP no marcado como lazy).

---

### P1-4. Targets táctiles ≥ 44px

**Archivo:** `src/components/playground/mock-site.tsx`
- CTA del header (línea ~564): agregar `min-h-11 sm:min-h-0`; en `<640px` reducir texto a `text-[13px] px-3.5`.
- Links del footer (línea ~824): agregar `inline-flex min-h-9 items-center` y bajar el `gap-2` del `<ul>` a `gap-0.5`.
- Botones de pricing (línea ~754): `py-2.5` → `min-h-12 py-3`.

**Aceptación:** en la auditoría de Lighthouse (mobile) no aparece "Tap targets are not sized appropriately".

---

## P2 — Medios

### P2-1. Stats compactas en mobile
**Archivo:** `mock-site.tsx` (línea ~657)
```diff
- <section className="grid gap-8 border-t border-border/50 px-6 py-14 sm:grid-cols-3 sm:px-10">
+ <section className="grid grid-cols-3 gap-3 border-t border-border/50 px-5 py-10 sm:gap-8 sm:px-10 sm:py-14">
```
- Cada item: `text-center sm:text-left` (mantener).
- Valor (línea ~660): `text-4xl` → `text-2xl sm:text-4xl`.
- Label (línea ~663): `text-sm` → `text-xs leading-4 sm:text-sm sm:leading-5`.

### P2-2. Footer responsive
**Archivo:** `mock-site.tsx` (línea ~795)
- `grid grid-cols-3 gap-8` → `grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-8`.
- Footer padding inferior: agregar `pb-[max(3rem,env(safe-area-inset-bottom))]`.
- Fine print (línea ~835): `text-muted-foreground/70` → `text-muted-foreground`.

### P2-3. Sección "Featured in" (press falsa)
**Archivo:** `mock-site.tsx` (líneas ~611-623)
- Si `PRESS_SECTION = remove`: borrar la sección.
- Si `tech-badges` (default): cambiar `aria-label` a `"Built with"`, anteponer un `<p>` "Built with" (`w-full text-center text-xs text-muted-foreground`), y en `MOCK_SITE_COPY[0].press` usar `["Web Audio API", "WebMIDI", "WebGL", "AI Stem Separation", "Runs in your browser"]`. Color de los items: `text-muted-foreground` (sin `/70`). En mobile: `gap-x-6 py-8`.

### P2-4. Features cards
**Archivo:** `mock-site.tsx` (línea ~632)
- `sm:grid-cols-3` → `md:grid-cols-3` (en 640-767px 3 columnas quedan muy angostas). Para 640-767 usar `sm:grid-cols-2` y que la 3ª card ocupe `sm:col-span-2 md:col-span-1`.
- Título sección (línea ~629): `text-3xl` → `text-[1.75rem] leading-tight sm:text-3xl`. Repetir este cambio en los `h2` de gallery (~693), pricing (~711) y final CTA (~768: `text-3xl sm:text-4xl` → `text-[1.75rem] sm:text-4xl`).

### P2-5. Testimonial
**Archivo:** `mock-site.tsx` (línea ~677)
- `text-2xl leading-9` → `text-xl leading-8 sm:text-3xl sm:leading-11`.
- Línea de autor (línea ~680): agregar `flex-wrap` para que el rol baje de línea en mobile.

### P2-6. Gallery
**Archivo:** `mock-site.tsx` (línea ~704)
- Alt genérico `Customer team ${index + 1}` → array de alts descriptivos: `["Club stage with colorful lights", "DJ performing on decks", "Concert crowd with raised hands", "Neon audio visualizer and music gear"]`.
- Grid: `gap-4` → `gap-2 sm:gap-4`.

---

## P3 — Bajos / pulido

### P3-1. Pricing
**Archivo:** `mock-site.tsx` (líneas ~715-763)
- Si `tier.price === "$0"` mostrar "Free" y ocultar `/month`.
- Plan `featured`: agregar badge `absolute -top-3 right-6 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background` con texto "Most popular" (añadir `relative` al `<article>`).
- Ícono de perks: `Zap` → `Check` (lucide) con `text-emerald-400`.
- `items-center` en `<li>` de perks → `items-start` + ícono `mt-0.5` (textos largos hacen wrap).

### P3-2. Rutas de plantilla
- Si `TEMPLATE_ROUTES = keep-noindex` (default): en `src/app/(shell)/layout.tsx`, `src/app/playground/page.tsx`, `src/app/celebrate/page.tsx`, `src/app/privacy/page.tsx` exportar `metadata = { robots: { index: false, follow: false } }` (fusionar si ya existe metadata). En `src/app/sitemap.ts` devolver solo la home.
- Si `delete`: **no ejecutar automáticamente**; dejar listado para el humano (borra mucho código).

### P3-3. Rendimiento del efecto en mobile
**Archivo:** `src/app/page.tsx`
- El efecto ya respeta `prefers-reduced-motion`. Opcional: bajar `grain` de `0.8` a `0.4` (el grano reduce legibilidad del texto pequeño).

---

## Checklist final de QA (para la IA ejecutora)

- [ ] `npm run lint` sin errores nuevos.
- [ ] `npm run build` OK.
- [ ] 375px y 390px: sin scroll horizontal (`document.documentElement.scrollWidth <= innerWidth`), un solo header, menú hamburguesa funcional, CTAs apilados.
- [ ] 768px: nav desktop visible, features en 2+1, footer 3 columnas.
- [ ] 1440px: la card centrada se ve igual o mejor que antes.
- [ ] Anchors `#features`, `#community`, `#pricing` hacen scroll suave.
- [ ] Ninguna mención visible a "Canvas UI" ni "DJ Pulse AI" en la home.
- [ ] `/playground` sigue renderizando (usa `MockSite` y `MOCK_SITE_COPY[1]`).
- [ ] Lighthouse mobile: Accessibility ≥ 95, sin advertencias de tap targets ni de LCP lazy.
