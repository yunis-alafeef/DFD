import JSZip from 'jszip';
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageBreak,
  PageNumber,
  PageOrientation,
  Paragraph,
  TextRun,
} from 'docx';
import { DIAGRAMS, PROJECT_INFO } from '../src/data/projectSpec';
import { ISOLATED_ERD_ENTITIES, ISOLATED_ERD_RELATIONSHIPS } from './chenErdIsolatedBuilders';

const EMU_PER_PX = 9525; // 1 inch = 914400 EMU = 96 px -> 9525 EMU/px

export interface NativeWordShapeSlot {
  id: string;
  svg: string;
  orientation: 'portrait' | 'landscape';
  heading: string;
  caption?: string;
}

function escAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

function parseHexColor(color: string | undefined): string | null {
  if (!color || color === 'none' || color === 'transparent') return null;
  const c = color.trim().replace(/^#/, '');
  if (/^[0-9A-Fa-f]{6}$/.test(c)) return c.toUpperCase();
  if (/^[0-9A-Fa-f]{3}$/.test(c)) {
    return c
      .split('')
      .map((ch) => ch + ch)
      .join('')
      .toUpperCase();
  }
  return '0F172A';
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

function makeFillXml(fill: string | undefined, opacity = 1): string {
  const hex = parseHexColor(fill);
  if (!hex) return '<a:noFill/>';
  const alphaXml =
    opacity < 0.999 ? `<a:alpha val="${Math.max(1000, Math.round(opacity * 100000))}"/>` : '';
  return `<a:solidFill><a:srgbClr val="${hex}">${alphaXml}</a:srgbClr></a:solidFill>`;
}

function makeLnXml(
  stroke: string | undefined,
  strokeWidthPx: number,
  scale: number,
  dasharray?: string,
  opacity = 1
): string {
  const hex = parseHexColor(stroke);
  if (!hex || strokeWidthPx <= 0) {
    return '<a:ln><a:noFill/></a:ln>';
  }
  const lnW = Math.max(6350, Math.round(strokeWidthPx * scale * EMU_PER_PX));
  const alphaXml =
    opacity < 0.999 ? `<a:alpha val="${Math.max(1000, Math.round(opacity * 100000))}"/>` : '';
  const dashXml = dasharray ? '<a:prstDash val="dash"/>' : '';
  return `<a:ln w="${lnW}"><a:solidFill><a:srgbClr val="${hex}">${alphaXml}</a:srgbClr></a:solidFill>${dashXml}</a:ln>`;
}

interface IdGen {
  next(): number;
}

function convertSvgToDrawingMl(
  svg: string,
  targetMaxWIn: number,
  targetMaxHIn: number,
  idGen: IdGen,
  groupName: string
): { drawingXml: string; widthEmu: number; heightEmu: number } {
  const vbMatch = svg.match(/viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"/);
  const svgW = vbMatch ? parseFloat(vbMatch[1]) : 1600;
  const svgH = vbMatch ? parseFloat(vbMatch[2]) : 1000;

  const maxWEmu = Math.round(targetMaxWIn * 914400);
  const maxHEmu = Math.round(targetMaxHIn * 914400);
  const ratio = svgW / svgH;

  let groupWEmu = maxWEmu;
  let groupHEmu = Math.round(groupWEmu / ratio);
  if (groupHEmu > maxHEmu) {
    groupHEmu = maxHEmu;
    groupWEmu = Math.round(groupHEmu * ratio);
  }

  // Scale factor from SVG user units -> EMU and equivalent screen px scale for stroke/fonts
  const pxScale = groupWEmu / (svgW * EMU_PER_PX);
  const toEmuX = (v: number) => Math.round((v / svgW) * groupWEmu);
  const toEmuY = (v: number) => Math.round((v / svgH) * groupHEmu);

  // Strip comments and <defs>...</defs> so we strictly traverse visible elements in paint order
  const cleaned = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/g, '');

  const shapes: string[] = [];

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
      const w = numAttr(attrs, 'width', 0);
      const h = numAttr(attrs, 'height', 0);
      const rx = numAttr(attrs, 'rx', 0);
      const fill = attrs.fill ?? '#000000';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1);

      // Skip full-canvas white backdrop rectangle
      if (x === 0 && y === 0 && Math.abs(w - svgW) < 2 && Math.abs(h - svgH) < 2 && !stroke) {
        continue;
      }
      if (w <= 0 || h <= 0) continue;

      const xE = toEmuX(x);
      const yE = toEmuY(y);
      const wE = Math.max(1270, toEmuX(w));
      const hE = Math.max(1270, toEmuY(h));

      let geomXml = '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>';
      if (rx > 0) {
        const minSide = Math.min(w, h) || 1;
        const adj = Math.max(0, Math.min(50000, Math.round((rx / minSide) * 100000)));
        geomXml = `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${adj}"/></a:avLst></a:prstGeom>`;
      }

      const id = idGen.next();
      shapes.push(
        `<wps:wsp>` +
          `<wps:cNvPr id="${id}" name="Rect_${id}"/>` +
          `<wps:cNvSpPr/>` +
          `<wps:spPr>` +
          `<a:xfrm><a:off x="${xE}" y="${yE}"/><a:ext cx="${wE}" cy="${hE}"/></a:xfrm>` +
          geomXml +
          makeFillXml(fill, opacity) +
          makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
          `</wps:spPr>` +
          `<wps:bodyPr/>` +
          `</wps:wsp>`
      );
    } else if (tag === 'ellipse' || tag === 'circle') {
      const cx = numAttr(attrs, 'cx', 0);
      const cy = numAttr(attrs, 'cy', 0);
      const rx = tag === 'circle' ? numAttr(attrs, 'r', 0) : numAttr(attrs, 'rx', 0);
      const ry = tag === 'circle' ? numAttr(attrs, 'r', 0) : numAttr(attrs, 'ry', 0);
      if (rx <= 0 || ry <= 0) continue;

      const xE = toEmuX(cx - rx);
      const yE = toEmuY(cy - ry);
      const wE = Math.max(1270, toEmuX(rx * 2));
      const hE = Math.max(1270, toEmuY(ry * 2));
      const fill = attrs.fill ?? '#FFFFFF';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1);

      const id = idGen.next();
      shapes.push(
        `<wps:wsp>` +
          `<wps:cNvPr id="${id}" name="Ellipse_${id}"/>` +
          `<wps:cNvSpPr/>` +
          `<wps:spPr>` +
          `<a:xfrm><a:off x="${xE}" y="${yE}"/><a:ext cx="${wE}" cy="${hE}"/></a:xfrm>` +
          `<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>` +
          makeFillXml(fill, opacity) +
          makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
          `</wps:spPr>` +
          `<wps:bodyPr/>` +
          `</wps:wsp>`
      );
    } else if (tag === 'line') {
      const x1 = numAttr(attrs, 'x1', 0);
      const y1 = numAttr(attrs, 'y1', 0);
      const x2 = numAttr(attrs, 'x2', 0);
      const y2 = numAttr(attrs, 'y2', 0);
      const stroke = attrs.stroke ?? '#1E3A5F';
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);

      const flipH = x2 < x1 ? ' flipH="1"' : '';
      const flipV = y2 < y1 ? ' flipV="1"' : '';

      const id = idGen.next();
      shapes.push(
        `<wps:wsp>` +
          `<wps:cNvPr id="${id}" name="Line_${id}"/>` +
          `<wps:cNvSpPr/>` +
          `<wps:spPr>` +
          `<a:xfrm${flipH}${flipV}><a:off x="${toEmuX(minX)}" y="${toEmuY(minY)}"/><a:ext cx="${toEmuX(dx)}" cy="${toEmuY(dy)}"/></a:xfrm>` +
          `<a:prstGeom prst="line"><a:avLst/></a:prstGeom>` +
          `<a:noFill/>` +
          makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
          `</wps:spPr>` +
          `<wps:bodyPr/>` +
          `</wps:wsp>`
      );
    } else if (tag === 'polygon') {
      const ptsRaw = (attrs.points ?? '').trim().split(/\s+/);
      const pts: [number, number][] = [];
      for (const pair of ptsRaw) {
        const [px, py] = pair.split(',').map(Number);
        if (Number.isFinite(px) && Number.isFinite(py)) pts.push([px, py]);
      }
      if (pts.length < 3) continue;

      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const w = Math.max(1, maxX - minX);
      const h = Math.max(1, maxY - minY);

      const fill = attrs.fill ?? '#FFFFFF';
      const stroke = attrs.stroke;
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      // Detect standard axis-aligned 4-vertex Chen diamond -> use native Word diamond AutoShape
      let isDiamond = false;
      if (pts.length === 4) {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const topMatch = pts.some(([px, py]) => Math.abs(px - cx) < 1.5 && Math.abs(py - minY) < 1.5);
        const botMatch = pts.some(([px, py]) => Math.abs(px - cx) < 1.5 && Math.abs(py - maxY) < 1.5);
        const leftMatch = pts.some(([px, py]) => Math.abs(px - minX) < 1.5 && Math.abs(py - cy) < 1.5);
        const rightMatch = pts.some(([px, py]) => Math.abs(px - maxX) < 1.5 && Math.abs(py - cy) < 1.5);
        isDiamond = topMatch && botMatch && leftMatch && rightMatch;
      }

      let geomXml = '';
      if (isDiamond) {
        geomXml = '<a:prstGeom prst="diamond"><a:avLst/></a:prstGeom>';
      } else {
        const pathPts = pts
          .map(([px, py], idx) => {
            const nx = Math.round(((px - minX) / w) * 100000);
            const ny = Math.round(((py - minY) / h) * 100000);
            return idx === 0
              ? `<a:moveTo><a:pt x="${nx}" y="${ny}"/></a:moveTo>`
              : `<a:lnTo><a:pt x="${nx}" y="${ny}"/></a:lnTo>`;
          })
          .join('');
        geomXml =
          `<a:custGeom>` +
          `<a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/>` +
          `<a:rect l="0" t="0" r="100000" b="100000"/>` +
          `<a:pathLst><a:path w="100000" h="100000">${pathPts}<a:close/></a:path></a:pathLst>` +
          `</a:custGeom>`;
      }

      const id = idGen.next();
      shapes.push(
        `<wps:wsp>` +
          `<wps:cNvPr id="${id}" name="${isDiamond ? 'Diamond' : 'Poly'}_${id}"/>` +
          `<wps:cNvSpPr/>` +
          `<wps:spPr>` +
          `<a:xfrm><a:off x="${toEmuX(minX)}" y="${toEmuY(minY)}"/><a:ext cx="${Math.max(1270, toEmuX(w))}" cy="${Math.max(1270, toEmuY(h))}"/></a:xfrm>` +
          geomXml +
          makeFillXml(fill, opacity) +
          makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
          `</wps:spPr>` +
          `<wps:bodyPr/>` +
          `</wps:wsp>`
      );
    } else if (tag === 'path') {
      // Parse polyline M x y L x y ...
      const d = (attrs.d ?? '').trim();
      const cmds = [...d.matchAll(/([ML])\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/g)];
      if (cmds.length < 2) continue;
      const pts: [number, number][] = cmds.map((c) => [parseFloat(c[2]), parseFloat(c[3])]);

      const stroke = attrs.stroke ?? '#1E3A5F';
      const strokeW = numAttr(attrs, 'stroke-width', 1.8);

      if (pts.length === 2) {
        const [x1, y1] = pts[0];
        const [x2, y2] = pts[1];
        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const flipH = x2 < x1 ? ' flipH="1"' : '';
        const flipV = y2 < y1 ? ' flipV="1"' : '';
        const id = idGen.next();
        shapes.push(
          `<wps:wsp>` +
            `<wps:cNvPr id="${id}" name="Connector_${id}"/>` +
            `<wps:cNvSpPr/>` +
            `<wps:spPr>` +
            `<a:xfrm${flipH}${flipV}><a:off x="${toEmuX(minX)}" y="${toEmuY(minY)}"/><a:ext cx="${toEmuX(dx)}" cy="${toEmuY(dy)}"/></a:xfrm>` +
            `<a:prstGeom prst="line"><a:avLst/></a:prstGeom>` +
            `<a:noFill/>` +
            makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
            `</wps:spPr>` +
            `<wps:bodyPr/>` +
            `</wps:wsp>`
        );
      } else {
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const w = Math.max(1, maxX - minX);
        const h = Math.max(1, maxY - minY);

        const pathPts = pts
          .map(([px, py], idx) => {
            const nx = Math.round(((px - minX) / w) * 100000);
            const ny = Math.round(((py - minY) / h) * 100000);
            return idx === 0
              ? `<a:moveTo><a:pt x="${nx}" y="${ny}"/></a:moveTo>`
              : `<a:lnTo><a:pt x="${nx}" y="${ny}"/></a:lnTo>`;
          })
          .join('');

        const id = idGen.next();
        shapes.push(
          `<wps:wsp>` +
            `<wps:cNvPr id="${id}" name="Polyline_${id}"/>` +
            `<wps:cNvSpPr/>` +
            `<wps:spPr>` +
            `<a:xfrm><a:off x="${toEmuX(minX)}" y="${toEmuY(minY)}"/><a:ext cx="${Math.max(1270, toEmuX(w))}" cy="${Math.max(1270, toEmuY(h))}"/></a:xfrm>` +
            `<a:custGeom>` +
            `<a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/>` +
            `<a:rect l="0" t="0" r="100000" b="100000"/>` +
            `<a:pathLst><a:path w="100000" h="100000" fill="none">${pathPts}</a:path></a:pathLst>` +
            `</a:custGeom>` +
            `<a:noFill/>` +
            makeLnXml(stroke, strokeW, pxScale, attrs['stroke-dasharray'], opacity) +
            `</wps:spPr>` +
            `<wps:bodyPr/>` +
            `</wps:wsp>`
        );
      }
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
      const colorHex = parseHexColor(attrs.fill ?? '#0F172A') ?? '0F172A';
      const isArabic = /[\u0600-\u06FF]/.test(plain);

      // Scaled Word half-points (93% factor gives clean visual parity in Windows Word Tahoma/Arial)
      const pt = fontSizePx * pxScale * 0.75 * 0.93;
      const szHalfPt = Math.max(9, Math.round(pt * 2));

      // Generous non-wrapping textbox centered cleanly on SVG anchor coordinate
      const estTextWidthPx = Math.max(44, plain.length * fontSizePx * (isArabic ? 0.68 : 0.65) + 28);
      const boxHPx = Math.max(16, fontSizePx * 1.55);
      const cyPx = y - fontSizePx * 0.34;
      const topPx = cyPx - boxHPx / 2;

      let leftPx = x;
      let jc = 'left';
      if (anchor === 'middle') {
        leftPx = x - estTextWidthPx / 2;
        jc = 'center';
      } else if (anchor === 'end') {
        leftPx = x - estTextWidthPx;
        jc = 'right';
      }

      const fontFamily = (attrs['font-family'] ?? '').toLowerCase();
      const asciiFont = fontFamily.includes('mono') ? 'Consolas' : 'Arial';
      const csFont = isArabic ? 'Tahoma' : asciiFont;

      const pPrXml = isArabic
        ? `<w:pPr><w:bidi/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="${jc}"/></w:pPr>`
        : `<w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="${jc}"/></w:pPr>`;

      const rPrXml =
        `<w:rPr>` +
        `<w:rFonts w:ascii="${asciiFont}" w:hAnsi="${asciiFont}" w:cs="${csFont}"/>` +
        (isBold ? `<w:b/><w:bCs/>` : '') +
        `<w:color w:val="${colorHex}"/>` +
        `<w:sz w:val="${szHalfPt}"/><w:szCs w:val="${szHalfPt}"/>` +
        (isArabic ? `<w:rtl/>` : '') +
        `</w:rPr>`;

      const id = idGen.next();
      shapes.push(
        `<wps:wsp>` +
          `<wps:cNvPr id="${id}" name="Text_${id}"/>` +
          `<wps:cNvSpPr txBox="1"/>` +
          `<wps:spPr>` +
          `<a:xfrm><a:off x="${toEmuX(leftPx)}" y="${toEmuY(topPx)}"/><a:ext cx="${Math.max(12700, toEmuX(estTextWidthPx))}" cy="${Math.max(12700, toEmuY(boxHPx))}"/></a:xfrm>` +
          `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>` +
          `<a:noFill/>` +
          `<a:ln><a:noFill/></a:ln>` +
          `</wps:spPr>` +
          `<wps:txbx><w:txbxContent><w:p>${pPrXml}<w:r>${rPrXml}<w:t xml:space="preserve">${escAttr(plain)}</w:t></w:r></w:p></w:txbxContent></wps:txbx>` +
          `<wps:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr">` +
          `<a:noAutofit/>` +
          `</wps:bodyPr>` +
          `</wps:wsp>`
      );
    }
  }

  const docPrId = idGen.next();
  const grpId = idGen.next();
  const safeName = escAttr(groupName);

  const drawingXml =
    `<w:p>` +
    `<w:pPr><w:spacing w:before="20" w:after="40"/><w:jc w:val="center"/></w:pPr>` +
    `<w:r><w:drawing>` +
    `<wp:inline distT="0" distB="0" distL="0" distR="0">` +
    `<wp:extent cx="${groupWEmu}" cy="${groupHEmu}"/>` +
    `<wp:effectExtent l="0" t="0" r="0" b="0"/>` +
    `<wp:docPr id="${docPrId}" name="${safeName}"/>` +
    `<wp:cNvGraphicFramePr/>` +
    `<a:graphic><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup">` +
    `<wpg:wgp>` +
    `<wpg:cNvPr id="${grpId}" name="${safeName}"/>` +
    `<wpg:cNvGrpSpPr/>` +
    `<wpg:grpSpPr>` +
    `<a:xfrm><a:off x="0" y="0"/><a:ext cx="${groupWEmu}" cy="${groupHEmu}"/><a:chOff x="0" y="0"/><a:chExt cx="${groupWEmu}" cy="${groupHEmu}"/></a:xfrm>` +
    `</wpg:grpSpPr>` +
    shapes.join('') +
    `</wpg:wgp>` +
    `</a:graphicData></a:graphic>` +
    `</wp:inline>` +
    `</w:drawing></w:r>` +
    `</w:p>`;

  return { drawingXml, widthEmu: groupWEmu, heightEmu: groupHEmu };
}

function rtlTextPara(text: string, opts: { bold?: boolean; size?: number; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; spaceBefore?: number; spaceAfter?: number; keepNext?: boolean; heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel] } = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align ?? AlignmentType.RIGHT,
    heading: opts.heading,
    keepNext: opts.keepNext,
    spacing: { before: opts.spaceBefore ?? 60, after: opts.spaceAfter ?? 100, line: 280 },
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
        size: opts.size ?? 22,
        color: opts.color ?? '0F172A',
        font: 'Tahoma',
        rightToLeft: true,
      }),
    ],
  });
}

export async function buildNativeWordShapesDocx(slots: NativeWordShapeSlot[]): Promise<Buffer> {
  const A4_WIDTH_TWIPS = 11906;
  const A4_HEIGHT_TWIPS = 16838;
  const PORTRAIT_MARGIN = 794; // ~1.4 cm -> usable 6.95 in x 10.3 in
  const LANDSCAPE_MARGIN = 720; // ~1.27 cm -> usable 10.69 in x 7.26 in

  const commonHeader = new Header({
    children: [
      rtlTextPara(`${PROJECT_INFO.titleAr}  |  أشكال Word أصلية قابلة للتعديل`, {
        size: 17,
        color: '64748B',
        align: AlignmentType.CENTER,
        spaceBefore: 0,
        spaceAfter: 30,
      }),
    ],
  });

  const commonFooter = new Footer({
    children: [
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'صفحة ', size: 17, color: '64748B', font: 'Tahoma', rightToLeft: true }),
          new TextRun({ children: [PageNumber.CURRENT], size: 17, color: '1E3A5F', bold: true }),
          new TextRun({ text: ' من ', size: 17, color: '64748B', font: 'Tahoma', rightToLeft: true }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 17, color: '1E3A5F', bold: true }),
        ],
      }),
    ],
  });

  const mainSlots = slots.slice(0, DIAGRAMS.length);
  const relSlots = slots.slice(DIAGRAMS.length, DIAGRAMS.length + ISOLATED_ERD_RELATIONSHIPS.length);
  const entSlots = slots.slice(DIAGRAMS.length + ISOLATED_ERD_RELATIONSHIPS.length);

  const mainSections = mainSlots.map((slot) => {
    const isPortrait = slot.orientation === 'portrait';
    return {
      properties: {
        page: {
          size: {
            width: A4_WIDTH_TWIPS,
            height: A4_HEIGHT_TWIPS,
            orientation: isPortrait ? PageOrientation.PORTRAIT : PageOrientation.LANDSCAPE,
          },
          margin: {
            top: isPortrait ? PORTRAIT_MARGIN : LANDSCAPE_MARGIN,
            bottom: isPortrait ? PORTRAIT_MARGIN : LANDSCAPE_MARGIN,
            left: isPortrait ? PORTRAIT_MARGIN : LANDSCAPE_MARGIN,
            right: isPortrait ? PORTRAIT_MARGIN : LANDSCAPE_MARGIN,
          },
        },
      },
      headers: { default: commonHeader },
      footers: { default: commonFooter },
      children: [
        rtlTextPara(slot.heading, {
          bold: true,
          size: 26,
          color: '1E3A5F',
          align: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_2,
          keepNext: true,
          spaceBefore: 0,
          spaceAfter: 60,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun(`[[NATIVE_SHAPE:${slot.id}]]`)],
        }),
        ...(slot.caption
          ? [
              rtlTextPara(slot.caption, {
                size: 19,
                color: '334155',
                align: AlignmentType.RIGHT,
                spaceBefore: 40,
                spaceAfter: 20,
              }),
            ]
          : []),
      ],
    };
  });

  const isolatedChildren: Paragraph[] = [
    rtlTextPara('حزمة مخططات ERD المنعزلة كأشكال Word أصلية (العلاقات الثنائية والكيانات)', {
      bold: true,
      size: 28,
      color: '1E3A5F',
      heading: HeadingLevel.HEADING_1,
      keepNext: true,
      spaceAfter: 100,
    }),
    rtlTextPara('1. العلاقات الثنائية بين الكيانات (17 علاقة — أشكال قابلة للتفكيك والتحرير)', {
      bold: true,
      size: 24,
      color: '0F766E',
      heading: HeadingLevel.HEADING_2,
      keepNext: true,
      spaceAfter: 80,
    }),
    ...relSlots.flatMap((slot) => [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        keepNext: true,
        children: [new TextRun(`[[NATIVE_SHAPE:${slot.id}]]`)],
      }),
      rtlTextPara(slot.heading, {
        bold: true,
        size: 18,
        color: '475569',
        align: AlignmentType.CENTER,
        spaceBefore: 20,
        spaceAfter: 100,
      }),
    ]),
    new Paragraph({ children: [new TextRun({ children: [new PageBreak()] })] }),
    rtlTextPara('2. الكيانات المنعزلة مع صفاتها بأسلوب تشين (19 كياناً — أشكال قابلة للتحرير)', {
      bold: true,
      size: 24,
      color: '0F766E',
      heading: HeadingLevel.HEADING_2,
      keepNext: true,
      spaceAfter: 80,
    }),
    ...entSlots.flatMap((slot) => [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        keepNext: true,
        children: [new TextRun(`[[NATIVE_SHAPE:${slot.id}]]`)],
      }),
      rtlTextPara(slot.heading, {
        bold: true,
        size: 18,
        color: '475569',
        align: AlignmentType.CENTER,
        spaceBefore: 20,
        spaceAfter: 120,
      }),
    ]),
  ];

  const doc = new Document({
    creator: 'Waqf Graduation Project Engineering Studio',
    title: `${PROJECT_INFO.documentTitleAr} – أشكال Word قابلة للتعديل`,
    description: 'جميع مخططات الفصل الثالث ومخططات ERD المنعزلة كأشكال Microsoft Word أصلية (DrawingML) قابلة للتحرير المباشر',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH_TWIPS,
              height: A4_HEIGHT_TWIPS,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: PORTRAIT_MARGIN,
              bottom: PORTRAIT_MARGIN,
              left: PORTRAIT_MARGIN,
              right: PORTRAIT_MARGIN,
            },
          },
        },
        headers: { default: commonHeader },
        footers: { default: commonFooter },
        children: [
          rtlTextPara('', { spaceBefore: 1400, spaceAfter: 200 }),
          rtlTextPara('ملف الأشكال الأصلية القابلة للتعديل في Microsoft Word', {
            bold: true,
            size: 30,
            color: '0F766E',
            align: AlignmentType.CENTER,
            spaceAfter: 180,
          }),
          rtlTextPara(PROJECT_INFO.titleAr, {
            bold: true,
            size: 42,
            color: '1E3A5F',
            align: AlignmentType.CENTER,
            spaceAfter: 260,
          }),
          rtlTextPara(
            `جميع المخططات الـ ${slots.length} في هذا المستند (المخطط البيئي، DFD 0، DFD 0 المنسق A4، DFD 1/2، مخطط Chen ERD الكامل بحجم الصفحة، Logical ERD، و${ISOLATED_ERD_RELATIONSHIPS.length + ISOLATED_ERD_ENTITIES.length} مخطط ERD منعزل) مبنية كأشكال ومربعات نصوص وخطوط أصلية مجمّعة في Word (DrawingML Grouped Shapes) تتيح النقر المباشر وفك التجميع (Ungroup) وتعديل أي نص أو شكل أو سهم دون الحاجة لأي تحويل إضافي.`,
            { size: 22, color: '334155', align: AlignmentType.CENTER, spaceAfter: 300 }
          ),
          rtlTextPara(
            `إجمالي المخططات المضمنة كأشكال أصلية: ${slots.length} مخططاً (${DIAGRAMS.length} رئيسية + ${ISOLATED_ERD_RELATIONSHIPS.length} علاقة + ${ISOLATED_ERD_ENTITIES.length} كياناً)`,
            { bold: true, size: 21, color: '1E3A5F', align: AlignmentType.CENTER }
          ),
        ],
      },
      ...mainSections,
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH_TWIPS,
              height: A4_HEIGHT_TWIPS,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: PORTRAIT_MARGIN,
              bottom: PORTRAIT_MARGIN,
              left: PORTRAIT_MARGIN,
              right: PORTRAIT_MARGIN,
            },
          },
        },
        headers: { default: commonHeader },
        footers: { default: commonFooter },
        children: isolatedChildren,
      },
    ],
  });

  const baseBuf = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(baseBuf);
  let docXml = await zip.file('word/document.xml')!.async('string');

  // Ensure DrawingML 2010 Group & Shape namespaces exist on root <w:document>
  docXml = docXml.replace(/<w:document\b([^>]*)>/, (full, attrs) => {
    let extra = '';
    if (!attrs.includes('xmlns:wp=')) extra += ' xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';
    if (!attrs.includes('xmlns:a=')) extra += ' xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';
    if (!attrs.includes('xmlns:wpg=')) extra += ' xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"';
    if (!attrs.includes('xmlns:wps=')) extra += ' xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"';
    if (!attrs.includes('xmlns:mc=')) extra += ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"';
    if (!attrs.includes('mc:Ignorable=')) extra += ' mc:Ignorable="wpg wps"';
    return `<w:document${attrs}${extra}>`;
  });

  let nextId = 100;
  const idGen: IdGen = { next: () => ++nextId };

  for (const slot of slots) {
    const isMain = mainSlots.some((m) => m.id === slot.id);
    const maxWIn = slot.orientation === 'landscape' ? 10.45 : isMain ? 6.95 : 6.75;
    const maxHIn = slot.orientation === 'landscape' ? 6.45 : isMain ? 9.45 : 4.25;

    const { drawingXml } = convertSvgToDrawingMl(slot.svg, maxWIn, maxHIn, idGen, `Diagram_${slot.id}`);
    const markerPattern = new RegExp(
      `<w:p>(?:(?!<w:p>).)*?\\[\\[NATIVE_SHAPE:${slot.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\](?:(?!</w:p>).)*?</w:p>`,
      's'
    );
    if (!markerPattern.test(docXml)) {
      throw new Error(`Placeholder not found in word/document.xml for slot: ${slot.id}`);
    }
    docXml = docXml.replace(markerPattern, () => drawingXml);
  }

  zip.file('word/document.xml', docXml);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
