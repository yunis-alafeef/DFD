import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Database,
  Download,
  FileArchive,
  FileCode2,
  FileSpreadsheet,
  FileText,
  GitBranch,
  Image as ImageIcon,
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import {
  DATA_DICTIONARY,
  DATA_STORES,
  DIAGRAMS,
  EXTERNAL_ENTITIES,
  MAIN_PROCESSES,
  PROJECT_INFO,
} from './data/projectSpec';

type ActiveSection = 'diagrams' | 'dictionary' | 'balancing' | 'deliverables';
type PreviewMode = 'svg' | 'png';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('diagrams');
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(DIAGRAMS[0].id);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('svg');
  const [zoom, setZoom] = useState<number>(100);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data dictionary filters
  const [ddSearch, setDdSearch] = useState<string>('');
  const [ddStoreFilter, setDdStoreFilter] = useState<string>('ALL');
  const [ddKeyFilter, setDdKeyFilter] = useState<string>('ALL');

  const selectedDiagram = useMemo(
    () => DIAGRAMS.find((d) => d.id === selectedDiagramId) ?? DIAGRAMS[0],
    [selectedDiagramId]
  );

  const filteredDictionary = useMemo(() => {
    const q = ddSearch.trim().toLowerCase();
    return DATA_DICTIONARY.filter((row) => {
      if (ddStoreFilter !== 'ALL' && row.dataStoreId !== ddStoreFilter) return false;
      if (ddKeyFilter === 'PK' && !row.keyType.includes('PK')) return false;
      if (ddKeyFilter === 'FK' && !row.keyType.includes('FK')) return false;
      if (!q) return true;
      return (
        row.tableNameEn.toLowerCase().includes(q) ||
        row.tableNameAr.toLowerCase().includes(q) ||
        row.fieldName.toLowerCase().includes(q) ||
        row.dataType.toLowerCase().includes(q) ||
        row.descriptionAr.toLowerCase().includes(q)
      );
    });
  }, [ddSearch, ddStoreFilter, ddKeyFilter]);

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const previewUrl =
    previewMode === 'svg'
      ? `/deliverables/03_Source/SVG/${selectedDiagram.svgFilename}`
      : `/deliverables/02_PNG/${selectedDiagram.pngFilename}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col" dir="rtl">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#diagrams"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('diagrams');
            }}
            className="font-display text-lg font-bold text-[#1E3A5F] whitespace-nowrap shrink-0"
          >
            مخططات الفصل الثالث
          </a>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveSection('diagrams')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'diagrams'
                  ? 'border-[#1E3A5F] text-[#1E3A5F] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              المخططات الهندسية
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('dictionary')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'dictionary'
                  ? 'border-[#1E3A5F] text-[#1E3A5F] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              قاموس البيانات
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('balancing')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'balancing'
                  ? 'border-[#1E3A5F] text-[#1E3A5F] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              التوافق والاتزان
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('deliverables')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'deliverables'
                  ? 'border-[#1E3A5F] text-[#1E3A5F] font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              حزمة التسليم
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center shrink-0">
            <a
              href="/deliverables/Chapter3_Waqf_Diagrams_Package.zip"
              download="Chapter3_Waqf_Diagrams_Package.zip"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#162C49] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FileArchive className="w-4 h-4" />
              <span>تحميل الحزمة الكاملة (ZIP)</span>
            </a>
          </div>
        </div>

        {/* Mobile Section Switcher */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {(
            [
              ['diagrams', 'المخططات'],
              ['dictionary', 'قاموس البيانات'],
              ['balancing', 'التوافق'],
              ['deliverables', 'التسليم'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                activeSection === key
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Project Academic Sub-header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>مشروع التخرج</span>
              <span aria-hidden="true">·</span>
              <span>{PROJECT_INFO.chapterAr}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">PostgreSQL / PostGIS / OCR / SHA-256</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {PROJECT_INFO.titleAr}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/deliverables/01_Word/مخططات_الفصل_الثالث.docx"
              download="مخططات_الفصل_الثالث.docx"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1E3A5F] bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>تحميل ملف Word القابل للتحرير (.docx)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6">
        {/* SECTION 1: INTERACTIVE DIAGRAMS STUDIO */}
        {activeSection === 'diagrams' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar: 6 Ordered Figures */}
            <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-50">
                <h2 className="font-display text-sm font-bold text-slate-900">
                  فهرس المخططات الأكاديمية
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  مرتبة وفق تسلسل الفصل الثالث
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {DIAGRAMS.map((diag) => {
                  const isActive = diag.id === selectedDiagram.id;
                  return (
                    <button
                      key={diag.id}
                      type="button"
                      onClick={() => {
                        setSelectedDiagramId(diag.id);
                        setZoom(100);
                      }}
                      className={`w-full text-right px-4 py-3.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                        isActive
                          ? 'bg-[#EFF6FF] text-[#1E3A5F]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#0F766E]">
                          {diag.figureNumber}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          0{diag.order}
                        </span>
                      </div>
                      <span className="text-sm font-semibold leading-snug">
                        {diag.titleAr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Primary Diagram Canvas & Academic Commentary */}
            <div className="lg:col-span-9 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Workspace Toolbar */}
                <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
                  <div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-[#0F766E]">
                        {selectedDiagram.figureNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{selectedDiagram.titleEn}</span>
                    </div>
                    <h2 className="font-display text-base font-bold text-slate-900 mt-0.5">
                      {selectedDiagram.titleAr}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Preview Format Switch */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('svg')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          previewMode === 'svg'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        متجهي SVG
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('png')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          previewMode === 'png'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        صورة 300 DPI PNG
                      </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 border border-slate-200 bg-white rounded-lg px-1.5 py-1">
                      <button
                        type="button"
                        title="تصغير"
                        onClick={() => setZoom((z) => Math.max(50, z - 25))}
                        className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-xs text-slate-700 w-11 text-center tabular-nums">
                        {zoom}%
                      </span>
                      <button
                        type="button"
                        title="تكبير"
                        onClick={() => setZoom((z) => Math.min(200, z + 25))}
                        className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="إعادة ضبط"
                        onClick={() => setZoom(100)}
                        className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Diagram Viewport */}
                <div className="bg-white p-4 overflow-auto max-h-[640px] border-b border-slate-200 flex justify-center">
                  <img
                    src={previewUrl}
                    alt={selectedDiagram.titleAr}
                    style={{ width: `${zoom}%`, maxWidth: zoom === 100 ? '100%' : 'none' }}
                    className="h-auto object-contain transition-transform duration-150"
                  />
                </div>

                {/* Per-Diagram Export Bar */}
                <div className="px-5 py-3 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-600">
                    تنزيل هذا المخطط بصيغ التسليم المستقلة:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`/deliverables/02_PNG/${selectedDiagram.pngFilename}`}
                      download={selectedDiagram.pngFilename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#162C49] rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>PNG (300 DPI)</span>
                    </a>
                    <a
                      href={`/deliverables/03_Source/SVG/${selectedDiagram.svgFilename}`}
                      download={selectedDiagram.svgFilename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>SVG</span>
                    </a>
                    <a
                      href={`/deliverables/03_Source/DrawIO/${selectedDiagram.drawioFilename}`}
                      download={selectedDiagram.drawioFilename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Draw.io</span>
                    </a>
                    <a
                      href={`/deliverables/03_Source/Mermaid/${selectedDiagram.mmdFilename}`}
                      download={selectedDiagram.mmdFilename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Mermaid</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Academic Explanation Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    الشرح الأكاديمي للمخطط ({selectedDiagram.figureNumber})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        selectedDiagram.id,
                        `${selectedDiagram.figureNumber}: ${selectedDiagram.titleAr}\n\n${selectedDiagram.academicSummaryAr}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedId === selectedDiagram.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الشرح الأكاديمي</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700">
                  {selectedDiagram.academicSummaryAr}
                </p>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    المرتكزات التصميمية والمعايير المحققة:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedDiagram.keyHighlightsAr.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DATA DICTIONARY EXPLORER */}
        {activeSection === 'dictionary' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  قاموس البيانات التفصيلي (Data Dictionary)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  نموذج PostgreSQL + PostGIS مطبع (3NF) · 19 جدولاً ·{' '}
                  <span className="font-mono tabular-nums">{DATA_DICTIONARY.length}</span> حقلاً موثقاً
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="/deliverables/04_Documentation/قاموس_البيانات.csv"
                  download="قاموس_البيانات.csv"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير CSV</span>
                </a>
                <a
                  href="/deliverables/04_Documentation/قاموس_البيانات.md"
                  download="قاموس_البيانات.md"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>تصدير Markdown</span>
                </a>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ddSearch}
                  onChange={(e) => setDdSearch(e.target.value)}
                  placeholder="ابحث باسم الجدول، اسم الحقل، نوع البيانات، أو الوصف..."
                  className="w-full pr-9 pl-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E3A5F]"
                />
              </div>

              <select
                value={ddStoreFilter}
                onChange={(e) => setDdStoreFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E3A5F]"
              >
                <option value="ALL">كافة مخازن البيانات (D1 – D8)</option>
                {DATA_STORES.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.id} · {ds.nameAr}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                {(
                  [
                    ['ALL', 'الكل'],
                    ['PK', 'PK فقط'],
                    ['FK', 'FK فقط'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setDdKeyFilter(k)}
                    className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      ddKeyFilter === k
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Density Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#1E3A5F] text-white text-xs font-semibold">
                    <th className="py-3 px-4 whitespace-nowrap">المخزن</th>
                    <th className="py-3 px-4 whitespace-nowrap">الكيان / الجدول</th>
                    <th className="py-3 px-4 whitespace-nowrap">اسم الحقل</th>
                    <th className="py-3 px-4 whitespace-nowrap">نوع البيانات</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">المفتاح</th>
                    <th className="py-3 px-4">وصف الحقل</th>
                    <th className="py-3 px-4">القيود والملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredDictionary.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500">
                        لا توجد حقول مطابقة لمعايير البحث الحالية.
                      </td>
                    </tr>
                  ) : (
                    filteredDictionary.map((row, i) => (
                      <tr key={`${row.tableNameEn}-${row.fieldName}-${i}`} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono text-xs font-semibold text-[#0F766E] whitespace-nowrap">
                          {row.dataStoreId}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-xs font-semibold text-[#1E3A5F]" dir="ltr">
                            {row.tableNameEn}
                          </div>
                          <div className="text-xs text-slate-500">{row.tableNameAr}</div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-xs font-medium text-slate-900 whitespace-nowrap" dir="ltr">
                          {row.fieldName}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-xs text-[#0F766E] whitespace-nowrap" dir="ltr">
                          {row.dataType}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-xs font-bold whitespace-nowrap" dir="ltr">
                          <span
                            className={
                              row.keyType.includes('PK')
                                ? 'text-amber-700'
                                : row.keyType.includes('FK')
                                ? 'text-[#0F766E]'
                                : row.keyType === 'UQ'
                                ? 'text-indigo-700'
                                : 'text-slate-400'
                            }
                          >
                            {row.keyType}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-xs sm:text-sm text-slate-700">
                          {row.descriptionAr}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500" dir="ltr">
                          {row.constraintsAr}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: DFD BALANCING & TRACEABILITY MATRIX */}
        {activeSection === 'balancing' && (
          <div className="space-y-6">
            {/* 7 Main Processes & Sub-processes */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  1. العمليات الرئيسية السبع وتفكيكها الهرمي (DFD Level 0 → Level 1)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  التزام كامل بالعمليات السبع المعتمدة دون إضافة عملية ثامنة أو حذف أي عملية
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MAIN_PROCESSES.map((proc) => (
                  <div
                    key={proc.id}
                    className="border border-slate-200 rounded-lg p-4 space-y-2.5 bg-slate-50/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-sm font-bold text-[#1E3A5F]">
                        {proc.id} {proc.titleAr}
                      </h3>
                      <span className="font-mono text-xs text-slate-400">
                        {proc.titleEn}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {proc.descriptionAr}
                    </p>
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      {proc.subProcesses.map((sub) => (
                        <div
                          key={sub.id}
                          className="text-xs flex items-center justify-between gap-2 text-slate-700"
                        >
                          <span>
                            <strong className="font-mono text-[#1E3A5F] ml-1.5">{sub.id}</strong>
                            {sub.titleAr}
                          </span>
                          <span className="font-mono text-[11px] text-[#0F766E]">
                            {sub.stores.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External Entities Balancing */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  2. اتزان التدفقات الخارجية (Context Diagram ↔ DFD Level 0)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  تطابق المدخلات والمخرجات للفئات الخمس المتعاملة مع النظام
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs font-semibold border-y border-slate-200">
                      <th className="py-3 px-4">الكيان الخارجي</th>
                      <th className="py-3 px-4">التدفقات الداخلة إلى النظام (Inputs)</th>
                      <th className="py-3 px-4">التدفقات الخارجة من النظام (Outputs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {EXTERNAL_ENTITIES.map((ent) => (
                      <tr key={ent.id}>
                        <td className="py-3 px-4 font-semibold text-slate-900 align-top whitespace-nowrap">
                          <div>{ent.nameAr}</div>
                          <div className="font-mono text-[11px] text-slate-400">{ent.nameEn}</div>
                        </td>
                        <td className="py-3 px-4 align-top space-y-1">
                          {ent.inputsToSystem.map((f, i) => (
                            <div key={i} className="text-slate-700">
                              <span className="font-mono text-[#1E3A5F] font-semibold">
                                [{f.targetProcess}]
                              </span>{' '}
                              {f.flow}
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 align-top space-y-1">
                          {ent.outputsFromSystem.map((f, i) => (
                            <div key={i} className="text-slate-700">
                              <span className="font-mono text-[#0F766E] font-semibold">
                                [{f.sourceProcess}]
                              </span>{' '}
                              {f.flow}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Stores <-> ERD Tables Mapping */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  3. تطابق مخازن البيانات (DFD) مع جداول قاعدة البيانات (ERD)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DATA_STORES.map((ds) => (
                  <div
                    key={ds.id}
                    className="border border-slate-200 rounded-lg p-4 bg-teal-50/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0F766E]">
                        {ds.id}
                      </span>
                      <Database className="w-4 h-4 text-[#0F766E]" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">{ds.nameAr}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {ds.descriptionAr}
                    </div>
                    <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-[#1E3A5F]" dir="ltr">
                      {ds.tables.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: ORGANIZED DELIVERABLES CENTER */}
        {activeSection === 'deliverables' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  مجلدات التسليم النهائية المنظمة
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  جميع الملفات مولّدة ومفحوصة بصرياً وجاهزة للإدراج المباشر في تقرير مشروع التخرج.
                </p>
              </div>
              <a
                href="/deliverables/Chapter3_Waqf_Diagrams_Package.zip"
                download="Chapter3_Waqf_Diagrams_Package.zip"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A5F] hover:bg-[#162C49] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الحزمة الكاملة (ZIP)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Folder 1: Word */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    المجلد الأول: Word (قابل للتحرير والنسخ)
                  </h3>
                  <span className="font-mono text-xs text-slate-400">01_Word/</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  مستند Word عربي منسق من اليمين إلى اليسار (A4)، يتضمن صفحة العنوان، وفهرس الأشكال، والصور عالية الدقة في صفحات أفقية مستقلة، والشروحات الأكاديمية، وجدول قاموس البيانات الكامل كنصوص وجداول قابلة للتعديل.
                </p>
                <a
                  href="/deliverables/01_Word/مخططات_الفصل_الثالث.docx"
                  download="مخططات_الفصل_الثالث.docx"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-[#1E3A5F] bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <span>مخططات_الفصل_الثالث.docx</span>
                  <Download className="w-4 h-4" />
                </a>
              </div>

              {/* Folder 4: Documentation */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    المجلد الرابع: التوثيق وقاموس البيانات
                  </h3>
                  <span className="font-mono text-xs text-slate-400">04_Documentation/</span>
                </div>
                <div className="space-y-2">
                  <a
                    href="/deliverables/04_Documentation/دليل_المخططات_والتوثيق.md"
                    download="دليل_المخططات_والتوثيق.md"
                    className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    <span>دليل_المخططات_والتوثيق.md (ترتيب وشرح المخططات)</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/deliverables/04_Documentation/قاموس_البيانات.md"
                    download="قاموس_البيانات.md"
                    className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    <span>قاموس_البيانات.md (Markdown)</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/deliverables/04_Documentation/قاموس_البيانات.csv"
                    download="قاموس_البيانات.csv"
                    className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    <span>قاموس_البيانات.csv (متوافق مع Excel UTF-8)</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Folder 2: PNG */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    المجلد الثاني: PNG مستقلة (300 DPI)
                  </h3>
                  <span className="font-mono text-xs text-slate-400">02_PNG/</span>
                </div>
                <div className="space-y-2">
                  {DIAGRAMS.map((d) => (
                    <a
                      key={d.id}
                      href={`/deliverables/02_PNG/${d.pngFilename}`}
                      download={d.pngFilename}
                      className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
                    >
                      <span>
                        <strong className="text-[#0F766E] ml-1.5">{d.figureNumber}</strong>
                        <span className="font-mono">{d.pngFilename}</span>
                      </span>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Folder 3: Source Files */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    المجلد الثالث: ملفات المصدر القابلة للتعديل
                  </h3>
                  <span className="font-mono text-xs text-slate-400">03_Source/</span>
                </div>
                <div className="space-y-2">
                  {DIAGRAMS.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between gap-2 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <span className="font-medium text-slate-800 truncate">
                        {d.figureNumber} · {d.id.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 font-mono">
                        <a
                          href={`/deliverables/03_Source/SVG/${d.svgFilename}`}
                          download={d.svgFilename}
                          className="text-[#1E3A5F] hover:underline"
                        >
                          SVG
                        </a>
                        <span className="text-slate-300">/</span>
                        <a
                          href={`/deliverables/03_Source/DrawIO/${d.drawioFilename}`}
                          download={d.drawioFilename}
                          className="text-[#1E3A5F] hover:underline"
                        >
                          Draw.io
                        </a>
                        <span className="text-slate-300">/</span>
                        <a
                          href={`/deliverables/03_Source/Mermaid/${d.mmdFilename}`}
                          download={d.mmdFilename}
                          className="text-[#1E3A5F] hover:underline"
                        >
                          MMD
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Academic Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>{PROJECT_INFO.documentTitleAr}</span>
          <span>صُمم وفق معايير Gane &amp; Sarson DFD وChen / Crow&apos;s Foot ERD (PostgreSQL + PostGIS)</span>
        </div>
      </footer>
    </div>
  );
}
