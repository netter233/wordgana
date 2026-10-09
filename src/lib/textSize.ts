/**
 * Tamaño de texto del sistema (Dynamic Type) en iOS y iPadOS. WebKit expone el estilo `-apple-system-body`,
 * que mide 17 px con el tamaño estándar y cambia con Ajustes → Accesibilidad → Texto más grande. Escalamos la
 * base de `rem` en la misma proporción, así con el tamaño estándar la app se ve igual que antes.
 */
const DEFAULT_BODY_PX = 17;
const MIN_SCALE = 0.8;
/** Las guías de Apple piden al menos 200 %; más allá, la tarjeta de práctica y el gráfico no entran. */
const MAX_SCALE = 2;

export function textScaleFor(systemBodyPx: number): number {
  if (!Number.isFinite(systemBodyPx) || systemBodyPx <= 0) return 1;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, systemBodyPx / DEFAULT_BODY_PX));
}

function systemBodyPx(): number | null {
  try {
    // En macOS el mismo estilo mide 13 px y achicaría la PWA: solo aplica con pantalla táctil.
    if (navigator.maxTouchPoints === 0 || !CSS.supports('font', '-apple-system-body')) return null;
    const probe = document.createElement('span');
    probe.style.font = '-apple-system-body';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.textContent = 'a';
    document.body.appendChild(probe);
    const px = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return px;
  } catch {
    return null;
  }
}

function apply() {
  const px = systemBodyPx();
  if (px === null) return;
  const scale = textScaleFor(px);
  document.documentElement.style.fontSize = scale === 1 ? '' : `${scale * 100}%`;
}

/** Aplica el tamaño del sistema y lo vuelve a leer al volver a la app, por si cambió en Ajustes. */
export function followSystemTextSize() {
  apply();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') apply();
  });
}
