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
