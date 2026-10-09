# Decisiones

Registro de decisiones tomadas con el usuario (Bruno) y su porqué. Agregar una entrada por decisión nueva.

## 2026-09-20 — Progreso recuperable y práctica más directa

**Decisión:** un ítem queda "afianzado" después de dos respuestas correctas consecutivas en la misma
combinación de silabario, Palabras/Oraciones y Leer/Escribir. Un error reinicia esa racha corta y prioriza
el ítem en rondas siguientes; dos nuevos aciertos permiten recuperarlo.

**Por qué:** el criterio anterior exigía no haber fallado nunca, por lo que una palabra quedaba fuera de
"dominadas" para siempre. También mezclaba comprensión y producción. El nuevo criterio comunica mejor el
estado actual y permite que el progreso refleje aprendizaje posterior sin introducir todavía un SRS completo.

**UX:** la selección de filas queda resumida detrás de Editar/Listo cuando ya está configurada. La práctica
agrega "No me acuerdo", corrección alineada para omisiones, textarea para oraciones y repaso directo de los
ítems fallados desde el resultado.

## 2026-09-20 — Hiragana/Katakana y oraciones avanzadas

**Decisión:** agregar un selector Hiragana/Katakana arriba de las estadísticas, con Hiragana a la izquierda.
Cada silabario conserva por separado sus filas, modo Leer/Escribir y tipo Palabras/Oraciones; la racha y las
rondas diarias siguen siendo globales. Katakana suma el alargador ー como fila especial además de ッ.

**Avanzado:** Oraciones se desbloquea al seleccionar todas las filas del silabario activo. Es una elección
separada de Leer/Escribir y no se activa automáticamente. Las rondas tienen 5 oraciones para compensar su
longitud. El romaji de las oraciones se guarda explícitamente porque las partículas は, へ y を no tienen siempre
su lectura literal.

**Katakana en oraciones:** se presupone que quien completó katakana ya aprendió hiragana, siguiendo el orden
de aprendizaje recomendado. Por eso las oraciones usan katakana para préstamos y nombres, e hiragana para
partículas y flexiones, sin ayudas ni transliteración parcial.

## 2026-09-20 — Proyecto iOS local con Capacitor

**Decisión:** agregar Capacitor y un proyecto Xcode con el identificador
`com.brunokupferberg.wordgana` para instalar WordGana directamente en un iPhone desde una Mac.
**Por qué:** permite ejecutar la app como una aplicación local independiente del servidor de desarrollo y
conserva el mismo código React/PWA. La firma queda gestionada por Xcode con el Apple ID del usuario.

## 2026-09-17 — Plataforma: PWA web, no app nativa

**Decisión:** React + Vite + TypeScript como PWA instalable.
**Por qué:** un solo código para iOS, Android y navegador. Se instala desde Safari/Chrome sin App Store,
sin Mac ni Xcode. Funciona offline.
**App Store después:** posible envolviendo el mismo build con Capacitor en un proyecto Xcode. Requiere Mac
y cuenta Apple Developer. Queda como Etapa 7 (futuro). Nada del diseño actual lo impide.

## 2026-09-17 — Significados en español, lista curada a mano

**Decisión:** `src/data/words.ts` con ~500 palabras `{ kana, es }` escritas a mano.
**Por qué:** el usuario habla español. Una lista curada garantiza palabras comunes, cortas y con muchas
combinables con pocas filas (vocales + K). Se descartó extraer JMdict (glosas en inglés, miles de palabras
raras, sin control).
**Futuro posible:** script que importe JMdict y traduzca, si la lista queda corta.

## 2026-09-17 — Rondas de 10 palabras

**Decisión:** sesiones de 10 con resumen (aciertos, falladas) y botón "Otra ronda".
**Por qué:** elegido por el usuario frente a modo infinito. Si hay menos de 10 palabras elegibles, la ronda
usa las que haya (mínimo 3).

## 2026-09-17 — Selección de modo con dos tarjetas, no un toggle de teclado

**Decisión:** en la pantalla inicial hay dos tarjetas: "Leer" (ejemplo en hiragana arriba, `___` abajo) y
"Escribir" (ejemplo en romaji arriba, `___` abajo). No hay un toggle aparte de "tengo teclado japonés".
**Por qué:** la tarjeta ya muestra qué vas a ver y qué vas a escribir; un toggle separado duplicaba la idea.
En modo Leer se acepta romaji **o** hiragana, así funciona también con un teclado IME sin configurar nada.

## 2026-09-17 — El romaji se genera, no se guarda

**Decisión:** las palabras solo guardan kana y significado. `toRomaji` produce Hepburn canónico y
`matchesRomaji` acepta variantes (shi/si, chi/ti, tsu/tu, fu/hu, ji/zi, o/wo, nn/n' para ん, macrones).
**Por qué:** una sola fuente de verdad; evita inconsistencias en 500 entradas escritas a mano.

## 2026-09-17 — Salir de la ronda en cualquier momento

**Decisión:** barra superior fija (`TopBar`) con una ✕ a la izquierda en las pantallas de práctica y
resultado, que vuelve a la configuración.
**Por qué:** el usuario quedaba atrapado: para salir de una ronda había que contestar las 10 palabras.
No pide confirmación porque cada respuesta ya se guardó en stats cuando se contestó: salir no pierde nada.

## 2026-09-17 — Aspecto de app móvil (barra, tarjetas, CTA fija)

**Decisión:** barra superior sticky con marca あ y título; secciones de la configuración dentro de
tarjetas blancas con sombra y títulos numerados ("1. ¿Qué filas ya sabés?"); chips seleccionados con
relleno de acento; botón principal en mayúsculas por CSS y fijo abajo (sticky) en la configuración;
barra de progreso en la práctica.
**Por qué:** el usuario pidió que se parezca más a una app móvil y pasó capturas de Kana Challenge como
referencia (barra superior, tarjetas, chips rellenos, CTA grande en mayúsculas). El texto en el código
sigue en minúsculas rioplatense; las mayúsculas son solo `text-transform`. La CTA fija resuelve además
que con muchas filas activas el botón quedaba lejos, al final de un scroll largo.

## 2026-09-17 — Emoji opcional por palabra en el feedback

**Decisión:** `Word` gana un campo `emoji?: string`, puesto a mano solo en las palabras donde hay un
emoji que representa el significado sin ambigüedad (alrededor de 150 de ~370). Se muestra al final de
la línea de feedback ("¡Bien! みず · mizu · agua 💧") al comprobar una respuesta, tanto si acertaste
como si no. Test que valida que cuando existe sea un único emoji (sin texto) y que haya una cantidad
razonable con emoji.
**Por qué:** pedido del usuario como "bonus" visual, con el ejemplo de いき (respiración) → 😮‍💨.
Explícitamente solo para palabras con un emoji claro, no forzarlo en todas: un emoji ambiguo o forzado
(p. ej. para "razón" o "sociedad") resta más de lo que suma. Se deja afuera de `toRomaji`/`checkAnswer`:
es puramente decorativo, no entra en la lógica de validación.

## 2026-09-17 — Racha, rondas de hoy y palabras dominadas (sin programa de días)

**Decisión:** tira de stats arriba del home: dos tiles (🔥 racha de días seguidos, 🎯 rondas de hoy) y
una barra "palabras dominadas" (contestadas al menos una vez y nunca falladas) sobre el total elegible
con las filas activas. Nueva clave `wordgana:progress:v1` con `{ lastDay, streak, roundsToday }`;
`countMastered` en `session.ts` sale de las stats por palabra que ya existían.
**Por qué:** el usuario quiso algo tipo Kana Challenge (racha, tiempo de estudio, "4 / 30 días"). Se
descartó copiar la barra de programa de 30 días porque WordGana no tiene currícula: no habría con qué
llenarla. El progreso real acá son las palabras dominadas, y el denominador son las palabras elegibles
con tus filas, así que la barra baja al activar filas nuevas — es honesto y empuja a practicarlas.
También se descartó el "tiempo de estudio": medir minutos en una PWA que se cierra sola es poco
confiable y no dice nada sobre lo aprendido.
**Detalles:** la racha solo cuenta rondas **terminadas** (salir con la ✕ no cuenta), el día se define
con la hora local del teléfono (medianoche, sin corte a las 4am), y si la última ronda fue ayer la
racha sigue viva sin sumar hasta que termines una hoy. No es punitiva: nunca avisa que la perdiste.

## 2026-09-17 — Filas de kana como unidades de selección

**Decisión:** básicas (あ か さ た な は ま や ら わ ん), dakuten/handakuten (が ざ だ ば ぱ), combinaciones
ゃゅょ (きゃ しゃ ちゃ にゃ ひゃ みゃ りゃ ぎゃ じゃ びゃ ぴゃ) y っ como toggle propio.
**Por qué:** refleja el orden en que los libros de texto enseñan hiragana. Una palabra es elegible solo si
todas sus unidades (tras tokenizar) pertenecen a filas activas.

## 2026-10-07 — Preparación para la App Store

**Decisión:** publicar la app de Capacitor en la App Store con una cuenta paga del Apple Developer Program.
En `Info.plist` se reemplazó `armv7` por `arm64` en `UIRequiredDeviceCapabilities` y se agregó
`ITSAppUsesNonExemptEncryption = false`. La política de privacidad vive en `docs/PRIVACY.md` y los pasos y
textos de la ficha en `docs/APP_STORE.md`.
**Por qué:** la firma gratuita vence cada 7 días y no permite distribuir la app a otras personas. `armv7` es
una arquitectura de 32 bits que iOS 15 ya no soporta; `arm64` describe correctamente los dispositivos
compatibles. La app solo usa el cifrado que trae iOS (HTTPS del sistema, aunque no hace pedidos de red), así
que queda exenta de la declaración de exportación y no hace falta responderla en cada build. La política de
privacidad se publica desde el repo público para no depender de un hosting aparte.

## 2026-10-07 — Letras sueltas como tercer tipo de práctica

**Decisión:** "Letras" es un `PracticeKind` más (`kana`), al lado de Palabras y Oraciones, con ítems generados
desde las filas activas (`letterItems`) en vez de una lista aparte. Las letras no tienen significado: el
feedback y el repaso muestran solo kana y romaji. El tipo por defecto sigue siendo Palabras.
**Por qué:** reutiliza ronda, validación (`checkAnswer` acepta variantes también para una sola letra) y progreso
por ítem sin código nuevo. Palabras sigue como default porque es la propuesta central de la app; Letras
queda primera en el selector porque es el orden natural de aprendizaje de una fila nueva.

## 2026-10-07 — Audio con la voz del sistema y solo después de responder

**Decisión:** la pronunciación usa `speechSynthesis` con `lang = ja-JP`, sin archivos de audio ni red. El botón
de escuchar aparece en el feedback y en la lista de repaso, nunca antes de responder. La reproducción
automática es opcional y viene apagada. Si el navegador lista voces pero ninguna es japonesa, el audio se
oculta y configuración explica cómo instalar una en iPhone.
**Por qué:** escuchar antes de responder regala la respuesta en modo Leer. La voz del sistema funciona offline,
no agrega peso a la app y suena natural en iOS (Kyoko/Otoya). Algunos WebView de iOS devuelven la lista de
voces vacía aunque haya voces instaladas, así que una lista vacía no oculta el audio.

## 2026-10-07 — Estadísticas e historial acumulado

**Decisión:** un registro `wordgana:lifetime:v1` guarda rondas completadas, rondas perfectas (de al menos 5
ítems), mejor racha y combinaciones script/tipo/modo practicadas. Respuestas y aciertos no se duplican ahí: se
calculan desde las stats por ítem. Las "letras que más cuestan" reparten cada respuesta de una palabra u oración
entre las letras distintas que la forman y exigen 3 respuestas mínimas.
**Por qué:** las stats por ítem ya registran cada respuesta, así que sumarlas evita dos fuentes de verdad. Las
rondas no se pueden reconstruir desde las stats: para quien ya usaba la app, el contador de rondas empieza en
cero con esta versión y la mejor racha arranca desde la racha actual. Un repaso de 1 o 2 errores sin fallar no
cuenta como ronda perfecta para que el logro no sea trivial.

## 2026-10-07 — Recordatorio diario con `@capacitor/local-notifications`

**Decisión:** agregar la dependencia `@capacitor/local-notifications` (8.3, misma versión mayor que Capacitor)
para un recordatorio diario opcional, solo en la app nativa; en la PWA la opción no aparece. En vez de una
notificación repetitiva se programan avisos sueltos para los próximos 14 días, que se reprograman al abrir la
app y al terminar cada ronda. El permiso se pide recién al activar el recordatorio.
**Por qué:** una notificación repetitiva no puede saltear los días en que ya practicaste. Con avisos sueltos,
el de hoy desaparece apenas terminás una ronda, el primero puede mencionar la racha real y, si dejás de abrir la
app, los avisos se terminan solos a las dos semanas en vez de insistir para siempre. Pedir el permiso en
contexto (al tocar el interruptor) es la práctica recomendada por Apple y evita un rechazo prematuro.

## 2026-10-07 — Logros

**Decisión:** 22 logros en cinco categorías (rondas, racha, vocabulario, precisión, silabarios y modos), con
meta numérica y progreso visible para los bloqueados. Se evalúan al terminar cada ronda y los nuevos se
celebran en Resultados. Al abrir la app se desbloquean en silencio los que ya se cumplían. Un logro
desbloqueado no se vuelve a bloquear. Las palabras aprendidas cuentan una vez por silabario aunque estén
afianzadas en Leer y en Escribir; "Hiragana/Katakana básico" exige afianzar las 46 letras básicas en Letras.
Los títulos viven en `src/data/achievements.ts` en los cuatro idiomas; las descripciones salen de i18n.
**Por qué:** Resultados es el momento natural para festejar y no interrumpe la práctica. Desbloquear en
silencio al abrir evita mostrar "10 / 10" bloqueado a quien ya tenía progreso de versiones anteriores. Mostrar
el progreso y un "próximo logro" (el bloqueado más cercano a la meta) da un objetivo concreto.
También: cada cambio de pantalla vuelve el scroll arriba (antes una pantalla nueva podía abrir por la mitad).

## 2026-10-08 — Tiempo de estudio dentro de WordGana

**Decisión:** el seguimiento de horas de japonés vive dentro de WordGana (no es otra app). El tiempo de
práctica se mide solo: cada respuesta suma el tiempo desde el evento anterior con un tope de 90 s, y no se
cuenta mientras la app está en segundo plano. Se guarda agrupado en un registro por día y categoría
(`practice:script:kind`). Mientras corre el cronómetro manual, la práctica no suma tiempo automático.
**Por qué:** dentro de WordGana se reutilizan racha, logros, recordatorio y publicación, y lo practicado en la app
se registra sin esfuerzo. El tope por pregunta evita que dejar el celular con una pregunta abierta infle las
horas. Agrupar por día mantiene el historial legible y el almacenamiento chico. Pausar el automático con el
cronómetro evita contar dos veces cuando alguien cronometra una sesión que incluye WordGana.

## 2026-10-08 — Cronómetro, carga manual y categorías de estudio

**Decisión:** el cronómetro guarda solo la categoría y la hora de inicio; el tiempo se calcula al mostrarlo, así
sigue contando aunque se cierre la app. Al detenerlo se abre el mismo formulario que la carga manual, ya
completado, y si pasaron más de 4 horas se sugiere revisar la duración. Las cargas aceptan de 1 a 720 minutos y
días hasta hoy. Las categorías de práctica de WordGana no se ofrecen para cargar a mano (son automáticas); hay
seis fijas (escucha, lectura, clase, conversación, escritura a mano, otras apps) y las personalizadas que se
crean desde el formulario o desde Categorías. Quitar una personalizada con tiempo registrado la archiva.
**Por qué:** guardar el inicio evita depender de procesos en segundo plano en iOS. Un único formulario mantiene
consistente la carga. Archivar en vez de borrar evita que el historial y los totales muestren registros
huérfanos.

## 2026-10-08 — Logros de tiempo de estudio

**Decisión:** ocho logros nuevos en la categoría "Tiempo de estudio": 1, 10, 50, 100, 500 y 1000 horas, y meta
diaria cumplida 7 y 30 días seguidos. Cuentan todas las fuentes (automático, cronómetro y manual). Además de al
terminar una ronda, se evalúan al guardar tiempo, y la celebración aparece arriba de la pantalla de tiempo.
**Por qué:** el registro es personal y de confianza, así que el tiempo cargado a mano vale lo mismo que el
automático. Celebrar donde se cargó el tiempo da la respuesta en el momento de la acción.

## 2026-10-08 — Colores por categoría en el gráfico día por día

**Decisión:** las columnas del gráfico día por día se apilan por grupo de categoría con la paleta categórica de
referencia del skill de visualización (8 colores en orden fijo, validados contra las superficies reales de la
app: blanco en claro y `#202024` en oscuro). Grupos: Letras, Palabras, Oraciones (ambos silabarios juntos),
Escucha, Lectura, Clase, Conversación y Escritura a mano; Otras apps y las categorías personalizadas van juntas en
"Otras", en gris. Cada grupo tiene siempre el mismo color, en el gráfico y en las barras por categoría. Hay
leyenda y, al tocar un día, el detalle por categoría en texto.
**Por qué:** con un solo color, un día con varias categorías se veía como un bloque uniforme. Más de ocho colores
ya no se distinguen bien (tampoco con daltonismo), así que lo menos frecuente se agrupa. Tres colores tienen
contraste menor a 3:1 sobre blanco; la leyenda y el detalle en texto cubren esa lectura, como exige la paleta.

## 2026-10-09 — Portugués de Brasil e italiano antes de la 1.0

**Decisión:** la app sale con seis idiomas: español, inglés, portugués de Brasil, francés, alemán e italiano. Los
significados nuevos viven en `src/data/translationsPtIt.ts`, con la misma clave en español que `translations.ts`,
y el test de traducciones exige los cinco idiomas para cada palabra y oración. Cualquier `pt-*` usa portugués de
Brasil. En la tienda, inglés es el idioma principal y el nombre es el mismo en todas las fichas.
**Por qué:** Brasil tiene una comunidad grande que estudia japonés e Italia suma un mercado europeo más; hacerlo
antes de la primera versión evita publicar una actualización solo de idiomas. Un archivo aparte evita reescribir
las 650 entradas existentes y deja claro qué falta si se agrega contenido.

## 2026-10-09 — Revisión de traducciones y fallback al inglés

**Decisión:** si a una palabra le falta el significado en un idioma, se muestra el inglés; el español queda solo
cuando tampoco hay inglés. Se precisaron tres glosas en español (きまる «quedar decidido», せんぱい «compañero con
más experiencia», ちゃわん «tazón para arroz») junto con sus claves de traducción. Los placeholders de respuesta
salen de i18n en lugar de estar en japonés. El detalle está en `docs/TRANSLATION_AUDIT.md`.
**Por qué:** `AGENTS.md` fija el inglés como idioma fuente de respaldo y alguien que eligió italiano lo entiende
mejor que el español. Las estadísticas se indexan por kana, así que cambiar la glosa no borra el progreso.

## 2026-10-09 — Icono con あ generado con AppKit

**Decisión:** los PNG del icono (iOS y PWA) se generan con `scripts/make-icons.swift`, que dibuja la あ blanca de
`public/icon.svg` sobre el naranja, sin canal alfa. Reemplaza a `make-icons.mjs`, que dibujaba un círculo blanco.
**Por qué:** el script anterior escribía PNG a mano y no podía dibujar texto, así que la build 1 salió con un
icono provisorio. AppKit viene con macOS y Xcode, así que no suma dependencias. La build 1 ya estaba en App
Store Connect, por eso esta va como build 2.

## 2026-10-09 — Icono en capas: あ y ア, build 3

**Decisión:** el icono pasa a ser un documento de Icon Composer (`ios/App/App/AppIcon.icon`) con dos capas
vectoriales: una あ blanca adelante y una ア translúcida atrás, sobre el mismo naranja. `scripts/make-icons.swift`
genera las capas, el `icon.json` y los PNG planos con la misma geometría (PWA y asset catalog). Va como build 3.
**Por qué:** la app enseña los dos silabarios y el icono anterior mostraba uno solo; muchas apps de kana usan
una あ sobre color. Las HIG piden capas para que iOS 26 aplique el vidrio y arme las variantes oscura,
transparente y teñida (`app-icons.md › Layer design`), y sugieren formas superpuestas con distinta opacidad para
dar profundidad. La あ no es translúcida para que se lea nítida en tamaños chicos.

## 2026-10-09 — Tamaño de texto del sistema y ajustes de la revisión de diseño (build 4)

**Decisión:** la base de `rem` sigue al tamaño de texto de iOS (`src/lib/textSize.ts`): mide el estilo
`-apple-system-body` de WebKit (17 px con el tamaño estándar) y escala la raíz en proporción, entre 80 % y 200 %.
Solo aplica con pantalla táctil, porque en macOS ese estilo mide 13 px y achicaría la PWA. Además: botones
principales sin mayúsculas, texto mínimo de 12 px en el gráfico, selectores y campo de hora de 44 px, borde de
campos de texto con 3:1 de contraste (`--field-border`), "Editar" en color de texto y candado de línea en lugar
del emoji. Con texto grande, las tarjetas de Inicio pasan a una columna y los selectores de Tiempo de estudio
bajan de línea.
**Por qué:** salen de la revisión con las guías de Apple (`accessibility.md › Support larger text sizes`,
`writing.md` sobre mayúsculas consistentes, `branding.md` sobre usar el color de marca con moderación). Medir y
escalar deja la app igual que antes con el tamaño estándar; usar `font: -apple-system-body` directo en `html` la
agrandaba un 6 %. El tope de 200 % es lo que piden las guías; más grande, la tarjeta de práctica no entra.
Se verificó con WebKit en 320, 375 y 393 px de ancho, al 100 % y al 200 %, en los seis idiomas, sin desbordes.
