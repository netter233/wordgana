# Revisión de traducciones — 9 de octubre de 2026

La cobertura de traducciones estaba completa, pero había errores de concordancia, significados
imprecisos y algunos textos y nombres accesibles sin localizar. Se corrigieron los problemas
detectados. La mayoría de las traducciones existentes resultó adecuada para su contexto.

## Alcance

- Seis idiomas: inglés, español rioplatense, francés, alemán, portugués de Brasil e italiano.
- Interfaz: inicio, selección de filas, modos de práctica, respuestas, resultados, ajustes,
  estadísticas, logros, tiempo de estudio, cronómetro, categorías, formularios e historial.
- 448 entradas de vocabulario en hiragana, 148 en katakana y 62 oraciones: 658 entradas en total.
- Títulos y descripciones de los 30 logros, mensajes de notificaciones y avisos de audio.
- Nombres accesibles, placeholders, selector de idioma y registro de idiomas en iOS.
- Tras los cambios, 194 claves de mensajes, incluidos los nombres de categorías e iconos.

## Hallazgos corregidos

| Área | Problema | Corrección |
| --- | --- | --- |
| Italiano | «Caratteri consolidate» tenía concordancia femenina con un sustantivo masculino. | Etiqueta «Padronanza: Caratteri», válida también para palabras y frases. |
| Italiano | «gli katakana» usaba un artículo incorrecto. | «i caratteri katakana», también en la descripción del logro. |
| Italiano | «andén» se traducía como «binario», que designa la vía. | «banchina (della stazione)». |
| Italiano | La glosa de medicamento usaba «medicina», menos precisa, y «pulso» podía confundirse con la muñeca. | «medicinale» y «polso arterioso». Son mejoras de precisión; «polso» también puede significar pulso. |
| Francés | «Note (facultatif)» tenía concordancia masculina. | «Note (facultative)». |
| Francés | «consignes à pièces» resultaba poco natural para los lockers de monedas. | «consignes automatiques». |
| Alemán | Los nombres de los silabarios aparecían en minúscula en algunas instrucciones. | «Hiragana» y «Katakana»; se ajustó la redacción de las instrucciones. |
| Portugués | «Limpar todas» sugería limpiar o borrar y «Próxima» no identificaba el paso siguiente. | «Desmarcar todas» y «Próximo». |
| Conteos | Los nombres de elementos y algunos resúmenes conservaban el plural cuando había uno. | Singular y plural para cada tipo de práctica, con concordancia en las instrucciones y filas seleccionadas. |
| Vocabulario | Algunas glosas eran ambiguas: decidirse/quedar decidido, edad/experiencia de un senpai, arroz/recipiente para arroz y favorito/algo que gusta. | Se precisaron los significados correspondientes y las claves de traducción, manteniendo el kana. |
| Interfaz | Los placeholders de escritura contenían instrucciones en japonés y la celebración final mantenía una frase japonesa sin traducir. | Textos en el idioma elegido; el contenido japonés de estudio permanece en japonés. |
| Accesibilidad | Los 12 iconos para elegir una categoría carecían de nombres localizados. | Nombres en los seis idiomas y contenido decorativo oculto al lector de pantalla. |
| Audio | El aviso genérico daba instrucciones específicas de iPhone también en la web. | Aviso referido a los ajustes de idioma y voz del dispositivo. |
| Idioma automático | La opción mostraba el idioma elegido en lugar del idioma que se usaría al activar «Automático». | Ahora muestra el idioma detectado del dispositivo. |
| Fallback | Una traducción ausente usaba español, aunque el estándar del proyecto establece inglés. | Fallback al inglés cuando existe; solo se conserva la glosa original cuando tampoco existe inglés. |
| Validación | La cobertura solo verificaba textos no vacíos del corpus; no cubría interfaz, logros ni nombres de iconos. | Pruebas adicionales de claves, etiquetas, funciones interpoladas, plurales, controles renderizados e idiomas de iOS. También se rechazan traducciones hechas solo de espacios. |

Las glosas de senpai y del recipiente para arroz se aclararon también en español. No se cambiaron
los kana, las respuestas aceptadas ni los identificadores de progreso, categorías o preferencias.
Los títulos de logros conservan sus adaptaciones idiomáticas; no necesitan ser traducciones literales.

## Comprobaciones

- `npm test`: 177 pruebas aprobadas en 16 archivos.
- `npm run build`: aprobado.
- `npm run ios:sync`: aprobado tras los cambios finales.
- Cobertura completa del corpus, mensajes y títulos de logros en los seis idiomas.
- Renderizado de los nombres accesibles y prompts de práctica en los seis idiomas.
- La opción automática mantiene separado el idioma elegido del idioma del dispositivo.
- Los kana originales del corpus coinciden con los anteriores a la revisión.

La cobertura automática no certifica por sí sola la calidad lingüística: esta revisión
incluyó la lectura de los mensajes y de las tablas de significados.

### Comprobación visual en Chrome

La captura inicialmente falló con ScreenCaptureKit `-3811`, incluso tras el reinicio.
Después de que el usuario trajo Chrome al escritorio visible, la conexión nativa funcionó
y se pudo revisar WordGana. No se confirmó la causa del fallo anterior.

- Inicio y ajustes en los seis idiomas, en una vista móvil de 375 × 667 CSS píxeles.
- Temas claro y oscuro mediante las opciones de emulación de Chrome, y vista de escritorio.
- Etiquetas largas en alemán y francés: se adaptan al ancho comprobado sin recortes.
- Foco visible y operación del selector de idioma con teclado; foco del campo de práctica.
- Práctica y feedback en alemán y portugués, con significado localizado y nombre accesible
  del botón de pronunciación. Se confirmó «Próximo» en portugués.
- Etiquetas de dominio en italiano y acción «Desmarcar todas» en portugués.
- Logros, estadísticas, tiempo de estudio y formulario de tiempo en francés.
- Selector de iconos de categoría: los 12 nombres franceses aparecen en el árbol de
  accesibilidad, sin anunciar el emoji decorativo como parte del nombre.
- Idioma automático restaurado al terminar; emulaciones desactivadas y app abierta en Chrome.

No se detectaron nuevos problemas de traducción ni recortes en este recorrido. La revisión
visual fue un muestreo de pantallas y estados, no todas las combinaciones de pantalla,
idioma y tema. Los tamaños de controles se revisaron en el CSS existente; no hubo cambios
de estilos. Quedan fuera una prueba con un lector de pantalla real y una prueba en un
dispositivo iOS real. Las dos respuestas de prueba se registraron en la instancia local
de `127.0.0.1:5173`; no se completaron rondas.

## Referencias lingüísticas consultadas

- [Treccani: banchina](https://www.treccani.it/enciclopedia/banchina/), para distinguir andén y vía.
- [Treccani: polso](https://www.treccani.it/vocabolario/polso/), que incluye tanto el significado fisiológico como el anatómico.
- [Diccionarios en Kotobank: 先輩](https://kotobank.jp/word/%E5%85%88%E8%BC%A9-551038), para precisar el contexto de senpai.
- [Diccionario en goo: 決まる](https://dictionary.goo.ne.jp/word/%E6%B1%BA%E3%82%8B_%28%E3%81%8D%E3%81%BE%E3%82%8B%29/), para la glosa «quedar decidido».
