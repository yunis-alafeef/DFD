import { PALETTE, escXml, wrapBidi } from './diagramBuilders';

const FONT_AR = 'Noto Kufi Arabic, Noto Sans Arabic, Tahoma, Arial, sans-serif';
const FONT_AR_BODY = 'Noto Sans Arabic, Noto Kufi Arabic, Tahoma, Arial, sans-serif';
const FONT_EN = 'Liberation Sans, Arial, Tahoma, sans-serif';

// Exact A4 Landscape aspect (297mm x 210mm = 1.41428) at 0.5 pt per SVG unit
const W = 1684;
const H = 1191;

interface FlowSpec {
  id: string;
  points: [number, number][];
  label: string;
  labelPos: [number, number];
  color: string;
  dashed?: boolean;
  fontSize?: number;
}

function arrowheadPolygon(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  len = 10,
  halfW = 4.2
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const bx = x2 - ux * len;
  const by = y2 - uy * len;
  const px1 = bx - uy * halfW;
  const py1 = by + ux * halfW;
  const px2 = bx + uy * halfW;
  const py2 = by - ux * halfW;
  return `<polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${px1.toFixed(1)},${py1.toFixed(1)} ${px2.toFixed(1)},${py2.toFixed(1)}" fill="${color}" />`;
}

function drawAcademicHeader(): string {
  const titleAr = 'الشكل (3-2 ب): مخطط تدفق البيانات من المستوى الصفري — النسخة الهندسية المنسقة (DFD Level 0)';
  const subtitleAr = 'المنصة الرقمية لإدارة وحصر الممتلكات الوقفية (تَرِكَة) — توزيع شبكي ثلاثي المناطق (A4 Landscape: 297 × 210 mm)';
  return `<rect width="${W}" height="${H}" fill="#FFFFFF" />
  <rect x="16" y="16" width="${W - 32}" height="${H - 32}" rx="8" fill="none" stroke="${PALETTE.borderSubtle}" stroke-width="1.4" />
  <rect x="16" y="16" width="${W - 32}" height="74" rx="8" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.4" />
  <line x1="16" y1="90" x2="${W - 16}" y2="90" stroke="${PALETTE.navy}" stroke-width="2" />
  <text x="${W / 2}" y="47" text-anchor="middle" font-family="${FONT_AR}" font-size="20.5" font-weight="bold" fill="${PALETTE.navy}">${escXml(wrapBidi(titleAr))}</text>
  <text x="${W / 2}" y="73" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="13.5" fill="${PALETTE.slateMid}">${escXml(wrapBidi(subtitleAr))}</text>
`;
}

function drawZoneBand(
  x: number,
  y: number,
  w: number,
  h: number,
  titleAr: string,
  fill: string,
  stroke: string,
  titleColor: string
): string {
  return `<g class="zone-band">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="1.1" />
    <rect x="${x}" y="${y}" width="${w}" height="24" rx="7" fill="${stroke}" opacity="0.22" />
    <text x="${x + w / 2}" y="${y + 16.5}" text-anchor="middle" font-family="${FONT_AR}" font-size="12" font-weight="bold" fill="${titleColor}">${escXml(wrapBidi(titleAr))}</text>
  </g>`;
}

function drawExternalEntityBox(
  x: number,
  y: number,
  w: number,
  h: number,
  titleAr: string,
  subEn: string
): string {
  return `<g class="external-entity">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#F1F5F9" stroke="${PALETTE.slateDark}" stroke-width="2" />
    <line x1="${x + 10}" y1="${y}" x2="${x + 10}" y2="${y + h}" stroke="${PALETTE.slateDark}" stroke-width="1.5" />
    <line x1="${x}" y1="${y + 7}" x2="${x + w}" y2="${y + 7}" stroke="${PALETTE.slateDark}" stroke-width="1.1" opacity="0.25" />
    <text x="${x + w / 2 + 4}" y="${y + h / 2 - 2}" text-anchor="middle" font-family="${FONT_AR}" font-size="14.5" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(titleAr))}</text>
    <text x="${x + w / 2 + 4}" y="${y + h / 2 + 18}" text-anchor="middle" font-family="${FONT_EN}" font-size="11" fill="${PALETTE.slateMuted}">${escXml(wrapBidi(subEn))}</text>
  </g>`;
}

function drawProcessBox(
  x: number,
  y: number,
  w: number,
  h: number,
  num: string,
  linesAr: string[]
): string {
  const headerH = 24;
  const bodyCenterY = y + headerH + (h - headerH) / 2;
  const lineH = 19;
  const startY = bodyCenterY - ((linesAr.length - 1) * lineH) / 2 + 4.5;
  return `<g class="dfd-process">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${PALETTE.navyLight}" stroke="${PALETTE.navy}" stroke-width="2.1" />
    <rect x="${x}" y="${y}" width="${w}" height="${headerH}" rx="7" fill="${PALETTE.navy}" />
    <rect x="${x}" y="${y + headerH - 7}" width="${w}" height="7" fill="${PALETTE.navy}" />
    <text x="${x + w / 2}" y="${y + 16.5}" text-anchor="middle" font-family="${FONT_EN}" font-size="13.5" font-weight="bold" fill="#FFFFFF">${escXml(num)}</text>
    ${linesAr
      .map(
        (line, i) =>
          `<text x="${x + w / 2}" y="${(startY + i * lineH).toFixed(1)}" text-anchor="middle" font-family="${FONT_AR}" font-size="13.5" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(line))}</text>`
      )
      .join('\n    ')}
  </g>`;
}

function drawDataStoreBox(
  x: number,
  y: number,
  w: number,
  h: number,
  id: string,
  linesAr: string[]
): string {
  const idW = 42;
  const textCenterX = x + idW + (w - idW) / 2;
  const lineH = 16.5;
  const startY = y + h / 2 - ((linesAr.length - 1) * lineH) / 2 + 4.5;
  return `<g class="data-store">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PALETTE.tealLight}" />
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${PALETTE.teal}" stroke-width="2" />
    <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${PALETTE.teal}" stroke-width="2" />
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${PALETTE.teal}" stroke-width="2" />
    <rect x="${x}" y="${y}" width="${idW}" height="${h}" fill="${PALETTE.teal}" />
    <text x="${x + idW / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-family="${FONT_EN}" font-size="13.5" font-weight="bold" fill="#FFFFFF">${escXml(id)}</text>
    ${linesAr
      .map(
        (line, i) =>
          `<text x="${textCenterX}" y="${(startY + i * lineH).toFixed(1)}" text-anchor="middle" font-family="${FONT_AR}" font-size="12.2" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(line))}</text>`
      )
      .join('\n    ')}
  </g>`;
}

function drawLegendBar(): string {
  const x = 26;
  const y = 1114;
  const w = W - 52;
  const cTitle = x + w * 0.885;
  const cEnt = x + w * 0.71;
  const cProc = x + w * 0.54;
  const cStore = x + w * 0.37;
  const cSolid = x + w * 0.21;
  const cDash = x + w * 0.085;
  return `<g class="legend">
    <rect x="${x}" y="${y}" width="${w}" height="50" rx="7" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />
    <text x="${cTitle}" y="${y + 30}" text-anchor="middle" font-family="${FONT_AR}" font-size="12.5" font-weight="bold" fill="${PALETTE.navy}">${escXml(wrapBidi('مفتاح الرموز (Gane & Sarson)'))}</text>

    <rect x="${cEnt + 22}" y="${y + 12}" width="38" height="26" rx="3" fill="#F1F5F9" stroke="${PALETTE.slateDark}" stroke-width="1.7" />
    <line x1="${cEnt + 28}" y1="${y + 12}" x2="${cEnt + 28}" y2="${y + 38}" stroke="${PALETTE.slateDark}" stroke-width="1.2" />
    <text x="${cEnt - 24}" y="${y + 29.5}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="12" font-weight="600" fill="${PALETTE.slateDark}">كيان خارجي</text>

    <rect x="${cProc + 22}" y="${y + 11}" width="42" height="28" rx="6" fill="${PALETTE.navyLight}" stroke="${PALETTE.navy}" stroke-width="1.7" />
    <line x1="${cProc + 22}" y1="${y + 20}" x2="${cProc + 64}" y2="${y + 20}" stroke="${PALETTE.navy}" stroke-width="1.7" />
    <text x="${cProc - 26}" y="${y + 29.5}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="12" font-weight="600" fill="${PALETTE.slateDark}">عملية رئيسية</text>

    <rect x="${cStore + 20}" y="${y + 13}" width="46" height="24" fill="${PALETTE.tealLight}" />
    <path d="M ${cStore + 66} ${y + 13} L ${cStore + 20} ${y + 13} L ${cStore + 20} ${y + 37} L ${cStore + 66} ${y + 37}" fill="none" stroke="${PALETTE.teal}" stroke-width="1.7" />
    <rect x="${cStore + 20}" y="${y + 13}" width="14" height="24" fill="${PALETTE.teal}" />
    <text x="${cStore - 26}" y="${y + 29.5}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="12" font-weight="600" fill="${PALETTE.slateDark}">مخزن بيانات</text>

    <line x1="${cSolid + 46}" y1="${y + 25}" x2="${cSolid + 8}" y2="${y + 25}" stroke="${PALETTE.navy}" stroke-width="1.8" />
    ${arrowheadPolygon(cSolid + 46, y + 25, cSolid, y + 25, PALETTE.navy, 9, 3.8)}
    <text x="${cSolid - 34}" y="${y + 29.5}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="12" font-weight="600" fill="${PALETTE.slateDark}">تدفق مباشر</text>

    <line x1="${cDash + 46}" y1="${y + 25}" x2="${cDash + 8}" y2="${y + 25}" stroke="${PALETTE.teal}" stroke-width="1.8" stroke-dasharray="5,3" />
    ${arrowheadPolygon(cDash + 46, y + 25, cDash, y + 25, PALETTE.teal, 9, 3.8)}
    <text x="${cDash - 38}" y="${y + 29.5}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="12" font-weight="600" fill="${PALETTE.slateDark}">قراءة مرجعية</text>
  </g>`;
}

// Automatically splits vertical wire segments cleanly around perpendicular crossings
// so all horizontal flow wires stay continuous and crossings are crisp and readable
// in SVG, PNG, EMF, and Word DrawingML without unsupported SVG arc commands.
function renderFlowWithCleanCrossings(flow: FlowSpec, allFlows: FlowSpec[]): string {
  const pts = flow.points.map(([x, y]) => [x, y] as [number, number]);
  let arrowSvg = '';
  if (pts.length >= 2) {
    const [x1, y1] = pts[pts.length - 2];
    const [x2, y2] = pts[pts.length - 1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    arrowSvg = arrowheadPolygon(x1, y1, x2, y2, flow.color, 10, 4.2);
    if (dist > 11) {
      pts[pts.length - 1] = [x2 - (dx / dist) * 7.5, y2 - (dy / dist) * 7.5];
    }
  }

  // Collect all horizontal segments from OTHER flows so any vertical segment in this flow
  // leaves a clean 9-unit vertical bridge gap around each perpendicular crossing.
  const otherHoriz: { y: number; xMin: number; xMax: number }[] = [];
  for (const other of allFlows) {
    if (other.id === flow.id) continue;
    for (let i = 0; i < other.points.length - 1; i++) {
      const [ox1, oy1] = other.points[i];
      const [ox2, oy2] = other.points[i + 1];
      if (Math.abs(oy1 - oy2) < 0.1) {
        otherHoriz.push({ y: oy1, xMin: Math.min(ox1, ox2), xMax: Math.max(ox1, ox2) });
      }
    }
  }

  const dChunks: string[] = [];
  let currentChain: [number, number][] = [pts[0]];

  const flushChain = () => {
    if (currentChain.length >= 2) {
      dChunks.push(
        currentChain
          .map(([px, py], idx) => `${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`)
          .join(' ')
      );
    }
  };

  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const isVert = Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) > 0.1;

    if (!isVert) {
      currentChain.push([x2, y2]);
      continue;
    }

    const dir = y2 > y1 ? 1 : -1;
    const yLo = Math.min(y1, y2);
    const yHi = Math.max(y1, y2);

    const crossYs = otherHoriz
      .filter((h) => h.xMin < x1 && x1 < h.xMax && yLo + 5 < h.y && h.y < yHi - 5)
      .map((h) => h.y)
      .sort((a, b) => (dir > 0 ? a - b : b - a));

    if (crossYs.length === 0) {
      currentChain.push([x2, y2]);
      continue;
    }

    const gapHalf = 4.5;
    for (const cy of crossYs) {
      const preY = cy - dir * gapHalf;
      const postY = cy + dir * gapHalf;
      currentChain.push([x1, preY]);
      flushChain();
      currentChain = [[x1, postY]];
    }
    currentChain.push([x2, y2]);
  }
  flushChain();

  const dashAttr = flow.dashed ? 'stroke-dasharray="6,4"' : '';
  const pathEls = dChunks
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${flow.color}" stroke-width="1.8" ${dashAttr} />`
    )
    .join('\n    ');

  const fs = flow.fontSize ?? 11.5;
  const estW = Math.max(48, Math.round(flow.label.length * (fs * 0.54) + 12));
  const estH = 14;
  const rx = (flow.labelPos[0] - estW / 2).toFixed(1);
  const ry = (flow.labelPos[1] - fs + 1).toFixed(1);

  return `<g class="data-flow" data-flow-id="${escXml(flow.id)}">
    ${pathEls}
    ${arrowSvg}
    <rect x="${rx}" y="${ry}" width="${estW}" height="${estH}" rx="3" fill="#FFFFFF" />
    <text x="${flow.labelPos[0]}" y="${flow.labelPos[1]}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="${fs}" font-weight="600" fill="${PALETTE.slateDark}">${escXml(wrapBidi(flow.label))}</text>
  </g>`;
}

export function buildDfdLevel0AcademicSvg(): string {
  let out = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-page="A4-landscape" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">
`;
  // Note: getMainSvgFontsCss is imported lazily below to avoid circular init at module top
  out = buildHeaderWithFonts() + drawAcademicHeader();

  // Three Balanced Architectural Grid Zones (Left: Data Stores | Center: Processes | Right: External Entities)
  out += drawZoneBand(74, 96, 286, 1010, 'منطقة مخازن البيانات (D1 – D8)', '#F6FEFC', '#99F6E4', PALETTE.teal);
  out += drawZoneBand(678, 96, 288, 1010, 'منطقة العمليات المركزية (1.0 – 7.0)', '#F8FAFF', '#BFDBFE', PALETTE.navy);
  out += drawZoneBand(1354, 96, 246, 1010, 'منطقة الكيانات الخارجية', '#F8FAFC', '#CBD5E1', PALETTE.slateMid);

  // 8 Data Stores (Left Zone: x=86..350, w=264)
  const stores: { id: string; y: number; h: number; lines: string[] }[] = [
    { id: 'D1', y: 156, h: 48, lines: ['سجل المستخدمين والصلاحيات'] },
    { id: 'D8', y: 224, h: 48, lines: ['سجل التدقيق والرقابة'] },
    { id: 'D2', y: 306, h: 52, lines: ['سجل الأوقاف والممتلكات', 'الجغرافية (PostGIS)'] },
    { id: 'D3', y: 436, h: 52, lines: ['أرشيف الوثائق والحجج الوقفية'] },
    { id: 'D4', y: 564, h: 52, lines: ['سجل الواقفين والشروط', 'والمستفيدين'] },
    { id: 'D5', y: 702, h: 52, lines: ['سجل العقود والإيجارات'] },
    { id: 'D6', y: 840, h: 54, lines: ['السجل المالي والتحصيل', 'والتوزيع'] },
    { id: 'D7', y: 984, h: 54, lines: ['سجل الخدمات الإلكترونية', 'والطلبات'] },
  ];
  // Use exact original D2/D4/D6/D7 titles (no extra "(PostGIS)" added!)
  stores[2].lines = ['سجل الأوقاف والممتلكات', 'الجغرافية'];
  for (const s of stores) {
    out += drawDataStoreBox(86, s.y, 264, s.h, s.id, s.lines);
  }

  // 7 Central Processes (Center Zone: x=690..954, w=264)
  const procs: { id: string; y: number; h: number; lines: string[] }[] = [
    { id: '1.0', y: 166, h: 96, lines: ['إدارة الحسابات', 'والصلاحيات'] },
    { id: '2.0', y: 294, h: 96, lines: ['إدارة الأوقاف والممتلكات', 'الوقفية والحصر الجغرافي'] },
    { id: '3.0', y: 422, h: 96, lines: ['إدارة الوثائق الوقفية', 'والأرشفة الإلكترونية'] },
    { id: '4.0', y: 550, h: 96, lines: ['إدارة شروط الواقفين', 'والمستفيدين'] },
    { id: '5.0', y: 678, h: 108, lines: ['إدارة العقود', 'والإيجارات'] },
    { id: '6.0', y: 816, h: 114, lines: ['إدارة المعاملات', 'المالية والتحصيل'] },
    { id: '7.0', y: 960, h: 104, lines: ['إدارة الخدمات', 'الإلكترونية والطلبات'] },
  ];
  for (const p of procs) {
    out += drawProcessBox(690, p.y, 264, p.h, p.id, p.lines);
  }

  // 5 External Entities (Right Zone: x=1368..1586, w=218)
  out += drawExternalEntityBox(1368, 168, 218, 76, 'مدير النظام', 'System Administrator');
  out += drawExternalEntityBox(1368, 294, 218, 168, 'موظف إدارة الأوقاف', 'Waqf Management Employee');
  out += drawExternalEntityBox(1368, 692, 218, 106, 'المستأجر', 'Tenant');
  out += drawExternalEntityBox(1368, 824, 218, 98, 'الناظر أو الوكيل', 'Nazir / Waqf Trustee');
  out += drawExternalEntityBox(1368, 954, 218, 110, 'المستفيد', 'Beneficiary');

  // All 44 Exact Flows (22 Left Process<->Store + 22 Right Entity<->Process)
  const flows: FlowSpec[] = [
    // --- LEFT HALF: 22 Flows between Processes (1.0–7.0) and Data Stores (D1–D8) ---
    { id: '1.0->D1', points: [[690, 174], [350, 174]], label: 'بيانات المستخدمين والأدوار', labelPos: [520, 169], color: PALETTE.navy },
    { id: 'D1->1.0', points: [[350, 198], [690, 198]], label: 'صلاحيات التحقق (RBAC)', labelPos: [520, 193], color: PALETTE.teal },
    { id: '1.0->D8', points: [[690, 224], [382, 224], [382, 236], [350, 236]], label: 'سجل أحداث الأمان', labelPos: [542, 219], color: PALETTE.navy },
    { id: 'D8->1.0', points: [[350, 258], [402, 258], [402, 248], [690, 248]], label: 'بيانات التدقيق', labelPos: [546, 263], color: PALETTE.teal },

    { id: '2.0->D8', points: [[690, 300], [422, 300], [422, 267], [350, 267]], label: 'تحديث سجل التدقيق', labelPos: [558, 295], color: PALETTE.navy },
    { id: '2.0->D2', points: [[690, 326], [350, 326]], label: 'بيانات الأصول والمضلعات (PostGIS)', labelPos: [520, 321], color: PALETTE.navy },
    { id: 'D2->2.0', points: [[350, 350], [690, 350]], label: 'بيانات الحصر والخرائط', labelPos: [520, 364], color: PALETTE.teal },

    { id: 'D2->3.0', points: [[326, 358], [326, 429], [690, 429]], label: 'مرجع العقار والوقف', labelPos: [532, 424], color: PALETTE.teal, dashed: true },
    { id: '3.0->D3', points: [[690, 454], [350, 454]], label: 'الصكوك والنص (OCR) وبصمة SHA-256', labelPos: [520, 449], color: PALETTE.navy },
    { id: 'D3->3.0', points: [[350, 478], [690, 478]], label: 'الوثائق المفهرسة', labelPos: [520, 492], color: PALETTE.teal },

    { id: 'D3->4.0', points: [[326, 488], [326, 557], [690, 557]], label: 'نصوص الحجج الوقفية', labelPos: [532, 552], color: PALETTE.teal, dashed: true },
    { id: '4.0->D4', points: [[690, 582], [350, 582]], label: 'الشروط والمستفيدون ونسب التوزيع', labelPos: [520, 577], color: PALETTE.navy },
    { id: 'D4->4.0', points: [[350, 606], [690, 606]], label: 'سجل الحصص المعتمدة', labelPos: [520, 620], color: PALETTE.teal },

    { id: 'D2->5.0', points: [[86, 334], [44, 334], [44, 662], [392, 662], [392, 688], [690, 688]], label: 'العقارات المتاحة للتأجير', labelPos: [544, 683], color: PALETTE.teal, dashed: true },
    { id: '5.0->D5', points: [[690, 716], [350, 716]], label: 'بيانات العقود وجداول السداد', labelPos: [520, 711], color: PALETTE.navy },
    { id: 'D5->5.0', points: [[350, 742], [690, 742]], label: 'حالة العقود السارية', labelPos: [520, 756], color: PALETTE.teal },

    { id: 'D5->6.0', points: [[326, 754], [326, 823], [690, 823]], label: 'جدول الدفعات المستحقة', labelPos: [520, 818], color: PALETTE.teal, dashed: true },
    { id: '6.0->D6', points: [[690, 854], [350, 854]], label: 'الفواتير والتحصيل وصرف الغلة', labelPos: [520, 849], color: PALETTE.navy },
    { id: 'D6->6.0', points: [[350, 880], [690, 880]], label: 'الأرصدة والمطالبات المالية', labelPos: [520, 894], color: PALETTE.teal },
    { id: 'D4->6.0', points: [[86, 592], [62, 592], [62, 922], [690, 922]], label: 'جدول استحقاق المستفيدين', labelPos: [520, 937], color: PALETTE.teal, dashed: true },

    { id: '7.0->D7', points: [[690, 998], [350, 998]], label: 'بيانات الطلبات وحالات التنفيذ', labelPos: [520, 993], color: PALETTE.navy },
    { id: 'D7->7.0', points: [[350, 1024], [690, 1024]], label: 'تفاصيل الطلبات والردود', labelPos: [520, 1038], color: PALETTE.teal },

    // --- RIGHT HALF: 22 Flows between External Entities (E1–E5) and Processes (1.0–7.0) ---
    { id: 'E1->1.0', points: [[1368, 188], [954, 188]], label: 'بيانات الحسابات والأدوار ومعايير الأمان', labelPos: [1124, 183], color: PALETTE.navy },
    { id: '1.0->E1', points: [[954, 226], [1368, 226]], label: 'تقارير التدقيق وإحصائيات النظام', labelPos: [1124, 240], color: PALETTE.teal },
    { id: 'E5->1.0', points: [[1586, 718], [1618, 718], [1618, 152], [898, 152], [898, 166]], label: 'بيانات التسجيل والتحقق (المستأجر)', labelPos: [1135, 147], color: PALETTE.navy },
    { id: 'E4->1.0', points: [[1586, 998], [1634, 998], [1634, 134], [746, 134], [746, 166]], label: 'بيانات الدخول والتحقق (المستفيد)', labelPos: [1135, 129], color: PALETTE.navy },

    { id: 'E2->2.0', points: [[1368, 318], [954, 318]], label: 'بيانات الحصر والإحداثيات الجغرافية', labelPos: [1124, 313], color: PALETTE.navy },
    { id: '2.0->E2', points: [[954, 356], [1368, 356]], label: 'سجلات الحصر والخرائط والتقارير', labelPos: [1124, 370], color: PALETTE.teal },

    { id: 'E2->3.0', points: [[1368, 388], [1286, 388], [1286, 442], [954, 442]], label: 'ملفات الصكوك والحجج الوقفية', labelPos: [1124, 437], color: PALETTE.navy },
    { id: '3.0->E2', points: [[954, 482], [1302, 482], [1302, 414], [1368, 414]], label: 'نتائج (OCR / SHA-256)', labelPos: [1124, 496], color: PALETTE.teal },

    { id: 'E2->4.0', points: [[1368, 436], [1318, 436], [1318, 570], [954, 570]], label: 'شروط الواقفين والمستفيدون', labelPos: [1124, 565], color: PALETTE.navy },
    { id: '4.0->E4', points: [[954, 612], [1602, 612], [1602, 968], [1586, 968]], label: 'بيانات الاستحقاق وحوالات العوائد', labelPos: [1124, 626], color: PALETTE.teal },

    { id: 'E2->5.0', points: [[1368, 450], [1282, 450], [1282, 686], [954, 686]], label: 'مسودات العقود', labelPos: [1116, 681], color: PALETTE.navy },
    { id: 'E5->5.0', points: [[1368, 712], [954, 712]], label: 'طلبات الاستئجار والتجديد', labelPos: [1116, 707], color: PALETTE.navy },
    { id: '5.0->E5', points: [[954, 742], [1368, 742]], label: 'نسخ العقود وجدول الدفعات', labelPos: [1116, 756], color: PALETTE.teal },
    { id: 'E3->5.0', points: [[1368, 836], [1304, 836], [1304, 774], [954, 774]], label: 'اعتمادات العقود وشروط التوزيع', labelPos: [1116, 788], color: PALETTE.navy },

    { id: 'E2->6.0', points: [[1368, 458], [1293, 458], [1293, 824], [954, 824]], label: 'أذونات الصرف والقيود', labelPos: [1116, 819], color: PALETTE.navy },
    { id: 'E5->6.0', points: [[1368, 768], [1315, 768], [1315, 854], [954, 854]], label: 'بيانات سداد الإيجارات', labelPos: [1116, 849], color: PALETTE.navy },
    { id: '6.0->E5', points: [[954, 884], [1326, 884], [1326, 786], [1368, 786]], label: 'فواتير الإيجار وإيصالات السداد', labelPos: [1116, 898], color: PALETTE.teal },
    { id: '6.0->E3', points: [[954, 914], [1337, 914], [1337, 874], [1368, 874]], label: 'تقارير الغلة والوضع المالي', labelPos: [1116, 928], color: PALETTE.teal },

    { id: 'E2->7.0', points: [[1586, 442], [1650, 442], [1650, 1090], [822, 1090], [822, 1064]], label: 'قرارات المعالجة والقيود المالية وشروط الواقفين', labelPos: [1135, 1085], color: PALETTE.navy },
    { id: '7.0->E3', points: [[954, 976], [1348, 976], [1348, 906], [1368, 906]], label: 'إشعارات الطلبات والمصادقات المعلقة', labelPos: [1116, 971], color: PALETTE.teal },
    { id: 'E4->7.0', points: [[1368, 1008], [954, 1008]], label: 'طلبات الاستحقاق والخدمات الإلكترونية', labelPos: [1116, 1003], color: PALETTE.navy },
    { id: '7.0->E4', points: [[954, 1044], [1368, 1044]], label: 'حالة الطلبات والإشعارات', labelPos: [1116, 1058], color: PALETTE.teal },
  ];

  for (const flow of flows) {
    out += renderFlowWithCleanCrossings(flow, flows) + '\n  ';
  }

  out += drawLegendBar();
  out += `</svg>\n`;
  return out;
}

import { getMainSvgFontsCss } from './svgFontEmbed';

function buildHeaderWithFonts(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-page="A4-landscape" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">
  <defs>
    <style type="text/css"><![CDATA[
${getMainSvgFontsCss()}
    ]]></style>
  </defs>
`;
}

export const DFD0_ACADEMIC_MERMAID = `flowchart LR
  %% المنصة الرقمية لإدارة وحصر الممتلكات الوقفية (تَرِكَة) - النسخة الهندسية A4
  subgraph ENTITIES["الكيانات الخارجية"]
    E1["مدير النظام"]
    E2["موظف إدارة الأوقاف"]
    E5["المستأجر"]
    E3["الناظر أو الوكيل"]
    E4["المستفيد"]
  end

  subgraph PROCESSES["العمليات المركزية (1.0 – 7.0)"]
    P1(["1.0 إدارة الحسابات والصلاحيات"])
    P2(["2.0 إدارة الأوقاف والممتلكات الوقفية والحصر الجغرافي"])
    P3(["3.0 إدارة الوثائق الوقفية والأرشفة الإلكترونية"])
    P4(["4.0 إدارة شروط الواقفين والمستفيدين"])
    P5(["5.0 إدارة العقود والإيجارات"])
    P6(["6.0 إدارة المعاملات المالية والتحصيل"])
    P7(["7.0 إدارة الخدمات الإلكترونية والطلبات"])
  end

  subgraph STORES["مخازن البيانات (D1 – D8)"]
    D1[("D1 سجل المستخدمين والصلاحيات")]
    D8[("D8 سجل التدقيق والرقابة")]
    D2[("D2 سجل الأوقاف والممتلكات الجغرافية")]
    D3[("D3 أرشيف الوثائق والحجج الوقفية")]
    D4[("D4 سجل الواقفين والشروط والمستفيدين")]
    D5[("D5 سجل العقود والإيجارات")]
    D6[("D6 السجل المالي والتحصيل والتوزيع")]
    D7[("D7 سجل الخدمات الإلكترونية والطلبات")]
  end

  E1 -->|"بيانات الحسابات والأدوار ومعايير الأمان"| P1
  P1 -->|"تقارير التدقيق وإحصائيات النظام"| E1
  E5 -->|"بيانات التسجيل والتحقق (المستأجر)"| P1
  E4 -->|"بيانات الدخول والتحقق (المستفيد)"| P1
  E2 -->|"بيانات الحصر والإحداثيات الجغرافية"| P2
  P2 -->|"سجلات الحصر والخرائط والتقارير"| E2
  E2 -->|"ملفات الصكوك والحجج الوقفية"| P3
  P3 -->|"نتائج (OCR / SHA-256)"| E2
  E2 -->|"شروط الواقفين والمستفيدون"| P4
  P4 -->|"بيانات الاستحقاق وحوالات العوائد"| E4
  E2 -->|"مسودات العقود"| P5
  E5 -->|"طلبات الاستئجار والتجديد"| P5
  P5 -->|"نسخ العقود وجدول الدفعات"| E5
  E3 -->|"اعتمادات العقود وشروط التوزيع"| P5
  E2 -->|"أذونات الصرف والقيود"| P6
  E5 -->|"بيانات سداد الإيجارات"| P6
  P6 -->|"فواتير الإيجار وإيصالات السداد"| E5
  P6 -->|"تقارير الغلة والوضع المالي"| E3
  E2 -->|"قرارات المعالجة والقيود المالية وشروط الواقفين"| P7
  P7 -->|"إشعارات الطلبات والمصادقات المعلقة"| E3
  E4 -->|"طلبات الاستحقاق والخدمات الإلكترونية"| P7
  P7 -->|"حالة الطلبات والإشعارات"| E4

  P1 -->|"بيانات المستخدمين والأدوار"| D1
  D1 -->|"صلاحيات التحقق (RBAC)"| P1
  P1 -->|"سجل أحداث الأمان"| D8
  D8 -->|"بيانات التدقيق"| P1
  P2 -->|"تحديث سجل التدقيق"| D8
  P2 -->|"بيانات الأصول والمضلعات (PostGIS)"| D2
  D2 -->|"بيانات الحصر والخرائط"| P2
  D2 -.->|"مرجع العقار والوقف"| P3
  P3 -->|"الصكوك والنص (OCR) وبصمة SHA-256"| D3
  D3 -->|"الوثائق المفهرسة"| P3
  D3 -.->|"نصوص الحجج الوقفية"| P4
  P4 -->|"الشروط والمستفيدون ونسب التوزيع"| D4
  D4 -->|"سجل الحصص المعتمدة"| P4
  D2 -.->|"العقارات المتاحة للتأجير"| P5
  P5 -->|"بيانات العقود وجداول السداد"| D5
  D5 -->|"حالة العقود السارية"| P5
  D5 -.->|"جدول الدفعات المستحقة"| P6
  P6 -->|"الفواتير والتحصيل وصرف الغلة"| D6
  D6 -->|"الأرصدة والمطالبات المالية"| P6
  D4 -.->|"جدول استحقاق المستفيدين"| P6
  P7 -->|"بيانات الطلبات وحالات التنفيذ"| D7
  D7 -->|"تفاصيل الطلبات والردود"| P7
`;

export function buildDfd0AcademicDrawioXml(
  buildDrawioXml: (
    diagramId: string,
    titleAr: string,
    nodes: { id: string; label: string; x: number; y: number; w: number; h: number; style: string }[],
    edges: { id: string; source: string; target: string; label: string; style?: string }[]
  ) => string
): string {
  const S_PROC = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#1E3A5F;strokeWidth=2;fontStyle=1;fontFamily=Noto Sans Arabic;';
  const S_ENT = 'shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=#F1F5F9;strokeColor=#0F172A;strokeWidth=2;fontStyle=1;fontFamily=Noto Sans Arabic;';
  const S_STORE = 'shape=partialRectangle;whiteSpace=wrap;html=1;left=1;right=0;top=1;bottom=1;fillColor=#F0FDFA;strokeColor=#0F766E;strokeWidth=2;fontStyle=1;fontFamily=Noto Sans Arabic;';
  const E_SOLID = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#1E3A5F;fontFamily=Noto Sans Arabic;';
  const E_TEAL = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#0F766E;fontFamily=Noto Sans Arabic;';
  const E_DASH = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;strokeColor=#0F766E;fontFamily=Noto Sans Arabic;';

  return buildDrawioXml(
    'dfd0-academic',
    'DFD Level 0 (A4 Landscape Academic)',
    [
      // Left Column: Data Stores
      { id: 'd1', label: 'D1 سجل المستخدمين والصلاحيات', x: 80, y: 150, w: 260, h: 48, style: S_STORE },
      { id: 'd8', label: 'D8 سجل التدقيق والرقابة', x: 80, y: 220, w: 260, h: 48, style: S_STORE },
      { id: 'd2', label: 'D2 سجل الأوقاف والممتلكات الجغرافية', x: 80, y: 300, w: 260, h: 50, style: S_STORE },
      { id: 'd3', label: 'D3 أرشيف الوثائق والحجج الوقفية', x: 80, y: 430, w: 260, h: 50, style: S_STORE },
      { id: 'd4', label: 'D4 سجل الواقفين والشروط والمستفيدين', x: 80, y: 555, w: 260, h: 50, style: S_STORE },
      { id: 'd5', label: 'D5 سجل العقود والإيجارات', x: 80, y: 690, w: 260, h: 50, style: S_STORE },
      { id: 'd6', label: 'D6 السجل المالي والتحصيل والتوزيع', x: 80, y: 825, w: 260, h: 52, style: S_STORE },
      { id: 'd7', label: 'D7 سجل الخدمات الإلكترونية والطلبات', x: 80, y: 970, w: 260, h: 52, style: S_STORE },

      // Center Column: Processes 1.0 - 7.0
      { id: 'p1', label: '1.0\nإدارة الحسابات والصلاحيات', x: 680, y: 160, w: 260, h: 90, style: S_PROC },
      { id: 'p2', label: '2.0\nإدارة الأوقاف والممتلكات الوقفية والحصر الجغرافي', x: 680, y: 288, w: 260, h: 90, style: S_PROC },
      { id: 'p3', label: '3.0\nإدارة الوثائق الوقفية والأرشفة الإلكترونية', x: 680, y: 416, w: 260, h: 90, style: S_PROC },
      { id: 'p4', label: '4.0\nإدارة شروط الواقفين والمستفيدين', x: 680, y: 544, w: 260, h: 90, style: S_PROC },
      { id: 'p5', label: '5.0\nإدارة العقود والإيجارات', x: 680, y: 672, w: 260, h: 100, style: S_PROC },
      { id: 'p6', label: '6.0\nإدارة المعاملات المالية والتحصيل', x: 680, y: 806, w: 260, h: 106, style: S_PROC },
      { id: 'p7', label: '7.0\nإدارة الخدمات الإلكترونية والطلبات', x: 680, y: 948, w: 260, h: 98, style: S_PROC },

      // Right Column: External Entities
      { id: 'e1', label: 'مدير النظام', x: 1340, y: 162, w: 220, h: 74, style: S_ENT },
      { id: 'e2', label: 'موظف إدارة الأوقاف', x: 1340, y: 288, w: 220, h: 160, style: S_ENT },
      { id: 'e5', label: 'المستأجر', x: 1340, y: 680, w: 220, h: 100, style: S_ENT },
      { id: 'e3', label: 'الناظر أو الوكيل', x: 1340, y: 810, w: 220, h: 94, style: S_ENT },
      { id: 'e4', label: 'المستفيد', x: 1340, y: 940, w: 220, h: 106, style: S_ENT },
    ],
    [
      // 44 Exact Flows
      { id: 'f01', source: 'e1', target: 'p1', label: 'بيانات الحسابات والأدوار ومعايير الأمان', style: E_SOLID },
      { id: 'f02', source: 'p1', target: 'e1', label: 'تقارير التدقيق وإحصائيات النظام', style: E_TEAL },
      { id: 'f03', source: 'e5', target: 'p1', label: 'بيانات التسجيل والتحقق (المستأجر)', style: E_SOLID },
      { id: 'f04', source: 'e4', target: 'p1', label: 'بيانات الدخول والتحقق (المستفيد)', style: E_SOLID },
      { id: 'f05', source: 'e2', target: 'p2', label: 'بيانات الحصر والإحداثيات الجغرافية', style: E_SOLID },
      { id: 'f06', source: 'p2', target: 'e2', label: 'سجلات الحصر والخرائط والتقارير', style: E_TEAL },
      { id: 'f07', source: 'e2', target: 'p3', label: 'ملفات الصكوك والحجج الوقفية', style: E_SOLID },
      { id: 'f08', source: 'p3', target: 'e2', label: 'نتائج (OCR / SHA-256)', style: E_TEAL },
      { id: 'f09', source: 'e2', target: 'p4', label: 'شروط الواقفين والمستفيدون', style: E_SOLID },
      { id: 'f10', source: 'p4', target: 'e4', label: 'بيانات الاستحقاق وحوالات العوائد', style: E_TEAL },
      { id: 'f11', source: 'e2', target: 'p5', label: 'مسودات العقود', style: E_SOLID },
      { id: 'f12', source: 'e5', target: 'p5', label: 'طلبات الاستئجار والتجديد', style: E_SOLID },
      { id: 'f13', source: 'p5', target: 'e5', label: 'نسخ العقود وجدول الدفعات', style: E_TEAL },
      { id: 'f14', source: 'e3', target: 'p5', label: 'اعتمادات العقود وشروط التوزيع', style: E_SOLID },
      { id: 'f15', source: 'e2', target: 'p6', label: 'أذونات الصرف والقيود', style: E_SOLID },
      { id: 'f16', source: 'e5', target: 'p6', label: 'بيانات سداد الإيجارات', style: E_SOLID },
      { id: 'f17', source: 'p6', target: 'e5', label: 'فواتير الإيجار وإيصالات السداد', style: E_TEAL },
      { id: 'f18', source: 'p6', target: 'e3', label: 'تقارير الغلة والوضع المالي', style: E_TEAL },
      { id: 'f19', source: 'e2', target: 'p7', label: 'قرارات المعالجة والقيود المالية وشروط الواقفين', style: E_SOLID },
      { id: 'f20', source: 'p7', target: 'e3', label: 'إشعارات الطلبات والمصادقات المعلقة', style: E_TEAL },
      { id: 'f21', source: 'e4', target: 'p7', label: 'طلبات الاستحقاق والخدمات الإلكترونية', style: E_SOLID },
      { id: 'f22', source: 'p7', target: 'e4', label: 'حالة الطلبات والإشعارات', style: E_TEAL },

      { id: 'f23', source: 'p1', target: 'd1', label: 'بيانات المستخدمين والأدوار', style: E_SOLID },
      { id: 'f24', source: 'd1', target: 'p1', label: 'صلاحيات التحقق (RBAC)', style: E_TEAL },
      { id: 'f25', source: 'p1', target: 'd8', label: 'سجل أحداث الأمان', style: E_SOLID },
      { id: 'f26', source: 'd8', target: 'p1', label: 'بيانات التدقيق', style: E_TEAL },
      { id: 'f27', source: 'p2', target: 'd8', label: 'تحديث سجل التدقيق', style: E_SOLID },
      { id: 'f28', source: 'p2', target: 'd2', label: 'بيانات الأصول والمضلعات (PostGIS)', style: E_SOLID },
      { id: 'f29', source: 'd2', target: 'p2', label: 'بيانات الحصر والخرائط', style: E_TEAL },
      { id: 'f30', source: 'd2', target: 'p3', label: 'مرجع العقار والوقف', style: E_DASH },
      { id: 'f31', source: 'p3', target: 'd3', label: 'الصكوك والنص (OCR) وبصمة SHA-256', style: E_SOLID },
      { id: 'f32', source: 'd3', target: 'p3', label: 'الوثائق المفهرسة', style: E_TEAL },
      { id: 'f33', source: 'd3', target: 'p4', label: 'نصوص الحجج الوقفية', style: E_DASH },
      { id: 'f34', source: 'p4', target: 'd4', label: 'الشروط والمستفيدون ونسب التوزيع', style: E_SOLID },
      { id: 'f35', source: 'd4', target: 'p4', label: 'سجل الحصص المعتمدة', style: E_TEAL },
      { id: 'f36', source: 'd2', target: 'p5', label: 'العقارات المتاحة للتأجير', style: E_DASH },
      { id: 'f37', source: 'p5', target: 'd5', label: 'بيانات العقود وجداول السداد', style: E_SOLID },
      { id: 'f38', source: 'd5', target: 'p5', label: 'حالة العقود السارية', style: E_TEAL },
      { id: 'f39', source: 'd5', target: 'p6', label: 'جدول الدفعات المستحقة', style: E_DASH },
      { id: 'f40', source: 'p6', target: 'd6', label: 'الفواتير والتحصيل وصرف الغلة', style: E_SOLID },
      { id: 'f41', source: 'd6', target: 'p6', label: 'الأرصدة والمطالبات المالية', style: E_TEAL },
      { id: 'f42', source: 'd4', target: 'p6', label: 'جدول استحقاق المستفيدين', style: E_DASH },
      { id: 'f43', source: 'p7', target: 'd7', label: 'بيانات الطلبات وحالات التنفيذ', style: E_SOLID },
      { id: 'f44', source: 'd7', target: 'p7', label: 'تفاصيل الطلبات والردود', style: E_TEAL },
    ]
  );
}
