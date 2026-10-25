# AutoParty — Web de bienvenida

Implementación y verificación: 25 de octubre de 2026.

## Alcance y fuente

Se aplicó el brief `../auto-party/BRIEF-WEB-AUTOPARTY.md` al proyecto de la landing. La aplicación del mixer pertenece a otro proyecto. Sus archivos no se modificaron.

La interfaz publicada en https://freeautoparty.vercel.app/ se abrió en Brave: se comprobó la marca AutoParty, la consola de dos decks y Party mode. El panel mostraba `AI not configured`. No se importaron canciones, iniciaron mezclas ni grabaciones en esta revisión. La biblioteca existente no se alteró. `public/autoparty-console.jpg` es una captura real de esa interfaz con los decks sin canciones cargadas, tomada a 1440 × 900.

## Diseño y contenido

- Se mantiene fondo oscuro, HexFloat de Canvas UI, iluminación, naranja/cian y una consola con perspectiva suave en escritorio. El contenido permanece como HTML legible y accesible.
- Recorrido: presentación → primeros pasos → Party mode y consola manual → temáticas y programa → consola frontal y funciones → IA opcional → FAQ → acceso a la app.
- Todo el contenido y los nombres accesibles de la landing están en inglés. Se retiraron de la página principal los precios, cifras, testimonios y promesas ficticias de la demostración.
- Los tres CTA principales apuntan a la aplicación actual. Todas las anclas tienen destino. Menú móvil con estado expandido y Escape; FAQ con `details` y `summary` nativos.
- Marca, metadatos, icono y manifest propios. No se enlazan páginas legales, contactos o redes no verificados.

## Corrección del scroll

Reproducción previa en Brave: documento de 861 px de altura, contenido interno de 4690 px dentro del wrapper fijo de HexFloat; una rueda de una página dejó `scrollTop` en 0.

El wrapper anterior cambia su contenedor entre fallback HTML y canvas cuando detecta soporte. El efecto de manejo de scroll del componente se monta con dependencias vacías y conserva el nodo anterior. Además, el contenido completo estaba fuera del flujo del documento, dentro de una capa fija.

La landing ahora usa scroll nativo del documento. HexFloat se usa únicamente para el fondo decorativo, con `pointer-events: none`; no envuelve controles ni captura rueda, teclado o gestos. El wrapper compartido `src/lib/HexFloat/HexFloat.tsx`, que ya tenía cambios del usuario, se conservó sin modificaciones adicionales. La decoración se detiene al ocultar la pestaña. En pantallas menores a 768 px y con movimiento reducido se usa el fondo SVG sin WebGL. La consola pierde la inclinación en móvil y con movimiento reducido.

La prueba de regresión `node --test scripts/check-welcome.mjs`, después de `npm run build`, verifica que el contenido interactivo no quede dentro de canvas, que las anclas tengan destino y que las FAQ usen controles nativos. Complementar con el recorrido manual de abajo: una comprobación de HTML no prueba la rueda o el gesto táctil.

## Verificación real

Compilación `npm run build`: correcta, exportación de 47 páginas. `npx tsc --noEmit`: correcto. ESLint sobre los archivos TS/TSX modificados de la landing: correcto. Tres pruebas del HTML exportado: correctas. No se añadieron dependencias.

Navegador: Brave en Windows, con viewport emulado. Se verificó la versión exportada en un servidor HTTP local en el puerto 3100.

| Viewport | Footer alcanzable | Desbordamiento horizontal |
| --- | --- | --- |
| 390 × 844 | Sí | No |
| 844 × 390 | Sí | No |
| 1024 × 768 | Sí | No |
| 1440 × 900 | Sí | No |
| 320 × 740 | Sí | No |
| 768 × 1024 | Sí | No |

Resultados numéricos: `evidence/responsive-checks.json`.

También se verificaron:

- Rueda en escritorio: `window.scrollY` pasó de 0 a 900.
- Regreso al inicio y navegación al contenido con anclas, dejando margen para la cabecera.
- Menú móvil: apertura, cierre con Escape y cierre al elegir FAQ; `aria-expanded` cambia a `false`.
- FAQ: abre con Espacio y cierra con Enter.
- `Ctrl+End` alcanza el pie; foco visible al navegar con teclado.
- Tres accesos a la app con URL correcta, ninguna ancla rota, un único `h1`, idioma `en`, sin videos vacíos.
- Sin errores o advertencias capturados en la consola de la vista previa de producción durante estas pruebas.

Capturas: `evidence/desktop-1440.jpg`, `evidence/mobile-390.jpg` y `evidence/features-desktop.jpg`.

Durante las pruebas de desarrollo, el indicador de Next.js interfería con el botón móvil; se desactivó. También se retiró la opción `experimental.viewTransition`, no reconocida por Next.js 16.3.1. El servidor de desarrollo bloqueó recursos al alternar entre localhost y 127.0.0.1; por eso la comprobación interactiva final se hizo con la exportación de producción.

## Prueba manual de regresión

1. Abrir la web y esperar que cargue el efecto. Desplazarse con rueda hasta el footer y volver arriba.
2. Repetir con teclado: Tab, Espacio, PageDown y Ctrl+End. Verificar que el foco sea visible y los enlaces funcionen.
3. En cada viewport de la tabla, abrir/cerrar menú, elegir una sección, abrir/cerrar FAQ y volver al footer. No debe haber una segunda barra de scroll ni contenido lateral oculto.
4. En un teléfono real, repetir con gestos táctiles. Activar movimiento reducido y zoom 200 % para comprobar también esas preferencias.

## Pendientes y límites

- Falta el dominio público de **esta landing**. Configurar `NEXT_PUBLIC_SITE_URL` con ese dominio antes de desplegar: habilita canonical, imagen social absoluta y sitemap. No se usó el dominio del mixer ni el del proyecto original de Canvas UI como si fueran el de la landing.
- La compilación conserva una advertencia de `metadataBase` originada en las páginas heredadas de la biblioteca. Esas páginas se conservaron y se excluyen del rastreo mediante robots; la navegación de bienvenida no las enlaza. El dominio configurado resolverá la base de las URLs.
- Falta probar gestos en hardware móvil real, lector de pantalla, zoom efectivo al 200 % y emulación de movimiento reducido. Las reglas de movimiento reducido están implementadas, pero no se pudo activar y comprobar esa preferencia con el control de navegador disponible. Las dimensiones móviles se verificaron por emulación, no en teléfonos físicos.
- No se comprobó compatibilidad universal ni funcionamiento offline, reproducción de audio, grabación o conexión real a Groq.
- Los cambios anteriores en `.vscode/settings.json`, `mock-site.tsx`, `HexFloat.tsx`, `CLAUDE.md` y el documento UX existente se conservaron. Los mocks siguen disponibles para las demos heredadas; no se usan en la página principal.

## Incorporar tutoriales reales

En `src/components/autoparty/content.ts`, agregar entradas a `tutorials` con título, descripción, duración real en segundos, poster, fuente de video, subtítulos en inglés y transcripción. Mientras la lista esté vacía, no se muestra una sección de videos. La guía escrita funciona independientemente de esa colección.

## Ajuste visual: HexFloat y Flame Wrap

Se aplicó el pedido de efectos usando las implementaciones de Canvas UI ya instaladas y las referencias aportadas. HexFloat ahora acompaña toda la landing como fondo fijo decorativo, sin envolver contenido ni capturar entradas. Tras el ajuste solicitado, se usan los valores aportados por el usuario: size 160, gap 0, bevel 1.5, tilt 24, perspective 0.5, float 0, speed 1, shine 0.5, lift 0.1, radius 1200, flow/swirl/trail 0, iridescence 1, bloom 0, grain 0.8 y gapColor auto. Se retiraron la opacidad de 0.43 y la máscara que apagaban el fondo.

Flame Wrap queda exclusivamente en las dos cajas de modos (naranja y cian). Las dos capturas de consola quedan sin fuego, a la espera de que el usuario elija otro efecto. Llamas de 64 px de alcance, velocidad 0.18, pocas chispas, sin deformación, derretido o quemado del contenido. El nuevo `FlameBorder` mantiene el texto, imágenes y enlaces fuera del canvas. La opción opcional `captureContent: false` agregada a `FlameWrapElements` permite dibujar solo el borde procedural; el comportamiento por defecto del componente de biblioteca se conserva.

Los efectos se destruyen al ocultar la pestaña. El renderer instalado pausa el fuego fuera de pantalla. Por debajo de 768 px o con movimiento reducido se mantiene un borde con resplandor estático, sin animación WebGL.

Verificación del ajuste: compilación de producción y TypeScript correctos; ESLint sobre componentes y renderer modificado, correcto; tres pruebas de regresión del HTML, correctas. En Brave a 1440 × 900 se comprobaron tres bordes y ninguna advertencia/error de consola. A 390 × 844, los tres canvas de fuego tienen `display: none`, el menú funciona, no hay desbordamiento horizontal y el footer sigue alcanzándose (`scrollY: 6044`). La preferencia de movimiento reducido sigue pendiente de emulación real, como se indicó arriba.

Nuevas capturas: `evidence/flame-cards-desktop.jpg`, `evidence/flame-console-desktop.jpg` y `evidence/flame-cards-mobile.jpg`.


Último ajuste solicitado: fuego únicamente en las dos cajas de modos; cero bordes de fuego dentro de las consolas. HexFloat recupera exactamente los valores aportados, sin opacidad adicional ni máscara. Verificado en Brave a 1440 × 900: dos bordes, cero en consolas, fondo con opacidad 1 y máscara none, sin desbordamiento horizontal ni errores capturados; footer alcanzable. Compilación, ESLint y tres pruebas de regresión correctos. Captura vigente: `evidence/hex-float-restored.jpg`. Las capturas anteriores de la consola con fuego son históricas y ya no representan el resultado actual.

## Modelo de home de Canvas UI (estado actual)

El pedido posterior de replicar el modelo de la home reemplaza el fondo global HexFloat por la estructura de la referencia: fondo negro, rails punteados, hero con Particle Reveal, guía dividida y cierre con partículas azules Blaze. Se mantienen nuestros textos, la captura real y el fuego exclusivamente en las dos cajas. El análisis y los parámetros reales están en `REFERENCIA-CANVAS-UI.md`. Las capturas anteriores con HexFloat global son históricas. La evidencia vigente lleva el prefijo `evidence/home-model-`.

## Flying Button en el hero

Se quitó el CTA Open AutoParty de la barra. El CTA del hero usa el componente oficial React Bits Flying Button (https://reactbits.dev/micro/flying-button), descargado del registro `FlyingButton-TS-CSS`, sin dependencias adicionales. Se conserva su licencia junto al componente. Preset: dark, medium, altitude 170, hoverTime 2.4, dos jets, thrusters y carryCursor activos, trigger hover, smoke/turbulence/wobble 1, sin rampa, thrust #8ec5ff y smoke #eef1f6.

La escena está posicionada sobre la fila para no agregar 440 px de espacio vacío. El humo se desvanece en los límites y el enlace secundario sigue por encima de la escena. El botón abre la app real al hacer click o pulsar Enter; hay un enlace noscript. El motor original respeta prefers-reduced-motion y conserva el botón aunque no haya simulación WebGL. Adaptación local al código original: actualización de props del motor en useEffect para cumplir las reglas de React 19.

Verificación: build de producción y TypeScript correctos, ESLint de los cuatro componentes sin errores y cuatro pruebas de HTML aprobadas. Vista real a 320 y 390 px sin desbordamiento; menú móvil abre/cierra con Escape. Enter en el CTA navegó a https://freeautoparty.vercel.app/ y se regresó a la landing. WebGL renderizó propulsores/humo sin errores de consola capturados. Evidencia: `evidence/flying-button-desktop.jpg` y `evidence/flying-button-mobile.jpg`. La preferencia de movimiento reducido se conserva desde el motor original; no se emuló en esta revisión.

## Marca única, cierre animado e idiomas EN / ES

El CTA del cierre reutiliza LaunchApp con el mismo Flying Button del hero. Se quitó la marca repetida del footer; se mantienen los enlaces y el crédito del desarrollador. La marca fija adopta el espaciado y subtítulo de la referencia, usando el logo oficial y BETA en naranja, visible también en móvil.

La landing se exporta en inglés y ofrece castellano mediante el selector EN / ES del navbar. LanguageProvider mantiene el idioma mediante useSyncExternalStore y localStorage, con alternativa en memoria si el almacenamiento no está disponible. Actualiza lang y el título del documento. spanish.ts cubre navegación, títulos, cuerpo, botones, guía interactiva, preguntas/respuestas y etiquetas accesibles. Los nombres de controles de la app (Library, Party mode, Start party, REC y Visuals) conservan su nombre real para que las instrucciones coincidan con el producto. Las capturas reales de la app conservan su contenido original.

Validación: build estático/TypeScript correctos; ESLint sin errores ni advertencias en los seis archivos modificados; seis pruebas aprobadas, incluida cobertura del diccionario. Navegación real con Enter desde el botón inferior a la app. Selector comprobado en ambos sentidos, persistencia de ES tras recargar y lang/título actualizados. Revisión visual a 320 px en ES: BETA visible, menú abre/cierra con Escape, cierre completo y sin desbordamiento horizontal. Consola sin errores capturados. Evidencia: evidence/bilingual-hero-es.jpg, evidence/bilingual-closing-mobile.jpg y evidence/bilingual-closing-en.jpg. Preview devuelto a inglés.

## Glide Select e Hyperspeed

Se integraron los dos componentes de React Bits desde el código completo adjuntado por el usuario. GlideSelect sustituye al select nativo y mantiene LanguageProvider, los códigos EN / ES, los nombres English / Castellano y la preferencia guardada. Usa los iconos Lucide ya instalados en lugar de sumar Hugeicons; conserva menú con apertura animada, indicador deslizante, selección con puntero, flechas, Enter y Escape. Se corrigieron dependencias de efectos y se añadió activación por click de tecnologías de asistencia. Código original y CSS quedan junto a la licencia react-bits.LICENSE.md.

Se dejó de renderizar ConsoleHex en el hero. HeroHyperspeed coloca Hyperspeed detrás de la primera consola, con las estelas visibles por debajo y entre las tarjetas de acceso. La captura conserva su relación de aspecto y no pasa por ningún efecto. Preset ambiental: winding, curvature 0.8, speed 0.65, density 36, dust 60, glow 0.55, reflections 0.35, roadOpacity 0, interactive false y paleta original magenta/cian. La capa no intercepta puntero ni scroll. Un fondo discreto protege la legibilidad del epígrafe. El wrapper reacciona a movimiento reducido y a la visibilidad del documento; el motor original pausa los frames fuera de pantalla. Sin WebGL se conserva la consola estática.

Validación: build de producción y TypeScript correctos; ESLint sin errores ni advertencias en los cinco componentes revisados; siete pruebas aprobadas. Comprobación real del selector con puntero (ES → EN), teclado (End + Enter a ES), apertura con Enter/flecha y cierre con Escape. Se revisaron 390 y 320 px sin desbordamiento; el menú cabe y la escena permite desplazarse. Cero instancias de ap-console-hex y un canvas de Hyperspeed detrás de la imagen; consola de navegador sin errores capturados. No se emuló la preferencia de movimiento reducido. Capturas: evidence/glide-select-desktop.jpg, evidence/glide-select-mobile.jpg y evidence/hyperspeed-console-desktop.jpg.

## Hyperspeed hasta el título; tarjetas sin fuego

Se retiraron las dos instancias de FlameBorder. Las tarjetas conservan sus iconos, enlaces y acentos naranja/cian, pero ya no tienen canvas ni bordes animados de fuego. Los propulsores de los CTA Flying Button se mantienen.

HeroHyperspeed ahora pertenece a la sección completa del hero, antes del título, en vez de pertenecer a la figura de la consola. La capa comienza justo al terminar el nav, está detrás del contenido (z-index -1), tiene overflow hidden y no recibe eventos de puntero. El nav conserva z-index 10. Las ondas pueden verse detrás de la barra al desplazarse, sin pintar por encima de ella.

Se agregó horizon al componente local Hyperspeed: 0.5 conserva el encuadre original; el hero usa 0.12. El ajuste utiliza camera.setViewOffset en resize, conservando el campo de visión y sin agrandar innecesariamente el canvas. Esto coloca el punto de fuga aproximadamente a la altura del título. Las sombras de texto sostienen la legibilidad del título y la descripción sobre las estelas.

Validado: build/TypeScript, ESLint de tres componentes y siete pruebas correctos. En navegador: cero ap-fire-border; escena y nav comparten exactamente el límite vertical inicial (61 px escritorio, 65 px móvil a 390 px); sin desbordamiento horizontal, sin errores capturados. Capturas actuales: evidence/hyperspeed-full-hero.jpg, evidence/hyperspeed-full-hero-mobile.jpg y evidence/modes-without-fire.jpg.

## Recorte lateral de Hyperspeed

La escena queda recortada exactamente por los rails punteados del main (máximo 1152 px). El wrapper se extiende únicamente sobre el padding lateral del hero: 32 px en escritorio y 20 px en móvil. El canvas mantiene su amplitud dentro del wrapper, cuyo overflow hidden impide que las estelas o su brillo pinten fuera. El exterior conserva el fondo negro de la página.

Build/TypeScript correctos. Medición real a 1920 px: main y recorte comparten los bordes 376.5 / 1528.5; a 390 px comparten 0 / 375, sin desbordamiento horizontal. Captura: evidence/hyperspeed-rail-clipped-desktop.jpg.

## Legibilidad del hero

El enlace See how it works del hero comparte ahora el mismo estilo base del cierre: fondo rgba(8,9,13,.5), borde blanco al 19%, radio 999 px y padding 11 px 24 px. Se retiraron sus excepciones de escritorio/móvil. Hyperspeed usa opacity .75 para reducir un 25% su intensidad completa, conservando el recorte lateral y las animaciones. Compilación/TypeScript correctos y estilos calculados de ambos botones iguales en navegador. Captura: evidence/hero-readable-cta.jpg.
