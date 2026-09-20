# Instalar WordGana en iPhone desde una Mac

WordGana usa Capacitor para ejecutar el mismo código web como una app local de iOS. La app funciona sin
un servidor de desarrollo y se instala directamente desde Xcode.

## Requisitos

- Una Mac con Xcode instalado.
- Un Apple ID agregado en **Xcode → Settings → Accounts**.
- El iPhone conectado por cable o emparejado con la Mac, desbloqueado y en Developer Mode.
- Node.js y npm instalados.

El proyecto ya está configurado con:

- Bundle ID: `com.brunokupferberg.wordgana`
- Apple Development Team: `Y5K3R5MZ4Q`
- Destino mínimo: iOS 15

## Primera instalación

Desde la carpeta del proyecto:

```bash
npm install
npm run ios:sync
npm run ios:open
```

En Xcode:

1. Seleccioná el proyecto **App**.
2. En **Signing & Capabilities**, verificá que **Automatically manage signing** esté activado.
3. Seleccioná **iPhone de Bruno** como destino.
4. Presioná **Run** (▶) o `⌘R`.
5. Aceptá en el iPhone cualquier pedido de confianza o Developer Mode.

## Instalar una actualización

Después de cambiar el código web:

```bash
npm run ios:sync
npm run ios:open
```

Elegí el iPhone y presioná **Run** en Xcode. `ios:sync` compila la versión de producción y copia los archivos
nuevos dentro del proyecto iOS antes de abrirlo.

## Verificar antes de instalar

```bash
npm test
npm run build
```

## Problemas comunes

- **El iPhone figura offline:** desbloquealo, reconectá el cable y aceptá **Confiar en esta computadora**.
- **No Account for Team:** agregá `brunokup97@gmail.com` en **Xcode → Settings → Accounts**.
- **No provisioning profiles:** abrí **Signing & Capabilities**, confirmá el Team y dejá que Xcode gestione
  la firma automáticamente.
- **Developer Mode desactivado:** activalo en **Ajustes → Privacidad y seguridad → Developer Mode** y
  reiniciá el iPhone cuando iOS lo solicite.
- **La app no refleja cambios:** ejecutá otra vez `npm run ios:sync` antes de correrla desde Xcode.

Con una cuenta Apple gratuita, la firma de desarrollo puede vencer y requerir que vuelvas a instalar la app
desde Xcode. Una cuenta Apple Developer paga extiende las opciones de distribución.
