# Referencia real de la home de Canvas UI

Fuente inspeccionada: `C:/Users/ezequ/Downloads/canvas-ui-main/`. Fecha: 25 de octubre de 2026. La carpeta de referencia se leyó, sin modificarla.

La home original no monta HexFloat globalmente. Su ruta `src/app/page.tsx` compone Navbar, Hero, Gallery, FeaturedVideos, HowItWorks, Frameworks, Agents, FAQ, Newsletter y CTA. Las capturas de HexFloat corresponden a la ruta de documentación del componente, no al diseño de la home.

## Modelo aplicado a AutoParty

| Fuente original | Configuración real | Adaptación |
| --- | --- | --- |
| `src/app/page.tsx` | Contenedor max-w-6xl (1152 px), rails punteados laterales | Mismo marco y ancho; secciones de AutoParty |
| `src/components/landing/navbar.tsx` | Barra 56 px, fondo translúcido, desenfoque, navegación central | Marca AutoParty, anclas y acceso al mixer; menú móvil |
| `src/components/landing/hero.tsx` | H1 hasta 60 px, peso 500, descripción 16/28, CTA redondo de 44 px y showcase grande | Copy real, captura actual y tarjetas con características verificadas |
| `src/components/landing/hero-reveal.tsx` | ParticleReveal radius 700, softness .55, size 1, scatter 0, drift 2, aberration 70, bend 100, fade 1, threshold 0, smoothing .5 | Mismos shader y preset sobre la captura de AutoParty |
| `src/components/landing/how-it-works.tsx` | Pasos numerados a la izquierda y demostración a la derecha | Guía seleccionable: Library, themes y Start party, sin simular reproducción |
| `src/components/landing/faq.tsx` | Título izquierdo y preguntas a la derecha | FAQ verificadas de AutoParty, teclado nativo |
| `src/components/landing/cta.tsx` | Blaze con sparkColor [.45,.65,1], smokeColor [.2,.45,1], height 1, distortion .6, distortionScale .5, layers 4, sparkDensity 1.5, smoke .5, sparks .5, sparkSize 1, glow 1.5 | Mismo fondo de partículas azules en el cierre, detrás de HTML nativo |

Se conservan los dos bordes Flame Wrap de las cajas de modos. No se aplica fuego a ninguna consola. HexFloat queda disponible en el proyecto, pero ya no es el fondo general: se sigue el modelo de la home solicitada. No se inventan testimonios, videos, estadísticas, contactos o planes. Se usa una tira de accesos a funciones reales donde la biblioteca exhibe sus componentes.

## Por qué antes se veía diferente

Los hashes de `HexFloatVanilla.ts` y `ParticleRevealVanilla.ts` de ambos proyectos coincidían antes de esta adaptación. También coincidía `hero-reveal.tsx`. La diferencia no era una instalación distinta, sino composición, parámetros y compatibilidad de navegador.

La home de referencia reproduce `/assets/fallback-hero.mp4` si no detecta HTML-in-Canvas. Ese video muestra el producto de Canvas UI y no representa AutoParty. Para no usar material ajeno como si fuera nuestro, se añadió a `ParticleRevealElements` una imagen opcional. El shader instalado puede usar nuestra captura como textura WebGL sin depender de la API experimental; sus parámetros visuales se mantienen. El comportamiento de captura HTML existente conserva sus valores por defecto. En móvil o con movimiento reducido, se mantiene la captura estática. Los textos superpuestos siguen como HTML y no se deforman.

`BlazeElements` admite `captureContent: false` para dibujar decoración sin capturar botones o textos. El comportamiento predeterminado se conserva.

## REA

Se leyó la skill `C:/Users/ezequ/.agents/skills/reverse-engineer-anything/SKILL.md`. Las herramientas REA están anunciadas en esta sesión. La propia skill indica usar herramientas normales de repositorio cuando hay código fuente completo, sin diagnósticos o preparación de proveedores innecesarios. No se ejecutó `npx rea-agents@latest setup`, no se cambiaron registros MCP y no se reinstaló la skill. La existencia de herramientas en la sesión no certifica todos los proveedores nativos de REA, que no fueron necesarios aquí.

Si más adelante hiciera falta reparar REA, el paso previo sería revisar el diagnóstico y preparar un `setup --client codex --dry-run --json`, presentar las rutas, copias de seguridad y cambios exactos, obtener la aprobación solicitada y recién entonces aplicar el mismo alcance. No hay una instalación pendiente necesaria para esta adaptación.

La licencia existente `LICENSE.md` se conserva.

## Validación de esta adaptación

- `npm run build`, TypeScript, ESLint sobre archivos modificados y tres pruebas del HTML exportado: correctos.
- Navegador integrado de ChatGPT: shader de partículas sobre imagen confirmado visualmente a 1440 × 900, canvas de 1086 px de ancho, sin errores o advertencias de consola capturados.
- Seis viewports comprobados: 390 × 844, 844 × 390, 1024 × 768, 1440 × 900, 320 × 740 y 768 × 1024. En todos: sin desbordamiento horizontal, final del documento alcanzable y footer visible. El footer tiene 10 px de margen exterior, como la referencia; la prueba no exige que quede pegado al borde del viewport.
- Guía: selección de temáticas con click y tercer paso con Enter; contenido y `aria-expanded` correctos.
- Móvil: menú abre y cierra al elegir FAQ; FAQ abre con Espacio. Cero bordes Flame Wrap en consolas.
- Evidencia: `evidence/home-model-desktop.jpg`, `home-model-mobile.jpg`, `home-model-guide.jpg`, `home-model-footer.jpg` y `home-model-responsive.json`.
- Se conserva la advertencia previa de metadataBase en las rutas heredadas, pendiente de configurar el dominio de la landing.
- No se comprobó la emulación de movimiento reducido ni teléfonos físicos. La conexión de control de Brave agotó su tiempo, por lo que las verificaciones finales se hicieron en el navegador integrado. Esto no bloqueó la comprobación del shader, que ahora usa la captura como textura.

## Cambio posterior: HexFloat solo en la imagen del hero

Por pedido del usuario, Particle Reveal fue reemplazado por HexFloat únicamente en la captura del hero. El fondo general, textos y cajas superpuestas no reciben el efecto. El renderer HexFloat admite una textura de imagen opcional para que funcione sin HTML-in-Canvas; su captura HTML por defecto se conserva. El hover usa flow 0.6, swirl 2, trail 0.25 y radio 260; no hay movimiento de puntero simulado. Ajustes de imagen: size 120, bevel 1.5, tilt 12, perspective .25, float 0, speed .6, shine .5, lift .15, iridescence .8, grain .08. En móvil y con movimiento reducido se conserva la captura estática. El fuego sigue únicamente en las dos cajas de modos.
`nVerificación del cambio a HexFloat: build, TypeScript, ESLint y tres pruebas correctas. En el navegador integrado se confirmó un canvas HexFloat sobre la captura, cero capas Particle Reveal y ninguna advertencia/error capturado. A 390 × 844, imagen estática, sin desbordamiento y scroll completo al footer. Captura: evidence/hero-console-hex.jpg.

## Ajuste de encuadre y Media Library

La primera captura se muestra de frente: tilt 0, perspective 0, sin flotación; se redujeron los hexágonos de 120 a 64 px y el levantamiento a 0.06 para conservar el encuadre. La segunda captura usa el PNG aportado por el usuario con Media Library abierta (1919 × 911), guardado como `public/autoparty-media-library.png`. Se respeta su proporción completa y se limita la segunda vista a 960 px, centrada. Se actualizó el título a Meet your library y se indica que las canciones fueron importadas por el usuario. No se tomaron nuevas capturas ni se modificó la app del mixer.

## Identidad oficial y crédito del desarrollador

Se incorporó el logo oficial con auriculares aportado por el usuario como `public/autoparty-logo.png`, en cabecera, pie y favicon/manifest. Se usa el logo personal `public/e-developer-logo.webp` en el crédito del footer: AutoParty · Browser-based mixing · Beta · Developing by [logo e]. El crédito enlaza a https://ezestom.is-a.dev/ en una pestaña nueva, con nombre accesible. Ambos assets se copiaron sin editar sus píxeles ni transparencia.

## Responsive de la captura y tipografía local

Se identificó que el recorte móvil lo provocaban `aspect-ratio: 1.05`, una altura mínima y `object-fit: cover`. La captura original mide 1440 × 900 (16:10), por lo que `aspect-video` (16:9) tampoco conservaría su encuadre exacto. La imagen y HexFloat ahora tienen un contenedor propio 8:5, sin altura mínima y con `object-fit: contain`. A 900 px o menos, las tarjetas quedan debajo de la imagen y no tapan ni condicionan su altura.

Se incorporó Google Sans Code variable (pesos 300–800) desde la carpeta local aportada, con `next/font/local`, `display: swap` y licencia OFL conservada en `src/app/fonts/GoogleSansCode-OFL.txt`. Se usa para navegación, botones, etiquetas y detalles técnicos, combinada con Geist Sans en títulos y lectura. No se realizan solicitudes a Google Fonts para descargarla en el navegador. También se compactó la cabecera por debajo de 480 px para mantener visibles el logo, el CTA y el menú.
Validación responsive y fuente: diez anchos (320, 390, 600, 735, 767, 768, 844, 900, 1024 y 1440 px) conservan ratio 1.6, object-fit contain, sin desbordamiento horizontal y menú dentro del viewport. Las tarjetas quedan debajo hasta 900 px. Google Sans Code confirmada como cargada mediante document.fonts; menú con Escape y footer comprobados a 390 × 844. Build, TypeScript, ESLint y tres pruebas correctos. Sin advertencias o errores de consola capturados. Evidencia: console-responsive-font.json, console-responsive-735.jpg y console-responsive-390.jpg.
