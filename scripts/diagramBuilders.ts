import { DIAGRAMS } from '../src/data/projectSpec';

// Unified Academic Color System (High-contrast, print & B/W friendly)
export const PALETTE = {
  bg: '#FFFFFF',
  surfaceLight: '#F8FAFC',
  navy: '#1E3A5F',
  navyLight: '#EFF6FF',
  slateDark: '#0F172A',
  slateMid: '#334155',
  slateMuted: '#64748B',
  borderSubtle: '#CBD5E1',
  teal: '#0F766E',
  tealLight: '#F0FDFA',
  amberDark: '#92400E',
  amberLight: '#FFFBEB',
  indigoDark: '#312E81',
  indigoLight: '#EEF2FF',
  gridLine: '#E2E8F0',
};

const FONT_AR = 'Noto Kufi Arabic, Noto Sans Arabic, DejaVu Sans, sans-serif';
const FONT_AR_BODY = 'Noto Sans Arabic, DejaVu Sans, sans-serif';
const FONT_MONO = 'DejaVu Sans Mono, monospace';
const FONT_EN = 'DejaVu Sans, Noto Sans Arabic, sans-serif';

export function escXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function svgHeader(width: number, height: number, titleAr: string, subtitleAr: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrow-navy" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="8" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 11 5 L 0 9 z" fill="${PALETTE.navy}" />
    </marker>
    <marker id="arrow-teal" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="8" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 11 5 L 0 9 z" fill="${PALETTE.teal}" />
    </marker>
    <marker id="arrow-slate" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="8" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 11 5 L 0 9 z" fill="${PALETTE.slateMid}" />
    </marker>
    <!-- Crow's Foot Markers -->
    <marker id="cf-one" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
      <line x1="6" y1="2" x2="6" y2="12" stroke="${PALETTE.navy}" stroke-width="1.8" />
      <line x1="10" y1="2" x2="10" y2="12" stroke="${PALETTE.navy}" stroke-width="1.8" />
    </marker>
    <marker id="cf-many" viewBox="0 0 16 14" refX="14" refY="7" markerWidth="14" markerHeight="12" orient="auto-start-reverse">
      <path d="M 14 2 L 4 7 L 14 12" fill="none" stroke="${PALETTE.navy}" stroke-width="1.8" />
      <line x1="4" y1="2" x2="4" y2="12" stroke="${PALETTE.navy}" stroke-width="1.8" />
    </marker>
    <marker id="cf-zero-one" viewBox="0 0 18 14" refX="16" refY="7" markerWidth="16" markerHeight="12" orient="auto-start-reverse">
      <circle cx="5" cy="7" r="3.2" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="1.6" />
      <line x1="12" y1="2" x2="12" y2="12" stroke="${PALETTE.navy}" stroke-width="1.8" />
    </marker>
    <marker id="cf-zero-many" viewBox="0 0 20 14" refX="18" refY="7" markerWidth="18" markerHeight="12" orient="auto-start-reverse">
      <circle cx="5" cy="7" r="3.2" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="1.6" />
      <path d="M 18 2 L 9 7 L 18 12" fill="none" stroke="${PALETTE.navy}" stroke-width="1.8" />
    </marker>
    <style>
      .halo { paint-order: stroke; stroke: #FFFFFF; stroke-width: 7px; stroke-linejoin: round; stroke-linecap: round; }
      .halo-sm { paint-order: stroke; stroke: #FFFFFF; stroke-width: 5px; stroke-linejoin: round; stroke-linecap: round; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
  <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="10" fill="none" stroke="${PALETTE.borderSubtle}" stroke-width="1.5" />
  <!-- Academic Title Header -->
  <rect x="18" y="18" width="${width - 36}" height="82" rx="10" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.5" />
  <line x1="18" y1="100" x2="${width - 18}" y2="100" stroke="${PALETTE.navy}" stroke-width="2" />
  <text x="${width / 2}" y="53" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="22" font-weight="bold" fill="${PALETTE.navy}">${escXml(titleAr)}</text>
  <text x="${width / 2}" y="82" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="14" fill="${PALETTE.slateMid}">${escXml(subtitleAr)}</text>
`;
}

function svgFooter(): string {
  return `</svg>\n`;
}

// Gane & Sarson External Entity (double side bar)
function drawExternalEntity(x: number, y: number, w: number, h: number, titleAr: string, subEn?: string): string {
  return `<g class="external-entity">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#F1F5F9" stroke="${PALETTE.slateDark}" stroke-width="2.2" />
    <line x1="${x + 10}" y1="${y}" x2="${x + 10}" y2="${y + h}" stroke="${PALETTE.slateDark}" stroke-width="1.6" />
    <line x1="${x}" y1="${y + 8}" x2="${x + w}" y2="${y + 8}" stroke="${PALETTE.slateDark}" stroke-width="1.2" opacity="0.25" />
    <text x="${x + w / 2 + 4}" y="${subEn ? y + h / 2 - 4 : y + h / 2 + 6}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="15" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(titleAr)}</text>
    ${subEn ? `<text x="${x + w / 2 + 4}" y="${y + h / 2 + 17}" text-anchor="middle" font-family="${FONT_EN}" font-size="11.5" fill="${PALETTE.slateMuted}">${escXml(subEn)}</text>` : ''}
  </g>`;
}

// Gane & Sarson Process (rounded rectangle with top number band)
function drawProcess(x: number, y: number, w: number, h: number, num: string, linesAr: string[], accent = PALETTE.navy, fill = PALETTE.navyLight): string {
  const headerH = 26;
  const bodyCenterY = y + headerH + (h - headerH) / 2;
  const lineH = 20;
  const startY = bodyCenterY - ((linesAr.length - 1) * lineH) / 2 + 5;
  return `<g class="dfd-process">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${accent}" stroke-width="2.2" />
    <path d="M ${x} ${y + headerH} L ${x + w} ${y + headerH} L ${x + w} ${y + 12} Q ${x + w} ${y} ${x + w - 12} ${y} L ${x + 12} ${y} Q ${x} ${y} ${x} ${y + 12} Z" fill="${accent}" />
    <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-family="${FONT_EN}" font-size="13.5" font-weight="bold" fill="#FFFFFF">${escXml(num)}</text>
    ${linesAr
      .map(
        (line, i) =>
          `<text x="${x + w / 2}" y="${startY + i * lineH}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13.5" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(line)}</text>`
      )
      .join('\n    ')}
  </g>`;
}

// Gane & Sarson Data Store (open-right rectangle with left ID compartment)
function drawDataStore(x: number, y: number, w: number, h: number, id: string, titleAr: string): string {
  const idW = 46;
  return `<g class="data-store">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PALETTE.tealLight}" />
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${PALETTE.teal}" stroke-width="2.2" />
    <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${PALETTE.teal}" stroke-width="2.2" />
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${PALETTE.teal}" stroke-width="2.2" />
    <rect x="${x}" y="${y}" width="${idW}" height="${h}" fill="${PALETTE.teal}" />
    <text x="${x + idW / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-family="${FONT_EN}" font-size="13.5" font-weight="bold" fill="#FFFFFF">${escXml(id)}</text>
    <text x="${x + idW + (w - idW) / 2}" y="${y + h / 2 + 5}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(titleAr)}</text>
  </g>`;
}

// Clean Flow Arrow with Halo Label
function drawFlow(
  points: [number, number][],
  label: string,
  labelPos: [number, number],
  color = PALETTE.navy,
  marker = 'arrow-navy',
  dashed = false,
  fontSize = 11.5
): string {
  const d = points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px} ${py}`).join(' ');
  return `<g class="data-flow">
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" ${dashed ? 'stroke-dasharray="6,4"' : ''} marker-end="url(#${marker})" />
    ${
      label
        ? `<text x="${labelPos[0]}" y="${labelPos[1]}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="${fontSize}" font-weight="600" fill="${PALETTE.slateDark}" class="halo">${escXml(label)}</text>`
        : ''
    }
  </g>`;
}

function drawDfdLegend(x: number, y: number, w: number): string {
  const cTitle = x + w * 0.87;
  const cEnt = x + w * 0.68;
  const cProc = x + w * 0.50;
  const cStore = x + w * 0.32;
  const cFlow = x + w * 0.14;
  return `<g class="legend">
    <rect x="${x}" y="${y}" width="${w}" height="62" rx="8" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />
    <text x="${cTitle}" y="${y + 36}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13" font-weight="bold" fill="${PALETTE.navy}">دليل الرموز (Gane &amp; Sarson)</text>

    <!-- External Entity icon -->
    <rect x="${cEnt + 26}" y="${y + 16}" width="44" height="30" rx="3" fill="#F1F5F9" stroke="${PALETTE.slateDark}" stroke-width="1.8" />
    <line x1="${cEnt + 33}" y1="${y + 16}" x2="${cEnt + 33}" y2="${y + 46}" stroke="${PALETTE.slateDark}" stroke-width="1.3" />
    <text x="${cEnt - 24}" y="${y + 36}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12.5" font-weight="600" fill="${PALETTE.slateDark}">كيان خارجي</text>

    <!-- Process icon -->
    <rect x="${cProc + 24}" y="${y + 15}" width="48" height="32" rx="7" fill="${PALETTE.navyLight}" stroke="${PALETTE.navy}" stroke-width="1.8" />
    <line x1="${cProc + 24}" y1="${y + 25}" x2="${cProc + 72}" y2="${y + 25}" stroke="${PALETTE.navy}" stroke-width="1.8" />
    <text x="${cProc - 26}" y="${y + 36}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12.5" font-weight="600" fill="${PALETTE.slateDark}">عملية نظام</text>

    <!-- Data Store icon -->
    <rect x="${cStore + 22}" y="${y + 17}" width="52" height="28" fill="${PALETTE.tealLight}" />
    <path d="M ${cStore + 74} ${y + 17} L ${cStore + 22} ${y + 17} L ${cStore + 22} ${y + 45} L ${cStore + 74} ${y + 45}" fill="none" stroke="${PALETTE.teal}" stroke-width="1.8" />
    <rect x="${cStore + 22}" y="${y + 17}" width="16" height="28" fill="${PALETTE.teal}" />
    <text x="${cStore - 26}" y="${y + 36}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12.5" font-weight="600" fill="${PALETTE.slateDark}">مخزن بيانات</text>

    <!-- Data Flow icon -->
    <line x1="${cFlow + 72}" y1="${y + 31}" x2="${cFlow + 20}" y2="${y + 31}" stroke="${PALETTE.navy}" stroke-width="1.8" marker-end="url(#arrow-navy)" />
    <text x="${cFlow - 24}" y="${y + 36}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12.5" font-weight="600" fill="${PALETTE.slateDark}">تدفق بيانات</text>
  </g>`;
}

// ============================================================================
// 1. CONTEXT DIAGRAM (01_Context_Diagram)
// ============================================================================
export function buildContextDiagramSvg(): string {
  const W = 1720;
  const H = 1140;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-1): المخطط البيئي للنظام (Context Diagram)',
    'المنصة الرقمية لإدارة وحصر الممتلكات الوقفية — حدود النظام وتدفقات البيانات مع الفئات الخارجية الخمس'
  );

  // Subtle central halo zone
  out += `<circle cx="860" cy="560" r="225" fill="none" stroke="${PALETTE.gridLine}" stroke-width="1.5" stroke-dasharray="6,6" />`;

  // Central System Process (0)
  out += drawProcess(
    670,
    460,
    380,
    200,
    '0',
    ['المنصة الرقمية لإدارة', 'وحصر الممتلكات الوقفية', '(النظام الشامل)'],
    PALETTE.navy,
    '#EFF6FF'
  );

  // 5 External Entities
  // Top: System Admin
  out += drawExternalEntity(710, 145, 300, 76, 'مدير النظام', 'System Administrator');
  // Top-Right: Waqf Employee
  out += drawExternalEntity(1350, 315, 310, 82, 'موظف إدارة الأوقاف', 'Waqf Management Employee');
  // Bottom-Right: Nazir
  out += drawExternalEntity(1350, 725, 310, 82, 'الناظر أو الوكيل', 'Nazir / Waqf Trustee');
  // Top-Left: Tenant
  out += drawExternalEntity(60, 315, 310, 82, 'المستأجر', 'Tenant');
  // Bottom-Left: Beneficiary
  out += drawExternalEntity(60, 725, 310, 82, 'المستفيد', 'Beneficiary');

  // Flows: System Admin (Top) <-> Process 0
  out += drawFlow(
    [
      [795, 221],
      [795, 456],
    ],
    'بيانات الحسابات والصلاحيات ومعايير الأمان',
    [715, 368],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [
      [925, 460],
      [925, 225],
    ],
    'تقارير التدقيق وإحصائيات النظام وحالة الحسابات',
    [1025, 368],
    PALETTE.teal,
    'arrow-teal'
  );

  // Flows: Waqf Employee (Right Upper) <-> Process 0
  out += drawFlow(
    [
      [1350, 340],
      [1155, 340],
      [1155, 495],
      [1054, 495],
    ],
    'بيانات الحصر والوثائق والشروط والعقود والقيود والقرارات',
    [1285, 295],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [
      [1050, 535],
      [1215, 535],
      [1215, 378],
      [1346, 378],
    ],
    'سجلات الحصر والخرائط ونتائج (OCR / SHA-256)',
    [1245, 560],
    PALETTE.teal,
    'arrow-teal'
  );

  // Flows: Nazir (Right Lower) <-> Process 0
  out += drawFlow(
    [
      [1350, 750],
      [1155, 750],
      [1155, 625],
      [1054, 625],
    ],
    'تحديثات الأوقاف واعتمادات العقود والصرف المالي',
    [1240, 785],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [
      [1050, 585],
      [1215, 585],
      [1215, 790],
      [1346, 790],
    ],
    'تقارير الغلة والوضع المالي وإشعارات المصادقة',
    [1265, 680],
    PALETTE.teal,
    'arrow-teal'
  );

  // Flows: Tenant (Left Upper) <-> Process 0
  out += drawFlow(
    [
      [370, 340],
      [565, 340],
      [565, 495],
      [666, 495],
    ],
    'بيانات التسجيل وطلبات الاستئجار وسداد الإيجارات',
    [435, 295],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [
      [670, 535],
      [505, 535],
      [505, 378],
      [374, 378],
    ],
    'العقود وجدول الدفعات والفواتير والإيصالات',
    [475, 560],
    PALETTE.teal,
    'arrow-teal'
  );

  // Flows: Beneficiary (Left Lower) <-> Process 0
  out += drawFlow(
    [
      [370, 750],
      [565, 750],
      [565, 625],
      [666, 625],
    ],
    'بيانات الهوية وطلبات الاستحقاق والخدمات الإلكترونية',
    [480, 785],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [
      [670, 585],
      [505, 585],
      [505, 790],
      [374, 790],
    ],
    'بيانات الاستحقاق والحوالات وحالة الطلبات',
    [455, 680],
    PALETTE.teal,
    'arrow-teal'
  );

  out += drawDfdLegend(60, 1045, W - 120);
  out += svgFooter();
  return out;
}

// ============================================================================
// 2. DFD LEVEL 0 (02_DFD_Level_0) — Balanced 7 Processes, 5 Entities, 8 Stores
// ============================================================================
export function buildDfdLevel0Svg(): string {
  const W = 2640;
  const H = 1780;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-2): مخطط تدفق البيانات من المستوى الصفري (DFD Level 0)',
    'تفصيل العمليات السبع الرئيسية (1.0 – 7.0) وتدفقاتها المتزنة مع الكيانات الخارجية ومخازن البيانات (D1 – D8)'
  );

  // Architectural Zones (generous spacing, zero overlapping channels)
  out += `<rect x="40" y="122" width="290" height="1535" rx="8" fill="#FAFBFD" stroke="${PALETTE.gridLine}" stroke-width="1" />`;
  out += `<text x="185" y="150" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13" font-weight="bold" fill="${PALETTE.slateMuted}">كيانات خارجية (المتعاملون)</text>`;

  out += `<rect x="2310" y="122" width="290" height="1535" rx="8" fill="#FAFBFD" stroke="${PALETTE.gridLine}" stroke-width="1" />`;
  out += `<text x="2455" y="150" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13" font-weight="bold" fill="${PALETTE.slateMuted}">كيانات خارجية (الإدارة والنظارة)</text>`;

  out += `<rect x="1160" y="122" width="350" height="1535" rx="8" fill="#F6FEFC" stroke="#CCFBF1" stroke-width="1.2" />`;
  out += `<text x="1335" y="150" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13" font-weight="bold" fill="${PALETTE.teal}">مخازن البيانات المركزية (D1 – D8)</text>`;

  // External Entities (Left: Tenant & Beneficiary)
  out += drawExternalEntity(60, 580, 250, 76, 'المستأجر', 'Tenant');
  out += drawExternalEntity(60, 1140, 250, 76, 'المستفيد', 'Beneficiary');

  // External Entities (Right: Admin, Employee, Nazir)
  out += drawExternalEntity(2330, 210, 250, 76, 'مدير النظام', 'System Administrator');
  out += drawExternalEntity(2330, 690, 250, 82, 'موظف إدارة الأوقاف', 'Waqf Management Employee');
  out += drawExternalEntity(2330, 1180, 250, 76, 'الناظر أو الوكيل', 'Nazir / Waqf Trustee');

  // Central Spine: 8 Data Stores (x=1185..1485, width=300, height=56)
  const stores = [
    { id: 'D1', y: 205, title: 'سجل المستخدمين والصلاحيات' },
    { id: 'D8', y: 345, title: 'سجل التدقيق والرقابة' },
    { id: 'D2', y: 505, title: 'سجل الأوقاف والممتلكات الجغرافية' },
    { id: 'D3', y: 675, title: 'أرشيف الوثائق والحجج الوقفية' },
    { id: 'D4', y: 855, title: 'سجل الواقفين والشروط والمستفيدين' },
    { id: 'D5', y: 1035, title: 'سجل العقود والإيجارات' },
    { id: 'D6', y: 1215, title: 'السجل المالي والتحصيل والتوزيع' },
    { id: 'D7', y: 1395, title: 'سجل الخدمات الإلكترونية والطلبات' },
  ];
  for (const s of stores) {
    out += drawDataStore(1185, s.y, 300, 56, s.id, s.title);
  }

  // Right-Center Lane: Processes 1.0, 2.0, 3.0 (x=1810..2100)
  out += drawProcess(1810, 195, 290, 108, '1.0', ['إدارة الحسابات', 'والصلاحيات']);
  out += drawProcess(1810, 480, 290, 116, '2.0', ['إدارة الأوقاف والممتلكات', 'الوقفية والحصر الجغرافي']);
  out += drawProcess(1810, 670, 290, 112, '3.0', ['إدارة الوثائق الوقفية', 'والأرشفة الإلكترونية']);

  // Left-Center Lane: Processes 4.0, 5.0, 6.0, 7.0 (x=510..800)
  out += drawProcess(510, 840, 290, 108, '4.0', ['إدارة شروط الواقفين', 'والمستفيدين']);
  out += drawProcess(510, 1020, 290, 104, '5.0', ['إدارة العقود', 'والإيجارات']);
  out += drawProcess(510, 1200, 290, 108, '6.0', ['إدارة المعاملات', 'المالية والتحصيل']);
  out += drawProcess(510, 1380, 290, 108, '7.0', ['إدارة الخدمات', 'الإلكترونية والطلبات']);

  // --- FLOWS: Right External Entities <-> Right Processes ---
  // Admin <-> 1.0
  out += drawFlow([[2330, 232], [2104, 232]], 'بيانات الحسابات والأدوار ومعايير الأمان', [2217, 218]);
  out += drawFlow([[2100, 268], [2326, 268]], 'تقارير التدقيق وإحصائيات النظام', [2217, 290], PALETTE.teal, 'arrow-teal');

  // Waqf Employee <-> 2.0 & 3.0
  out += drawFlow([[2330, 705], [2205, 705], [2205, 515], [2104, 515]], 'بيانات الحصر والإحداثيات الجغرافية', [2215, 495]);
  out += drawFlow([[2100, 560], [2240, 560], [2240, 720], [2326, 720]], 'سجلات الحصر والخرائط والتقارير', [2215, 582], PALETTE.teal, 'arrow-teal');

  out += drawFlow([[2330, 738], [2104, 738]], 'ملفات الصكوك والحجج الوقفية', [2217, 724]);
  out += drawFlow([[2100, 764], [2326, 764]], 'نتائج (OCR / SHA-256)', [2217, 785], PALETTE.teal, 'arrow-teal');

  // Waqf Employee -> 4.0, 5.0, 6.0, 7.0 via clean bottom bus (y=1595)
  out += drawFlow(
    [[2455, 772], [2455, 1595], [655, 1595], [655, 1492]],
    'قرارات المعالجة والقيود المالية وشروط الواقفين',
    [1680, 1582],
    PALETTE.navy,
    'arrow-navy'
  );
  // Dedicated vertical feeder taps at x=840, 880, 920 (well left of Data Store labels at x=1060)
  out += drawFlow([[840, 1595], [840, 1280], [804, 1280]], 'أذونات الصرف والقيود', [850, 1345], PALETTE.navy, 'arrow-navy');
  out += drawFlow([[880, 1595], [880, 1095], [804, 1095]], 'مسودات العقود', [885, 1145], PALETTE.navy, 'arrow-navy');
  out += drawFlow([[920, 1595], [920, 915], [804, 915]], 'شروط الواقفين والمستفيدون', [920, 965], PALETTE.navy, 'arrow-navy');

  // Nazir <-> 4.0, 5.0, 6.0, 7.0 routed cleanly through inter-store corridors (NEVER crossing D5/D6 boxes!)
  out += drawFlow(
    [[2330, 1200], [1630, 1200], [1630, 1152], [965, 1152], [965, 1055], [804, 1055]],
    'اعتمادات العقود وشروط التوزيع',
    [1860, 1188],
    PALETTE.navy,
    'arrow-navy'
  );
  out += drawFlow(
    [[800, 1255], [1060, 1255], [1060, 1342], [2180, 1342], [2180, 1228], [2326, 1228]],
    'تقارير الغلة والوضع المالي',
    [1860, 1328],
    PALETTE.teal,
    'arrow-teal'
  );
  out += drawFlow(
    [[800, 1470], [2235, 1470], [2235, 1248], [2326, 1248]],
    'إشعارات الطلبات والمصادقات المعلقة',
    [1860, 1456],
    PALETTE.teal,
    'arrow-teal'
  );

  // --- FLOWS: Left External Entities <-> Processes ---
  // Tenant <-> 1.0, 5.0, 6.0, 7.0
  out += drawFlow([[185, 580], [185, 228], [1806, 228]], 'بيانات التسجيل والتحقق (المستأجر)', [760, 215]);
  out += drawFlow([[310, 620], [425, 620], [425, 1055], [506, 1055]], 'طلبات الاستئجار والتجديد', [415, 815]);
  out += drawFlow([[510, 1095], [395, 1095], [395, 642], [314, 642]], 'نسخ العقود وجدول الدفعات', [395, 975], PALETTE.teal, 'arrow-teal');

  out += drawFlow([[270, 656], [270, 1230], [506, 1230]], 'بيانات سداد الإيجارات', [380, 1218]);
  out += drawFlow([[510, 1272], [240, 1272], [240, 660]], 'فواتير الإيجار وإيصالات السداد', [370, 1292], PALETTE.teal, 'arrow-teal');

  // Beneficiary <-> 1.0, 4.0, 7.0
  out += drawFlow([[125, 1140], [125, 188], [1806, 188]], 'بيانات الدخول والتحقق (المستفيد)', [760, 174]);
  out += drawFlow([[310, 1180], [375, 1180], [375, 1435], [506, 1435]], 'طلبات الاستحقاق والخدمات الإلكترونية', [415, 1422]);
  out += drawFlow([[510, 1468], [345, 1468], [345, 1202], [314, 1202]], 'حالة الطلبات والإشعارات', [410, 1488], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[510, 890], [335, 890], [335, 1156], [314, 1156]], 'بيانات الاستحقاق وحوالات العوائد', [410, 875], PALETTE.teal, 'arrow-teal');

  // --- FLOWS: Processes <-> Central Data Stores (D1 – D8) ---
  // 1.0 <-> D1 & D8
  out += drawFlow([[1810, 224], [1489, 224]], 'بيانات المستخدمين والأدوار', [1650, 210]);
  out += drawFlow([[1485, 248], [1806, 248]], 'صلاحيات التحقق (RBAC)', [1650, 266], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1810, 286], [1645, 286], [1645, 368], [1489, 368]], 'سجل أحداث الأمان', [1650, 355]);
  out += drawFlow([[1485, 388], [1675, 388], [1675, 296], [1806, 296]], 'بيانات التدقيق', [1650, 405], PALETTE.teal, 'arrow-teal');

  // 2.0 <-> D2 & D8
  out += drawFlow([[1810, 522], [1489, 522]], 'بيانات الأصول والمضلعات (PostGIS)', [1650, 508]);
  out += drawFlow([[1485, 548], [1806, 548]], 'بيانات الحصر والخرائط', [1650, 566], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1810, 495], [1710, 495], [1710, 356], [1489, 356]], 'تحديث سجل التدقيق', [1700, 445]);

  // 3.0 <-> D3 & D2
  out += drawFlow([[1810, 695], [1489, 695]], 'الصكوك والنص (OCR) وبصمة SHA-256', [1650, 681]);
  out += drawFlow([[1485, 720], [1806, 720]], 'الوثائق المفهرسة', [1650, 738], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1485, 535], [1565, 535], [1565, 682], [1806, 682]], 'مرجع العقار والوقف', [1645, 622], PALETTE.teal, 'arrow-teal', true);

  // 4.0 <-> D4 & D3 (Clean horizontal labels centered around x=1095, dashed cross-store bus at x=1005)
  out += drawFlow([[800, 875], [1181, 875]], 'الشروط والمستفيدون ونسب التوزيع', [1075, 862]);
  out += drawFlow([[1185, 898], [804, 898]], 'سجل الحصص المعتمدة', [1075, 916], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1185, 705], [1025, 705], [1025, 855], [804, 855]], 'نصوص الحجج الوقفية', [1015, 785], PALETTE.teal, 'arrow-teal', true);

  // 5.0 <-> D5 & D2
  out += drawFlow([[800, 1052], [1181, 1052]], 'بيانات العقود وجداول السداد', [1075, 1039]);
  out += drawFlow([[1185, 1078], [804, 1078]], 'حالة العقود السارية', [1075, 1096], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1185, 545], [990, 545], [990, 1034], [804, 1034]], 'العقارات المتاحة للتأجير', [990, 745], PALETTE.teal, 'arrow-teal', true);

  // 6.0 <-> D6 & D5 & D4
  out += drawFlow([[800, 1230], [1181, 1230]], 'الفواتير والتحصيل وصرف الغلة', [1075, 1216]);
  out += drawFlow([[1185, 1255], [804, 1255]], 'الأرصدة والمطالبات المالية', [1075, 1272], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[1185, 1090], [955, 1090], [955, 1214], [804, 1214]], 'جدول الدفعات المستحقة', [955, 1170], PALETTE.teal, 'arrow-teal', true);
  out += drawFlow([[1185, 908], [935, 908], [935, 1204], [804, 1204]], 'جدول استحقاق المستفيدين', [935, 1015], PALETTE.teal, 'arrow-teal', true);

  // 7.0 <-> D7
  out += drawFlow([[800, 1412], [1181, 1412]], 'بيانات الطلبات وحالات التنفيذ', [1075, 1399]);
  out += drawFlow([[1185, 1438], [804, 1438]], 'تفاصيل الطلبات والردود', [1075, 1456], PALETTE.teal, 'arrow-teal');

  out += drawDfdLegend(40, 1682, W - 80);
  out += svgFooter();
  return out;
}

// ============================================================================
// 3. DFD LEVEL 1 (03_DFD_Level_1) — 7 Decomposed Modules -> 21 Sub-processes
// ============================================================================
export function buildDfdLevel1Svg(): string {
  const W = 2500;
  const H = 1860;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-3): مخطط تدفق البيانات من المستوى الأول (DFD Level 1)',
    'التفكيك الوظيفي الهرمي للعمليات السبع الرئيسية إلى 21 عملية فرعية (1.1 – 7.3) وتدفقاتها مع مخازن البيانات'
  );

  // Layout: 7 structured module panels in 2 columns (4 on right, 3 on left) + central summary bar
  interface ModulePanel {
    procId: string;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
    subs: { id: string; lines: string[]; inLabel: string; outLabel: string }[];
    stores: { id: string; title: string }[];
    extLabels: string[];
  }

  const panels: ModulePanel[] = [
    {
      procId: '1.0',
      title: '1.0 إدارة الحسابات والصلاحيات',
      x: 1275,
      y: 122,
      w: 1185,
      h: 365,
      extLabels: ['مدير النظام', 'المستفيد / المستأجر'],
      stores: [
        { id: 'D1', title: 'سجل المستخدمين والصلاحيات' },
        { id: 'D8', title: 'سجل التدقيق والرقابة' },
      ],
      subs: [
        { id: '1.1', lines: ['تسجيل الدخول', 'والتحقق من الهوية'], inLabel: 'بيانات الدخول', outLabel: 'رمز الجلسة' },
        { id: '1.2', lines: ['إدارة المستخدمين', 'والأدوار (RBAC)'], inLabel: 'الأدوار والصلاحيات', outLabel: 'صلاحيات محدثة' },
        { id: '1.3', lines: ['تسجيل التدقيق', 'الأمني والجلسات'], inLabel: 'أحداث العمليات', outLabel: 'تقارير التدقيق' },
      ],
    },
    {
      procId: '2.0',
      title: '2.0 إدارة الأوقاف والممتلكات والحصر الجغرافي',
      x: 1275,
      y: 505,
      w: 1185,
      h: 365,
      extLabels: ['موظف إدارة الأوقاف', 'الناظر أو الوكيل'],
      stores: [
        { id: 'D2', title: 'سجل الأوقاف والممتلكات الجغرافية' },
        { id: 'D8', title: 'سجل التدقيق' },
      ],
      subs: [
        { id: '2.1', lines: ['تسجيل بيانات الوقف', 'والممتلكات الأساسية'], inLabel: 'بيانات الحصر', outLabel: 'سجل الأصل الوقفي' },
        { id: '2.2', lines: ['الرسم والمسح الجغرافي', 'للحدود (PostGIS)'], inLabel: 'الإحداثيات المكانية', outLabel: 'مضلعات معتمدة' },
        { id: '2.3', lines: ['تحديث الحالة وإصدار', 'تقارير الحصر'], inLabel: 'تحديث الحالة', outLabel: 'خرائط وتقارير' },
      ],
    },
    {
      procId: '3.0',
      title: '3.0 إدارة الوثائق الوقفية والأرشفة الإلكترونية',
      x: 1275,
      y: 888,
      w: 1185,
      h: 365,
      extLabels: ['موظف إدارة الأوقاف'],
      stores: [
        { id: 'D3', title: 'أرشيف الوثائق والحجج الوقفية' },
        { id: 'D2', title: 'سجل الأوقاف' },
      ],
      subs: [
        { id: '3.1', lines: ['رفع وفحص الصكوك', 'والحجج الوقفية'], inLabel: 'ملفات الصكوك', outLabel: 'وثيقة مفحوصة' },
        { id: '3.2', lines: ['المعالجة الضوئية', 'واستخلاص النص (OCR)'], inLabel: 'صور الصكوك', outLabel: 'نص مستخلص' },
        { id: '3.3', lines: ['توليد البصمة (SHA-256)', 'والفهرسة والأرشفة'], inLabel: 'الوثيقة والنص', outLabel: 'وثيقة موثقة' },
      ],
    },
    {
      procId: '4.0',
      title: '4.0 إدارة شروط الواقفين والمستفيدين',
      x: 1275,
      y: 1271,
      w: 1185,
      h: 365,
      extLabels: ['موظف الأوقاف / الناظر', 'المستفيد'],
      stores: [
        { id: 'D4', title: 'سجل الواقفين والشروط والمستفيدين' },
        { id: 'D3', title: 'أرشيف الصكوك' },
      ],
      subs: [
        { id: '4.1', lines: ['توثيق شروط الواقفين', 'وقواعد المصارف'], inLabel: 'شروط الواقفين', outLabel: 'قواعد التوزيع' },
        { id: '4.2', lines: ['تسجيل المستفيدين', 'والتحقق من الأهلية'], inLabel: 'بيانات المستفيدين', outLabel: 'قائمة المؤهلين' },
        { id: '4.3', lines: ['احتساب نسب التوزيع', 'المعتمدة'], inLabel: 'قواعد ومؤهلون', outLabel: 'جدول الحصص' },
      ],
    },
    {
      procId: '5.0',
      title: '5.0 إدارة العقود والإيجارات',
      x: 40,
      y: 122,
      w: 1185,
      h: 495,
      extLabels: ['المستأجر', 'موظف الأوقاف / الناظر'],
      stores: [
        { id: 'D5', title: 'سجل العقود والإيجارات' },
        { id: 'D2', title: 'العقارات المتاحة' },
      ],
      subs: [
        { id: '5.1', lines: ['إعداد ومراجعة مسودات', 'عقود الإيجار'], inLabel: 'طلب الاستئجار', outLabel: 'مسودة العقد' },
        { id: '5.2', lines: ['اعتماد العقود وتوثيقها', 'وربطها بالممتلكات'], inLabel: 'اعتماد الناظر', outLabel: 'عقد موثق' },
        { id: '5.3', lines: ['جدولة الدفعات ومتابعة', 'التجديد والإنهاء'], inLabel: 'شروط السداد', outLabel: 'جدول الدفعات' },
      ],
    },
    {
      procId: '6.0',
      title: '6.0 إدارة المعاملات المالية والتحصيل',
      x: 40,
      y: 635,
      w: 1185,
      h: 495,
      extLabels: ['المستأجر / المستفيد', 'موظف الأوقاف / الناظر'],
      stores: [
        { id: 'D6', title: 'السجل المالي والتحصيل والتوزيع' },
        { id: 'D4', title: 'حصص المستفيدين' },
      ],
      subs: [
        { id: '6.1', lines: ['إصدار مطالبات', 'وفواتير الإيجار'], inLabel: 'جدول الدفعات', outLabel: 'فاتورة مستحقة' },
        { id: '6.2', lines: ['تحصيل الإيجارات', 'وإصدار الإيصالات'], inLabel: 'بيانات السداد', outLabel: 'إيصال وقيد دائن' },
        { id: '6.3', lines: ['توزيع الغلة وصرف', 'مستحقات المستفيدين'], inLabel: 'صافي الغلة', outLabel: 'حوالات وتقارير' },
      ],
    },
    {
      procId: '7.0',
      title: '7.0 إدارة الخدمات الإلكترونية والطلبات',
      x: 40,
      y: 1148,
      w: 1185,
      h: 488,
      extLabels: ['المستفيد / المستأجر', 'موظف الأوقاف / الناظر'],
      stores: [
        { id: 'D7', title: 'سجل الخدمات الإلكترونية والطلبات' },
        { id: 'D5', title: 'سجل العقود' },
      ],
      subs: [
        { id: '7.1', lines: ['استقبال وتصنيف', 'الطلبات الإلكترونية'], inLabel: 'طلبات الخدمات', outLabel: 'تذكرة مصنفة' },
        { id: '7.2', lines: ['معالجة الطلبات وتوجيهها', 'للجهات المختصة'], inLabel: 'قرارات المعالجة', outLabel: 'نتيجة الطلب' },
        { id: '7.3', lines: ['إرسال الإشعارات', 'ومتابعة الإنجاز'], inLabel: 'تحديث الحالة', outLabel: 'إشعار فوري' },
      ],
    },
  ];

  for (const p of panels) {
    // Panel Container
    out += `<g class="module-panel">
      <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="1.8" />
      <rect x="${p.x}" y="${p.y}" width="${p.w}" height="38" rx="10" fill="${PALETTE.navy}" />
      <rect x="${p.x}" y="${p.y + 24}" width="${p.w}" height="14" fill="${PALETTE.navy}" />
      <text x="${p.x + p.w * 0.68}" y="${p.y + 25}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="14.5" font-weight="bold" fill="#FFFFFF">${escXml(p.title)}</text>
      <text x="${p.x + p.w * 0.21}" y="${p.y + 24}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12" fill="#CBD5E1">الجهات: ${escXml(p.extLabels.join(' · '))}</text>
    `;

    // 3 Sub-processes laid out right-to-left (x.1 on right, x.2 middle, x.3 left) for natural Arabic reading
    const subW = 280;
    const subH = 104;
    const subY = p.y + 72;
    const subXs = [p.x + p.w - 315, p.x + p.w / 2 - subW / 2, p.x + 35];

    p.subs.forEach((sub, idx) => {
      const sx = subXs[idx];
      out += drawProcess(sx, subY, subW, subH, sub.id, sub.lines);

      // Inter-subprocess flow (idx 0 -> 1 -> 2)
      if (idx < 2) {
        const nextX = subXs[idx + 1] + subW;
        out += drawFlow(
          [
            [sx, subY + subH / 2],
            [nextX + 4, subY + subH / 2],
          ],
          sub.outLabel,
          [(sx + nextX) / 2, subY + subH / 2 - 12],
          PALETTE.navy,
          'arrow-navy',
          false,
          10.5
        );
      }
    });

    // External Input Badge -> first sub-process top
    out += drawFlow(
      [
        [subXs[0] + subW / 2, p.y + 42],
        [subXs[0] + subW / 2, subY - 4],
      ],
      p.subs[0].inLabel,
      [subXs[0] + subW / 2 - 75, p.y + 60],
      PALETTE.slateMid,
      'arrow-slate',
      false,
      10.5
    );

    // Output from 3rd sub-process downward (shifted right so it never touches dashed reference arrow)
    out += drawFlow(
      [
        [subXs[2] + subW - 45, subY + subH],
        [subXs[2] + subW - 45, p.y + p.h - 110],
      ],
      p.subs[2].outLabel,
      [subXs[2] + subW - 45, subY + subH + 34],
      PALETTE.teal,
      'arrow-teal',
      false,
      10.5
    );

    // Data Stores inside bottom of panel
    const storeY = p.y + p.h - 82;
    const storeW = 350;
    const storeXs =
      p.stores.length === 2
        ? [p.x + p.w - 400, p.x + 50]
        : [p.x + p.w / 2 - storeW / 2];

    p.stores.forEach((st, sIdx) => {
      const stX = storeXs[sIdx];
      out += drawDataStore(stX, storeY, storeW, 50, st.id, st.title);
      // Connect sub-processes to data store cleanly
      const targetSubIdx = sIdx === 0 ? 1 : 2;
      const sx = subXs[targetSubIdx] + subW / 2;
      const stCenterX = stX + storeW / 2;
      if (sIdx === 0) {
        out += drawFlow(
          [
            [sx, subY + subH],
            [sx, storeY - 22],
            [stCenterX, storeY - 22],
            [stCenterX, storeY - 4],
          ],
          'قراءة / كتابة بيانات',
          [(sx + stCenterX) / 2, storeY - 30],
          PALETTE.teal,
          'arrow-teal',
          false,
          10.5
        );
      } else {
        const refX = stX + 95;
        out += drawFlow(
          [
            [refX, storeY],
            [refX, subY + subH + 4],
          ],
          'مرجع / تدقيق',
          [refX, storeY - 28],
          PALETTE.teal,
          'arrow-teal',
          true,
          10.5
        );
      }
    });

    out += `</g>\n`;
  }

  // Inter-module horizontal balancing bridge callouts
  out += `<rect x="40" y="1655" width="${W - 80}" height="52" rx="8" fill="${PALETTE.navyLight}" stroke="${PALETTE.navy}" stroke-width="1.2" />`;
  out += `<text x="${W / 2}" y="1686" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="13" font-weight="bold" fill="${PALETTE.navy}">الترابط المتوازن بين العمليات: (D2 العقارات المتاحة ← 5.1 إعداد العقود) · (D3 الصكوك ← 4.1 شروط الواقفين) · (D5 جدول الدفعات ← 6.1 إصدار الفواتير) · (D4 حصص الاستحقاق ← 6.3 توزيع الغلة)</text>`;

  out += drawDfdLegend(40, 1730, W - 80);
  out += svgFooter();
  return out;
}

// ============================================================================
// 4. DFD LEVEL 2 (04_DFD_Level_2) — Complex Processes (2.2 PostGIS & 3.2/3.3 OCR/SHA-256)
// ============================================================================
export function buildDfdLevel2Svg(): string {
  const W = 2150;
  const H = 1380;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-4): مخطط تدفق البيانات من المستوى الثاني للعمليات المعقدة (DFD Level 2)',
    'تفكيك العمليتين التخصصيتين: (2.2) المسح الجغرافي وحساب المضلعات عبر PostGIS، و(3.2 / 3.3) المعالجة الضوئية OCR والتوثيق الرقمي SHA-256'
  );

  // Panel A (Right): Process 2.2 Decomposition
  out += `<rect x="1100" y="128" width="1000" height="1060" rx="12" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="2" />`;
  out += `<rect x="1100" y="128" width="1000" height="48" rx="12" fill="${PALETTE.navy}" />`;
  out += `<rect x="1100" y="156" width="1000" height="20" fill="${PALETTE.navy}" />`;
  out += `<text x="1600" y="159" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="16" font-weight="bold" fill="#FFFFFF">أولاً: تفكيك العملية (2.2) — الرسم والمسح الجغرافي للحدود (PostGIS)</text>`;

  // External / Parent Inputs for Panel A
  out += drawExternalEntity(1790, 210, 275, 72, 'موظف إدارة الأوقاف', 'مخرجات العملية (2.1)');
  out += drawProcess(1355, 210, 280, 96, '2.2.1', ['استقبال الإحداثيات', 'وملفات المساحة الميدانية']);
  out += drawProcess(1355, 410, 280, 96, '2.2.2', ['التحقق الطوبولوجي', 'ومنع تداخل الحدود الوقفية']);
  out += drawProcess(1355, 610, 280, 96, '2.2.3', ['توحيد الإسقاط (SRID 4326)', 'وحساب المساحة والمركز']);
  out += drawProcess(1355, 810, 280, 96, '2.2.4', ['اعتماد المضلع المكاني', 'وتحديث طبقة الخرائط']);
  out += drawDataStore(1330, 1020, 330, 58, 'D2', 'سجل الأوقاف والممتلكات الجغرافية');

  // Panel A Flows
  out += drawFlow([[1790, 248], [1639, 248]], 'ملف الحدود أو النقاط', [1714, 232]);
  out += drawFlow([[1495, 306], [1495, 406]], 'إحداثيات خام مهيكلة', [1590, 362]);
  out += drawFlow([[1495, 506], [1495, 606]], 'مضلع سليم طوبولوجياً', [1590, 562]);
  out += drawFlow([[1495, 706], [1495, 806]], 'GEOMETRY(Polygon,4326) + المساحة', [1620, 762]);
  out += drawFlow([[1495, 906], [1495, 1016]], 'سجل gis_parcels وخصائص العقار', [1615, 965], PALETTE.teal, 'arrow-teal');
  // Verification feedback from D2 to 2.2.2
  out += drawFlow(
    [[1330, 1049], [1180, 1049], [1180, 458], [1351, 458]],
    'استعلام الحدود المجاورة (ST_Intersects)',
    [1255, 725],
    PALETTE.teal,
    'arrow-teal',
    true
  );
  // Output back to Employee / 2.3
  out += drawFlow(
    [[1635, 858], [1925, 858], [1925, 286]],
    'خريطة رقمية معتمدة وتقرير المساحة',
    [1915, 580],
    PALETTE.teal,
    'arrow-teal'
  );

  // Panel B (Left): Process 3.2/3.3 Decomposition
  out += `<rect x="50" y="128" width="1000" height="1060" rx="12" fill="#FFFFFF" stroke="${PALETTE.teal}" stroke-width="2" />`;
  out += `<rect x="50" y="128" width="1000" height="48" rx="12" fill="${PALETTE.teal}" />`;
  out += `<rect x="50" y="156" width="1000" height="20" fill="${PALETTE.teal}" />`;
  out += `<text x="550" y="159" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="16" font-weight="bold" fill="#FFFFFF">ثانياً: تفكيك العمليات (3.2 / 3.3) — المعالجة الضوئية (OCR) والتوثيق (SHA-256)</text>`;

  out += drawExternalEntity(740, 210, 275, 72, 'موظف إدارة الأوقاف', 'مخرجات العملية (3.1)');
  out += drawProcess(315, 210, 280, 96, '3.2.1', ['معالجة الصورة الرقمية', 'وتحسين التباين والدقة'], PALETTE.teal, PALETTE.tealLight);
  out += drawProcess(315, 410, 280, 96, '3.2.2', ['التعرف الضوئي على النص', 'العربي واستخلاص الحقول (OCR)'], PALETTE.teal, PALETTE.tealLight);
  out += drawProcess(315, 610, 280, 96, '3.2.3', ['توليد البصمة الرقمية', 'SHA-256 والتحقق من التكرار'], PALETTE.teal, PALETTE.tealLight);
  out += drawProcess(315, 810, 280, 96, '3.2.4', ['فهرسة النص والأرشفة', 'الآمنة وتسجيل الأثر'], PALETTE.teal, PALETTE.tealLight);
  out += drawDataStore(290, 1020, 330, 58, 'D3', 'أرشيف الوثائق والحجج الوقفية');

  // Panel B Flows
  out += drawFlow([[740, 248], [599, 248]], 'صورة الصك الممسوحة', [670, 232], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[455, 306], [455, 406]], 'صورة محسنة جاهزة للتحليل', [555, 362], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[455, 506], [455, 606]], 'النص العربي المستخلص (ocr_text)', [565, 562], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[455, 706], [455, 806]], 'بصمة (64-char SHA-256) غير مكررة', [570, 762], PALETTE.teal, 'arrow-teal');
  out += drawFlow([[455, 906], [455, 1016]], 'ملف الوثيقة + النص + البصمة الرقمية', [565, 965], PALETTE.teal, 'arrow-teal');
  // Verification from D3 to 3.2.3
  out += drawFlow(
    [[290, 1049], [140, 1049], [140, 658], [311, 658]],
    'مطابقة البصمة لمنع التكرار والتزوير',
    [220, 855],
    PALETTE.navy,
    'arrow-navy',
    true
  );
  // Output back to Employee
  out += drawFlow(
    [[595, 858], [875, 858], [875, 286]],
    'شهادة توثيق SHA-256 ونتائج الفهرسة',
    [865, 580],
    PALETTE.navy,
    'arrow-navy'
  );

  // Academic Rationale Banner
  out += `<rect x="50" y="1210" width="${W - 100}" height="52" rx="8" fill="${PALETTE.amberLight}" stroke="#F59E0B" stroke-width="1.2" />`;
  out += `<text x="${W / 2}" y="1241" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="13" font-weight="bold" fill="${PALETTE.amberDark}">المبرر العلمي للمستوى الثاني: تم قصر التفكيك على العمليتين (2.2) و(3.2/3.3) لتضمنهما تحويلات تخصصية معقدة (طوبولوجيا PostGIS ومعالجة OCR وبصمة SHA-256)، بينما تكتفي بقية العمليات بالمستوى الأول.</text>`;

  out += drawDfdLegend(50, 1285, W - 100);
  out += svgFooter();
  return out;
}

// ============================================================================
// 5. CONCEPTUAL ERD (05_Conceptual_ERD) — Entities, Relationships, 1:1, 1:N, M:N
// ============================================================================
export function buildConceptualErdSvg(): string {
  const W = 2460;
  const H = 1620;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-5): مخطط الكيانات والعلاقات المفاهيمي (Conceptual ERD)',
    'التمثيل التصوري للكيانات الأساسية والخصائص الدلالية وعلاقاتها (1:1، 1:N، M:N) قبل التطبيع التنفيذي'
  );

  function drawConceptEntity(x: number, y: number, w: number, h: number, ar: string, en: string, attrs: string[], fill = '#EFF6FF', stroke = PALETTE.navy): string {
    const hdrH = 44;
    return `<g class="concept-entity">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#FFFFFF" stroke="${stroke}" stroke-width="2.2" />
      <rect x="${x}" y="${y}" width="${w}" height="${hdrH}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5" />
      <text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="14" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(ar)}</text>
      <text x="${x + w / 2}" y="${y + 37}" text-anchor="middle" font-family="${FONT_EN}" font-size="11" font-weight="bold" fill="${stroke}">${escXml(en)}</text>
      ${attrs
        .map(
          (a, i) =>
            `<text x="${x + w / 2}" y="${y + hdrH + 20 + i * 19}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12" fill="${PALETTE.slateMid}">${escXml(a)}</text>`
        )
        .join('\n      ')}
    </g>`;
  }

  function drawDiamondRel(cx: number, cy: number, rx: number, ry: number, verbAr: string, cardA: string, posA: [number, number], cardB: string, posB: [number, number]): string {
    return `<g class="concept-rel">
      <polygon points="${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}" fill="${PALETTE.amberLight}" stroke="${PALETTE.amberDark}" stroke-width="1.8" />
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="11.5" font-weight="bold" fill="${PALETTE.amberDark}">${escXml(verbAr)}</text>
      <text x="${posA[0]}" y="${posA[1]}" text-anchor="middle" font-family="${FONT_EN}" font-size="13" font-weight="bold" fill="${PALETTE.navy}" class="halo-sm">${escXml(cardA)}</text>
      <text x="${posB[0]}" y="${posB[1]}" text-anchor="middle" font-family="${FONT_EN}" font-size="13" font-weight="bold" fill="${PALETTE.navy}" class="halo-sm">${escXml(cardB)}</text>
    </g>`;
  }

  function connectLine(pts: [number, number][], color = PALETTE.slateMid): string {
    const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" />`;
  }

  // Row 1: RBAC & Users & Audit (Top)
  out += drawConceptEntity(1840, 150, 260, 128, 'الأدوار الوظيفية', 'Roles', ['معرف الدور (PK)', 'اسم الدور', 'الوصف']);
  out += drawConceptEntity(1260, 150, 260, 128, 'الصلاحيات', 'Permissions', ['معرف الصلاحية (PK)', 'رمز الصلاحية', 'الوحدة الوظيفية']);
  out += drawConceptEntity(1840, 420, 260, 165, 'المستخدمون', 'Users', ['معرف المستخدم (PK)', 'الاسم والهوية', 'البريد والهاتف', 'حالة الحساب']);
  out += drawConceptEntity(2140, 420, 175, 145, 'سجل التدقيق', 'Audit_Logs', ['معرف السجل (PK)', 'نوع العملية', 'الكيان المستهدف', 'التاريخ']);

  // Row 2/3: Core Waqf, Waqif, Properties, GIS, Documents
  out += drawConceptEntity(1330, 420, 260, 145, 'الواقفون', 'Waqifs', ['معرف الواقف (PK)', 'اسم الواقف', 'الهوية / المرجع', 'تاريخ الوقف']);
  out += drawConceptEntity(1330, 700, 270, 165, 'الأوقاف', 'Waqfs', ['معرف الوقف (PK)', 'اسم الوقف ونوعه', 'رقم الصك الوقفي', 'الحالة التنظيمية']);
  out += drawConceptEntity(830, 700, 270, 165, 'الممتلكات الوقفية', 'Properties', ['معرف العقار (PK)', 'الرمز والتصنيف', 'المساحة والعنوان', 'القيمة والحالة']);
  out += drawConceptEntity(320, 700, 275, 150, 'القطع الجغرافية', 'GIS_Parcels', ['معرف القطعة (PK)', 'مضلع الحدود (Polygon)', 'المركز الهندسي (Point)', 'تاريخ المسح'], PALETTE.tealLight, PALETTE.teal);
  out += drawConceptEntity(830, 420, 270, 165, 'الوثائق المؤرشفة', 'Documents', ['معرف الوثيقة (PK)', 'نوع الوثيقة', 'النص المستخلص (OCR)', 'بصمة SHA-256'], PALETTE.tealLight, PALETTE.teal);

  // Row 4: Conditions, Beneficiaries, Tenants, Contracts
  out += drawConceptEntity(1840, 700, 260, 145, 'شروط الواقفين', 'Waqif_Conditions', ['معرف الشرط (PK)', 'عنوان المصرف', 'النص الشرعي', 'أولوية التنفيذ']);
  out += drawConceptEntity(1840, 1000, 260, 150, 'المستفيدون', 'Beneficiaries', ['معرف المستفيد (PK)', 'الاسم والهوية', 'فئة الاستحقاق', 'الحساب البنكي (IBAN)']);
  out += drawConceptEntity(1330, 1020, 270, 145, 'صرفيات العوائد', 'Disbursements', ['معرف الصرف (PK)', 'المبلغ المصروف', 'تاريخ التحويل', 'رقم المرجع']);
  out += drawConceptEntity(830, 1010, 270, 165, 'عقود الإيجار', 'Lease_Contracts', ['معرف العقد (PK)', 'رقم العقد', 'تاريخ البداية والنهاية', 'الأجرة السنوية']);
  out += drawConceptEntity(320, 1010, 275, 145, 'المستأجرون', 'Tenants', ['معرف المستأجر (PK)', 'الاسم الكامل', 'الهوية / السجل', 'بيانات التواصل']);

  // Row 5: Invoices, Payments, Service Requests
  out += drawConceptEntity(830, 1300, 270, 145, 'الفواتير والمطالبات', 'Invoices', ['معرف الفاتورة (PK)', 'تاريخ الاستحقاق', 'المبلغ المطلوب', 'حالة الفاتورة']);
  out += drawConceptEntity(320, 1300, 275, 145, 'التحصيل والسداد', 'Payments', ['معرف السداد (PK)', 'المبلغ المدفوع', 'تاريخ التحصيل', 'رقم الإيصال']);
  out += drawConceptEntity(1840, 1300, 260, 145, 'الخدمات والطلبات', 'Service_Requests', ['معرف الطلب (PK)', 'نوع الطلب', 'الوصف والتاريخ', 'حالة الطلب']);

  // Relationships with Diamonds & Cardinalities
  // Roles M:N Permissions
  out += connectLine([[1840, 214], [1520, 214]]);
  out += drawDiamondRel(1680, 214, 58, 28, 'يمتلك', 'M', [1815, 204], 'N', [1545, 204]);

  // Roles 1:N Users
  out += connectLine([[1970, 278], [1970, 420]]);
  out += drawDiamondRel(1970, 349, 54, 26, 'يُسند لـ', '1', [1988, 298], 'N', [1988, 405]);

  // Users 1:N Audit_Logs
  out += connectLine([[2100, 495], [2140, 495]]);
  out += `<text x="2108" y="485" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.navy}">1</text>`;
  out += `<text x="2128" y="485" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.navy}">N</text>`;

  // Users 1:N Waqfs (Nazir)
  out += connectLine([[1840, 520], [1710, 520], [1710, 740], [1600, 740]]);
  out += drawDiamondRel(1710, 620, 54, 26, 'يدير', '1', [1818, 510], 'N', [1622, 730]);

  // Waqifs 1:N Waqfs
  out += connectLine([[1465, 565], [1465, 700]]);
  out += drawDiamondRel(1465, 632, 54, 26, 'ينشئ', '1', [1484, 585], 'N', [1484, 686]);

  // Waqfs 1:N Properties
  out += connectLine([[1330, 782], [1100, 782]]);
  out += drawDiamondRel(1215, 782, 54, 26, 'يحتوي', '1', [1308, 770], 'N', [1122, 770]);

  // Properties 1:1 GIS_Parcels
  out += connectLine([[830, 782], [595, 782]]);
  out += drawDiamondRel(712, 782, 62, 26, 'يمتلك موقعاً', '1', [808, 770], '1', [618, 770]);

  // Properties 1:N Documents
  out += connectLine([[965, 700], [965, 585]]);
  out += drawDiamondRel(965, 642, 54, 26, 'يوثق بـ', '1', [985, 686], 'N', [985, 603]);

  // Waqfs 1:N Waqif_Conditions
  out += connectLine([[1600, 772], [1840, 772]]);
  out += drawDiamondRel(1720, 772, 54, 26, 'يخضع لـ', '1', [1622, 760], 'N', [1818, 760]);

  // Waqfs M:N Beneficiaries (Conceptual M:N!)
  out += connectLine([[1520, 865], [1520, 935], [1930, 935], [1930, 1000]]);
  out += drawDiamondRel(1720, 935, 62, 28, 'يستحق منه', 'M', [1540, 888], 'N', [1912, 985]);

  // Beneficiaries 1:N Disbursements
  out += connectLine([[1840, 1090], [1600, 1090]]);
  out += drawDiamondRel(1720, 1090, 56, 26, 'يستلم', '1', [1818, 1078], 'N', [1622, 1078]);

  // Properties 1:N Lease_Contracts
  out += connectLine([[965, 865], [965, 1010]]);
  out += drawDiamondRel(965, 937, 54, 26, 'يُؤجر بـ', '1', [985, 885], 'N', [985, 995]);

  // Tenants 1:N Lease_Contracts
  out += connectLine([[595, 1090], [830, 1090]]);
  out += drawDiamondRel(712, 1090, 54, 26, 'يُبرم', '1', [618, 1078], 'N', [808, 1078]);

  // Lease_Contracts 1:N Invoices
  out += connectLine([[965, 1175], [965, 1300]]);
  out += drawDiamondRel(965, 1237, 54, 26, 'يُصدر', '1', [985, 1195], 'N', [985, 1285]);

  // Invoices 1:N Payments
  out += connectLine([[830, 1372], [595, 1372]]);
  out += drawDiamondRel(712, 1372, 54, 26, 'يُسدد بـ', '1', [808, 1360], 'N', [618, 1360]);

  // Users 1:0..1 Tenants & 1:0..1 Beneficiaries & 1:N Service_Requests
  out += connectLine([[2100, 550], [2270, 550], [2270, 1372], [2100, 1372]]);
  out += drawDiamondRel(2270, 960, 56, 26, 'يقدم', '1', [2122, 540], 'N', [2122, 1360]);

  // Properties 1:N Service_Requests (bottom connector)
  out += connectLine([[1100, 1140], [1230, 1140], [1230, 1390], [1840, 1390]]);
  out += drawDiamondRel(1490, 1390, 62, 26, 'يرتبط بطلب', '0..1', [1248, 1375], 'N', [1815, 1378]);

  // Conceptual ERD Legend
  out += `<rect x="40" y="1520" width="${W - 80}" height="62" rx="8" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />`;
  out += `<text x="${W / 2}" y="1556" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="13" font-weight="bold" fill="${PALETTE.navy}">دليل المخطط المفاهيمي (Chen / Conceptual ERD): المستطيل يمثل الكيان وخصائصه الأساسية · المعين يمثل العلاقة الدلالية · الرموز (1:1، 1:N، M:N) تمثل الكاردينالية قبل فك علاقات متعدد إلى متعدد.</text>`;
  out += svgFooter();
  return out;
}

// ============================================================================
// 6. LOGICAL ERD (06_Logical_ERD) — 19 Tables, 3NF, PostgreSQL + PostGIS, Crow's Foot
// ============================================================================
export function buildLogicalErdSvg(): string {
  const W = 2700;
  const H = 1940;
  let out = svgHeader(
    W,
    H,
    'الشكل (3-6): مخطط الكيانات والعلاقات المنطقي (Logical ERD)',
    'النموذج العلائقي المطبع (3NF) المتوافق مع PostgreSQL وPostGIS — يشمل 19 جدولاً والمفاتيح الأساسية والأجنبية والجداول الوسيطة وعلامات Crow\'s Foot'
  );

  interface TableCol {
    key: 'PK' | 'FK' | 'PK,FK' | 'FK,UQ' | 'UQ' | '';
    name: string;
    type: string;
  }

  interface TableDef {
    id: string;
    nameEn: string;
    nameAr: string;
    x: number;
    y: number;
    w: number;
    cols: TableCol[];
    accent?: string;
    headerBg?: string;
  }

  function drawLogicalTable(t: TableDef): { svg: string; h: number } {
    const hdrH = 44;
    const rowH = 22;
    const h = hdrH + t.cols.length * rowH + 10;
    const accent = t.accent ?? PALETTE.navy;
    const headerBg = t.headerBg ?? PALETTE.navy;
    let s = `<g class="logical-table" id="tbl-${t.nameEn}">
      <rect x="${t.x}" y="${t.y}" width="${t.w}" height="${h}" rx="6" fill="#FFFFFF" stroke="${accent}" stroke-width="2" />
      <rect x="${t.x}" y="${t.y}" width="${t.w}" height="${hdrH}" rx="6" fill="${headerBg}" />
      <rect x="${t.x}" y="${t.y + 30}" width="${t.w}" height="14" fill="${headerBg}" />
      <text x="${t.x + t.w / 2}" y="${t.y + 20}" text-anchor="middle" font-family="${FONT_MONO}" font-size="13.5" font-weight="bold" fill="#FFFFFF">${escXml(t.nameEn)}</text>
      <text x="${t.x + t.w / 2}" y="${t.y + 37}" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="11.5" fill="#E2E8F0">${escXml(t.nameAr)}</text>
    `;

    t.cols.forEach((c, i) => {
      const ry = t.y + hdrH + 6 + i * rowH;
      if (i % 2 === 1) {
        s += `<rect x="${t.x + 1}" y="${ry}" width="${t.w - 2}" height="${rowH}" fill="#F8FAFC" />`;
      }
      const keyColor = c.key.includes('PK') ? '#B45309' : c.key === 'FK' ? PALETTE.teal : c.key === 'UQ' ? '#4338CA' : PALETTE.slateMuted;
      if (c.key) {
        s += `<text x="${t.x + 10}" y="${ry + 15}" font-family="${FONT_MONO}" font-size="10.5" font-weight="bold" fill="${keyColor}">${escXml(c.key)}</text>`;
      }
      s += `<text x="${t.x + 56}" y="${ry + 15}" font-family="${FONT_MONO}" font-size="11" font-weight="${c.key.includes('PK') ? 'bold' : 'normal'}" fill="${PALETTE.slateDark}">${escXml(c.name)}</text>`;
      s += `<text x="${t.x + t.w - 10}" y="${ry + 15}" text-anchor="end" font-family="${FONT_MONO}" font-size="10" fill="${PALETTE.slateMuted}">${escXml(c.type)}</text>`;
    });

    s += `</g>\n`;
    return { svg: s, h };
  }

  const tables: TableDef[] = [
    // Col 4 (Rightmost: Security & Users & Audit)
    {
      id: 'T1',
      nameEn: 'roles',
      nameAr: 'الأدوار الوظيفية',
      x: 2220,
      y: 140,
      w: 360,
      cols: [
        { key: 'PK', name: 'role_id', type: 'BIGSERIAL' },
        { key: 'UQ', name: 'role_name', type: 'VARCHAR(60)' },
        { key: '', name: 'description', type: 'VARCHAR(255)' },
      ],
    },
    {
      id: 'T2',
      nameEn: 'role_permissions',
      nameAr: 'صلاحيات الأدوار (وسيط M:N)',
      x: 1750,
      y: 140,
      w: 360,
      accent: PALETTE.amberDark,
      headerBg: PALETTE.amberDark,
      cols: [
        { key: 'PK,FK', name: 'role_id', type: 'BIGINT' },
        { key: 'PK,FK', name: 'permission_id', type: 'BIGINT' },
      ],
    },
    {
      id: 'T3',
      nameEn: 'permissions',
      nameAr: 'الصلاحيات',
      x: 1280,
      y: 140,
      w: 360,
      cols: [
        { key: 'PK', name: 'permission_id', type: 'BIGSERIAL' },
        { key: 'UQ', name: 'permission_code', type: 'VARCHAR(80)' },
        { key: '', name: 'module_name', type: 'VARCHAR(80)' },
      ],
    },
    {
      id: 'T4',
      nameEn: 'users',
      nameAr: 'المستخدمون',
      x: 2200,
      y: 350,
      w: 380,
      cols: [
        { key: 'PK', name: 'user_id', type: 'UUID' },
        { key: 'FK', name: 'role_id', type: 'BIGINT' },
        { key: '', name: 'full_name', type: 'VARCHAR(150)' },
        { key: 'UQ', name: 'national_id', type: 'VARCHAR(20)' },
        { key: 'UQ', name: 'email', type: 'VARCHAR(120)' },
        { key: '', name: 'phone', type: 'VARCHAR(20)' },
        { key: '', name: 'password_hash', type: 'VARCHAR(255)' },
        { key: '', name: 'is_active', type: 'BOOLEAN' },
      ],
    },
    {
      id: 'T5',
      nameEn: 'audit_logs',
      nameAr: 'سجلات التدقيق',
      x: 2200,
      y: 675,
      w: 380,
      cols: [
        { key: 'PK', name: 'log_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'user_id', type: 'UUID' },
        { key: '', name: 'action_type', type: 'VARCHAR(40)' },
        { key: '', name: 'target_table', type: 'VARCHAR(60)' },
        { key: '', name: 'record_id', type: 'VARCHAR(64)' },
        { key: '', name: 'created_at', type: 'TIMESTAMPTZ' },
      ],
    },

    // Core Waqf & Spatial & Docs
    {
      id: 'T6',
      nameEn: 'waqifs',
      nameAr: 'الواقفون',
      x: 1730,
      y: 350,
      w: 370,
      cols: [
        { key: 'PK', name: 'waqif_id', type: 'BIGSERIAL' },
        { key: '', name: 'full_name', type: 'VARCHAR(160)' },
        { key: 'UQ', name: 'national_id', type: 'VARCHAR(20)' },
        { key: '', name: 'waqf_date', type: 'DATE' },
      ],
    },
    {
      id: 'T7',
      nameEn: 'waqfs',
      nameAr: 'الأوقاف',
      x: 1480,
      y: 590,
      w: 390,
      cols: [
        { key: 'PK', name: 'waqf_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'waqif_id', type: 'BIGINT' },
        { key: 'FK', name: 'nazir_user_id', type: 'UUID' },
        { key: '', name: 'waqf_name', type: 'VARCHAR(180)' },
        { key: '', name: 'waqf_type', type: 'VARCHAR(30)' },
        { key: 'UQ', name: 'deed_number', type: 'VARCHAR(60)' },
        { key: '', name: 'status', type: 'VARCHAR(30)' },
      ],
    },
    {
      id: 'T8',
      nameEn: 'properties',
      nameAr: 'الممتلكات الوقفية',
      x: 840,
      y: 590,
      w: 410,
      cols: [
        { key: 'PK', name: 'property_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'waqf_id', type: 'BIGINT' },
        { key: 'UQ', name: 'property_code', type: 'VARCHAR(40)' },
        { key: '', name: 'property_type', type: 'VARCHAR(50)' },
        { key: '', name: 'address', type: 'VARCHAR(255)' },
        { key: '', name: 'area_sqm', type: 'NUMERIC(12,2)' },
        { key: '', name: 'estimated_value', type: 'NUMERIC(14,2)' },
        { key: '', name: 'status', type: 'VARCHAR(30)' },
      ],
    },
    {
      id: 'T9',
      nameEn: 'gis_parcels',
      nameAr: 'القطع الجغرافية (PostGIS)',
      x: 80,
      y: 590,
      w: 440,
      accent: PALETTE.teal,
      headerBg: PALETTE.teal,
      cols: [
        { key: 'PK', name: 'parcel_id', type: 'BIGSERIAL' },
        { key: 'FK,UQ', name: 'property_id', type: 'BIGINT' },
        { key: '', name: 'boundary_geom', type: 'GEOMETRY(Polygon,4326)' },
        { key: '', name: 'centroid_point', type: 'GEOMETRY(Point,4326)' },
        { key: '', name: 'survey_date', type: 'DATE' },
      ],
    },
    {
      id: 'T10',
      nameEn: 'documents',
      nameAr: 'الوثائق المؤرشفة (OCR / SHA-256)',
      x: 680,
      y: 140,
      w: 430,
      accent: PALETTE.teal,
      headerBg: PALETTE.teal,
      cols: [
        { key: 'PK', name: 'document_id', type: 'UUID' },
        { key: 'FK', name: 'waqf_id', type: 'BIGINT' },
        { key: 'FK', name: 'property_id', type: 'BIGINT (NULL)' },
        { key: 'FK', name: 'uploaded_by', type: 'UUID' },
        { key: '', name: 'doc_type', type: 'VARCHAR(60)' },
        { key: '', name: 'file_path', type: 'VARCHAR(400)' },
        { key: 'UQ', name: 'sha256_hash', type: 'CHAR(64)' },
        { key: '', name: 'ocr_text', type: 'TEXT' },
        { key: '', name: 'archived_at', type: 'TIMESTAMPTZ' },
      ],
    },

    // Conditions & Beneficiaries & Disbursements
    {
      id: 'T11',
      nameEn: 'waqif_conditions',
      nameAr: 'شروط الواقفين',
      x: 1520,
      y: 940,
      w: 380,
      cols: [
        { key: 'PK', name: 'condition_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'waqf_id', type: 'BIGINT' },
        { key: '', name: 'condition_title', type: 'VARCHAR(160)' },
        { key: '', name: 'condition_text', type: 'TEXT' },
        { key: '', name: 'priority_order', type: 'SMALLINT' },
      ],
    },
    {
      id: 'T12',
      nameEn: 'waqf_beneficiaries',
      nameAr: 'استحقاقات المستفيدين (وسيط M:N)',
      x: 1490,
      y: 1210,
      w: 410,
      accent: PALETTE.amberDark,
      headerBg: PALETTE.amberDark,
      cols: [
        { key: 'PK', name: 'entitlement_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'waqf_id', type: 'BIGINT' },
        { key: 'FK', name: 'beneficiary_id', type: 'BIGINT' },
        { key: 'FK', name: 'condition_id', type: 'BIGINT' },
        { key: '', name: 'share_percentage', type: 'NUMERIC(5,2)' },
      ],
    },
    {
      id: 'T13',
      nameEn: 'beneficiaries',
      nameAr: 'المستفيدون',
      x: 2140,
      y: 1020,
      w: 420,
      cols: [
        { key: 'PK', name: 'beneficiary_id', type: 'BIGSERIAL' },
        { key: 'FK,UQ', name: 'user_id', type: 'UUID (NULL)' },
        { key: '', name: 'full_name', type: 'VARCHAR(160)' },
        { key: 'UQ', name: 'national_id', type: 'VARCHAR(20)' },
        { key: '', name: 'category', type: 'VARCHAR(60)' },
        { key: '', name: 'bank_iban', type: 'VARCHAR(34)' },
      ],
    },
    {
      id: 'T14',
      nameEn: 'disbursements',
      nameAr: 'صرفيات عوائد المستفيدين',
      x: 1510,
      y: 1510,
      w: 390,
      cols: [
        { key: 'PK', name: 'disbursement_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'entitlement_id', type: 'BIGINT' },
        { key: 'FK', name: 'approved_by', type: 'UUID' },
        { key: '', name: 'amount', type: 'NUMERIC(12,2)' },
        { key: '', name: 'disbursement_date', type: 'DATE' },
      ],
    },

    // Leases, Tenants, Invoices, Payments
    {
      id: 'T15',
      nameEn: 'lease_contracts',
      nameAr: 'عقود الإيجار',
      x: 840,
      y: 960,
      w: 410,
      cols: [
        { key: 'PK', name: 'contract_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'property_id', type: 'BIGINT' },
        { key: 'FK', name: 'tenant_id', type: 'BIGINT' },
        { key: 'FK', name: 'approved_by', type: 'UUID' },
        { key: 'UQ', name: 'contract_number', type: 'VARCHAR(50)' },
        { key: '', name: 'start_date', type: 'DATE' },
        { key: '', name: 'end_date', type: 'DATE' },
        { key: '', name: 'annual_rent', type: 'NUMERIC(12,2)' },
        { key: '', name: 'contract_status', type: 'VARCHAR(30)' },
      ],
    },
    {
      id: 'T16',
      nameEn: 'tenants',
      nameAr: 'المستأجرون',
      x: 80,
      y: 980,
      w: 410,
      cols: [
        { key: 'PK', name: 'tenant_id', type: 'BIGSERIAL' },
        { key: 'FK,UQ', name: 'user_id', type: 'UUID' },
        { key: '', name: 'full_name', type: 'VARCHAR(160)' },
        { key: 'UQ', name: 'national_id_or_cr', type: 'VARCHAR(25)' },
      ],
    },
    {
      id: 'T17',
      nameEn: 'invoices',
      nameAr: 'المطالبات والفواتير المالية',
      x: 840,
      y: 1360,
      w: 410,
      cols: [
        { key: 'PK', name: 'invoice_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'contract_id', type: 'BIGINT' },
        { key: '', name: 'due_date', type: 'DATE' },
        { key: '', name: 'amount_due', type: 'NUMERIC(12,2)' },
        { key: '', name: 'invoice_status', type: 'VARCHAR(30)' },
      ],
    },
    {
      id: 'T18',
      nameEn: 'payments',
      nameAr: 'عمليات التحصيل والسداد',
      x: 80,
      y: 1360,
      w: 410,
      cols: [
        { key: 'PK', name: 'payment_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'invoice_id', type: 'BIGINT' },
        { key: 'FK', name: 'collected_by', type: 'UUID' },
        { key: '', name: 'amount_paid', type: 'NUMERIC(12,2)' },
        { key: '', name: 'payment_date', type: 'TIMESTAMPTZ' },
        { key: 'UQ', name: 'receipt_number', type: 'VARCHAR(50)' },
      ],
    },

    // E-Services
    {
      id: 'T19',
      nameEn: 'service_requests',
      nameAr: 'الخدمات الإلكترونية والطلبات',
      x: 2140,
      y: 1360,
      w: 420,
      cols: [
        { key: 'PK', name: 'request_id', type: 'BIGSERIAL' },
        { key: 'FK', name: 'requester_user_id', type: 'UUID' },
        { key: 'FK', name: 'property_id', type: 'BIGINT (NULL)' },
        { key: 'FK', name: 'handled_by', type: 'UUID (NULL)' },
        { key: '', name: 'request_type', type: 'VARCHAR(60)' },
        { key: '', name: 'request_status', type: 'VARCHAR(30)' },
        { key: '', name: 'submitted_at', type: 'TIMESTAMPTZ' },
      ],
    },
  ];

  // Draw Crow's Foot connectors FIRST (behind table borders slightly or cleanly routed in gaps)
  function cfLink(pts: [number, number][], startMarker: string, endMarker: string, dashed = false): string {
    const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
    return `<path d="${d}" fill="none" stroke="${PALETTE.navy}" stroke-width="1.8" ${dashed ? 'stroke-dasharray="6,4"' : ''} marker-start="url(#${startMarker})" marker-end="url(#${endMarker})" />`;
  }

  // roles 1--* role_permissions *--1 permissions
  out += cfLink([[2220, 195], [2110, 195]], 'cf-one', 'cf-many');
  out += cfLink([[1640, 195], [1750, 195]], 'cf-one', 'cf-many');
  // roles 1--* users
  out += cfLink([[2400, 260], [2400, 350]], 'cf-one', 'cf-many');
  // users 1--* audit_logs
  out += cfLink([[2390, 580], [2390, 675]], 'cf-one', 'cf-many');
  // users 1--0..1 beneficiaries
  out += cfLink([[2580, 480], [2605, 480], [2605, 1080], [2560, 1080]], 'cf-one', 'cf-zero-one');
  // users 1--* service_requests
  out += cfLink([[2580, 520], [2620, 520], [2620, 1430], [2560, 1430]], 'cf-one', 'cf-many');
  // users 1--* waqfs (nazir)
  out += cfLink([[2200, 490], [2130, 490], [2130, 650], [1870, 650]], 'cf-one', 'cf-many');
  // waqifs 1--* waqfs
  out += cfLink([[1730, 440], [1675, 440], [1675, 590]], 'cf-one', 'cf-many');
  // waqfs 1--* properties
  out += cfLink([[1480, 690], [1250, 690]], 'cf-one', 'cf-many');
  // properties 1--1 gis_parcels
  out += cfLink([[840, 665], [520, 665]], 'cf-one', 'cf-one');
  // waqfs 1--* documents & properties 1--0..* documents
  out += cfLink([[1480, 625], [1340, 625], [1340, 260], [1110, 260]], 'cf-one', 'cf-many');
  out += cfLink([[960, 590], [960, 392]], 'cf-one', 'cf-zero-many', true);
  // waqfs 1--* waqif_conditions
  out += cfLink([[1675, 798], [1675, 940]], 'cf-one', 'cf-many');
  // waqfs 1--* waqf_beneficiaries
  out += cfLink([[1480, 745], [1425, 745], [1425, 1275], [1490, 1275]], 'cf-one', 'cf-many');
  // waqif_conditions 1--* waqf_beneficiaries
  out += cfLink([[1710, 1104], [1710, 1210]], 'cf-one', 'cf-many');
  // beneficiaries 1--* waqf_beneficiaries
  out += cfLink([[2140, 1120], [2020, 1120], [2020, 1280], [1900, 1280]], 'cf-one', 'cf-many');
  // waqf_beneficiaries 1--* disbursements
  out += cfLink([[1705, 1374], [1705, 1510]], 'cf-one', 'cf-many');
  // properties 1--* lease_contracts
  out += cfLink([[1045, 820], [1045, 960]], 'cf-one', 'cf-many');
  // tenants 1--* lease_contracts
  out += cfLink([[490, 1055], [840, 1055]], 'cf-one', 'cf-many');
  // users 1--0..1 tenants (routed along very top/left outer border)
  out += cfLink([[2350, 350], [2350, 122], [45, 122], [45, 1040], [80, 1040]], 'cf-one', 'cf-zero-one', true);
  // lease_contracts 1--* invoices
  out += cfLink([[1045, 1212], [1045, 1360]], 'cf-one', 'cf-many');
  // invoices 1--* payments
  out += cfLink([[840, 1435], [490, 1435]], 'cf-one', 'cf-many');
  // properties 1--0..* service_requests
  out += cfLink([[1250, 795], [1340, 795], [1340, 1690], [2350, 1690], [2350, 1568]], 'cf-one', 'cf-zero-many', true);

  // Draw all 19 tables on top of lines cleanly
  for (const t of tables) {
    out += drawLogicalTable(t).svg;
  }

  // Logical ERD Legend
  out += `<rect x="40" y="1820" width="${W - 80}" height="80" rx="8" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />`;
  out += `<text x="${W / 2}" y="1852" text-anchor="middle" direction="rtl" font-family="${FONT_AR}" font-size="13.5" font-weight="bold" fill="${PALETTE.navy}">دليل ترميز Crow's Foot ومعايير التطبيع (PostgreSQL + PostGIS · 3NF):</text>`;
  out += `<text x="${W / 2}" y="1880" text-anchor="middle" direction="rtl" font-family="${FONT_AR_BODY}" font-size="12.5" fill="${PALETTE.slateDark}">PK: مفتاح أساسي · FK: مفتاح أجنبي · UQ: قيد فريد · الخط المتصل: علاقة إلزامية (1:1 أو 1:N) · الخط المتقطع: علاقة اختيارية (0..1 أو 0..N) · الجداول الذهبية: جداول وسيطة لفك علاقات M:N · الجداول الخضراء: خصائص PostGIS وOCR/SHA-256.</text>`;

  out += svgFooter();
  return out;
}

// ============================================================================
// MERMAID & DRAW.IO SOURCE BUILDERS
// ============================================================================
export function buildMermaidSources(): Record<string, string> {
  return {
    '01_Context_Diagram.mmd': `flowchart TB
  %% المنصة الرقمية لإدارة وحصر الممتلكات الوقفية - المخطط البيئي
  E1["مدير النظام"]
  E2["موظف إدارة الأوقاف"]
  E3["الناظر أو الوكيل"]
  E4["المستفيد"]
  E5["المستأجر"]
  SYS(("0<br/>المنصة الرقمية لإدارة<br/>وحصر الممتلكات الوقفية"))

  E1 -->|"بيانات الحسابات والصلاحيات ومعايير الأمان"| SYS
  SYS -->|"تقارير التدقيق وإحصائيات النظام"| E1
  E2 -->|"بيانات الحصر والوثائق والشروط والعقود والقرارات"| SYS
  SYS -->|"سجلات الحصر والخرائط ونتائج OCR/SHA-256"| E2
  E3 -->|"تحديثات الأوقاف واعتمادات العقود والصرف"| SYS
  SYS -->|"تقارير الغلة والوضع المالي وإشعارات المصادقة"| E3
  E4 -->|"بيانات الهوية وطلبات الاستحقاق والخدمات"| SYS
  SYS -->|"بيانات الاستحقاق والحوالات وحالة الطلبات"| E4
  E5 -->|"بيانات التسجيل وطلبات الاستئجار وسداد الإيجارات"| SYS
  SYS -->|"العقود وجدول الدفعات والفواتير والإيصالات"| E5
`,
    '02_DFD_Level_0.mmd': `flowchart LR
  %% DFD Level 0 - 7 Main Processes, 5 Entities, 8 Data Stores
  E1["مدير النظام"]
  E2["موظف إدارة الأوقاف"]
  E3["الناظر أو الوكيل"]
  E4["المستفيد"]
  E5["المستأجر"]

  P1(["1.0 إدارة الحسابات والصلاحيات"])
  P2(["2.0 إدارة الأوقاف والممتلكات والحصر الجغرافي"])
  P3(["3.0 إدارة الوثائق الوقفية والأرشفة الإلكترونية"])
  P4(["4.0 إدارة شروط الواقفين والمستفيدين"])
  P5(["5.0 إدارة العقود والإيجارات"])
  P6(["6.0 إدارة المعاملات المالية والتحصيل"])
  P7(["7.0 إدارة الخدمات الإلكترونية والطلبات"])

  D1[("D1 سجل المستخدمين والصلاحيات")]
  D2[("D2 سجل الأوقاف والممتلكات الجغرافية")]
  D3[("D3 أرشيف الوثائق والحجج الوقفية")]
  D4[("D4 سجل الواقفين والشروط والمستفيدين")]
  D5[("D5 سجل العقود والإيجارات")]
  D6[("D6 السجل المالي والتحصيل والتوزيع")]
  D7[("D7 سجل الخدمات الإلكترونية والطلبات")]
  D8[("D8 سجل التدقيق والرقابة")]

  E1 --> P1 --> E1
  E2 --> P2 --> E2
  E2 --> P3 --> E2
  E2 --> P4
  E2 --> P5
  E2 --> P6
  E2 --> P7
  E3 --> P4
  E3 --> P5
  P6 --> E3
  P7 --> E3
  E4 --> P1
  E4 --> P7 --> E4
  P4 --> E4
  E5 --> P1
  E5 --> P5 --> E5
  E5 --> P6 --> E5
  E5 --> P7

  P1 <--> D1
  P1 --> D8
  P2 <--> D2
  P2 --> D8
  P3 <--> D3
  D2 -.-> P3
  P4 <--> D4
  D3 -.-> P4
  P5 <--> D5
  D2 -.-> P5
  P6 <--> D6
  D5 -.-> P6
  D4 -.-> P6
  P7 <--> D7
`,
    '03_DFD_Level_1.mmd': `flowchart TB
  subgraph M1["1.0 إدارة الحسابات والصلاحيات"]
    P11(["1.1 تسجيل الدخول والتحقق"]) --> P12(["1.2 إدارة الأدوار RBAC"]) --> P13(["1.3 التدقيق الأمني"])
  end
  subgraph M2["2.0 إدارة الأوقاف والحصر الجغرافي"]
    P21(["2.1 تسجيل الأصول الوقفية"]) --> P22(["2.2 المسح الجغرافي PostGIS"]) --> P23(["2.3 تحديث الحالة والتقارير"])
  end
  subgraph M3["3.0 إدارة الوثائق والأرشفة"]
    P31(["3.1 رفع وفحص الصكوك"]) --> P32(["3.2 الاستخلاص الضوئي OCR"]) --> P33(["3.3 بصمة SHA-256 والأرشفة"])
  end
  subgraph M4["4.0 إدارة شروط الواقفين والمستفيدين"]
    P41(["4.1 توثيق الشروط"]) --> P42(["4.2 أهلية المستفيدين"]) --> P43(["4.3 احتساب الحصص"])
  end
  subgraph M5["5.0 إدارة العقود والإيجارات"]
    P51(["5.1 مسودات العقود"]) --> P52(["5.2 اعتماد وتوثيق العقود"]) --> P53(["5.3 جدولة الدفعات"])
  end
  subgraph M6["6.0 إدارة المعاملات المالية والتحصيل"]
    P61(["6.1 إصدار الفواتير"]) --> P62(["6.2 تحصيل الإيجارات"]) --> P63(["6.3 توزيع الغلة والصرف"])
  end
  subgraph M7["7.0 إدارة الخدمات الإلكترونية والطلبات"]
    P71(["7.1 استقبال وتصنيف الطلبات"]) --> P72(["7.2 معالجة وتوجيه الطلبات"]) --> P73(["7.3 الإشعارات والمتابعة"])
  end
`,
    '04_DFD_Level_2.mmd': `flowchart TB
  subgraph L2_GIS["تفكيك العملية 2.2: المسح الجغرافي PostGIS"]
    P221(["2.2.1 استقبال الإحداثيات"]) --> P222(["2.2.2 التحقق الطوبولوجي ومنع التداخل"])
    P222 --> P223(["2.2.3 توحيد الإسقاط SRID 4326"])
    P223 --> P224(["2.2.4 اعتماد المضلع وحفظه"])
    P224 --> D2[("D2 سجل الأوقاف والممتلكات الجغرافية")]
    D2 -.-> P222
  end
  subgraph L2_OCR["تفكيك العمليات 3.2 / 3.3: OCR وبصمة SHA-256"]
    P321(["3.2.1 تحسين جودة الصورة"]) --> P322(["3.2.2 استخلاص النص العربي OCR"])
    P322 --> P323(["3.2.3 توليد بصمة SHA-256 والتحقق"])
    P323 --> P324(["3.2.4 فهرسة النص والأرشفة"])
    P324 --> D3[("D3 أرشيف الوثائق والحجج الوقفية")]
    D3 -.-> P323
  end
`,
    '05_Conceptual_ERD.mmd': `erDiagram
  ROLES }o--o{ PERMISSIONS : "يمتلك (M:N)"
  ROLES ||--o{ USERS : "يسند إلى (1:N)"
  USERS ||--o{ AUDIT_LOGS : "ينشئ (1:N)"
  USERS ||--o{ WAQFS : "يشرف كناظر (1:N)"
  WAQIFS ||--o{ WAQFS : "ينشئ (1:N)"
  WAQFS ||--o{ PROPERTIES : "يحتوي (1:N)"
  PROPERTIES ||--|| GIS_PARCELS : "يمتلك موقعاً (1:1)"
  PROPERTIES ||--o{ DOCUMENTS : "يوثق بـ (1:N)"
  WAQFS ||--o{ WAQIF_CONDITIONS : "يخضع لـ (1:N)"
  WAQFS }o--o{ BENEFICIARIES : "يستحق منه (M:N)"
  BENEFICIARIES ||--o{ DISBURSEMENTS : "يستلم (1:N)"
  PROPERTIES ||--o{ LEASE_CONTRACTS : "يؤجر عبر (1:N)"
  TENANTS ||--o{ LEASE_CONTRACTS : "يبرم (1:N)"
  LEASE_CONTRACTS ||--o{ INVOICES : "يصدر (1:N)"
  INVOICES ||--o{ PAYMENTS : "يسدد عبر (1:N)"
  USERS ||--o{ SERVICE_REQUESTS : "يقدم (1:N)"
`,
    '06_Logical_ERD.mmd': `erDiagram
  roles ||--o{ role_permissions : "has"
  permissions ||--o{ role_permissions : "assigned"
  roles ||--o{ users : "defines"
  users ||--o{ audit_logs : "records"
  users ||--o| beneficiaries : "links"
  users ||--o| tenants : "links"
  users ||--o{ waqfs : "nazir_of"
  waqifs ||--o{ waqfs : "establishes"
  waqfs ||--o{ properties : "owns"
  properties ||--|| gis_parcels : "mapped_by"
  waqfs ||--o{ documents : "archived_in"
  properties ||--o{ documents : "attached_to"
  waqfs ||--o{ waqif_conditions : "governed_by"
  waqfs ||--o{ waqf_beneficiaries : "allocates"
  beneficiaries ||--o{ waqf_beneficiaries : "receives_share"
  waqif_conditions ||--o{ waqf_beneficiaries : "specifies"
  waqf_beneficiaries ||--o{ disbursements : "paid_via"
  properties ||--o{ lease_contracts : "leased_under"
  tenants ||--o{ lease_contracts : "signs"
  lease_contracts ||--o{ invoices : "bills"
  invoices ||--o{ payments : "settled_by"
  users ||--o{ service_requests : "submits"
  properties ||--o{ service_requests : "relates_to"
`,
  };
}

// Valid Diagrams.net / Draw.io XML generator for editable source files
export function buildDrawioXml(diagramId: string, titleAr: string, nodes: { id: string; label: string; x: number; y: number; w: number; h: number; style: string }[], edges: { id: string; source: string; target: string; label: string; style?: string }[]): string {
  const cells = [
    `<mxCell id="0" />`,
    `<mxCell id="1" parent="0" />`,
    ...nodes.map(
      (n) =>
        `<mxCell id="${escXml(n.id)}" value="${escXml(n.label)}" style="${escXml(n.style)}" vertex="1" parent="1"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry" /></mxCell>`
    ),
    ...edges.map(
      (e) =>
        `<mxCell id="${escXml(e.id)}" value="${escXml(e.label)}" style="${escXml(e.style ?? 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#1E3A5F;fontFamily=Noto Sans Arabic;')}" edge="1" parent="1" source="${escXml(e.source)}" target="${escXml(e.target)}"><mxGeometry relative="1" as="geometry" /></mxCell>`
    ),
  ].join('\n        ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Waqf-Chapter3-Generator" version="24.0">
  <diagram id="${escXml(diagramId)}" name="${escXml(titleAr)}">
    <mxGraphModel dx="1600" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
      <root>
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}

export function buildAllDrawioFiles(): Record<string, string> {
  const S_PROC = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#1E3A5F;strokeWidth=2;fontStyle=1;';
  const S_ENT = 'shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=#F1F5F9;strokeColor=#0F172A;strokeWidth=2;fontStyle=1;';
  const S_STORE = 'shape=partialRectangle;whiteSpace=wrap;html=1;left=1;right=0;top=1;bottom=1;fillColor=#F0FDFA;strokeColor=#0F766E;strokeWidth=2;';
  const S_TBL = 'shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fillColor=#FFFFFF;strokeColor=#1E3A5F;';

  return {
    '01_Context_Diagram.drawio': buildDrawioXml(
      'context',
      'Context Diagram',
      [
        { id: 'sys', label: '0\nالمنصة الرقمية لإدارة وحصر الممتلكات الوقفية', x: 640, y: 420, w: 340, h: 160, style: S_PROC },
        { id: 'e1', label: 'مدير النظام', x: 680, y: 120, w: 260, h: 70, style: S_ENT },
        { id: 'e2', label: 'موظف إدارة الأوقاف', x: 1180, y: 280, w: 260, h: 70, style: S_ENT },
        { id: 'e3', label: 'الناظر أو الوكيل', x: 1180, y: 620, w: 260, h: 70, style: S_ENT },
        { id: 'e4', label: 'المستفيد', x: 180, y: 620, w: 260, h: 70, style: S_ENT },
        { id: 'e5', label: 'المستأجر', x: 180, y: 280, w: 260, h: 70, style: S_ENT },
      ],
      [
        { id: 'f1', source: 'e1', target: 'sys', label: 'بيانات الحسابات والصلاحيات ومعايير الأمان' },
        { id: 'f2', source: 'sys', target: 'e1', label: 'تقارير التدقيق وإحصائيات النظام' },
        { id: 'f3', source: 'e2', target: 'sys', label: 'بيانات الحصر والوثائق والشروط والعقود' },
        { id: 'f4', source: 'sys', target: 'e2', label: 'سجلات الحصر والخرائط ونتائج OCR/SHA-256' },
        { id: 'f5', source: 'e3', target: 'sys', label: 'اعتمادات العقود والصرف المالي' },
        { id: 'f6', source: 'sys', target: 'e3', label: 'تقارير الغلة وإشعارات المصادقة' },
        { id: 'f7', source: 'e4', target: 'sys', label: 'بيانات الهوية وطلبات الاستحقاق والخدمات' },
        { id: 'f8', source: 'sys', target: 'e4', label: 'بيانات الاستحقاق والحوالات وحالة الطلبات' },
        { id: 'f9', source: 'e5', target: 'sys', label: 'طلبات الاستئجار وسداد الإيجارات' },
        { id: 'f10', source: 'sys', target: 'e5', label: 'العقود والفواتير وإيصالات السداد' },
      ]
    ),
    '02_DFD_Level_0.drawio': buildDrawioXml(
      'dfd0',
      'DFD Level 0',
      [
        { id: 'e1', label: 'مدير النظام', x: 1400, y: 80, w: 220, h: 65, style: S_ENT },
        { id: 'e2', label: 'موظف إدارة الأوقاف', x: 1400, y: 420, w: 220, h: 65, style: S_ENT },
        { id: 'e3', label: 'الناظر أو الوكيل', x: 1400, y: 820, w: 220, h: 65, style: S_ENT },
        { id: 'e5', label: 'المستأجر', x: 40, y: 420, w: 220, h: 65, style: S_ENT },
        { id: 'e4', label: 'المستفيد', x: 40, y: 820, w: 220, h: 65, style: S_ENT },
        { id: 'p1', label: '1.0 إدارة الحسابات والصلاحيات', x: 1020, y: 80, w: 240, h: 80, style: S_PROC },
        { id: 'p2', label: '2.0 إدارة الأوقاف والحصر الجغرافي', x: 1020, y: 280, w: 240, h: 80, style: S_PROC },
        { id: 'p3', label: '3.0 إدارة الوثائق والأرشفة الإلكترونية', x: 1020, y: 480, w: 240, h: 80, style: S_PROC },
        { id: 'p4', label: '4.0 إدارة شروط الواقفين والمستفيدين', x: 380, y: 580, w: 240, h: 80, style: S_PROC },
        { id: 'p5', label: '5.0 إدارة العقود والإيجارات', x: 380, y: 740, w: 240, h: 80, style: S_PROC },
        { id: 'p6', label: '6.0 إدارة المعاملات المالية والتحصيل', x: 380, y: 900, w: 240, h: 80, style: S_PROC },
        { id: 'p7', label: '7.0 إدارة الخدمات الإلكترونية والطلبات', x: 380, y: 1060, w: 240, h: 80, style: S_PROC },
        { id: 'd1', label: 'D1 سجل المستخدمين والصلاحيات', x: 700, y: 90, w: 240, h: 50, style: S_STORE },
        { id: 'd8', label: 'D8 سجل التدقيق والرقابة', x: 700, y: 190, w: 240, h: 50, style: S_STORE },
        { id: 'd2', label: 'D2 سجل الأوقاف والممتلكات الجغرافية', x: 700, y: 310, w: 240, h: 50, style: S_STORE },
        { id: 'd3', label: 'D3 أرشيف الوثائق والحجج الوقفية', x: 700, y: 480, w: 240, h: 50, style: S_STORE },
        { id: 'd4', label: 'D4 سجل الواقفين والمستفيدين', x: 700, y: 610, w: 240, h: 50, style: S_STORE },
        { id: 'd5', label: 'D5 سجل العقود والإيجارات', x: 700, y: 760, w: 240, h: 50, style: S_STORE },
        { id: 'd6', label: 'D6 السجل المالي والتحصيل', x: 700, y: 910, w: 240, h: 50, style: S_STORE },
        { id: 'd7', label: 'D7 سجل الخدمات الإلكترونية', x: 700, y: 1070, w: 240, h: 50, style: S_STORE },
      ],
      [
        { id: 'l1', source: 'e1', target: 'p1', label: 'بيانات الحسابات والصلاحيات' },
        { id: 'l2', source: 'p1', target: 'd1', label: 'حفظ المستخدمين والأدوار' },
        { id: 'l3', source: 'p1', target: 'd8', label: 'أحداث الأمان' },
        { id: 'l4', source: 'e2', target: 'p2', label: 'بيانات الحصر والإحداثيات' },
        { id: 'l5', source: 'p2', target: 'd2', label: 'الأصول والمضلعات' },
        { id: 'l6', source: 'e2', target: 'p3', label: 'الصكوك الوقفية' },
        { id: 'l7', source: 'p3', target: 'd3', label: 'OCR + SHA-256' },
        { id: 'l8', source: 'p4', target: 'd4', label: 'الشروط والحصص' },
        { id: 'l9', source: 'p5', target: 'd5', label: 'العقود الموثقة' },
        { id: 'l10', source: 'p6', target: 'd6', label: 'الفواتير والتحصيل والصرف' },
        { id: 'l11', source: 'p7', target: 'd7', label: 'تذاكر الطلبات' },
      ]
    ),
    '03_DFD_Level_1.drawio': buildDrawioXml(
      'dfd1',
      'DFD Level 1',
      [
        { id: 'p11', label: '1.1 تسجيل الدخول', x: 900, y: 80, w: 200, h: 65, style: S_PROC },
        { id: 'p12', label: '1.2 إدارة الأدوار RBAC', x: 640, y: 80, w: 200, h: 65, style: S_PROC },
        { id: 'p13', label: '1.3 التدقيق الأمني', x: 380, y: 80, w: 200, h: 65, style: S_PROC },
        { id: 'p21', label: '2.1 تسجيل الوقف', x: 900, y: 200, w: 200, h: 65, style: S_PROC },
        { id: 'p22', label: '2.2 المسح الجغرافي PostGIS', x: 640, y: 200, w: 200, h: 65, style: S_PROC },
        { id: 'p23', label: '2.3 تقارير الحصر', x: 380, y: 200, w: 200, h: 65, style: S_PROC },
        { id: 'p31', label: '3.1 رفع الصكوك', x: 900, y: 320, w: 200, h: 65, style: S_PROC },
        { id: 'p32', label: '3.2 معالجة OCR', x: 640, y: 320, w: 200, h: 65, style: S_PROC },
        { id: 'p33', label: '3.3 بصمة SHA-256', x: 380, y: 320, w: 200, h: 65, style: S_PROC },
        { id: 'p41', label: '4.1 شروط الواقفين', x: 900, y: 440, w: 200, h: 65, style: S_PROC },
        { id: 'p42', label: '4.2 أهلية المستفيدين', x: 640, y: 440, w: 200, h: 65, style: S_PROC },
        { id: 'p43', label: '4.3 احتساب الحصص', x: 380, y: 440, w: 200, h: 65, style: S_PROC },
        { id: 'p51', label: '5.1 مسودات العقود', x: 900, y: 560, w: 200, h: 65, style: S_PROC },
        { id: 'p52', label: '5.2 اعتماد العقود', x: 640, y: 560, w: 200, h: 65, style: S_PROC },
        { id: 'p53', label: '5.3 جدولة الدفعات', x: 380, y: 560, w: 200, h: 65, style: S_PROC },
        { id: 'p61', label: '6.1 إصدار الفواتير', x: 900, y: 680, w: 200, h: 65, style: S_PROC },
        { id: 'p62', label: '6.2 تحصيل الإيجارات', x: 640, y: 680, w: 200, h: 65, style: S_PROC },
        { id: 'p63', label: '6.3 توزيع الغلة', x: 380, y: 680, w: 200, h: 65, style: S_PROC },
        { id: 'p71', label: '7.1 تصنيف الطلبات', x: 900, y: 800, w: 200, h: 65, style: S_PROC },
        { id: 'p72', label: '7.2 معالجة الطلبات', x: 640, y: 800, w: 200, h: 65, style: S_PROC },
        { id: 'p73', label: '7.3 الإشعارات والمتابعة', x: 380, y: 800, w: 200, h: 65, style: S_PROC },
      ],
      [
        { id: 's1', source: 'p11', target: 'p12', label: 'تحقق' },
        { id: 's2', source: 'p12', target: 'p13', label: 'أثر أمني' },
        { id: 's3', source: 'p21', target: 'p22', label: 'بيانات عقار' },
        { id: 's4', source: 'p22', target: 'p23', label: 'مضلع مكاني' },
        { id: 's5', source: 'p31', target: 'p32', label: 'صورة صك' },
        { id: 's6', source: 'p32', target: 'p33', label: 'نص مستخلص' },
        { id: 's7', source: 'p41', target: 'p42', label: 'قواعد' },
        { id: 's8', source: 'p42', target: 'p43', label: 'مؤهلون' },
        { id: 's9', source: 'p51', target: 'p52', label: 'مسودة' },
        { id: 's10', source: 'p52', target: 'p53', label: 'عقد موثق' },
        { id: 's11', source: 'p61', target: 'p62', label: 'فاتورة' },
        { id: 's12', source: 'p62', target: 'p63', label: 'صافي غلة' },
        { id: 's13', source: 'p71', target: 'p72', label: 'تذكرة' },
        { id: 's14', source: 'p72', target: 'p73', label: 'قرار' },
      ]
    ),
    '04_DFD_Level_2.drawio': buildDrawioXml(
      'dfd2',
      'DFD Level 2',
      [
        { id: 'p221', label: '2.2.1 استقبال الإحداثيات', x: 800, y: 100, w: 230, h: 70, style: S_PROC },
        { id: 'p222', label: '2.2.2 التحقق الطوبولوجي', x: 800, y: 230, w: 230, h: 70, style: S_PROC },
        { id: 'p223', label: '2.2.3 توحيد SRID 4326', x: 800, y: 360, w: 230, h: 70, style: S_PROC },
        { id: 'p224', label: '2.2.4 اعتماد المضلع', x: 800, y: 490, w: 230, h: 70, style: S_PROC },
        { id: 'd2', label: 'D2 سجل الأوقاف والممتلكات الجغرافية', x: 800, y: 620, w: 230, h: 55, style: S_STORE },
        { id: 'p321', label: '3.2.1 تحسين الصورة', x: 240, y: 100, w: 230, h: 70, style: S_PROC },
        { id: 'p322', label: '3.2.2 استخلاص OCR', x: 240, y: 230, w: 230, h: 70, style: S_PROC },
        { id: 'p323', label: '3.2.3 بصمة SHA-256', x: 240, y: 360, w: 230, h: 70, style: S_PROC },
        { id: 'p324', label: '3.2.4 الفهرسة والأرشفة', x: 240, y: 490, w: 230, h: 70, style: S_PROC },
        { id: 'd3', label: 'D3 أرشيف الوثائق والحجج الوقفية', x: 240, y: 620, w: 230, h: 55, style: S_STORE },
      ],
      [
        { id: 'g1', source: 'p221', target: 'p222', label: 'إحداثيات خام' },
        { id: 'g2', source: 'p222', target: 'p223', label: 'مضلع سليم' },
        { id: 'g3', source: 'p223', target: 'p224', label: 'WGS84 + مساحة' },
        { id: 'g4', source: 'p224', target: 'd2', label: 'حفظ gis_parcels' },
        { id: 'o1', source: 'p321', target: 'p322', label: 'صورة محسنة' },
        { id: 'o2', source: 'p322', target: 'p323', label: 'نص مستخلص' },
        { id: 'o3', source: 'p323', target: 'p324', label: 'بصمة SHA-256' },
        { id: 'o4', source: 'p324', target: 'd3', label: 'وثيقة مؤرشفة' },
      ]
    ),
    '05_Conceptual_ERD.drawio': buildDrawioXml(
      'cerd',
      'Conceptual ERD',
      [
        { id: 'roles', label: 'الأدوار الوظيفية (Roles)', x: 1100, y: 80, w: 200, h: 70, style: S_TBL },
        { id: 'perms', label: 'الصلاحيات (Permissions)', x: 760, y: 80, w: 200, h: 70, style: S_TBL },
        { id: 'users', label: 'المستخدمون (Users)', x: 1100, y: 220, w: 200, h: 70, style: S_TBL },
        { id: 'waqifs', label: 'الواقفون (Waqifs)', x: 760, y: 220, w: 200, h: 70, style: S_TBL },
        { id: 'waqfs', label: 'الأوقاف (Waqfs)', x: 760, y: 370, w: 200, h: 70, style: S_TBL },
        { id: 'props', label: 'الممتلكات (Properties)', x: 440, y: 370, w: 200, h: 70, style: S_TBL },
        { id: 'gis', label: 'القطع الجغرافية (GIS)', x: 120, y: 370, w: 200, h: 70, style: S_TBL },
        { id: 'docs', label: 'الوثائق (Documents)', x: 440, y: 220, w: 200, h: 70, style: S_TBL },
        { id: 'conds', label: 'شروط الواقفين', x: 1100, y: 370, w: 200, h: 70, style: S_TBL },
        { id: 'bens', label: 'المستفيدون', x: 1100, y: 540, w: 200, h: 70, style: S_TBL },
        { id: 'leases', label: 'عقود الإيجار', x: 440, y: 540, w: 200, h: 70, style: S_TBL },
        { id: 'tenants', label: 'المستأجرون', x: 120, y: 540, w: 200, h: 70, style: S_TBL },
        { id: 'invoices', label: 'الفواتير', x: 440, y: 700, w: 200, h: 70, style: S_TBL },
        { id: 'payments', label: 'السداد', x: 120, y: 700, w: 200, h: 70, style: S_TBL },
      ],
      [
        { id: 'r1', source: 'roles', target: 'perms', label: 'M : N' },
        { id: 'r2', source: 'roles', target: 'users', label: '1 : N' },
        { id: 'r3', source: 'waqifs', target: 'waqfs', label: '1 : N' },
        { id: 'r4', source: 'waqfs', target: 'props', label: '1 : N' },
        { id: 'r5', source: 'props', target: 'gis', label: '1 : 1' },
        { id: 'r6', source: 'props', target: 'docs', label: '1 : N' },
        { id: 'r7', source: 'waqfs', target: 'conds', label: '1 : N' },
        { id: 'r8', source: 'waqfs', target: 'bens', label: 'M : N' },
        { id: 'r9', source: 'props', target: 'leases', label: '1 : N' },
        { id: 'r10', source: 'tenants', target: 'leases', label: '1 : N' },
        { id: 'r11', source: 'leases', target: 'invoices', label: '1 : N' },
        { id: 'r12', source: 'invoices', target: 'payments', label: '1 : N' },
      ]
    ),
    '06_Logical_ERD.drawio': buildDrawioXml(
      'lerd',
      'Logical ERD (3NF)',
      [
        { id: 'roles', label: 'roles (PK: role_id)', x: 1200, y: 60, w: 220, h: 70, style: S_TBL },
        { id: 'role_permissions', label: 'role_permissions (PK,FK: role_id, permission_id)', x: 920, y: 60, w: 240, h: 70, style: S_TBL },
        { id: 'permissions', label: 'permissions (PK: permission_id)', x: 640, y: 60, w: 220, h: 70, style: S_TBL },
        { id: 'users', label: 'users (PK: user_id, FK: role_id)', x: 1200, y: 200, w: 220, h: 80, style: S_TBL },
        { id: 'audit_logs', label: 'audit_logs (PK: log_id, FK: user_id)', x: 1200, y: 360, w: 220, h: 80, style: S_TBL },
        { id: 'waqifs', label: 'waqifs (PK: waqif_id)', x: 920, y: 200, w: 220, h: 70, style: S_TBL },
        { id: 'waqfs', label: 'waqfs (PK: waqf_id, FK: waqif_id, nazir_user_id)', x: 780, y: 360, w: 250, h: 80, style: S_TBL },
        { id: 'properties', label: 'properties (PK: property_id, FK: waqf_id)', x: 420, y: 360, w: 240, h: 80, style: S_TBL },
        { id: 'gis_parcels', label: 'gis_parcels (PK: parcel_id, FK/UQ: property_id, GEOMETRY)', x: 60, y: 360, w: 280, h: 80, style: S_TBL },
        { id: 'documents', label: 'documents (PK: document_id, sha256_hash, ocr_text)', x: 360, y: 120, w: 250, h: 90, style: S_TBL },
        { id: 'waqif_conditions', label: 'waqif_conditions (PK: condition_id, FK: waqf_id)', x: 780, y: 520, w: 250, h: 80, style: S_TBL },
        { id: 'waqf_beneficiaries', label: 'waqf_beneficiaries (PK: entitlement_id, FKs)', x: 780, y: 660, w: 250, h: 80, style: S_TBL },
        { id: 'beneficiaries', label: 'beneficiaries (PK: beneficiary_id, FK: user_id)', x: 1140, y: 560, w: 250, h: 80, style: S_TBL },
        { id: 'disbursements', label: 'disbursements (PK: disbursement_id, FK: entitlement_id)', x: 780, y: 800, w: 260, h: 80, style: S_TBL },
        { id: 'lease_contracts', label: 'lease_contracts (PK: contract_id, FKs)', x: 420, y: 540, w: 240, h: 90, style: S_TBL },
        { id: 'tenants', label: 'tenants (PK: tenant_id, FK/UQ: user_id)', x: 80, y: 540, w: 240, h: 80, style: S_TBL },
        { id: 'invoices', label: 'invoices (PK: invoice_id, FK: contract_id)', x: 420, y: 720, w: 240, h: 80, style: S_TBL },
        { id: 'payments', label: 'payments (PK: payment_id, FK: invoice_id)', x: 80, y: 720, w: 240, h: 80, style: S_TBL },
        { id: 'service_requests', label: 'service_requests (PK: request_id, FKs)', x: 1140, y: 740, w: 250, h: 80, style: S_TBL },
      ],
      [
        { id: 'c1', source: 'roles', target: 'role_permissions', label: '1:N' },
        { id: 'c2', source: 'permissions', target: 'role_permissions', label: '1:N' },
        { id: 'c3', source: 'roles', target: 'users', label: '1:N' },
        { id: 'c4', source: 'users', target: 'audit_logs', label: '1:N' },
        { id: 'c5', source: 'waqifs', target: 'waqfs', label: '1:N' },
        { id: 'c6', source: 'waqfs', target: 'properties', label: '1:N' },
        { id: 'c7', source: 'properties', target: 'gis_parcels', label: '1:1' },
        { id: 'c8', source: 'waqfs', target: 'documents', label: '1:N' },
        { id: 'c9', source: 'waqfs', target: 'waqif_conditions', label: '1:N' },
        { id: 'c10', source: 'waqif_conditions', target: 'waqf_beneficiaries', label: '1:N' },
        { id: 'c11', source: 'beneficiaries', target: 'waqf_beneficiaries', label: '1:N' },
        { id: 'c12', source: 'waqf_beneficiaries', target: 'disbursements', label: '1:N' },
        { id: 'c13', source: 'properties', target: 'lease_contracts', label: '1:N' },
        { id: 'c14', source: 'tenants', target: 'lease_contracts', label: '1:N' },
        { id: 'c15', source: 'lease_contracts', target: 'invoices', label: '1:N' },
        { id: 'c16', source: 'invoices', target: 'payments', label: '1:N' },
        { id: 'c17', source: 'users', target: 'service_requests', label: '1:N' },
      ]
    ),
  };
}
