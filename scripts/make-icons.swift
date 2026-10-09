// Genera el icono de WordGana: una あ blanca delante de una ア translúcida, sobre naranja (#c2410c).
// - ios/App/App/AppIcon.icon: documento de Icon Composer con dos capas vectoriales (iOS 26 en adelante;
//   el sistema arma las variantes oscura, transparente y teñida a partir de las capas).
// - PNG planos sin canal alfa para iOS anteriores y para la PWA.
// Uso, desde la raíz del repo: swiftc -O scripts/make-icons.swift -o /tmp/make-icons && /tmp/make-icons
import AppKit

let canvas: CGFloat = 1024
let orange = (r: 0xc2 / 255.0, g: 0x41 / 255.0, b: 0x0c / 255.0)
let font = CTFontCreateWithName("HiraginoSans-W6" as CFString, 100, nil)

struct Glyph {
  let text: String
  let file: String
  let height: CGFloat   // alto de la letra en px del lienzo de 1024
  let center: CGPoint   // centro, con y hacia abajo como en SVG
  let opacity: CGFloat
  let translucent: Bool // la de atrás deja ver el fondo; la de adelante queda blanca y nítida
}

// La ア va atrás y desplazada; la あ adelante. Juntas dicen "hiragana y katakana".
let glyphs = [
  Glyph(text: "ア", file: "katakana-a.svg", height: 430, center: CGPoint(x: 618, y: 400), opacity: 0.4, translucent: true),
  Glyph(text: "あ", file: "hiragana-a.svg", height: 520, center: CGPoint(x: 456, y: 584), opacity: 1, translucent: false),
]

/// Contorno de la letra en coordenadas del lienzo (y hacia abajo).
func outline(_ glyph: Glyph) -> CGPath {
  var unichar = Array(glyph.text.utf16)
  var id = CGGlyph()
  CTFontGetGlyphsForCharacters(font, &unichar, &id, 1)
  let raw = CTFontCreatePathForGlyph(font, id, nil)!
  let box = raw.boundingBoxOfPath
  let scale = glyph.height / box.height
  var transform = CGAffineTransform(translationX: glyph.center.x, y: glyph.center.y)
    .scaledBy(x: scale, y: -scale)
    .translatedBy(x: -box.midX, y: -box.midY)
  return raw.copy(using: &transform)!
}

func svgPath(_ path: CGPath) -> String {
  var d = ""
  func p(_ point: CGPoint) -> String { String(format: "%.1f %.1f", point.x, point.y) }
  path.applyWithBlock { element in
    let e = element.pointee
    switch e.type {
    case .moveToPoint: d += "M\(p(e.points[0]))"
    case .addLineToPoint: d += "L\(p(e.points[0]))"
    case .addQuadCurveToPoint: d += "Q\(p(e.points[0])) \(p(e.points[1]))"
    case .addCurveToPoint: d += "C\(p(e.points[0])) \(p(e.points[1])) \(p(e.points[2]))"
    case .closeSubpath: d += "Z"
    @unknown default: break
    }
  }
  return d
}

func writeIconDocument(at dir: String) throws {
  let assets = "\(dir)/Assets"
  try FileManager.default.createDirectory(atPath: assets, withIntermediateDirectories: true)
  for glyph in glyphs {
    let svg = """
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <path fill="#ffffff" d="\(svgPath(outline(glyph)))"/>
      </svg>

      """
    try svg.write(toFile: "\(assets)/\(glyph.file)", atomically: true, encoding: .utf8)
  }
  // Cada letra en su propio grupo para que el vidrio y la sombra separen las dos capas.
  let groups = glyphs.map { glyph in
    """
        {
          "layers" : [
            {
              "image-name" : "\(glyph.file)",
              "name" : "\(glyph.file.replacingOccurrences(of: ".svg", with: ""))",
              "opacity" : \(glyph.opacity)
            }
          ],
          "shadow" : {
            "kind" : "neutral",
            "opacity" : 0.5
          },
          "translucency" : {
            "enabled" : \(glyph.translucent),
            "value" : 0.4
          }
        }
    """
  }
  let json = """
    {
      "fill" : {
        "solid" : "srgb:\(String(format: "%.5f,%.5f,%.5f", orange.r, orange.g, orange.b)),1.00000"
      },
      "groups" : [
    \(groups.reversed().joined(separator: ",\n"))
      ],
      "supported-platforms" : {
        "squares" : [
          "iOS"
        ]
      }
    }

    """
  try json.write(toFile: "\(dir)/icon.json", atomically: true, encoding: .utf8)
}

func writePNG(size: Int, path: String) throws {
  // 32 bits por píxel sin alfa: Core Graphics no dibuja sobre RGB de 24 bits.
  let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8, samplesPerPixel: 3,
    hasAlpha: false, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 32)!
  let context = NSGraphicsContext(bitmapImageRep: rep)!.cgContext
  context.setFillColor(CGColor(srgbRed: orange.r, green: orange.g, blue: orange.b, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: size, height: size))
  // Lienzo de 1024 con y hacia abajo, escalado al tamaño pedido.
  let scale = CGFloat(size) / canvas
  context.translateBy(x: 0, y: CGFloat(size))
  context.scaleBy(x: scale, y: -scale)
  for glyph in glyphs {
    context.setFillColor(CGColor(gray: 1, alpha: glyph.opacity))
    context.addPath(outline(glyph))
    context.fillPath()
  }
  try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}

try writeIconDocument(at: "ios/App/App/AppIcon.icon")
try writePNG(size: 1024, path: "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
try writePNG(size: 512, path: "public/icon-512.png")
try writePNG(size: 192, path: "public/icon-192.png")
try writePNG(size: 180, path: "public/apple-touch-icon.png")
print("icons written")
