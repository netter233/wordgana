# WordGana

PWA para practicar hiragana de forma incremental: marcás las filas del silabario que ya sabés y practicás
con palabras reales formadas solo por esas letras, en modo Leer (hiragana → romaji) o Escribir
(romaji → hiragana con teclado japonés).

## Desarrollo

```
npm install
npm run dev            # servidor local en http://localhost:5173
npm test               # vitest
npm run build          # build de producción en dist/
npm run preview        # sirve dist/ (para probar PWA/offline)
```

### Probar desde el celular (misma red WiFi)

```
npm run dev -- --host
```

Va a mostrar una URL tipo `http://192.168.x.x:5173`. Abrila desde el navegador del celular
(Safari en iPhone, Chrome en Android) estando en la misma red que la compu.

## Instalar como app en iPhone (PWA)

1. Abrí la URL de WordGana en **Safari** (tiene que ser Safari, no Chrome ni otro navegador, para poder
   instalarla en iOS).
2. Tocá el botón de compartir (el cuadrado con la flecha hacia arriba).
3. Elegí **"Agregar a pantalla de inicio"**.
4. Confirmá el nombre y tocá **"Agregar"**.

Queda un ícono en la pantalla de inicio que abre la app en modo standalone (sin la barra de Safari) y
funciona offline después de la primera visita, gracias al service worker.

## Instalar en Android

En Chrome, abrí la URL y tocá el menú (⋮) → **"Instalar app"** o **"Agregar a pantalla de inicio"**.

## Publicar en App Store (futuro)

El mismo build de esta PWA se puede envolver con [Capacitor](https://capacitorjs.com/) en un proyecto
Xcode para subirlo a la App Store. Requiere una Mac y una cuenta de Apple Developer. Ver `docs/PLAN.md`
(Etapa 7) y `docs/DECISIONS.md` para el detalle de esta decisión.
