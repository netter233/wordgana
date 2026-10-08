# Instalar y actualizar WordGana en tu iPhone

Esta guía te permite pasar la versión del proyecto de tu Mac al iPhone usando Xcode.
Una vez instalada, WordGana funciona sin tener la Mac conectada ni un servidor de desarrollo encendido.

## Para actualizarla la próxima vez

1. Conectá el iPhone a la Mac por cable y desbloquealo.
2. Abrí **Terminal** y ejecutá estos comandos, uno por uno. Si alguno da un error, resolvelo antes de seguir:

   ```bash
   cd /Users/brunokupferberg/Documents/Development/WordGana
   npm test
   npm run ios:sync
   npm run ios:open
   ```

3. En la barra superior de Xcode, elegí el esquema **App** y el destino **iPhone de Bruno**.
4. Presioná **Run** (el triángulo de la barra superior) o **⌘R**.
5. Esperá a que termine y comprobá que WordGana se abra en el iPhone.

`npm run ios:sync` compila el código web y lo copia al proyecto iOS. Ya incluye `npm run build`.
`npm run ios:open` abre el proyecto en Xcode. **Abrir Xcode por sí solo no instala la actualización: falta presionar Run.**

Actualizá sobre la app existente para conservar los datos locales. Evitá desinstalarla y mantené el mismo Bundle Identifier.

## Configuración inicial

En esta Mac ya están instalados Xcode, Node.js y npm, y el proyecto tiene configurada la firma.
El iPhone fue detectado con el modo desarrollador activado el 28 de septiembre de 2026.
Estos pasos sirven si necesitás volver a configurarlo o usar otra Mac.

### 1. Preparar el proyecto

Abrí Terminal y entrá a la carpeta:

```bash
cd /Users/brunokupferberg/Documents/Development/WordGana
```

Si moviste el proyecto, reemplazá esa ruta por la nueva. Instalá las dependencias la primera vez
o cuando cambien las del proyecto:

```bash
npm install
```

Después ejecutá, uno por uno:

```bash
npm test
npm run ios:sync
npm run ios:open
```

Los tests deben terminar sin fallos y la sincronización debe mostrar `Sync finished`.
Si necesitás abrir el proyecto manualmente, está en `ios/App/App.xcodeproj`.

### 2. Conectar y preparar el iPhone

1. Conectalo por cable y desbloquealo.
2. Si aparece **Confiar en esta computadora**, tocá **Confiar** e ingresá el código del iPhone.
3. Si Xcode pide modo desarrollador, abrí **Ajustes → Privacidad y seguridad → Modo desarrollador** en el iPhone.
4. Activalo, reiniciá cuando se solicite y confirmá la activación después del reinicio.

Si esa opción no aparece, conectá primero el iPhone con Xcode abierto y dejá que complete el emparejamiento.
La primera preparación del dispositivo puede tardar varios minutos.

### 3. Configurar la cuenta y la firma en Xcode

1. Abrí **Xcode → Settings → Apple Accounts** (en otras versiones aparece como **Accounts**).
2. Agregá tu cuenta Apple si todavía no figura.
3. Volvé al proyecto. En el panel izquierdo, seleccioná el proyecto **App**.
4. En **TARGETS**, seleccioná **App** y abrí **Signing & Capabilities**.
5. Dejá activado **Automatically manage signing**.
6. En **Team**, elegí tu equipo de desarrollo. Si usás una cuenta gratuita, puede aparecer como **Personal Team**.
7. Verificá que el **Bundle Identifier** sea `com.brunokupferberg.wordgana`.

El identificador del equipo configurado en este proyecto es `Y5K3R5MZ4Q`.
Xcode debe poder resolver la firma sin errores antes de instalar.

### 4. Instalar desde Xcode

1. En la barra superior, seleccioná el esquema **App**.
2. En el selector de destino junto al esquema, elegí **iPhone de Bruno**.
   Seleccioná el dispositivo físico, no un simulador ni un destino genérico como **Any iOS Device**.
3. Presioná **⌘R** o el botón **Run**.
4. Mantené el iPhone desbloqueado mientras Xcode compila, firma e instala la app.

La instalación está lista cuando WordGana se abre en el iPhone. Un mensaje **Build Succeeded**
confirma la compilación; todavía puede quedar pendiente la instalación o la autorización del desarrollador.

### 5. Si aparece “Desarrollador no fiable”

Durante la instalación del 28 de septiembre de 2026, iOS rechazó la apertura con un error que mencionaba
la firma, los permisos de la app o la confianza del perfil. La comprobación local de la firma pasó;
la confianza del perfil quedó pendiente de comprobar en el iPhone.

En el iPhone:

1. Abrí **Ajustes → General → VPN y gestión de dispositivos**.
2. En **App del desarrollador**, seleccioná el perfil de tu cuenta Apple.
3. Tocá **Confiar** y confirmá lo que pida el dispositivo. El texto puede variar según la versión de iOS.
4. Mantené conexión a internet mientras se verifica el perfil.
5. Volvé a abrir **WordGana** desde su ícono, o presioná **⌘R** en Xcode.

Confiar en la computadora y confiar en el desarrollador son dos pasos distintos.
Si no aparece el perfil, intentá instalar con **Run** y revisá el error que muestre Xcode.

## Comprobar que quedó lista

- WordGana abre desde su ícono en el iPhone.
- Podés iniciar una práctica.
- Si instalaste una actualización, ves el cambio que esperabas y tu progreso anterior sigue disponible.
- Podés desconectar el cable y volver a abrirla.

## Resolver problemas

| Lo que aparece | Qué hacer |
| --- | --- |
| `npm: command not found` | Instalá Node.js desde su sitio oficial, con npm, y volvé a abrir Terminal. |
| No encuentra `package.json` | Ejecutá el comando `cd` del principio para entrar a la carpeta WordGana. |
| Faltan dependencias o no encuentra Vite/Capacitor | Ejecutá `npm install` dentro de WordGana y repetí `npm run ios:sync`. |
| Falla `npm test` o `npm run ios:sync` | Revisá el primer error de Terminal y corregilo antes de instalar; podrías estar copiando una versión vieja. |
| El iPhone no aparece o figura desconectado | Desbloquealo, reconectá el cable y aceptá la confianza en la computadora. Esperá a que Xcode termine de prepararlo. |
| `Developer Mode disabled` | Activá el modo desarrollador como se explica arriba y completá el reinicio y la confirmación. |
| `No Account for Team` | Agregá la cuenta correspondiente en los ajustes de Xcode y revisá **Team** en **Signing & Capabilities**. |
| `No provisioning profiles` o un error de firma | Revisá la cuenta, **Team**, **Automatically manage signing** y la conexión a internet. Volvé a intentar **Run**. |
| `A build only device cannot be used to run this target` | Seleccioná **iPhone de Bruno** como destino físico. |
| “Desarrollador no fiable” o un error que menciona un perfil no confiado | Seguí el paso 5. Si ya confiaste en el perfil, revisá también la firma en Xcode; el mensaje puede incluir otras causas. |
| `Couldn't load local-notifications because it is already opened from another project or workspace` o `Missing package product` | Hay otra ventana de Xcode abierta con un archivo de la carpeta WordGana (por ejemplo, `AGENTS.md`), y Xcode toma esa carpeta como otro proyecto. Cerrá esa ventana, dejá solo `App.xcodeproj` y elegí **File → Packages → Resolve Package Versions**. Si sigue, usá **File → Packages → Reset Package Caches**. |
| La app no refleja los últimos cambios | Ejecutá `npm run ios:sync` y después **⌘R**. Comprobá que estés abriendo la app instalada desde Xcode. |
| Dejó de abrir después de varios días | Si usás un **Personal Team** gratuito, el perfil caduca a los 7 días. Volvé a conectar el iPhone y ejecutá **Run** para renovar la instalación. |

Si un error persiste, guardá el mensaje completo de Terminal o Xcode para poder identificar la causa.

## Referencias oficiales

- [Apple: ejecutar una app en un dispositivo](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices).
- [Apple: activar el modo desarrollador](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device).
- [Apple: confiar en un desarrollador](https://support.apple.com/es-es/118254). Esta página trata apps de empresa y documenta la ubicación de los controles de confianza; WordGana se instala con Xcode.
- [Apple: cuentas de desarrollo y límites de Personal Team](https://developer.apple.com/help/account/basics/about-your-developer-account).

Guía actualizada el 28 de septiembre de 2026. Los nombres de algunos menús pueden variar con la versión de Xcode o iOS.
