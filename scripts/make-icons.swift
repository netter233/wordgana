// Genera los iconos PNG a partir del diseño de public/icon.svg: あ blanca sobre naranja, sin transparencia
// (la App Store rechaza iconos con canal alfa). iOS redondea las esquinas solo.
// Uso, desde la raíz del repo: swiftc -O scripts/make-icons.swift -o /tmp/make-icons && /tmp/make-icons
import AppKit

func makeIcon(size: Int, path: String) throws {
  let side = CGFloat(size)
  // 32 bits por píxel sin alfa: Core Graphics no dibuja sobre RGB de 24 bits.
  let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8, samplesPerPixel: 3,
    hasAlpha: false, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 32)!
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  NSColor(srgbRed: 0xc2 / 255, green: 0x41 / 255, blue: 0x0c / 255, alpha: 1).setFill()
  NSRect(x: 0, y: 0, width: side, height: side).fill()
  let font = NSFont(name: "HiraginoSans-W6", size: side * 0.58)
    ?? NSFont.systemFont(ofSize: side * 0.58, weight: .semibold)
  let text = NSAttributedString(string: "あ", attributes: [.font: font, .foregroundColor: NSColor.white])
  let bounds = text.boundingRect(with: NSSize(width: side, height: side), options: [.usesDeviceMetrics])
  text.draw(at: NSPoint(x: (side - bounds.width) / 2 - bounds.minX, y: (side - bounds.height) / 2 - bounds.minY))
  NSGraphicsContext.restoreGraphicsState()
  try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}

try makeIcon(size: 1024, path: "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
try makeIcon(size: 512, path: "public/icon-512.png")
try makeIcon(size: 192, path: "public/icon-192.png")
try makeIcon(size: 180, path: "public/apple-touch-icon.png")
print("icons written")
