# WordGana

App para practicar hiragana y katakana de forma incremental: marcás las filas del silabario que ya sabés y
practicás solo con material formado por esas letras. Funciona como PWA y como app de iPhone (Capacitor), sin
conexión y sin cuentas. Interfaz en español, inglés, francés y alemán.

## Qué tiene

- **Tres tipos de práctica:** Letras (kana sueltos de las filas activas), Palabras (cerca de 450 en hiragana y
  más de 140 en katakana, con significado) y Oraciones (se desbloquean al completar todas las filas).
- **Dos modos:** Leer (kana → romaji) y Escribir (romaji → kana con teclado japonés). Se aceptan variantes de
  romaji como shi/si o tsu/tu.
- **Progreso por ítem:** cada ítem se afianza con dos aciertos seguidos en el mismo modo. Lo que fallás vuelve
  más seguido y se puede repasar al terminar la ronda.
- **Pronunciación:** botón para escuchar después de responder, con la voz japonesa del sistema (sin red).
  Opción para reproducir automáticamente.
- **Estadísticas:** totales históricos, aciertos por modo y las letras y palabras que más cuestan.
- **Tiempo de estudio:** la práctica en la app se registra sola; lo que estudiás afuera (clases, lectura,
  escucha o categorías propias) se suma con cronómetro o a mano. Meta diaria, gráfico por día, reparto por
  categoría e historial editable.
- **Logros:** 30 logros por rondas, racha, horas de estudio, vocabulario, rondas perfectas y silabarios.
- **Racha y recordatorio diario:** el recordatorio (solo en la app nativa) avisa a la hora elegida y solo los
  días que todavía no practicaste.

### Japonés para un viaje

Oraciones incluye 32 frases para compras y konbini, restaurantes y cafeterías, transporte, hoteles y paseos.
Elegí **Oraciones** después de marcar todas las filas del silabario: las frases se mezclan con las anteriores
en rondas de 5, tanto en Leer como en Escribir, con significado en los cuatro idiomas.

| Situación | Ejemplo en kana | Significado |
| --- | --- | --- |
| Mostrador de Lawson | からあげクン レギュラーを ひとつ ください。 | Un Karaage-kun clásico, por favor. |
| Mostrador de FamilyMart | ファミチキを ひとつ ください。 | Un Famichiki, por favor. |
| Caja | カードで はらえますか。 | ¿Puedo pagar con tarjeta? |
| Restaurante | おかいけいを おねがいします。 | La cuenta, por favor. |
| Transporte | この バスは くうこうへ いきますか。 | ¿Este colectivo va al aeropuerto? |
| Hotel | チェックインを おねがいします。 | Quisiera hacer el check-in. |

Las frases se escriben sin kanji para practicar kana; en carteles reales algunas palabras pueden aparecer
en kanji. Los nombres de productos mantienen su escritura: **からあげクン レギュラー** y
**からあげクン レッド**, de [Lawson](https://www.lawson.co.jp/recommend/original/fry/), mezclan hiragana y
katakana; **ファミチキ**, de [FamilyMart](https://www.family.co.jp/goods/friedfoods/0253116.html), usa katakana.
En Palabras de katakana también se pueden practicar チキン, コロッケ, レシート, レギュラー y レッド.

Todo se guarda en el dispositivo (localStorage). No hay backend, analíticas ni publicidad.

## Desarrollo

```
npm install
npm run dev            # servidor local en http://localhost:5173
npm test               # vitest
npm run build          # build de producción en dist/
npm run preview        # sirve dist/ (para probar PWA/offline)
npm run ios:sync       # build + copia al proyecto iOS
npm run ios:open       # abre el proyecto en Xcode
```

### Probar desde el celular (misma red WiFi)

```
npm run dev -- --host
```

Va a mostrar una URL tipo `http://192.168.x.x:5173`. Abrila desde el navegador del celular estando en la
misma red que la compu. El recordatorio diario no aparece en la versión web: solo existe en la app nativa.

## Instalar en iPhone

### Como app nativa desde una Mac

Requiere Xcode, un Apple ID configurado en Xcode y el iPhone conectado. La guía paso a paso está en
[`docs/IPHONE_INSTALL.md`](docs/IPHONE_INSTALL.md).

```bash
npm run ios:sync
npm run ios:open
```

En Xcode elegí tu iPhone como destino y presioná **Run** (⌘R). Con una cuenta gratuita de Apple la instalación
vence a los 7 días; con el Apple Developer Program dura un año.

### Como PWA

1. Abrí la URL de WordGana en **Safari**.
2. Tocá compartir → **Agregar a pantalla de inicio**.

Queda un ícono que abre la app sin la barra de Safari y funciona offline después de la primera visita.

## Instalar en Android (PWA)

En Chrome, abrí la URL y tocá el menú (⋮) → **Instalar app**.

## Publicar en la App Store

La guía con los pasos, los textos de la ficha y la checklist está en [`docs/APP_STORE.md`](docs/APP_STORE.md).
Las capturas de pantalla están en [`docs/app-store-screenshots/`](docs/app-store-screenshots/) y la política de
privacidad en [`docs/PRIVACY.md`](docs/PRIVACY.md).

## Documentación

| Archivo | Para qué |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Stack, convenciones y cómo continuar el trabajo |
| [`docs/PLAN.md`](docs/PLAN.md) | Diseño y etapas de implementación |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Decisiones de diseño y su porqué |
| [`docs/IPHONE_INSTALL.md`](docs/IPHONE_INSTALL.md) | Instalar y actualizar en un iPhone desde Xcode |
| [`docs/APP_STORE.md`](docs/APP_STORE.md) | Publicar en la App Store |
