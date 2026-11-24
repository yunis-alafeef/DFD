// Pure TypeScript MS-EMF (Enhanced Metafile Format) Vector Binary Encoder
// Translates our diagram SVG vector primitives directly into native Windows GDI EMF records:
//   - EMR_HEADER / EMR_EOF / MM_ANISOTROPIC viewport & HIMETRIC physical frame
//   - EMR_RECTANGLE / EMR_ROUNDRECT / EMR_ELLIPSE / EMR_POLYGON / EMR_POLYLINE
//   - EMR_CREATEPEN / EMR_EXTCREATEPEN (dashed lines) / EMR_CREATEBRUSHINDIRECT
//   - EMR_EXTCREATEFONTINDIRECTW / EMR_EXTTEXTOUTW (logical UTF-16LE + TA_RTLREADING + ETO_RTLREADING)
// Zero rasterization (no BITBLT/STRETCHDIBITS) -> 100% un-groupable editable vector objects in Microsoft Word!

const SCALE = 10; // Logical sub-pixel precision (10 EMF logical units per 1 SVG px)

// MS-EMF Record Types
const EMR_HEADER = 1;
const EMR_POLYGON = 3;
const EMR_POLYLINE = 4;
const EMR_SETWINDOWEXTEX = 9;
const EMR_SETWINDOWORGEX = 10;
const EMR_SETVIEWPORTEXTEX = 11;
const EMR_SETVIEWPORTORGEX = 12;
const EMR_EOF = 14;
const EMR_SETMAPMODE = 17;
const EMR_SETBKMODE = 18;
const EMR_SETPOLYFILLMODE = 19;
const EMR_SETTEXTALIGN = 22;
const EMR_SETTEXTCOLOR = 24;
const EMR_SELECTOBJECT = 37;
const EMR_CREATEPEN = 38;
const EMR_CREATEBRUSHINDIRECT = 39;
const EMR_DELETEOBJECT = 40;
const EMR_ELLIPSE = 42;
const EMR_RECTANGLE = 43;
const EMR_ROUNDRECT = 44;
const EMR_EXTCREATEFONTINDIRECTW = 82;
const EMR_EXTTEXTOUTW = 84;
const EMR_EXTCREATEPEN = 95;

// GDI Constants
const MM_ANISOTROPIC = 8;
const TRANSPARENT = 1;
const ALTERNATE = 1;
const GM_COMPATIBLE = 1;

const PS_SOLID = 0;
const PS_NULL = 5;
const PS_GEOMETRIC = 0x00010000;
const PS_DASH = 0x00000001;
const BS_SOLID = 0;

// Stock Objects
const WHITE_BRUSH = 0x80000000;
const NULL_BRUSH = 0x80000005;
const BLACK_PEN = 0x80000007;
const NULL_PEN = 0x80000008;
const SYSTEM_FONT = 0x8000000d;

// Text Alignment & ExtTextOut Flags
const TA_LEFT = 0x0000;
const TA_RIGHT = 0x0002;
const TA_CENTER = 0x0006;
const TA_BASELINE = 0x0018;
const TA_RTLREADING = 0x0100;
const ETO_RTLREADING = 0x0080;

// Font Charsets
const ANSI_CHARSET = 0;
const ARABIC_CHARSET = 178;

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

function stripBidiControls(str: string): string {
  return str.replace(/[\u202A-\u202E\u2066-\u2069]/g, '');
}

function parseAttrs(tagAttrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z0-9_:-]+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tagAttrStr)) !== null) {
    attrs[m[1]] = decodeXmlEntities(m[2]);
  }
  return attrs;
}

function numAttr(attrs: Record<string, string>, key: string, fallback = 0): number {
  const v = attrs[key];
  if (v === undefined) return fallback;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseColorRef(color: string | undefined, opacity = 1): number | null {
  if (!color || color === 'none' || color === 'transparent') return null;
  const c = color.trim().replace(/^#/, '');
  let r = 15, g = 23, b = 42;
  if (/^[0-9A-Fa-f]{6}$/.test(c)) {
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
  } else if (/^[0-9A-Fa-f]{3}$/.test(c)) {
    r = parseInt(c[0] + c[0], 16);
    g = parseInt(c[1] + c[1], 16);
    b = parseInt(c[2] + c[2], 16);
  }
  if (opacity < 0.999) {
    r = Math.round(r * opacity + 255 * (1 - opacity));
    g = Math.round(g * opacity + 255 * (1 - opacity));
    b = Math.round(b * opacity + 255 * (1 - opacity));
  }
  // Win32 COLORREF is 0x00BBGGRR
  return ((b & 0xff) << 16) | ((g & 0xff) << 8) | (r & 0xff);
}

class EmfRecordWriter {
  private records: Buffer[] = [];
  private nextHandle = 1; // Slot 0 is reserved in MS-EMF
  private brushCache = new Map<string, number>();
  private penCache = new Map<string, number>();
  private fontCache = new Map<string, number>();
  private selectedBrush: number = WHITE_BRUSH;
  private selectedPen: number = BLACK_PEN;
  private selectedFont: number = SYSTEM_FONT;
  private currentTextColor: number = -1;
  private currentTextAlign: number = -1;

  get handleCount(): number {
    return this.nextHandle;
  }

  get recordCount(): number {
    return this.records.length;
  }

  pushRecord(buf: Buffer): void {
    this.records.push(buf);
  }

  private rec(type: number, payloadSize: number, fill: (b: Buffer) => void): Buffer {
    const size = (8 + payloadSize + 3) & ~3;
    const b = Buffer.alloc(size);
    b.writeUInt32LE(type, 0);
    b.writeUInt32LE(size, 4);
    fill(b);
    return b;
  }

  addSimple2Int(type: number, a: number, c: number): void {
    this.records.push(
      this.rec(type, 8, (b) => {
        b.writeInt32LE(a, 8);
        b.writeInt32LE(c, 12);
      })
    );
  }

  addSimple1Uint(type: number, val: number): void {
    this.records.push(
      this.rec(type, 4, (b) => {
        b.writeUInt32LE(val >>> 0, 8);
      })
    );
  }

  selectObject(ih: number): void {
    this.records.push(
      this.rec(EMR_SELECTOBJECT, 4, (b) => {
        b.writeUInt32LE(ih >>> 0, 8);
      })
    );
  }

  useBrush(colorRef: number | null): void {
    if (colorRef === null) {
      if (this.selectedBrush !== NULL_BRUSH) {
        this.selectObject(NULL_BRUSH);
        this.selectedBrush = NULL_BRUSH;
      }
      return;
    }
    const key = String(colorRef);
    let ih = this.brushCache.get(key);
    if (ih === undefined) {
      ih = this.nextHandle++;
      this.brushCache.set(key, ih);
      this.records.push(
        this.rec(EMR_CREATEBRUSHINDIRECT, 16, (b) => {
          b.writeUInt32LE(ih!, 8);
          b.writeUInt32LE(BS_SOLID, 12);
          b.writeUInt32LE(colorRef >>> 0, 16);
          b.writeUInt32LE(0, 20);
        })
      );
    }
    if (this.selectedBrush !== ih) {
      this.selectObject(ih);
      this.selectedBrush = ih;
    }
  }

  usePen(colorRef: number | null, widthLogical: number, dashed: boolean): void {
    if (colorRef === null || widthLogical <= 0) {
      if (this.selectedPen !== NULL_PEN) {
        this.selectObject(NULL_PEN);
        this.selectedPen = NULL_PEN;
      }
      return;
    }
    const w = Math.max(1, Math.round(widthLogical));
    const key = `${colorRef}:${w}:${dashed ? 1 : 0}`;
    let ih = this.penCache.get(key);
    if (ih === undefined) {
      ih = this.nextHandle++;
      this.penCache.set(key, ih);
      if (dashed) {
        // EMR_EXTCREATEPEN (56 bytes: header 8 + ihPen 4 + 4*4 offsets + EXTLOGPEN 28 incl 1 dummy StyleEntry)
        this.records.push(
          this.rec(EMR_EXTCREATEPEN, 48, (b) => {
            b.writeUInt32LE(ih!, 8);
            b.writeUInt32LE(0, 12); // offBmi
            b.writeUInt32LE(0, 16); // cbBmi
            b.writeUInt32LE(0, 20); // offBits
            b.writeUInt32LE(0, 24); // cbBits
            b.writeUInt32LE((PS_GEOMETRIC | PS_DASH) >>> 0, 28);
            b.writeUInt32LE(w, 32);
            b.writeUInt32LE(BS_SOLID, 36);
            b.writeUInt32LE(colorRef >>> 0, 40);
            b.writeUInt32LE(0, 44); // BrushHatch
            b.writeUInt32LE(0, 48); // NumStyleEntries
            b.writeUInt32LE(0, 52); // StyleEntry[0] padding
          })
        );
      } else {
        // EMR_CREATEPEN (28 bytes)
        this.records.push(
          this.rec(EMR_CREATEPEN, 20, (b) => {
            b.writeUInt32LE(ih!, 8);
            b.writeUInt32LE(PS_SOLID, 12);
            b.writeInt32LE(w, 16);
            b.writeInt32LE(0, 20);
            b.writeUInt32LE(colorRef >>> 0, 24);
          })
        );
      }
    }
    if (this.selectedPen !== ih) {
      this.selectObject(ih);
      this.selectedPen = ih;
    }
  }

  useFont(faceName: string, heightLogical: number, bold: boolean, isArabic: boolean): void {
    const h = Math.max(10, Math.round(heightLogical));
    const weight = bold ? 700 : 400;
    const charset = isArabic ? ARABIC_CHARSET : ANSI_CHARSET;
    const key = `${faceName}:${h}:${weight}:${charset}`;
    let ih = this.fontCache.get(key);
    if (ih === undefined) {
      ih = this.nextHandle++;
      this.fontCache.set(key, ih);
      // EMR_EXTCREATEFONTINDIRECTW with compact LOGFONTW (total 104 bytes)
      this.records.push(
        this.rec(EMR_EXTCREATEFONTINDIRECTW, 96, (b) => {
          b.writeUInt32LE(ih!, 8);
          b.writeInt32LE(-h, 12); // lfHeight (negative = character cell height)
          b.writeInt32LE(0, 16); // lfWidth
          b.writeInt32LE(0, 20); // lfEscapement
          b.writeInt32LE(0, 24); // lfOrientation
          b.writeInt32LE(weight, 28); // lfWeight
          b.writeUInt8(0, 32); // lfItalic
          b.writeUInt8(0, 33); // lfUnderline
          b.writeUInt8(0, 34); // lfStrikeOut
          b.writeUInt8(charset, 35); // lfCharSet
          b.writeUInt8(0, 36); // lfOutPrecision
          b.writeUInt8(0, 37); // lfClipPrecision
          b.writeUInt8(5, 38); // lfQuality = CLEARTYPE_QUALITY
          b.writeUInt8(0, 39); // lfPitchAndFamily
          const nameBuf = Buffer.from(faceName.slice(0, 31), 'utf16le');
          nameBuf.copy(b, 40, 0, Math.min(nameBuf.length, 62));
        })
      );
    }
    if (this.selectedFont !== ih) {
      this.selectObject(ih);
      this.selectedFont = ih;
    }
  }

  setTextColor(colorRef: number): void {
    if (this.currentTextColor !== colorRef) {
      this.addSimple1Uint(EMR_SETTEXTCOLOR, colorRef);
      this.currentTextColor = colorRef;
    }
  }

  setTextAlign(alignFlags: number): void {
    if (this.currentTextAlign !== alignFlags) {
      this.addSimple1Uint(EMR_SETTEXTALIGN, alignFlags);
      this.currentTextAlign = alignFlags;
    }
  }

  drawRectangle(left: number, top: number, right: number, bottom: number): void {
    this.records.push(
      this.rec(EMR_RECTANGLE, 16, (b) => {
        b.writeInt32LE(left, 8);
        b.writeInt32LE(top, 12);
        b.writeInt32LE(right, 16);
        b.writeInt32LE(bottom, 20);
      })
    );
  }

  drawRoundRect(left: number, top: number, right: number, bottom: number, cw: number, ch: number): void {
    this.records.push(
      this.rec(EMR_ROUNDRECT, 24, (b) => {
        b.writeInt32LE(left, 8);
        b.writeInt32LE(top, 12);
        b.writeInt32LE(right, 16);
        b.writeInt32LE(bottom, 20);
        b.writeInt32LE(cw, 24);
        b.writeInt32LE(ch, 28);
      })
    );
  }

  drawEllipse(left: number, top: number, right: number, bottom: number): void {
    this.records.push(
      this.rec(EMR_ELLIPSE, 16, (b) => {
        b.writeInt32LE(left, 8);
        b.writeInt32LE(top, 12);
        b.writeInt32LE(right, 16);
        b.writeInt32LE(bottom, 20);
      })
    );
  }

  drawPolygon(pts: [number, number][]): void {
    if (pts.length < 3) return;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    this.records.push(
      this.rec(EMR_POLYGON, 20 + pts.length * 8, (b) => {
        b.writeInt32LE(Math.min(...xs), 8);
        b.writeInt32LE(Math.min(...ys), 12);
        b.writeInt32LE(Math.max(...xs), 16);
        b.writeInt32LE(Math.max(...ys), 20);
        b.writeUInt32LE(pts.length, 24);
        pts.forEach(([px, py], i) => {
          b.writeInt32LE(px, 28 + i * 8);
          b.writeInt32LE(py, 32 + i * 8);
        });
      })
    );
  }

  drawPolyline(pts: [number, number][]): void {
    if (pts.length < 2) return;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    this.records.push(
      this.rec(EMR_POLYLINE, 20 + pts.length * 8, (b) => {
        b.writeInt32LE(Math.min(...xs), 8);
        b.writeInt32LE(Math.min(...ys), 12);
        b.writeInt32LE(Math.max(...xs), 16);
        b.writeInt32LE(Math.max(...ys), 20);
        b.writeUInt32LE(pts.length, 24);
        pts.forEach(([px, py], i) => {
          b.writeInt32LE(px, 28 + i * 8);
          b.writeInt32LE(py, 32 + i * 8);
        });
      })
    );
  }

  drawTextOutW(
    refX: number,
    refY: number,
    text: string,
    options: number,
    bounds: [number, number, number, number]
  ): void {
    const strBuf = Buffer.from(text, 'utf16le');
    const chars = text.length; // UTF-16 code units
    const offString = 76;
    const paddedStrLen = (strBuf.length + 3) & ~3;
    const totalSize = offString + paddedStrLen;
    const b = Buffer.alloc(totalSize);

    const scaleTo01Mm = 2540 / (96 * SCALE);

    b.writeUInt32LE(EMR_EXTTEXTOUTW, 0);
    b.writeUInt32LE(totalSize, 4);
    b.writeInt32LE(bounds[0], 8);
    b.writeInt32LE(bounds[1], 12);
    b.writeInt32LE(bounds[2], 16);
    b.writeInt32LE(bounds[3], 20);
    b.writeUInt32LE(GM_COMPATIBLE, 24);
    b.writeFloatLE(scaleTo01Mm, 28); // exScale
    b.writeFloatLE(scaleTo01Mm, 32); // eyScale
    b.writeInt32LE(refX, 36); // EmrText.Reference.x
    b.writeInt32LE(refY, 40); // EmrText.Reference.y
    b.writeUInt32LE(chars, 44); // EmrText.Chars
    b.writeUInt32LE(offString, 48); // EmrText.offString
    b.writeUInt32LE(options >>> 0, 52); // EmrText.Options
    // EmrText.Rectangle (56..72): 0s when neither ETO_OPAQUE nor ETO_CLIPPED
    // EmrText.offDx (72..76): 0 so Windows GDI/Word uses natural Arabic Uniscribe cursive shaping
    b.writeUInt32LE(0, 72);
    strBuf.copy(b, offString);

    this.records.push(b);
  }

  cleanupAllHandles(): void {
    this.selectObject(WHITE_BRUSH);
    this.selectObject(BLACK_PEN);
    this.selectObject(SYSTEM_FONT);
    for (let ih = 1; ih < this.nextHandle; ih++) {
      this.addSimple1Uint(EMR_DELETEOBJECT, ih);
    }
  }

  buildFile(svgW: number, svgH: number): Buffer {
    const devW = Math.round(svgW * SCALE);
    const devH = Math.round(svgH * SCALE);
    const frameW = Math.round((svgW * 2540) / 96); // 0.01 mm HIMETRIC
    const frameH = Math.round((svgH * 2540) / 96);
    const mmW = Math.max(1, Math.round((svgW * 25.4) / 96));
    const mmH = Math.max(1, Math.round((svgH * 25.4) / 96));

    // EMR_EOF (20 bytes)
    const eofBuf = Buffer.alloc(20);
    eofBuf.writeUInt32LE(EMR_EOF, 0);
    eofBuf.writeUInt32LE(20, 4);
    eofBuf.writeUInt32LE(0, 8); // nPalEntries
    eofBuf.writeUInt32LE(16, 12); // offPalEntries
    eofBuf.writeUInt32LE(20, 16); // nSizeLast

    const bodyLen = this.records.reduce((acc, r) => acc + r.length, 0);
    const headerSize = 108;
    const totalBytes = headerSize + bodyLen + eofBuf.length;
    const totalRecords = 1 + this.records.length + 1;

    // EMR_HEADER (108 bytes — standard Header + HeaderExtension1 + HeaderExtension2)
    const hdr = Buffer.alloc(headerSize);
    hdr.writeUInt32LE(EMR_HEADER, 0);
    hdr.writeUInt32LE(headerSize, 4);
    // Bounds RECTL
    hdr.writeInt32LE(0, 8);
    hdr.writeInt32LE(0, 12);
    hdr.writeInt32LE(devW - 1, 16);
    hdr.writeInt32LE(devH - 1, 20);
    // Frame RECTL (0.01 mm)
    hdr.writeInt32LE(0, 24);
    hdr.writeInt32LE(0, 28);
    hdr.writeInt32LE(frameW, 32);
    hdr.writeInt32LE(frameH, 36);
    // Signature " EMF" (0x464D4520) & Version 1.0 (0x00010000)
    hdr.writeUInt32LE(0x464d4520, 40);
    hdr.writeUInt32LE(0x00010000, 44);
    hdr.writeUInt32LE(totalBytes, 48);
    hdr.writeUInt32LE(totalRecords, 52);
    hdr.writeUInt16LE(this.nextHandle, 56);
    hdr.writeUInt16LE(0, 58); // Reserved
    hdr.writeUInt32LE(0, 60); // nDescription
    hdr.writeUInt32LE(0, 64); // offDescription
    hdr.writeUInt32LE(0, 68); // nPalEntries
    hdr.writeInt32LE(devW, 72); // Device.cx
    hdr.writeInt32LE(devH, 76); // Device.cy
    hdr.writeInt32LE(mmW, 80); // Millimeters.cx
    hdr.writeInt32LE(mmH, 84); // Millimeters.cy
    // HeaderExtension1
    hdr.writeUInt32LE(0, 88); // cbPixelFormat
    hdr.writeUInt32LE(0, 92); // offPixelFormat
    hdr.writeUInt32LE(0, 96); // bOpenGL
    // HeaderExtension2 (Micrometers)
    hdr.writeInt32LE(mmW * 1000, 100);
    hdr.writeInt32LE(mmH * 1000, 104);

    return Buffer.concat([hdr, ...this.records, eofBuf]);
  }
}

export function convertSvgToEmfBuffer(svg: string): Buffer {
  const vbMatch = svg.match(/viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"/);
  const svgW = vbMatch ? parseFloat(vbMatch[1]) : 1600;
  const svgH = vbMatch ? parseFloat(vbMatch[2]) : 1000;

  const w = new EmfRecordWriter();
  const devW = Math.round(svgW * SCALE);
  const devH = Math.round(svgH * SCALE);

  // Initialize GDI Coordinate Mapping & Drawing Modes
  w.addSimple1Uint(EMR_SETMAPMODE, MM_ANISOTROPIC);
  w.addSimple2Int(EMR_SETWINDOWORGEX, 0, 0);
  w.addSimple2Int(EMR_SETWINDOWEXTEX, devW, devH);
  w.addSimple2Int(EMR_SETVIEWPORTORGEX, 0, 0);
  w.addSimple2Int(EMR_SETVIEWPORTEXTEX, devW, devH);
  w.addSimple1Uint(EMR_SETBKMODE, TRANSPARENT);
  w.addSimple1Uint(EMR_SETPOLYFILLMODE, ALTERNATE);

  const cleaned = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/g, '');

  const toL = (v: number) => Math.round(v * SCALE);
  const tokenRe = /<(rect|circle|ellipse|line|polygon|path)\b([^>]*?)\/>|<(text)\b([^>]*)>([\s\S]*?)<\/text>/g;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(cleaned)) !== null) {
    const tag = match[1] || match[3];
    const attrStr = match[2] ?? match[4] ?? '';
    const attrs = parseAttrs(attrStr);
    const opacity = numAttr(attrs, 'opacity', 1);

    if (tag === 'rect') {
      const x = numAttr(attrs, 'x', 0);
      const y = numAttr(attrs, 'y', 0);
      const width = numAttr(attrs, 'width', 0);
      const height = numAttr(attrs, 'height', 0);
      const rx = numAttr(attrs, 'rx', 0);
      const fill = attrs.fill ?? '#000000';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1);

      // Skip full-canvas white backdrop rectangle so Word Ungroup doesn't block underlying objects
      if (x === 0 && y === 0 && Math.abs(width - svgW) < 2 && Math.abs(height - svgH) < 2 && !stroke) {
        continue;
      }
      if (width <= 0 || height <= 0) continue;

      w.useBrush(parseColorRef(fill, opacity));
      w.usePen(parseColorRef(stroke, opacity), toL(strokeW), Boolean(attrs['stroke-dasharray']));

      const l = toL(x);
      const t = toL(y);
      const r = toL(x + width);
      const b = toL(y + height);

      if (rx > 0) {
        const cornerDiam = toL(Math.min(rx * 2, width, height));
        w.drawRoundRect(l, t, r, b, cornerDiam, cornerDiam);
      } else {
        w.drawRectangle(l, t, r, b);
      }
    } else if (tag === 'ellipse' || tag === 'circle') {
      const cx = numAttr(attrs, 'cx', 0);
      const cy = numAttr(attrs, 'cy', 0);
      const rx = tag === 'circle' ? numAttr(attrs, 'r', 0) : numAttr(attrs, 'rx', 0);
      const ry = tag === 'circle' ? numAttr(attrs, 'r', 0) : numAttr(attrs, 'ry', 0);
      if (rx <= 0 || ry <= 0) continue;

      const fill = attrs.fill ?? '#FFFFFF';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1);

      w.useBrush(parseColorRef(fill, opacity));
      w.usePen(parseColorRef(stroke, opacity), toL(strokeW), Boolean(attrs['stroke-dasharray']));
      w.drawEllipse(toL(cx - rx), toL(cy - ry), toL(cx + rx), toL(cy + ry));
    } else if (tag === 'line') {
      const x1 = numAttr(attrs, 'x1', 0);
      const y1 = numAttr(attrs, 'y1', 0);
      const x2 = numAttr(attrs, 'x2', 0);
      const y2 = numAttr(attrs, 'y2', 0);
      const stroke = attrs.stroke ?? '#1E3A5F';
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      w.useBrush(null);
      w.usePen(parseColorRef(stroke, opacity), toL(strokeW), Boolean(attrs['stroke-dasharray']));
      w.drawPolyline([
        [toL(x1), toL(y1)],
        [toL(x2), toL(y2)],
      ]);
    } else if (tag === 'polygon') {
      const ptsRaw = (attrs.points ?? '').trim().split(/\s+/);
      const pts: [number, number][] = [];
      for (const pair of ptsRaw) {
        const [px, py] = pair.split(',').map(Number);
        if (Number.isFinite(px) && Number.isFinite(py)) {
          pts.push([toL(px), toL(py)]);
        }
      }
      if (pts.length < 3) continue;

      const fill = attrs.fill ?? '#FFFFFF';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      w.useBrush(parseColorRef(fill, opacity));
      w.usePen(parseColorRef(stroke, opacity), toL(strokeW), Boolean(attrs['stroke-dasharray']));
      w.drawPolygon(pts);
    } else if (tag === 'path') {
      const d = (attrs.d ?? '').trim();
      const cmds = [...d.matchAll(/([ML])\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/g)];
      if (cmds.length < 2) continue;
      const pts: [number, number][] = cmds.map((c) => [toL(parseFloat(c[2])), toL(parseFloat(c[3]))]);
      const stroke = attrs.stroke ?? '#1E3A5F';
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      w.useBrush(null);
      w.usePen(parseColorRef(stroke, opacity), toL(strokeW), Boolean(attrs['stroke-dasharray']));
      w.drawPolyline(pts);
    } else if (tag === 'text') {
      const innerRaw = match[5] ?? '';
      const plain = stripBidiControls(decodeXmlEntities(innerRaw.replace(/<[^>]+>/g, ''))).trim();
      if (!plain) continue;

      const x = numAttr(attrs, 'x', 0);
      const y = numAttr(attrs, 'y', 0);
      const fontSizePx = numAttr(attrs, 'font-size', 14);
      const fontWeight = attrs['font-weight'] ?? 'normal';
      const isBold = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
      const anchor = attrs['text-anchor'] ?? 'start';
      const colorRef = parseColorRef(attrs.fill ?? '#0F172A') ?? 0x002a170f;
      const isArabic = /[\u0600-\u06FF]/.test(plain);

      const fontFamilyRaw = (attrs['font-family'] ?? '').toLowerCase();
      // Universal Windows-safe fonts for crisp Arabic shaping & exact Microsoft Word Ungroup metrics
      const faceName = fontFamilyRaw.includes('mono') ? 'Consolas' : isArabic ? 'Tahoma' : 'Arial';
      // 93% scaling balances Tahoma width against Noto Sans Arabic SVG box dimensions
      const scaledHeight = fontSizePx * 0.93 * SCALE;

      w.useFont(faceName, scaledHeight, isBold, isArabic);
      w.setTextColor(colorRef);

      let horizFlag = TA_LEFT;
      if (anchor === 'middle') horizFlag = TA_CENTER;
      else if (anchor === 'end') horizFlag = TA_RIGHT;

      const rtlFlag = isArabic ? TA_RTLREADING : 0;
      w.setTextAlign(horizFlag | TA_BASELINE | rtlFlag);

      const refX = toL(x);
      const refY = toL(y);
      const estW = Math.round(Math.max(40, plain.length * fontSizePx * 0.65) * SCALE);
      const estAsc = Math.round(fontSizePx * 0.9 * SCALE);
      const estDesc = Math.round(fontSizePx * 0.35 * SCALE);
      let bLeft = refX;
      if (anchor === 'middle') bLeft = refX - Math.round(estW / 2);
      else if (anchor === 'end') bLeft = refX - estW;

      w.drawTextOutW(
        refX,
        refY,
        plain,
        isArabic ? ETO_RTLREADING : 0,
        [bLeft, refY - estAsc, bLeft + estW, refY + estDesc]
      );
    }
  }

  w.cleanupAllHandles();
  return w.buildFile(svgW, svgH);
}
