import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import JSZip from 'jszip';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  ImageRun,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  TableLayoutType,
} from 'docx';
import {
  PROJECT_INFO,
  DIAGRAMS,
  MAIN_PROCESSES,
  EXTERNAL_ENTITIES,
  DATA_STORES,
  DATA_DICTIONARY,
} from '../src/data/projectSpec';
import {
  buildContextDiagramSvg,
  buildDfdLevel0Svg,
  buildDfdLevel1Svg,
  buildDfdLevel2Svg,
  buildConceptualErdSvg,
  buildLogicalErdSvg,
  buildMermaidSources,
  buildAllDrawioFiles,
} from './diagramBuilders';
import {
  ISOLATED_ERD_ENTITIES,
  ISOLATED_ERD_RELATIONSHIPS,
  buildIsolatedEntitySvg,
  buildIsolatedRelationshipSvg,
} from './chenErdIsolatedBuilders';
import { buildNativeWordShapesDocx, NativeWordShapeSlot } from './wordShapesDocxBuilder';
import { convertSvgToEmfBuffer } from './emfBuilder';

const OUT_ROOT = path.resolve(process.cwd(), 'public', 'deliverables');
const DIR_WORD = path.join(OUT_ROOT, '01_Word');
const DIR_PNG = path.join(OUT_ROOT, '02_PNG');
const DIR_SRC = path.join(OUT_ROOT, '03_Source');
const DIR_SRC_SVG = path.join(DIR_SRC, 'SVG');
const DIR_SRC_EMF = path.join(DIR_SRC, 'EMF');
const DIR_SRC_MMD = path.join(DIR_SRC, 'Mermaid');
const DIR_SRC_DRAWIO = path.join(DIR_SRC, 'DrawIO');
const DIR_ERD_ISO = path.join(DIR_SRC, 'ERD_Isolated');
const DIR_ERD_ISO_ENT = path.join(DIR_ERD_ISO, 'Entities_SVG');
const DIR_ERD_ISO_REL = path.join(DIR_ERD_ISO, 'Relationships_SVG');
const DIR_ERD_ISO_ENT_EMF = path.join(DIR_ERD_ISO, 'Entities_EMF');
const DIR_ERD_ISO_REL_EMF = path.join(DIR_ERD_ISO, 'Relationships_EMF');
const DIR_DOCS = path.join(OUT_ROOT, '04_Documentation');

function ensureDirs() {
  for (const d of [
    OUT_ROOT,
    DIR_WORD,
    DIR_PNG,
    DIR_SRC,
    DIR_SRC_SVG,
    DIR_SRC_EMF,
    DIR_SRC_MMD,
    DIR_SRC_DRAWIO,
    DIR_ERD_ISO,
    DIR_ERD_ISO_ENT,
    DIR_ERD_ISO_REL,
    DIR_ERD_ISO_ENT_EMF,
    DIR_ERD_ISO_REL_EMF,
    DIR_DOCS,
  ]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

function rtlRun(text: string, opts: { bold?: boolean; size?: number; color?: string; font?: string } = {}) {
  return new TextRun({
    text,
    bold: opts.bold ?? false,
    size: opts.size ?? 24, // half-points (24 = 12pt)
    color: opts.color ?? '0F172A',
    font: opts.font ?? 'Noto Sans Arabic',
    rightToLeft: true,
  });
}

function ltrRun(text: string, opts: { bold?: boolean; size?: number; color?: string; font?: string } = {}) {
  return new TextRun({
    text,
    bold: opts.bold ?? false,
    size: opts.size ?? 20,
    color: opts.color ?? '0F172A',
    font: opts.font ?? 'Consolas',
    rightToLeft: false,
  });
}

function rtlPara(children: TextRun[], opts: { align?: (typeof AlignmentType)[keyof typeof AlignmentType]; spaceBefore?: number; spaceAfter?: number; heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel]; keepNext?: boolean } = {}) {
  return new Paragraph({
    children,
    bidirectional: true,
    alignment: opts.align ?? AlignmentType.RIGHT,
    heading: opts.heading,
    keepNext: opts.keepNext,
    spacing: {
      before: opts.spaceBefore ?? 80,
      after: opts.spaceAfter ?? 120,
      line: 300,
    },
  });
}

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
  left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
  right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
};

function makeCell(
  runs: TextRun[],
  opts: { fill?: string; widthPct?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}
) {
  return new TableCell({
    shading: opts.fill ? { type: ShadingType.SOLID, color: opts.fill, fill: opts.fill } : undefined,
    width: opts.widthPct ? { size: opts.widthPct, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 90, bottom: 90, left: 110, right: 110 },
    children: [
      new Paragraph({
        children: runs,
        bidirectional: true,
        alignment: opts.align ?? AlignmentType.RIGHT,
        spacing: { before: 20, after: 20, line: 260 },
      }),
    ],
  });
}

async function generateAll() {
  ensureDirs();
  console.log('1. Building vector SVGs and rendering 300-DPI PNGs...');

  const svgGenerators: Record<string, () => string> = {
    context: buildContextDiagramSvg,
    dfd0: buildDfdLevel0Svg,
    dfd1: buildDfdLevel1Svg,
    dfd2: buildDfdLevel2Svg,
    cerd: buildConceptualErdSvg,
    lerd: buildLogicalErdSvg,
  };

  const pngMetaMap: Record<string, { path: string; buffer: Buffer; width: number; height: number }> = {};
  const svgMap: Record<string, string> = {};
  const nativeWordSlots: NativeWordShapeSlot[] = [];

  for (const diag of DIAGRAMS) {
    const svg = svgGenerators[diag.id]();
    svgMap[diag.id] = svg;
    const svgPath = path.join(DIR_SRC_SVG, diag.svgFilename);
    fs.writeFileSync(svgPath, svg, 'utf-8');

    const emfBuf = convertSvgToEmfBuffer(svg);
    fs.writeFileSync(path.join(DIR_SRC_EMF, diag.emfFilename), emfBuf);

    // Render crisp high-resolution PNG with 300 DPI metadata
    const renderDensity = diag.id === 'context' ? 180 : diag.id === 'cerd' ? 170 : 150;
    const pngPath = path.join(DIR_PNG, diag.pngFilename);
    const pngBuf = await sharp(Buffer.from(svg), { density: renderDensity })
      .flatten({ background: '#FFFFFF' })
      .png({ compressionLevel: 9 })
      .withMetadata({ density: 300 })
      .toBuffer();

    fs.writeFileSync(pngPath, pngBuf);
    const meta = await sharp(pngBuf).metadata();
    pngMetaMap[diag.id] = {
      path: pngPath,
      buffer: pngBuf,
      width: meta.width ?? 3600,
      height: meta.height ?? 2400,
    };
    nativeWordSlots.push({
      id: diag.id,
      svg,
      orientation: diag.orientation,
      heading: `${diag.figureNumber}: ${diag.titleAr}`,
      caption: `الشرح الأكاديمي: ${diag.academicSummaryAr}`,
    });
    console.log(`   -> ${diag.pngFilename} + ${diag.emfFilename} (${Math.round(emfBuf.length / 1024)} KB EMF)`);
  }

  console.log('2. Writing Mermaid (.mmd) and Draw.io (.drawio) source files...');
  const mmdFiles = buildMermaidSources();
  for (const [name, content] of Object.entries(mmdFiles)) {
    fs.writeFileSync(path.join(DIR_SRC_MMD, name), content, 'utf-8');
  }

  const drawioFiles = buildAllDrawioFiles();
  for (const [name, content] of Object.entries(drawioFiles)) {
    fs.writeFileSync(path.join(DIR_SRC_DRAWIO, name), content, 'utf-8');
  }

  console.log('2b. Generating Isolated Chen ERD SVG & Native Vector EMF Bundles (17 relationships + 19 entities)...');
  const isoRelPngs: { spec: (typeof ISOLATED_ERD_RELATIONSHIPS)[number]; buffer: Buffer; width: number; height: number }[] = [];
  const isoEntPngs: { spec: (typeof ISOLATED_ERD_ENTITIES)[number]; buffer: Buffer; width: number; height: number }[] = [];

  for (const rel of ISOLATED_ERD_RELATIONSHIPS) {
    const svg = buildIsolatedRelationshipSvg(rel);
    fs.writeFileSync(path.join(DIR_ERD_ISO_REL, rel.filename), svg, 'utf-8');
    fs.writeFileSync(path.join(DIR_ERD_ISO_REL_EMF, rel.filename.replace(/\.svg$/, '.emf')), convertSvgToEmfBuffer(svg));
    const pngBuf = await sharp(Buffer.from(svg), { density: 144 })
      .flatten({ background: '#FFFFFF' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    const meta = await sharp(pngBuf).metadata();
    isoRelPngs.push({ spec: rel, buffer: pngBuf, width: meta.width ?? 1400, height: meta.height ?? 460 });
    nativeWordSlots.push({
      id: rel.id,
      svg,
      orientation: 'portrait',
      heading: `${rel.figureNumber}: ${rel.titleAr} (${rel.cardinalityLabelEn})`,
    });
  }

  for (const ent of ISOLATED_ERD_ENTITIES) {
    const svg = buildIsolatedEntitySvg(ent);
    fs.writeFileSync(path.join(DIR_ERD_ISO_ENT, ent.filename), svg, 'utf-8');
    fs.writeFileSync(path.join(DIR_ERD_ISO_ENT_EMF, ent.filename.replace(/\.svg$/, '.emf')), convertSvgToEmfBuffer(svg));
    const pngBuf = await sharp(Buffer.from(svg), { density: 144 })
      .flatten({ background: '#FFFFFF' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    const meta = await sharp(pngBuf).metadata();
    isoEntPngs.push({ spec: ent, buffer: pngBuf, width: meta.width ?? 1600, height: meta.height ?? 860 });
    nativeWordSlots.push({
      id: ent.id,
      svg,
      orientation: 'portrait',
      heading: `${ent.figureNumber}: كيان ${ent.tableNameAr} (${ent.tableNameEn})`,
    });
  }

  const isoReadme = [
    `# حزمة مخططات ERD المنعزلة بصيغة SVG (أسلوب تشين Chen Notation)`,
    `مشروع: ${PROJECT_INFO.titleAr}`,
    '',
    `تحتوي هذه الحزمة على ملفات SVG مستقلة بخطوط عربية مضمنة (Noto Kufi Arabic & Noto Sans Arabic) لضمان الظهور الاحترافي عند التصدير أو الفتح على أي جهاز:`,
    '',
    `## 1. مجلد Relationships_SVG (${ISOLATED_ERD_RELATIONSHIPS.length} علاقة ثنائية منعزلة)`,
    ...ISOLATED_ERD_RELATIONSHIPS.map((r) => `- \`${r.filename}\` — ${r.figureNumber}: ${r.titleAr} (${r.cardinalityLabelEn})`),
    '',
    `## 2. مجلد Entities_SVG (${ISOLATED_ERD_ENTITIES.length} كياناً مع صفاتها بأسلوب تشين)`,
    ...ISOLATED_ERD_ENTITIES.map((e) => `- \`${e.filename}\` — ${e.figureNumber}: كيان ${e.tableNameAr} (\`${e.tableNameEn}\`)`),
  ].join('\n');
  fs.writeFileSync(path.join(DIR_ERD_ISO, 'README.md'), isoReadme, 'utf-8');

  // Package dedicated Isolated Chen ERD SVG ZIP bundle (unchanged)
  const erdZip = new JSZip();
  erdZip.file('README.md', isoReadme);
  const erdEntFolder = erdZip.folder('Entities_SVG')!;
  const erdRelFolder = erdZip.folder('Relationships_SVG')!;
  for (const ent of ISOLATED_ERD_ENTITIES) {
    erdEntFolder.file(ent.filename, fs.readFileSync(path.join(DIR_ERD_ISO_ENT, ent.filename)));
  }
  for (const rel of ISOLATED_ERD_RELATIONSHIPS) {
    erdRelFolder.file(rel.filename, fs.readFileSync(path.join(DIR_ERD_ISO_REL, rel.filename)));
  }
  const erdZipBuf = await erdZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(DIR_SRC, 'Waqf_ERD_Isolated_SVG_Bundle.zip'), erdZipBuf);
  console.log(`   -> Waqf_ERD_Isolated_SVG_Bundle.zip (${Math.round(erdZipBuf.length / 1024)} KB)`);

  // Package dedicated All-42 Native Vector EMF Bundle ZIP
  const emfGuide = [
    `# حزمة ملفات EMF المتجهية الأصلية (42 مخططاً) – ${PROJECT_INFO.titleAr}`,
    '',
    `تحتوي هذه الحزمة على جميع المخططات بصيغة Enhanced Metafile (.emf) متجهية أصلية (وليست صوراً نقطية):`,
    `- 01_Main_Diagrams: المخططات الرئيسية الستة (Context / DFD 0,1,2 / Conceptual Chen ERD / Logical ERD)`,
    `- 02_ERD_Entities: الكيانات التسعة عشر المنعزلة بأسلوب تشين`,
    `- 03_ERD_Relationships: العلاقات الثنائية السبعة عشر المنعزلة`,
    '',
    `## طريقة التحرير وفك التجميع داخل Microsoft Word:`,
    `1. في Word: إدراج (Insert) -> صور (Pictures) -> هذا الجهاز، ثم اختر أي ملف (.emf).`,
    `2. انقر بزر الفأرة الأيمن على المخطط -> تجميع (Group) -> فك التجميع (Ungroup)، ووافق على التحويل إلى كائن رسومي من Microsoft Office.`,
    `3. يمكنك الآن النقر على أي مستطيل أو معين أو سهم أو نص عربي وتحريره أو نقله بشكل مستقل تماماً.`,
  ].join('\n');

  const emfZip = new JSZip();
  emfZip.file('README_EMF_Word.md', emfGuide);
  const emfMainFolder = emfZip.folder('01_Main_Diagrams')!;
  const emfEntFolder = emfZip.folder('02_ERD_Entities')!;
  const emfRelFolder = emfZip.folder('03_ERD_Relationships')!;
  for (const diag of DIAGRAMS) {
    emfMainFolder.file(diag.emfFilename, fs.readFileSync(path.join(DIR_SRC_EMF, diag.emfFilename)));
  }
  for (const ent of ISOLATED_ERD_ENTITIES) {
    const fname = ent.filename.replace(/\.svg$/, '.emf');
    emfEntFolder.file(fname, fs.readFileSync(path.join(DIR_ERD_ISO_ENT_EMF, fname)));
  }
  for (const rel of ISOLATED_ERD_RELATIONSHIPS) {
    const fname = rel.filename.replace(/\.svg$/, '.emf');
    emfRelFolder.file(fname, fs.readFileSync(path.join(DIR_ERD_ISO_REL_EMF, fname)));
  }
  const emfZipBuf = await emfZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(DIR_SRC, 'Waqf_All_Diagrams_EMF_Bundle.zip'), emfZipBuf);
  console.log(`   -> Waqf_All_Diagrams_EMF_Bundle.zip (${Math.round(emfZipBuf.length / 1024)} KB)`);

  console.log('3. Generating Documentation files (.md and .csv)...');
  const docGuideLines: string[] = [
    `# دليل مخططات الفصل الثالث – ${PROJECT_INFO.titleAr}`,
    '',
    `## 1. نظرة عامة على المشروع`,
    `- **عنوان المشروع:** ${PROJECT_INFO.titleAr}`,
    `- **الفصل:** ${PROJECT_INFO.chapterAr}`,
    `- **التقنيات المعتمدة:** ${PROJECT_INFO.technologies.join('، ')}`,
    '',
    `## 2. العمليات الرئيسية السبع المعتمدة`,
    ...MAIN_PROCESSES.map((p) => `- **${p.id} ${p.titleAr}:** ${p.descriptionAr}`),
    '',
    `## 3. الفئات الخارجية المتعاملة مع النظام`,
    ...EXTERNAL_ENTITIES.map((e) => `- **${e.nameAr} (${e.nameEn})**`),
    '',
    `## 4. ترتيب المخططات وشروحاتها الأكاديمية`,
    ...DIAGRAMS.flatMap((d) => [
      `### ${d.figureNumber}: ${d.titleAr}`,
      `- **ملف الصورة (300 DPI PNG):** \`02_PNG/${d.pngFilename}\``,
      `- **ملف المصدر المتجهي (SVG):** \`03_Source/SVG/${d.svgFilename}\``,
      `- **ملف المصدر (Mermaid):** \`03_Source/Mermaid/${d.mmdFilename}\``,
      `- **ملف المصدر (Draw.io):** \`03_Source/DrawIO/${d.drawioFilename}\``,
      '',
      d.academicSummaryAr,
      '',
      '**أبرز النقاط التحليلية:**',
      ...d.keyHighlightsAr.map((k) => `- ${k}`),
      '',
    ]),
    `## 5. حزمة مخططات ERD المنعزلة (أسلوب تشين Chen)`,
    `- **حزمة ZIP المستقلة:** \`03_Source/Waqf_ERD_Isolated_SVG_Bundle.zip\``,
    `- **العلاقات الثنائية المنعزلة (17 علاقة):** \`03_Source/ERD_Isolated/Relationships_SVG/\``,
    `- **الكيانات المنعزلة مع صفاتها (19 كياناً):** \`03_Source/ERD_Isolated/Entities_SVG/\``,
    '',
    `## 6. مصفوفة التطابق بين مخازن البيانات (DFD) وجداول قاعدة البيانات (ERD)`,
    `| الرمز | اسم مخزن البيانات | الجداول المرتبطة في Logical ERD | الوصف |`,
    `|---|---|---|---|`,
    ...DATA_STORES.map((ds) => `| ${ds.id} | ${ds.nameAr} | \`${ds.tables.join('`, `')}\` | ${ds.descriptionAr} |`),
  ];
  fs.writeFileSync(path.join(DIR_DOCS, 'دليل_المخططات_والتوثيق.md'), docGuideLines.join('\n'), 'utf-8');

  // Markdown Data Dictionary
  const ddMdLines: string[] = [
    `# قاموس البيانات التفصيلي (Data Dictionary) – ${PROJECT_INFO.titleAr}`,
    '',
    `بيئة التنفيذ المستهدفة: **PostgreSQL + PostGIS** (التطبيع الثالث 3NF — 19 جدولاً)`,
    '',
    `| الجدول (En) | الجدول (Ar) | المخزن | اسم الحقل | نوع البيانات | المفتاح | وصف الحقل | القيود والملاحظات |`,
    `|---|---|---|---|---|---|---|---|`,
    ...DATA_DICTIONARY.map(
      (r) =>
        `| \`${r.tableNameEn}\` | ${r.tableNameAr} | ${r.dataStoreId} | \`${r.fieldName}\` | \`${r.dataType}\` | ${r.keyType} | ${r.descriptionAr} | ${r.constraintsAr} |`
    ),
  ];
  fs.writeFileSync(path.join(DIR_DOCS, 'قاموس_البيانات.md'), ddMdLines.join('\n'), 'utf-8');

  // UTF-8 BOM CSV for Excel
  const csvHeader = 'Table_En,Table_Ar,DataStore,Field_Name,Data_Type,Key_Type,Description_Ar,Constraints\n';
  const csvBody = DATA_DICTIONARY.map((r) =>
    [r.tableNameEn, r.tableNameAr, r.dataStoreId, r.fieldName, r.dataType, r.keyType, r.descriptionAr, r.constraintsAr]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  ).join('\n');
  fs.writeFileSync(path.join(DIR_DOCS, 'قاموس_البيانات.csv'), '\uFEFF' + csvHeader + csvBody, 'utf-8');

  console.log('4. Building editable RTL Arabic Word Document (.docx)...');
  const A4_WIDTH_TWIPS = 11906;
  const A4_HEIGHT_TWIPS = 16838;
  const MARGIN_TWIPS = 1134; // ~2.0 cm margins

  const commonHeader = new Header({
    children: [
      rtlPara(
        [
          rtlRun(`${PROJECT_INFO.titleAr}  |  ${PROJECT_INFO.chapterAr}`, {
            size: 18,
            color: '64748B',
          }),
        ],
        { align: AlignmentType.CENTER, spaceBefore: 0, spaceAfter: 40 }
      ),
    ],
  });

  const commonFooter = new Footer({
    children: [
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        children: [
          rtlRun('صفحة ', { size: 18, color: '64748B' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '1E3A5F', bold: true }),
          rtlRun(' من ', { size: 18, color: '64748B' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '1E3A5F', bold: true }),
        ],
      }),
    ],
  });

  // Section 1: Title Page + Overview & Figures Index + Processes Table (A4 Portrait)
  const overviewTableRows = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        makeCell([rtlRun('الرقم', { bold: true, size: 22, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 10, align: AlignmentType.CENTER }),
        makeCell([rtlRun('العملية الرئيسية', { bold: true, size: 22, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 35 }),
        makeCell([rtlRun('الوصف التحليلي المختصر', { bold: true, size: 22, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 55 }),
      ],
    }),
    ...MAIN_PROCESSES.map(
      (p, idx) =>
        new TableRow({
          cantSplit: true,
          children: [
            makeCell([ltrRun(p.id, { bold: true, size: 20, color: '1E3A5F' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF', align: AlignmentType.CENTER }),
            makeCell([rtlRun(p.titleAr, { bold: true, size: 21 })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
            makeCell([rtlRun(p.descriptionAr, { size: 20, color: '334155' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
          ],
        })
    ),
  ];

  const figuresIndexRows = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        makeCell([rtlRun('رقم الشكل', { bold: true, size: 21, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 18, align: AlignmentType.CENTER }),
        makeCell([rtlRun('عنوان المخطط', { bold: true, size: 21, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 54 }),
        makeCell([rtlRun('اتجاه الصفحة', { bold: true, size: 21, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 28, align: AlignmentType.CENTER }),
      ],
    }),
    ...DIAGRAMS.map(
      (d, idx) =>
        new TableRow({
          cantSplit: true,
          children: [
            makeCell([rtlRun(d.figureNumber, { bold: true, size: 20, color: '1E3A5F' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF', align: AlignmentType.CENTER }),
            makeCell([rtlRun(d.titleAr, { size: 20 })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
            makeCell([rtlRun(d.orientation === 'portrait' ? 'عمودي كاملة الصفحة (Portrait A4)' : 'أفقي (Landscape A4)', { size: 20, color: '475569' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF', align: AlignmentType.CENTER }),
          ],
        })
    ),
  ];

  const section1Children: (Paragraph | Table)[] = [
    rtlPara([], { spaceBefore: 1200, spaceAfter: 400 }),
    rtlPara([rtlRun('وثيقة التحليل والتصميم الهندسي – الفصل الثالث', { bold: true, size: 28, color: '0F766E' })], {
      align: AlignmentType.CENTER,
      spaceAfter: 200,
    }),
    rtlPara([rtlRun('مخططات الفصل الثالث', { bold: true, size: 48, color: '1E3A5F' })], {
      align: AlignmentType.CENTER,
      spaceAfter: 160,
    }),
    rtlPara([rtlRun(`مشروع التخرج: ${PROJECT_INFO.titleAr}`, { bold: true, size: 34, color: '0F172A' })], {
      align: AlignmentType.CENTER,
      spaceAfter: 360,
    }),
    rtlPara(
      [
        rtlRun(
          'تشمل هذه الوثيقة الأكاديمية المخططات التحليلية والتصميمية الكاملة للنظام: المخطط البيئي (Context Diagram)، ومخططات تدفق البيانات (DFD Level 0 / Level 1 / Level 2)، ومخططي الكيانات والعلاقات المفاهيمي والمنطقي (Conceptual & Logical ERD)، إضافة إلى قاموس البيانات التفصيلي المتوافق مع PostgreSQL وPostGIS.',
          { size: 24, color: '334155' }
        ),
      ],
      { align: AlignmentType.CENTER, spaceAfter: 500 }
    ),
    rtlPara([rtlRun(`البيئة التقنية المرجعية: ${PROJECT_INFO.technologies.join(' · ')}`, { bold: true, size: 21, color: '1E3A5F' })], {
      align: AlignmentType.CENTER,
      spaceAfter: 600,
    }),
    rtlPara([new TextRun({ children: [new PageBreak()] })]),

    // Page 2: Scope, Figures Index & 7 Processes Table
    rtlPara([rtlRun('1. نطاق التحليل والعمليات الرئيسية السبع', { bold: true, size: 30, color: '1E3A5F' })], {
      heading: HeadingLevel.HEADING_1,
      keepNext: true,
      spaceAfter: 140,
    }),
    rtlPara(
      [
        rtlRun(
          'تستند جميع المخططات الواردة في هذا الفصل إلى المرجعية الوظيفية المعتمدة للمنصة الرقمية لإدارة وحصر الممتلكات الوقفية، والتي تتكون من سبع عمليات رئيسية متكاملة وخمس فئات خارجية متعاملة مع النظام (مدير النظام، موظف إدارة الأوقاف، الناظر أو الوكيل، المستفيد، المستأجر). يوضح الجدول (3-1) ملخص العمليات السبع المعتمدة:',
          { size: 22 }
        ),
      ],
      { spaceAfter: 140 }
    ),
    rtlPara([rtlRun('الجدول (3-1): العمليات الرئيسية السبع المعتمدة في المنصة الوقفية', { bold: true, size: 22, color: '1E3A5F' })], {
      align: AlignmentType.CENTER,
      keepNext: true,
      spaceAfter: 80,
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      visuallyRightToLeft: true,
      borders: TABLE_BORDERS,
      rows: overviewTableRows,
    }),
    rtlPara([rtlRun('قائمة الأشكال والمخططات الواردة في المستند', { bold: true, size: 26, color: '1E3A5F' })], {
      heading: HeadingLevel.HEADING_2,
      spaceBefore: 280,
      keepNext: true,
      spaceAfter: 100,
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      visuallyRightToLeft: true,
      borders: TABLE_BORDERS,
      rows: figuresIndexRows,
    }),
  ];

  // Landscape sections for each of the 6 diagrams so every diagram fits large, crisp, centered without clipping!
  // Usable Landscape A4 area inside 1.5cm margins:
  // A4 Landscape width = 16838 twips (~11.69 in), height = 11906 twips (~8.27 in)
  // Margin = 850 twips (~1.5 cm) -> Usable width = 15138 twips (~1009 px at 96dpi), Usable height for image = 7200 twips (~480 px at 96dpi) leaving generous space for title + academic explanation!
  const LANDSCAPE_MARGIN = 850;
  const PORTRAIT_FULL_MARGIN = 794; // ~1.4cm for full-page Portrait Chen ERD
  const MAX_LANDSCAPE_IMG_W_PX = 930;
  const MAX_LANDSCAPE_IMG_H_PX = 485;
  const MAX_PORTRAIT_IMG_W_PX = 635;
  const MAX_PORTRAIT_IMG_H_PX = 835;

  const diagramSections = DIAGRAMS.map((d) => {
    const info = pngMetaMap[d.id];
    const ratio = info.width / info.height;
    const isPortrait = d.orientation === 'portrait';
    const maxW = isPortrait ? MAX_PORTRAIT_IMG_W_PX : MAX_LANDSCAPE_IMG_W_PX;
    const maxH = isPortrait ? MAX_PORTRAIT_IMG_H_PX : MAX_LANDSCAPE_IMG_H_PX;

    let targetW = maxW;
    let targetH = Math.round(targetW / ratio);
    if (targetH > maxH) {
      targetH = maxH;
      targetW = Math.round(targetH * ratio);
    }

    const pageMargin = isPortrait ? PORTRAIT_FULL_MARGIN : LANDSCAPE_MARGIN;

    return {
      properties: {
        page: {
          size: {
            width: A4_WIDTH_TWIPS,
            height: A4_HEIGHT_TWIPS,
            orientation: isPortrait ? PageOrientation.PORTRAIT : PageOrientation.LANDSCAPE,
          },
          margin: {
            top: pageMargin,
            bottom: pageMargin,
            left: pageMargin,
            right: pageMargin,
          },
        },
      },
      headers: { default: commonHeader },
      footers: { default: commonFooter },
      children: [
        rtlPara([rtlRun(`${d.figureNumber}: ${d.titleAr}`, { bold: true, size: 28, color: '1E3A5F' })], {
          heading: HeadingLevel.HEADING_2,
          align: AlignmentType.CENTER,
          keepNext: true,
          spaceBefore: 0,
          spaceAfter: 60,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 20, after: 80 },
          children: [
            new ImageRun({
              data: info.buffer,
              transformation: {
                width: targetW,
                height: targetH,
              },
              type: 'png',
            }),
          ],
        }),
        rtlPara([rtlRun(`الشرح الأكاديمي (${d.figureNumber}): `, { bold: true, size: 21, color: '0F766E' }), rtlRun(d.academicSummaryAr, { size: 20, color: '1E293B' })], {
          spaceBefore: 30,
          spaceAfter: 50,
        }),
        rtlPara([rtlRun(`المرتكزات التصميمية: ${d.keyHighlightsAr.join(' · ')}`, { bold: true, size: 19, color: '475569' })], {
          spaceBefore: 10,
          spaceAfter: 30,
        }),
      ],
    };
  });

  // Final Section: Data Store Mapping + Full Data Dictionary (Landscape A4 for wide readable columns!)
  const storeMappingRows = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        makeCell([rtlRun('الرمز', { bold: true, size: 20, color: 'FFFFFF' })], { fill: '0F766E', widthPct: 10, align: AlignmentType.CENTER }),
        makeCell([rtlRun('اسم مخزن البيانات (DFD)', { bold: true, size: 20, color: 'FFFFFF' })], { fill: '0F766E', widthPct: 28 }),
        makeCell([rtlRun('الجداول المقابلة (ERD)', { bold: true, size: 20, color: 'FFFFFF' })], { fill: '0F766E', widthPct: 28 }),
        makeCell([rtlRun('الوصف الوظيفي', { bold: true, size: 20, color: 'FFFFFF' })], { fill: '0F766E', widthPct: 34 }),
      ],
    }),
    ...DATA_STORES.map(
      (ds, idx) =>
        new TableRow({
          cantSplit: true,
          children: [
            makeCell([ltrRun(ds.id, { bold: true, size: 19, color: '0F766E' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF', align: AlignmentType.CENTER }),
            makeCell([rtlRun(ds.nameAr, { bold: true, size: 19 })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
            makeCell([ltrRun(ds.tables.join(', '), { size: 18, color: '1E3A5F' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF', align: AlignmentType.LEFT }),
            makeCell([rtlRun(ds.descriptionAr, { size: 19, color: '334155' })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
          ],
        })
    ),
  ];

  const ddRows = [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        makeCell([rtlRun('الكيان / الجدول', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 16 }),
        makeCell([rtlRun('اسم الحقل', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 14 }),
        makeCell([rtlRun('نوع البيانات', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 15 }),
        makeCell([rtlRun('المفتاح', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 8, align: AlignmentType.CENTER }),
        makeCell([rtlRun('وصف الحقل', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 27 }),
        makeCell([rtlRun('القيود والملاحظات', { bold: true, size: 19, color: 'FFFFFF' })], { fill: '1E3A5F', widthPct: 20 }),
      ],
    }),
    ...DATA_DICTIONARY.map(
      (entry, idx) =>
        new TableRow({
          cantSplit: true,
          children: [
            makeCell(
              [ltrRun(entry.tableNameEn, { bold: true, size: 17, color: '1E3A5F' }), rtlRun(` (${entry.tableNameAr})`, { size: 17, color: '475569' })],
              { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }
            ),
            makeCell([ltrRun(entry.fieldName, { bold: entry.keyType.includes('PK'), size: 17 })], {
              fill: idx % 2 ? 'F8FAFC' : 'FFFFFF',
              align: AlignmentType.LEFT,
            }),
            makeCell([ltrRun(entry.dataType, { size: 16, color: '0F766E' })], {
              fill: idx % 2 ? 'F8FAFC' : 'FFFFFF',
              align: AlignmentType.LEFT,
            }),
            makeCell([ltrRun(entry.keyType, { bold: entry.keyType !== '-', size: 17, color: entry.keyType.includes('PK') ? 'B45309' : '1E3A5F' })], {
              fill: idx % 2 ? 'F8FAFC' : 'FFFFFF',
              align: AlignmentType.CENTER,
            }),
            makeCell([rtlRun(entry.descriptionAr, { size: 18 })], { fill: idx % 2 ? 'F8FAFC' : 'FFFFFF' }),
            makeCell([ltrRun(entry.constraintsAr, { size: 16, color: '475569' })], {
              fill: idx % 2 ? 'F8FAFC' : 'FFFFFF',
              align: AlignmentType.LEFT,
            }),
          ],
        })
    ),
  ];

  const doc = new Document({
    creator: 'Waqf Graduation Project Engineering Studio',
    title: PROJECT_INFO.documentTitleAr,
    description: 'مخططات التحليل والتصميم وقاموس البيانات لمشروع المنصة الرقمية لإدارة وحصر الممتلكات الوقفية',
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
              top: MARGIN_TWIPS,
              bottom: MARGIN_TWIPS,
              left: MARGIN_TWIPS,
              right: MARGIN_TWIPS,
            },
          },
        },
        headers: { default: commonHeader },
        footers: { default: commonFooter },
        children: section1Children,
      },
      ...diagramSections,
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH_TWIPS,
              height: A4_HEIGHT_TWIPS,
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: LANDSCAPE_MARGIN,
              bottom: LANDSCAPE_MARGIN,
              left: LANDSCAPE_MARGIN,
              right: LANDSCAPE_MARGIN,
            },
          },
        },
        headers: { default: commonHeader },
        footers: { default: commonFooter },
        children: [
          rtlPara([rtlRun('2. التطابق بين مخازن البيانات (DFD) وقاعدة البيانات (ERD)', { bold: true, size: 28, color: '1E3A5F' })], {
            heading: HeadingLevel.HEADING_1,
            keepNext: true,
            spaceAfter: 100,
          }),
          rtlPara([rtlRun('الجدول (3-2): مصفوفة تطابق مخازن البيانات الثمانية مع جداول النموذج العلائقي', { bold: true, size: 21, color: '0F766E' })], {
            align: AlignmentType.CENTER,
            keepNext: true,
            spaceAfter: 80,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            visuallyRightToLeft: true,
            borders: TABLE_BORDERS,
            rows: storeMappingRows,
          }),
          rtlPara([new TextRun({ children: [new PageBreak()] })]),
          rtlPara([rtlRun('3. قاموس البيانات التفصيلي (Data Dictionary)', { bold: true, size: 28, color: '1E3A5F' })], {
            heading: HeadingLevel.HEADING_1,
            keepNext: true,
            spaceAfter: 100,
          }),
          rtlPara([rtlRun('الجدول (3-3): قاموس البيانات الكامل لجميع كيانات وحقول قاعدة البيانات (PostgreSQL + PostGIS)', { bold: true, size: 21, color: '1E3A5F' })], {
            align: AlignmentType.CENTER,
            keepNext: true,
            spaceAfter: 80,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            visuallyRightToLeft: true,
            borders: TABLE_BORDERS,
            rows: ddRows,
          }),
        ],
      },
      // Section 4: Isolated Chen ERD Relationships & Entities (Portrait A4 matching PDF pages 3–8!)
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH_TWIPS,
              height: A4_HEIGHT_TWIPS,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: MARGIN_TWIPS,
              bottom: MARGIN_TWIPS,
              left: MARGIN_TWIPS,
              right: MARGIN_TWIPS,
            },
          },
        },
        headers: { default: commonHeader },
        footers: { default: commonFooter },
        children: [
          rtlPara([rtlRun('4. الحزمة المنعزلة لنموذج الكينونة والعلاقة (Chen ERD)', { bold: true, size: 30, color: '1E3A5F' })], {
            heading: HeadingLevel.HEADING_1,
            keepNext: true,
            spaceAfter: 120,
          }),
          rtlPara(
            [
              rtlRun(
                'تستعرض هذه الفقرة تفاصيل العلاقات الثنائية السبعة عشر بين الكيانات، يليها تفصيل كل كيان من كيانات قاعدة البيانات التسعة عشر مع صفاته بأسلوب تشين (Chen Notation)، بحيث يظهر المفتاح الأساسي مسطراً وتُبرز الصفات الفريدة أو المركبة بإهليلج مزدوج.',
                { size: 21, color: '334155' }
              ),
            ],
            { spaceAfter: 160 }
          ),
          rtlPara([rtlRun('4.1 العلاقات الثنائية بين الكيانات (17 علاقة)', { bold: true, size: 25, color: '0F766E' })], {
            heading: HeadingLevel.HEADING_2,
            keepNext: true,
            spaceAfter: 100,
          }),
          ...isoRelPngs.flatMap((item) => {
            const targetW = 580;
            const targetH = Math.round((targetW * item.height) / item.width);
            return [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                spacing: { before: 80, after: 40 },
                children: [
                  new ImageRun({
                    data: item.buffer,
                    transformation: { width: targetW, height: targetH },
                    type: 'png',
                  }),
                ],
              }),
              rtlPara([rtlRun(`${item.spec.figureNumber}: ${item.spec.titleAr} (${item.spec.cardinalityLabelEn})`, { bold: true, size: 19, color: '475569' })], {
                align: AlignmentType.CENTER,
                spaceBefore: 0,
                spaceAfter: 120,
              }),
            ];
          }),
          rtlPara([new TextRun({ children: [new PageBreak()] })]),
          rtlPara([rtlRun('4.2 الكيانات المنعزلة مع صفاتها بأسلوب تشين (19 كياناً)', { bold: true, size: 25, color: '0F766E' })], {
            heading: HeadingLevel.HEADING_2,
            keepNext: true,
            spaceAfter: 100,
          }),
          ...isoEntPngs.flatMap((item) => {
            const targetW = 590;
            const targetH = Math.round((targetW * item.height) / item.width);
            return [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                spacing: { before: 100, after: 40 },
                children: [
                  new ImageRun({
                    data: item.buffer,
                    transformation: { width: targetW, height: targetH },
                    type: 'png',
                  }),
                ],
              }),
              rtlPara([rtlRun(`${item.spec.figureNumber}: كيان ${item.spec.tableNameAr} (${item.spec.tableNameEn})`, { bold: true, size: 19, color: '475569' })], {
                align: AlignmentType.CENTER,
                spaceBefore: 0,
                spaceAfter: 140,
              }),
            ];
          }),
        ],
      },
    ],
  });

  const docxPath = path.join(DIR_WORD, 'مخططات_الفصل_الثالث.docx');
  const docxBuf = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, docxBuf);
  console.log(`   -> مخططات_الفصل_الثالث.docx (${Math.round(docxBuf.length / 1024)} KB)`);

  console.log('4b. Building Native Editable Word Shapes Document (.docx DrawingML)...');
  const shapesDocxPath = path.join(DIR_WORD, 'مخططات_كأشكال_Word_قابلة_للتعديل.docx');
  const shapesDocxBuf = await buildNativeWordShapesDocx(nativeWordSlots);
  fs.writeFileSync(shapesDocxPath, shapesDocxBuf);
  console.log(`   -> مخططات_كأشكال_Word_قابلة_للتعديل.docx (${Math.round(shapesDocxBuf.length / 1024)} KB)`);

  console.log('5. Packaging complete ZIP archive...');
  const zip = new JSZip();
  function addFolderToZip(folderPath: string, zipFolder: JSZip) {
    for (const item of fs.readdirSync(folderPath)) {
      if (item.endsWith('.zip')) continue;
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addFolderToZip(fullPath, zipFolder.folder(item)!);
      } else {
        zipFolder.file(item, fs.readFileSync(fullPath));
      }
    }
  }
  addFolderToZip(DIR_WORD, zip.folder('01_Word')!);
  addFolderToZip(DIR_PNG, zip.folder('02_PNG')!);
  addFolderToZip(DIR_SRC, zip.folder('03_Source')!);
  addFolderToZip(DIR_DOCS, zip.folder('04_Documentation')!);

  const zipBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const zipPath = path.join(OUT_ROOT, 'Chapter3_Waqf_Diagrams_Package.zip');
  fs.writeFileSync(zipPath, zipBuf);
  console.log(`   -> Chapter3_Waqf_Diagrams_Package.zip (${Math.round(zipBuf.length / 1024)} KB)`);
  console.log('All deliverables generated successfully!');
}

generateAll().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
