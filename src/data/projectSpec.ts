export interface ProcessSpec {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  subProcesses: {
    id: string;
    titleAr: string;
    inputs: string[];
    outputs: string[];
    stores: string[];
  }[];
}

export interface DataStoreSpec {
  id: string;
  nameAr: string;
  nameEn: string;
  tables: string[];
  descriptionAr: string;
}

export interface ExternalEntitySpec {
  id: string;
  nameAr: string;
  nameEn: string;
  inputsToSystem: { flow: string; targetProcess: string }[];
  outputsFromSystem: { flow: string; sourceProcess: string }[];
}

export interface DataDictionaryEntry {
  tableNameEn: string;
  tableNameAr: string;
  dataStoreId: string;
  fieldName: string;
  dataType: string;
  keyType: 'PK' | 'FK' | 'PK, FK' | 'FK, UQ' | 'UQ' | '-';
  descriptionAr: string;
  constraintsAr: string;
}

export interface DiagramMetadata {
  id: string;
  order: number;
  figureNumber: string;
  titleAr: string;
  titleEn: string;
  pngFilename: string;
  svgFilename: string;
  mmdFilename: string;
  drawioFilename: string;
  orientation: 'portrait' | 'landscape';
  academicSummaryAr: string;
  keyHighlightsAr: string[];
}

export const PROJECT_INFO = {
  titleAr: 'المنصة الرقمية لإدارة وحصر الممتلكات الوقفية',
  titleEn: 'Digital Platform for Managing and Inventorying Waqf Properties',
  documentTitleAr: 'مخططات الفصل الثالث – المنصة الرقمية لإدارة وحصر الممتلكات الوقفية',
  chapterAr: 'الفصل الثالث: تحليل وتصميم النظام',
  technologies: [
    'React.js',
    'Node.js',
    'Express.js',
    'PostgreSQL',
    'PostGIS',
    'OCR',
    'RESTful APIs',
    'Clean Architecture',
    'SHA-256',
  ],
};

export const EXTERNAL_ENTITIES: ExternalEntitySpec[] = [
  {
    id: 'E1',
    nameAr: 'مدير النظام',
    nameEn: 'System Administrator',
    inputsToSystem: [
      { flow: 'بيانات الحسابات والأدوار والصلاحيات', targetProcess: '1.0' },
      { flow: 'معايير الأمان وإعدادات المنصة', targetProcess: '1.0' },
    ],
    outputsFromSystem: [
      { flow: 'تقارير التدقيق وسجلات الأنشطة', sourceProcess: '1.0' },
      { flow: 'إحصائيات النظام وحالة الحسابات', sourceProcess: '1.0' },
    ],
  },
  {
    id: 'E2',
    nameAr: 'موظف إدارة الأوقاف',
    nameEn: 'Waqf Management Employee',
    inputsToSystem: [
      { flow: 'بيانات الحصر والإحداثيات الجغرافية', targetProcess: '2.0' },
      { flow: 'ملفات الصكوك والحجج الوقفية', targetProcess: '3.0' },
      { flow: 'شروط الواقفين وقوائم المستفيدين', targetProcess: '4.0' },
      { flow: 'بيانات مسودات العقود وشروط التأجير', targetProcess: '5.0' },
      { flow: 'بيانات القيود المالية وأذونات الصرف', targetProcess: '6.0' },
      { flow: 'قرارات معالجة الطلبات الإلكترونية', targetProcess: '7.0' },
    ],
    outputsFromSystem: [
      { flow: 'سجلات الحصر والخرائط والتقارير الشاملة', sourceProcess: '2.0' },
      { flow: 'نتائج الاستخلاص النصي (OCR) والتحقق (SHA-256)', sourceProcess: '3.0' },
    ],
  },
  {
    id: 'E3',
    nameAr: 'الناظر أو الوكيل',
    nameEn: 'Nazir / Waqf Trustee',
    inputsToSystem: [
      { flow: 'تحديثات حالة الأوقاف وشروط التوزيع', targetProcess: '4.0' },
      { flow: 'اعتمادات العقود والصرف المالي', targetProcess: '5.0' },
    ],
    outputsFromSystem: [
      { flow: 'تقارير الغلة والوضع المالي والإداري', sourceProcess: '6.0' },
      { flow: 'إشعارات الطلبات والمصادقات المعلقة', sourceProcess: '7.0' },
    ],
  },
  {
    id: 'E4',
    nameAr: 'المستفيد',
    nameEn: 'Beneficiary',
    inputsToSystem: [
      { flow: 'بيانات الدخول والتحقق من الهوية', targetProcess: '1.0' },
      { flow: 'طلبات الاستحقاق والخدمات الإلكترونية', targetProcess: '7.0' },
    ],
    outputsFromSystem: [
      { flow: 'بيانات الاستحقاق وحوالات العوائد', sourceProcess: '4.0' },
      { flow: 'حالة الطلبات والإشعارات', sourceProcess: '7.0' },
    ],
  },
  {
    id: 'E5',
    nameAr: 'المستأجر',
    nameEn: 'Tenant',
    inputsToSystem: [
      { flow: 'بيانات التسجيل والتحقق', targetProcess: '1.0' },
      { flow: 'طلبات الاستئجار والصيانة والاعتراض', targetProcess: '7.0' },
      { flow: 'بيانات سداد الإيجارات', targetProcess: '6.0' },
    ],
    outputsFromSystem: [
      { flow: 'نسخ العقود وجدول الدفعات', sourceProcess: '5.0' },
      { flow: 'فواتير الإيجار وإيصالات السداد وحالة الطلبات', sourceProcess: '6.0' },
    ],
  },
];

export const MAIN_PROCESSES: ProcessSpec[] = [
  {
    id: '1.0',
    titleAr: 'إدارة الحسابات والصلاحيات',
    titleEn: 'Accounts & RBAC Management',
    descriptionAr:
      'تتولى هذه العملية المصادقة والتحقق من هوية جميع الفئات المتعاملة مع المنصة، وإدارة الأدوار الوظيفية ومصفوفة الصلاحيات (RBAC)، وتسجيل جميع الحركات الأمنية في سجل التدقيق.',
    subProcesses: [
      {
        id: '1.1',
        titleAr: 'تسجيل الدخول والتحقق من الهوية',
        inputs: ['بيانات الدخول والتحقق'],
        outputs: ['رمز الجلسة المصادق عليه'],
        stores: ['D1'],
      },
      {
        id: '1.2',
        titleAr: 'إدارة المستخدمين والأدوار والصلاحيات',
        inputs: ['بيانات الحسابات والأدوار والصلاحيات'],
        outputs: ['حالة الحسابات والصلاحيات المحدثة'],
        stores: ['D1'],
      },
      {
        id: '1.3',
        titleAr: 'تسجيل التدقيق الأمني وإدارة الجلسات',
        inputs: ['أحداث النظام والعمليات الحساسة'],
        outputs: ['تقارير التدقيق وسجلات الأنشطة'],
        stores: ['D8'],
      },
    ],
  },
  {
    id: '2.0',
    titleAr: 'إدارة الأوقاف والممتلكات الوقفية والحصر الجغرافي',
    titleEn: 'Waqf Inventory & GIS Management',
    descriptionAr:
      'تختص بتسجيل الأوقاف والأصول العقارية والمنقولة، وحصرها مكانياً عبر تحديد الحدود والمضلعات الجغرافية المتوافقة مع PostGIS، ومنع التداخل المكاني.',
    subProcesses: [
      {
        id: '2.1',
        titleAr: 'تسجيل بيانات الوقف والممتلكات الأساسية',
        inputs: ['بيانات الحصر الوقفي'],
        outputs: ['سجل الأصل الوقفي المرمز'],
        stores: ['D2'],
      },
      {
        id: '2.2',
        titleAr: 'الرسم والمسح الجغرافي للحدود (PostGIS)',
        inputs: ['الإحداثيات الجغرافية والحدود المكانية'],
        outputs: ['الخرائط المضلعية والمساحات المعتمدة'],
        stores: ['D2'],
      },
      {
        id: '2.3',
        titleAr: 'تحديث حالة الممتلكات وإصدار تقارير الحصر',
        inputs: ['تحديثات حالة الأوقاف'],
        outputs: ['سجلات الحصر والخرائط والتقارير الشاملة'],
        stores: ['D2', 'D8'],
      },
    ],
  },
  {
    id: '3.0',
    titleAr: 'إدارة الوثائق الوقفية والأرشفة الإلكترونية',
    titleEn: 'Waqf Documents & Digital Archiving',
    descriptionAr:
      'تقوم باستقبال الصكوك والحجج الوقفية الرقمية، ومعالجتها ضوئياً (OCR) لاستخلاص النصوص القابلة للبحث، وحساب البصمة الرقمية SHA-256 لضمان سلامة الوثائق من التعديل.',
    subProcesses: [
      {
        id: '3.1',
        titleAr: 'رفع وفحص الصكوك والحجج الوقفية',
        inputs: ['ملفات الصكوك والحجج الوقفية'],
        outputs: ['وثائق أولية مفحوصة'],
        stores: ['D3'],
      },
      {
        id: '3.2',
        titleAr: 'المعالجة الضوئية واستخلاص النصوص (OCR)',
        inputs: ['صور الصكوك الممسوحة'],
        outputs: ['نصوص مستخلصة قابلة للفهرسة'],
        stores: ['D3'],
      },
      {
        id: '3.3',
        titleAr: 'توليد البصمة الرقمية (SHA-256) والأرشفة',
        inputs: ['الوثيقة المفحوصة والنص المستخلص'],
        outputs: ['سجل موثق ببصمة SHA-256'],
        stores: ['D3', 'D8'],
      },
    ],
  },
  {
    id: '4.0',
    titleAr: 'إدارة شروط الواقفين والمستفيدين',
    titleEn: 'Waqif Conditions & Beneficiaries Management',
    descriptionAr:
      'تُعنى بتوثيق شروط الواقفين وقواعد المصارف الشرعية، والتحقق من أهلية المستفيدين وربطهم بالأوقاف المستحقة وفق نسب الاستحقاق المعتمدة.',
    subProcesses: [
      {
        id: '4.1',
        titleAr: 'توثيق شروط الواقفين وقواعد المصارف',
        inputs: ['شروط الواقفين', 'بيانات الصكوك المؤرشفة'],
        outputs: ['قواعد التوزيع المهيكلة'],
        stores: ['D4'],
      },
      {
        id: '4.2',
        titleAr: 'تسجيل المستفيدين والتحقق من الاستحقاق',
        inputs: ['قوائم وبيانات المستفيدين'],
        outputs: ['سجل المستفيدين المؤهلين'],
        stores: ['D4'],
      },
      {
        id: '4.3',
        titleAr: 'احتساب نسب التوزيع المعتمدة',
        inputs: ['شروط التوزيع المحدثة'],
        outputs: ['جدول حصص الاستحقاق المعتمد'],
        stores: ['D4'],
      },
    ],
  },
  {
    id: '5.0',
    titleAr: 'إدارة العقود والإيجارات',
    titleEn: 'Contracts & Leases Management',
    descriptionAr:
      'تدير دورة حياة عقود استثمار وتأجير الممتلكات الوقفية بدءاً من إعداد المسودة والتحقق من خلو العقار، ومروراً باعتماد الناظر، وانتهاءً بجدولة الدفعات والتجديد.',
    subProcesses: [
      {
        id: '5.1',
        titleAr: 'إعداد ومراجعة مسودات عقود الإيجار',
        inputs: ['بيانات مسودات العقود', 'بيانات العقار المتاح'],
        outputs: ['مسودة عقد جاهزة للاعتماد'],
        stores: ['D5', 'D2'],
      },
      {
        id: '5.2',
        titleAr: 'اعتماد العقود وتوثيقها وربطها بالممتلكات',
        inputs: ['اعتماد الناظر والموظف'],
        outputs: ['نسخ العقود المعتمدة'],
        stores: ['D5', 'D3'],
      },
      {
        id: '5.3',
        titleAr: 'جدولة الدفعات ومتابعة التجديد والإنهاء',
        inputs: ['شروط السداد والمدة التعاقدية'],
        outputs: ['جدول الدفعات الدورية وتنبيهات الانتهاء'],
        stores: ['D5'],
      },
    ],
  },
  {
    id: '6.0',
    titleAr: 'إدارة المعاملات المالية والتحصيل',
    titleEn: 'Financial Transactions & Collection',
    descriptionAr:
      'تنظم إصدار فواتير ومطالبات الإيجار الدورية، وتحصيل المبالغ وإصدار الإيصالات، ثم توزيع صافي الغلة وصرف مستحقات المستفيدين استناداً إلى شروط الواقفين.',
    subProcesses: [
      {
        id: '6.1',
        titleAr: 'إصدار مطالبات وفواتير الإيجار',
        inputs: ['جدول الدفعات المستحقة'],
        outputs: ['فواتير الإيجار'],
        stores: ['D6', 'D5'],
      },
      {
        id: '6.2',
        titleAr: 'تحصيل الإيجارات وإصدار إيصالات السداد',
        inputs: ['بيانات سداد الإيجارات'],
        outputs: ['إيصالات السداد والقيود الدائنة'],
        stores: ['D6'],
      },
      {
        id: '6.3',
        titleAr: 'توزيع الغلة وصرف مستحقات المستفيدين',
        inputs: ['أذونات الصرف', 'جدول حصص الاستحقاق'],
        outputs: ['حوالات العوائد وتقارير الغلة'],
        stores: ['D6', 'D4'],
      },
    ],
  },
  {
    id: '7.0',
    titleAr: 'إدارة الخدمات الإلكترونية والطلبات',
    titleEn: 'E-Services & Requests Management',
    descriptionAr:
      'توفر بوابة موحدة لاستقبال طلبات المستفيدين والمستأجرين (طلب استئجار، صيانة، إثبات استحقاق، اعتراض)، وتوجيهها للمعنيين، وإبلاغ مقدميها بحالة التنفيذ.',
    subProcesses: [
      {
        id: '7.1',
        titleAr: 'استقبال وتصنيف طلبات المستفيدين والمستأجرين',
        inputs: ['طلبات الاستحقاق والاستئجار والصيانة'],
        outputs: ['تذكرة طلب مصنفة'],
        stores: ['D7'],
      },
      {
        id: '7.2',
        titleAr: 'معالجة الطلبات وتوجيهها للجهات المختصة',
        inputs: ['قرارات معالجة الطلبات الإلكترونية'],
        outputs: ['نتائج البت في الطلبات'],
        stores: ['D7', 'D5', 'D4'],
      },
      {
        id: '7.3',
        titleAr: 'إرسال الإشعارات ومتابعة حالة الإنجاز',
        inputs: ['تحديثات حالة الطلبات والمصادقات'],
        outputs: ['حالة الطلبات والإشعارات الفورية'],
        stores: ['D7'],
      },
    ],
  },
];

export const DATA_STORES: DataStoreSpec[] = [
  {
    id: 'D1',
    nameAr: 'سجل المستخدمين والصلاحيات',
    nameEn: 'Users & RBAC Store',
    tables: ['users', 'roles', 'permissions', 'role_permissions'],
    descriptionAr: 'يخزن حسابات المستخدمين، الأدوار الوظيفية، ومصفوفة الصلاحيات.',
  },
  {
    id: 'D2',
    nameAr: 'سجل الأوقاف والممتلكات الجغرافية',
    nameEn: 'Waqfs, Properties & GIS Store',
    tables: ['waqfs', 'properties', 'gis_parcels'],
    descriptionAr: 'يخزن الأصول الوقفية والحدود المكانية والمضلعات عبر PostGIS.',
  },
  {
    id: 'D3',
    nameAr: 'أرشيف الوثائق والحجج الوقفية',
    nameEn: 'Documents & OCR Archive',
    tables: ['documents'],
    descriptionAr: 'يحفظ الصكوك الرقمية والنصوص المستخلصة بـ OCR وبصمات SHA-256.',
  },
  {
    id: 'D4',
    nameAr: 'سجل الواقفين والشروط والمستفيدين',
    nameEn: 'Waqifs, Conditions & Beneficiaries',
    tables: ['waqifs', 'waqif_conditions', 'beneficiaries', 'waqf_beneficiaries'],
    descriptionAr: 'يضم الواقفين، شروطهم الشرعية، المستفيدين، ونسب الاستحقاق.',
  },
  {
    id: 'D5',
    nameAr: 'سجل العقود والإيجارات',
    nameEn: 'Tenants & Lease Contracts',
    tables: ['tenants', 'lease_contracts'],
    descriptionAr: 'يدير بيانات المستأجرين، العقود الموثقة، ودورات السداد.',
  },
  {
    id: 'D6',
    nameAr: 'السجل المالي والتحصيل والتوزيع',
    nameEn: 'Invoices, Payments & Disbursements',
    tables: ['invoices', 'payments', 'disbursements'],
    descriptionAr: 'يسجل الفواتير، عمليات التحصيل، وصرفيات عوائد المستفيدين.',
  },
  {
    id: 'D7',
    nameAr: 'سجل الخدمات الإلكترونية والطلبات',
    nameEn: 'E-Service Requests Store',
    tables: ['service_requests'],
    descriptionAr: 'يوثق طلبات المستفيدين والمستأجرين وحالات معالجتها.',
  },
  {
    id: 'D8',
    nameAr: 'سجل التدقيق والرقابة',
    nameEn: 'Audit Logs Store',
    tables: ['audit_logs'],
    descriptionAr: 'يرصد كافة العمليات الأمنية والتعديلات التاريخية في المنصة.',
  },
];

export const DATA_DICTIONARY: DataDictionaryEntry[] = [
  // D1: roles, permissions, role_permissions, users
  { tableNameEn: 'roles', tableNameAr: 'الأدوار الوظيفية', dataStoreId: 'D1', fieldName: 'role_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للدور الوظيفي', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'roles', tableNameAr: 'الأدوار الوظيفية', dataStoreId: 'D1', fieldName: 'role_name', dataType: 'VARCHAR(60)', keyType: 'UQ', descriptionAr: 'اسم الدور (مدير نظام، موظف، ناظر، مستفيد، مستأجر)', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'roles', tableNameAr: 'الأدوار الوظيفية', dataStoreId: 'D1', fieldName: 'description', dataType: 'VARCHAR(255)', keyType: '-', descriptionAr: 'وصف نطاق مهام الدور الوظيفي', constraintsAr: 'NULLABLE' },

  { tableNameEn: 'permissions', tableNameAr: 'الصلاحيات', dataStoreId: 'D1', fieldName: 'permission_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للصلاحية', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'permissions', tableNameAr: 'الصلاحيات', dataStoreId: 'D1', fieldName: 'permission_code', dataType: 'VARCHAR(80)', keyType: 'UQ', descriptionAr: 'الرمز البرمجي للصلاحية (مثل waqf:create)', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'permissions', tableNameAr: 'الصلاحيات', dataStoreId: 'D1', fieldName: 'module_name', dataType: 'VARCHAR(80)', keyType: '-', descriptionAr: 'اسم الوحدة الوظيفية التابعة لها الصلاحية', constraintsAr: 'NOT NULL' },

  { tableNameEn: 'role_permissions', tableNameAr: 'صلاحيات الأدوار (وسيط)', dataStoreId: 'D1', fieldName: 'role_id', dataType: 'BIGINT', keyType: 'PK, FK', descriptionAr: 'مرجع للدور الوظيفي في جدول roles', constraintsAr: 'FK -> roles(role_id) ON DELETE CASCADE' },
  { tableNameEn: 'role_permissions', tableNameAr: 'صلاحيات الأدوار (وسيط)', dataStoreId: 'D1', fieldName: 'permission_id', dataType: 'BIGINT', keyType: 'PK, FK', descriptionAr: 'مرجع للصلاحية في جدول permissions', constraintsAr: 'FK -> permissions(permission_id) ON DELETE CASCADE' },

  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'user_id', dataType: 'UUID', keyType: 'PK', descriptionAr: 'المعرف الفريد للمستخدم في المنصة', constraintsAr: 'DEFAULT gen_random_uuid()' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'role_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الدور الوظيفي المخصص للمستخدم', constraintsAr: 'NOT NULL, FK -> roles(role_id)' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'full_name', dataType: 'VARCHAR(150)', keyType: '-', descriptionAr: 'الاسم الكامل للمستخدم', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'national_id', dataType: 'VARCHAR(20)', keyType: 'UQ', descriptionAr: 'رقم الهوية الوطنية أو الإقامة', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'email', dataType: 'VARCHAR(120)', keyType: 'UQ', descriptionAr: 'البريد الإلكتروني الرسمي', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'phone', dataType: 'VARCHAR(20)', keyType: '-', descriptionAr: 'رقم الهاتف للتواصل والإشعارات', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'password_hash', dataType: 'VARCHAR(255)', keyType: '-', descriptionAr: 'كلمة المرور المشفرة', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'is_active', dataType: 'BOOLEAN', keyType: '-', descriptionAr: 'حالة تفعيل الحساب', constraintsAr: 'NOT NULL DEFAULT TRUE' },
  { tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', fieldName: 'created_at', dataType: 'TIMESTAMPTZ', keyType: '-', descriptionAr: 'تاريخ ووقت إنشاء الحساب', constraintsAr: 'NOT NULL DEFAULT NOW()' },

  // D8: audit_logs
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'log_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف التسلسلي لحركة التدقيق', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'user_id', dataType: 'UUID', keyType: 'FK', descriptionAr: 'المستخدم المنفذ للعملية', constraintsAr: 'NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'action_type', dataType: 'VARCHAR(40)', keyType: '-', descriptionAr: 'نوع العملية (INSERT / UPDATE / APPROVE / LOGIN)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'target_table', dataType: 'VARCHAR(60)', keyType: '-', descriptionAr: 'الكيان المتأثر بالعملية', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'record_id', dataType: 'VARCHAR(64)', keyType: '-', descriptionAr: 'معرف السجل المتأثر', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', fieldName: 'created_at', dataType: 'TIMESTAMPTZ', keyType: '-', descriptionAr: 'الطابع الزمني الدقيق للحدث', constraintsAr: 'NOT NULL DEFAULT NOW()' },

  // D4: waqifs, waqif_conditions, beneficiaries, waqf_beneficiaries
  { tableNameEn: 'waqifs', tableNameAr: 'الواقفون', dataStoreId: 'D4', fieldName: 'waqif_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للواقف', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'waqifs', tableNameAr: 'الواقفون', dataStoreId: 'D4', fieldName: 'full_name', dataType: 'VARCHAR(160)', keyType: '-', descriptionAr: 'الاسم الكامل للواقف', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'waqifs', tableNameAr: 'الواقفون', dataStoreId: 'D4', fieldName: 'national_id', dataType: 'VARCHAR(20)', keyType: 'UQ', descriptionAr: 'رقم الهوية أو الرقم المرجعي للواقف', constraintsAr: 'UNIQUE, NULLABLE' },
  { tableNameEn: 'waqifs', tableNameAr: 'الواقفون', dataStoreId: 'D4', fieldName: 'waqf_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ إنشاء الوقف الأولي', constraintsAr: 'NOT NULL' },

  // D2: waqfs, properties, gis_parcels
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'waqf_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للكيان الوقفي', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'waqif_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الواقف المنشئ للوقف', constraintsAr: 'NOT NULL, FK -> waqifs(waqif_id)' },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'nazir_user_id', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الناظر أو الوكيل المسؤول عن الوقف', constraintsAr: 'NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'waqf_name', dataType: 'VARCHAR(180)', keyType: '-', descriptionAr: 'الاسم الرسمي للوقف', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'waqf_type', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'نوع الوقف (خيري / ذري / مشترك)', constraintsAr: "CHECK (waqf_type IN ('خيري','ذري','مشترك'))" },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'deed_number', dataType: 'VARCHAR(60)', keyType: 'UQ', descriptionAr: 'رقم صك أو حجة الوقفية', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', fieldName: 'status', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'الحالة التنظيمية للوقف (نشط / موقوف / قيد المراجعة)', constraintsAr: 'NOT NULL DEFAULT \'نشط\'' },

  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'property_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للأصل أو العقار الوقفي', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'waqf_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الوقف التابع له العقار', constraintsAr: 'NOT NULL, FK -> waqfs(waqf_id)' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'property_code', dataType: 'VARCHAR(40)', keyType: 'UQ', descriptionAr: 'الرمز الموحد للحصر العقاري', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'property_type', dataType: 'VARCHAR(50)', keyType: '-', descriptionAr: 'تصنيف العقار (أرض، مبنى سكني، محل تجاري، مزرعة)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'address', dataType: 'VARCHAR(255)', keyType: '-', descriptionAr: 'العنوان الوطني والمنطقة الإدارية', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'area_sqm', dataType: 'NUMERIC(12,2)', keyType: '-', descriptionAr: 'المساحة الإجمالية بالمتر المربع', constraintsAr: 'CHECK (area_sqm > 0)' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'estimated_value', dataType: 'NUMERIC(14,2)', keyType: '-', descriptionAr: 'القيمة التقديرية للأصل الوقفي', constraintsAr: 'CHECK (estimated_value >= 0)' },
  { tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', fieldName: 'status', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'الحالة التشغيلية (شاغر / مؤجر / تحت الصيانة)', constraintsAr: 'NOT NULL' },

  { tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية (PostGIS)', dataStoreId: 'D2', fieldName: 'parcel_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للرسم المكاني للقطعة', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية (PostGIS)', dataStoreId: 'D2', fieldName: 'property_id', dataType: 'BIGINT', keyType: 'FK, UQ', descriptionAr: 'العقار المرتبط بهذه القطعة (علاقة 1:1)', constraintsAr: 'NOT NULL, UNIQUE, FK -> properties(property_id)' },
  { tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية (PostGIS)', dataStoreId: 'D2', fieldName: 'boundary_geom', dataType: 'GEOMETRY(Polygon,4326)', keyType: '-', descriptionAr: 'المضلع الجغرافي لحدود العقار بنظام WGS84', constraintsAr: 'NOT NULL, GIST Spatial Index' },
  { tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية (PostGIS)', dataStoreId: 'D2', fieldName: 'centroid_point', dataType: 'GEOMETRY(Point,4326)', keyType: '-', descriptionAr: 'نقطة المركز الهندسي للعرض على الخريطة', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية (PostGIS)', dataStoreId: 'D2', fieldName: 'survey_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ الرفع المساحي الميداني', constraintsAr: 'NOT NULL' },

  // D3: documents
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'document_id', dataType: 'UUID', keyType: 'PK', descriptionAr: 'المعرف الفريد للوثيقة المؤرشفة', constraintsAr: 'DEFAULT gen_random_uuid()' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'waqf_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الوقف المرتبط بالوثيقة', constraintsAr: 'NOT NULL, FK -> waqfs(waqf_id)' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'property_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'العقار المحدد (اختياري للوثائق العامة)', constraintsAr: 'NULLABLE, FK -> properties(property_id)' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'uploaded_by', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الموظف الذي قام برفع وأرشفة الوثيقة', constraintsAr: 'NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'doc_type', dataType: 'VARCHAR(60)', keyType: '-', descriptionAr: 'نوع الوثيقة (حجة وقف، صك ملكية، مخطط مساحي، عقد)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'file_path', dataType: 'VARCHAR(400)', keyType: '-', descriptionAr: 'مسار التخزين الآمن للملف الرقمي', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'sha256_hash', dataType: 'CHAR(64)', keyType: 'UQ', descriptionAr: 'البصمة الرقمية SHA-256 للتحقق من سلامة الوثيقة', constraintsAr: 'NOT NULL, UNIQUE, LENGTH = 64' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'ocr_text', dataType: 'TEXT', keyType: '-', descriptionAr: 'النص المستخلص آلياً بواسطة تقنية OCR للبحث', constraintsAr: 'GIN Full-Text Index' },
  { tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية المؤرشفة', dataStoreId: 'D3', fieldName: 'archived_at', dataType: 'TIMESTAMPTZ', keyType: '-', descriptionAr: 'تاريخ ووقت الأرشفة الإلكترونية', constraintsAr: 'NOT NULL DEFAULT NOW()' },

  // D4 cont.
  { tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', fieldName: 'condition_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد لشرط الواقف', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', fieldName: 'waqf_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الوقف الذي يسري عليه الشرط', constraintsAr: 'NOT NULL, FK -> waqfs(waqf_id)' },
  { tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', fieldName: 'condition_title', dataType: 'VARCHAR(160)', keyType: '-', descriptionAr: 'عنوان الشرط أو مصرف الغلة', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', fieldName: 'condition_text', dataType: 'TEXT', keyType: '-', descriptionAr: 'النص الشرعي الحرفي لشرط الواقف', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', fieldName: 'priority_order', dataType: 'SMALLINT', keyType: '-', descriptionAr: 'أولوية التنفيذ والتوزيع المالي', constraintsAr: 'CHECK (priority_order > 0)' },

  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'beneficiary_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للمستفيد', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'user_id', dataType: 'UUID', keyType: 'FK, UQ', descriptionAr: 'حساب المنصة المرتبط بالمستفيد (علاقة 1:1)', constraintsAr: 'UNIQUE, NULLABLE, FK -> users(user_id)' },
  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'full_name', dataType: 'VARCHAR(160)', keyType: '-', descriptionAr: 'الاسم الكامل للمستفيد', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'national_id', dataType: 'VARCHAR(20)', keyType: 'UQ', descriptionAr: 'رقم الهوية الوطنية للمستفيد', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'category', dataType: 'VARCHAR(60)', keyType: '-', descriptionAr: 'فئة الاستحقاق (ذرية / فقراء / جهة علمية)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', fieldName: 'bank_iban', dataType: 'VARCHAR(34)', keyType: '-', descriptionAr: 'رقم الحساب المصرفي الدولي لتحويل العوائد', constraintsAr: 'NULLABLE' },

  { tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين (وسيط)', dataStoreId: 'D4', fieldName: 'entitlement_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'معرف قيد الاستحقاق (يفك علاقة M:N)', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين (وسيط)', dataStoreId: 'D4', fieldName: 'waqf_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الوقف الموزع للعائد', constraintsAr: 'NOT NULL, FK -> waqfs(waqf_id)' },
  { tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين (وسيط)', dataStoreId: 'D4', fieldName: 'beneficiary_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'المستفيد المستحق للحصة', constraintsAr: 'NOT NULL, FK -> beneficiaries(beneficiary_id)' },
  { tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين (وسيط)', dataStoreId: 'D4', fieldName: 'condition_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'شرط الواقف المنظم لهذا الاستحقاق', constraintsAr: 'NOT NULL, FK -> waqif_conditions(condition_id)' },
  { tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين (وسيط)', dataStoreId: 'D4', fieldName: 'share_percentage', dataType: 'NUMERIC(5,2)', keyType: '-', descriptionAr: 'النسبة المئوية للاستحقاق من صافي الغلة', constraintsAr: 'CHECK (share_percentage > 0 AND <= 100)' },

  // D5: tenants, lease_contracts
  { tableNameEn: 'tenants', tableNameAr: 'المستأجرون', dataStoreId: 'D5', fieldName: 'tenant_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للمستأجر', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'tenants', tableNameAr: 'المستأجرون', dataStoreId: 'D5', fieldName: 'user_id', dataType: 'UUID', keyType: 'FK, UQ', descriptionAr: 'حساب المنصة المرتبط بالمستأجر (علاقة 1:1)', constraintsAr: 'UNIQUE, NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'tenants', tableNameAr: 'المستأجرون', dataStoreId: 'D5', fieldName: 'full_name', dataType: 'VARCHAR(160)', keyType: '-', descriptionAr: 'الاسم الكامل للمستأجر أو المنشأة', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'tenants', tableNameAr: 'المستأجرون', dataStoreId: 'D5', fieldName: 'national_id_or_cr', dataType: 'VARCHAR(25)', keyType: 'UQ', descriptionAr: 'رقم الهوية أو السجل التجاري', constraintsAr: 'NOT NULL, UNIQUE' },

  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'contract_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد لعقد الإيجار', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'property_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'العقار الوقفي المؤجر', constraintsAr: 'NOT NULL, FK -> properties(property_id)' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'tenant_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'المستأجر المتعاقد', constraintsAr: 'NOT NULL, FK -> tenants(tenant_id)' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'approved_by', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الناظر أو الموظف المعتمد للعقد', constraintsAr: 'NULLABLE, FK -> users(user_id)' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'contract_number', dataType: 'VARCHAR(50)', keyType: 'UQ', descriptionAr: 'الرقم المرجعي الموثق للعقد', constraintsAr: 'NOT NULL, UNIQUE' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'start_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ بداية سريان العقد', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'end_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ انتهاء العقد', constraintsAr: 'CHECK (end_date > start_date)' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'annual_rent', dataType: 'NUMERIC(12,2)', keyType: '-', descriptionAr: 'قيمة الأجرة السنوية', constraintsAr: 'CHECK (annual_rent > 0)' },
  { tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', fieldName: 'contract_status', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'حالة العقد (مسودة / ساري / منتهي / ملغى)', constraintsAr: 'NOT NULL' },

  // D6: invoices, payments, disbursements
  { tableNameEn: 'invoices', tableNameAr: 'المطالبات والفواتير المالية', dataStoreId: 'D6', fieldName: 'invoice_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للفاتورة الدورية', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'invoices', tableNameAr: 'المطالبات والفواتير المالية', dataStoreId: 'D6', fieldName: 'contract_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'عقد الإيجار المصدرة له الفاتورة', constraintsAr: 'NOT NULL, FK -> lease_contracts(contract_id)' },
  { tableNameEn: 'invoices', tableNameAr: 'المطالبات والفواتير المالية', dataStoreId: 'D6', fieldName: 'due_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ استحقاق السداد', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'invoices', tableNameAr: 'المطالبات والفواتير المالية', dataStoreId: 'D6', fieldName: 'amount_due', dataType: 'NUMERIC(12,2)', keyType: '-', descriptionAr: 'المبلغ المستحق للتحصيل', constraintsAr: 'CHECK (amount_due > 0)' },
  { tableNameEn: 'invoices', tableNameAr: 'المطالبات والفواتير المالية', dataStoreId: 'D6', fieldName: 'invoice_status', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'حالة الفاتورة (مستحقة / مسددة / متأخرة)', constraintsAr: 'NOT NULL' },

  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'payment_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد لعملية السداد', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'invoice_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'الفاتورة المسددة', constraintsAr: 'NOT NULL, FK -> invoices(invoice_id)' },
  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'collected_by', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الموظف المحصل أو بوابة الدفع المعتمدة', constraintsAr: 'NULLABLE, FK -> users(user_id)' },
  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'amount_paid', dataType: 'NUMERIC(12,2)', keyType: '-', descriptionAr: 'المبلغ المدفوع فعلياً', constraintsAr: 'CHECK (amount_paid > 0)' },
  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'payment_date', dataType: 'TIMESTAMPTZ', keyType: '-', descriptionAr: 'تاريخ ووقت إتمام التحصيل', constraintsAr: 'NOT NULL DEFAULT NOW()' },
  { tableNameEn: 'payments', tableNameAr: 'عمليات التحصيل والسداد', dataStoreId: 'D6', fieldName: 'receipt_number', dataType: 'VARCHAR(50)', keyType: 'UQ', descriptionAr: 'رقم سند القبض أو الإيصال المالي', constraintsAr: 'NOT NULL, UNIQUE' },

  { tableNameEn: 'disbursements', tableNameAr: 'صرفيات عوائد المستفيدين', dataStoreId: 'D6', fieldName: 'disbursement_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد لحركة الصرف', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'disbursements', tableNameAr: 'صرفيات عوائد المستفيدين', dataStoreId: 'D6', fieldName: 'entitlement_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'مرجع استحقاق المستفيد في waqf_beneficiaries', constraintsAr: 'NOT NULL, FK -> waqf_beneficiaries(entitlement_id)' },
  { tableNameEn: 'disbursements', tableNameAr: 'صرفيات عوائد المستفيدين', dataStoreId: 'D6', fieldName: 'approved_by', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الناظر أو الموظف المعتمد للصرف', constraintsAr: 'NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'disbursements', tableNameAr: 'صرفيات عوائد المستفيدين', dataStoreId: 'D6', fieldName: 'amount', dataType: 'NUMERIC(12,2)', keyType: '-', descriptionAr: 'قيمة العائد المصروف للمستفيد', constraintsAr: 'CHECK (amount > 0)' },
  { tableNameEn: 'disbursements', tableNameAr: 'صرفيات عوائد المستفيدين', dataStoreId: 'D6', fieldName: 'disbursement_date', dataType: 'DATE', keyType: '-', descriptionAr: 'تاريخ التحويل المالي', constraintsAr: 'NOT NULL' },

  // D7: service_requests
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'request_id', dataType: 'BIGSERIAL', keyType: 'PK', descriptionAr: 'المعرف الفريد للطلب الإلكتروني', constraintsAr: 'NOT NULL, AUTO INCREMENT' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'requester_user_id', dataType: 'UUID', keyType: 'FK', descriptionAr: 'مقدم الطلب (مستفيد أو مستأجر)', constraintsAr: 'NOT NULL, FK -> users(user_id)' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'property_id', dataType: 'BIGINT', keyType: 'FK', descriptionAr: 'العقار المرتبط بالطلب إن وجد', constraintsAr: 'NULLABLE, FK -> properties(property_id)' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'handled_by', dataType: 'UUID', keyType: 'FK', descriptionAr: 'الموظف المكلف بمعالجة الطلب', constraintsAr: 'NULLABLE, FK -> users(user_id)' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'request_type', dataType: 'VARCHAR(60)', keyType: '-', descriptionAr: 'نوع الطلب (استئجار، صيانة، إثبات استحقاق، استفسار)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'request_status', dataType: 'VARCHAR(30)', keyType: '-', descriptionAr: 'حالة الطلب (جديد / قيد المراجعة / مقبول / مرفوض)', constraintsAr: 'NOT NULL' },
  { tableNameEn: 'service_requests', tableNameAr: 'الخدمات الإلكترونية والطلبات', dataStoreId: 'D7', fieldName: 'submitted_at', dataType: 'TIMESTAMPTZ', keyType: '-', descriptionAr: 'تاريخ تقديم الطلب', constraintsAr: 'NOT NULL DEFAULT NOW()' },
];

export const DIAGRAMS: DiagramMetadata[] = [
  {
    id: 'context',
    order: 1,
    figureNumber: 'الشكل (3-1)',
    titleAr: 'المخطط البيئي للنظام (Context Diagram)',
    titleEn: 'System Context Diagram (DFD Level -1)',
    pngFilename: '01_Context_Diagram.png',
    svgFilename: '01_Context_Diagram.svg',
    mmdFilename: '01_Context_Diagram.mmd',
    drawioFilename: '01_Context_Diagram.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'يمثل المخطط البيئي أعلى مستوى تجريدي للمنصة الرقمية لإدارة وحصر الممتلكات الوقفية، حيث يوضح حدود النظام كعملية مركزية واحدة (0) وتفاعلاتها مع الفئات الخمس الخارجية المتعاملة معها (مدير النظام، موظف إدارة الأوقاف، الناظر أو الوكيل، المستفيد، والمستأجر) دون إظهار مخازن البيانات الداخلية أو التفصيل الداخلي للعمليات. وتُعد تدفقات البيانات الظاهرة في هذا المخطط مرجعاً أساسياً للاتزان (Balancing) مع المستوى الصفري والمستويات التفصيلية اللاحقة.',
    keyHighlightsAr: [
      'يحدد حدود النظام بعملية شاملة رقم (0) دون مخازن بيانات داخلية.',
      'يبرز كافة التدفقات الداخلة والخارجة للجهات الخمس بدقة متوازنة.',
      'يمنع أي اتصال مباشر بين الكيانات الخارجية بعضها ببعض.',
    ],
  },
  {
    id: 'dfd0',
    order: 2,
    figureNumber: 'الشكل (3-2)',
    titleAr: 'مخطط تدفق البيانات من المستوى الصفري (DFD Level 0)',
    titleEn: 'Data Flow Diagram – Level 0',
    pngFilename: '02_DFD_Level_0.png',
    svgFilename: '02_DFD_Level_0.svg',
    mmdFilename: '02_DFD_Level_0.mmd',
    drawioFilename: '02_DFD_Level_0.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'يفصل مخطط المستوى الصفري (DFD Level 0) العملية المركزية في المخطط البيئي إلى العمليات الرئيسية السبع المعتمدة في نطاق المشروع (1.0 إلى 7.0) مع ربطها بمخازن البيانات الثمانية (D1 إلى D8) وبنفس الكيانات الخارجية الخمس وبنفس تدفقات البيانات المتزنة مع المخطط البيئي. يلتزم المخطط التزاماً صارماً بقواعد نمذجة تدفق البيانات من حيث عدم اتصال الكيانات الخارجية بمخازن البيانات مباشرة، وعدم اتصال مخازن البيانات ببعضها مباشرة، مع تسمية جميع الأسهم ببيانات اسمية واضحة.',
    keyHighlightsAr: [
      'تغطية كاملة للعمليات السبع (1.0–7.0) دون إضافة أو حذف.',
      'اتزان تام (100% Balancing) مع مدخلات ومخرجات المخطط البيئي.',
      'ترابط منظم مع 8 مخازن بيانات متطابقة مع كيانات قاعدة البيانات.',
    ],
  },
  {
    id: 'dfd1',
    order: 3,
    figureNumber: 'الشكل (3-3)',
    titleAr: 'مخطط تدفق البيانات من المستوى الأول (DFD Level 1)',
    titleEn: 'Data Flow Diagram – Level 1',
    pngFilename: '03_DFD_Level_1.png',
    svgFilename: '03_DFD_Level_1.svg',
    mmdFilename: '03_DFD_Level_1.mmd',
    drawioFilename: '03_DFD_Level_1.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'يقدم مخطط المستوى الأول (DFD Level 1) التفكيك الوظيفي الهرمي لكل عملية من العمليات السبع الرئيسية إلى 21 عملية فرعية متخصصة (1.1–1.3 وصولاً إلى 7.1–7.3). ويوضح كيفية تحول البيانات داخل كل وحدة وظيفية، مثل التحقق من الصلاحيات (RBAC)، والمسح الجغرافي (PostGIS)، والاستخلاص الضوئي (OCR)، وتوليد البصمة الرقمية (SHA-256)، واحتساب حصص المستفيدين، وإصدار الفواتير وتوزيع الغلة، ومعالجة طلبات الخدمات الإلكترونية.',
    keyHighlightsAr: [
      'ترقيم هرمي منضبط (1.1–7.3) بواقع 3 عمليات فرعية دقيقة لكل عملية رئيسية.',
      'توضيح تفاعل كل عملية فرعية مع مخازن البيانات (D1–D8) دون تداخل.',
      'دمج الجوانب الوظيفية للتقنيات المعتمدة ضمن سياق تدفق البيانات.',
    ],
  },
  {
    id: 'dfd2',
    order: 4,
    figureNumber: 'الشكل (3-4)',
    titleAr: 'مخطط تدفق البيانات من المستوى الثاني للعمليات المعقدة (DFD Level 2)',
    titleEn: 'Data Flow Diagram – Level 2 (Complex Processes)',
    pngFilename: '04_DFD_Level_2.png',
    svgFilename: '04_DFD_Level_2.svg',
    mmdFilename: '04_DFD_Level_2.mmd',
    drawioFilename: '04_DFD_Level_2.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'تم إعداد المستوى الثاني (DFD Level 2) خصيصاً للعمليتين الأكثر تعقيداً من الناحية العلمية والتقنية في المنصة، وهما: العملية الفرعية (2.2) الخاصة بالرسم والمسح الجغرافي للحدود عبر PostGIS (من استقبال الإحداثيات والتحقق الطوبولوجي ومنع التداخل حتى حساب المساحة وإسقاط WGS84)، والعملية الفرعية (3.2 / 3.3) الخاصة بالمعالجة الضوئية للوثائق العربية (OCR) وتوليد البصمة الرقمية (SHA-256) لضمان عدم التلاعب بالصكوك والحجج الوقفية.',
    keyHighlightsAr: [
      'مبرر علمياً بتعقيد التحويلات المكانية (PostGIS) والرقمية (OCR + SHA-256).',
      'تفكيك دقيق من (2.2.1–2.2.4) و(3.2.1–3.2.4) متزن مع المستوى الأول.',
      'تجنب التفكيك غير الضروري للعمليات البسيطة حفاظاً على الرصانة الأكاديمية.',
    ],
  },
  {
    id: 'cerd',
    order: 5,
    figureNumber: 'الشكل (3-5)',
    titleAr: 'مخطط الكيانات والعلاقات المفاهيمي (Conceptual ERD)',
    titleEn: 'Conceptual Entity-Relationship Diagram',
    pngFilename: '05_Conceptual_ERD.png',
    svgFilename: '05_Conceptual_ERD.svg',
    mmdFilename: '05_Conceptual_ERD.mmd',
    drawioFilename: '05_Conceptual_ERD.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'يعرض المخطط المفاهيمي للكيانات والعلاقات (Conceptual ERD) البنية التصورية المجردة لبيانات المنصة قبل التطبيع التقني الكامل. يضم الكيانات الأساسية السبعة عشر وعلاقاتها الدلالية وكارديناليتها المتنوعة، بما في ذلك علاقات واحد إلى واحد (1:1) مثل الممتلكات والقطع الجغرافية، وعلاقات واحد إلى متعدد (1:N) مثل الأوقاف والممتلكات والعقود والفواتير، وعلاقات متعدد إلى متعدد (M:N) مثل الأدوار والصلاحيات، والأوقاف والمستفيدين قبل فكها إلى جداول وسيطة.',
    keyHighlightsAr: [
      'تمثيل واضح لأنواع العلاقات الثلاث (1:1 و 1:N و M:N) بالكاردينالية القياسية.',
      'تغطية مفاهيمية شاملة لجميع مخازن البيانات (D1–D8).',
      'تجريد مناسب يفصل الدلالات المفاهيمية عن تفاصيل التنفيذ الفيزيائية.',
    ],
  },
  {
    id: 'lerd',
    order: 6,
    figureNumber: 'الشكل (3-6)',
    titleAr: 'مخطط الكيانات والعلاقات المنطقي (Logical ERD)',
    titleEn: 'Logical Entity-Relationship Diagram (PostgreSQL + PostGIS)',
    pngFilename: '06_Logical_ERD.png',
    svgFilename: '06_Logical_ERD.svg',
    mmdFilename: '06_Logical_ERD.mmd',
    drawioFilename: '06_Logical_ERD.drawio',
    orientation: 'landscape',
    academicSummaryAr:
      'يمثل المخطط المنطقي (Logical ERD) النموذج العلائقي المطبع حتى المستوى الثالث (3NF) والمتوافق مباشرة مع بيئة PostgreSQL وامتداد PostGIS. يتكون من 19 جدولاً، حيث تم فك جميع علاقات متعدد إلى متعدد عبر إنشاء الجداول الوسيطة (role_permissions و waqf_beneficiaries)، مع تحديد كافة المفاتيح الأساسية (PK) والأجنبية (FK) والقيود الفريدة (UQ) وأنواع البيانات الدقيقة مثل GEOMETRY(Polygon,4326) و CHAR(64) لبصمة SHA-256 و NUMERIC(14,2) للقيم المالية.',
    keyHighlightsAr: [
      'تطبيع كامل (3NF) عبر 19 جدولاً وفك كافة علاقات M:N بجداول وسيطة.',
      'توافق مباشر مع PostgreSQL وPostGIS وتمثيل Crow\'s Foot للكاردينالية.',
      'تطابق تام مع قاموس البيانات ومخازن بيانات مخططات DFD.',
    ],
  },
];

export interface IsolatedErdRelationshipMeta {
  id: string;
  order: number;
  figureNumber: string;
  titleAr: string;
  cardinalityLabelEn: 'One-to-One' | 'One-to-Many' | 'Many-to-Many';
  rightEntityAr: string;
  leftEntityAr: string;
  verbAr: string;
  filename: string;
}

export interface IsolatedErdEntityMeta {
  id: string;
  order: number;
  figureNumber: string;
  tableNameEn: string;
  tableNameAr: string;
  dataStoreId: string;
  attributeCount: number;
  filename: string;
}

export const ISOLATED_ERD_RELATIONSHIPS_META: IsolatedErdRelationshipMeta[] = [
  { id: 'rel-01', order: 1, figureNumber: 'الشكل (3-7)', titleAr: 'علاقة الأدوار الوظيفية بالصلاحيات', cardinalityLabelEn: 'Many-to-Many', rightEntityAr: 'الأدوار الوظيفية', leftEntityAr: 'الصلاحيات', verbAr: 'تمتلك', filename: 'R01_roles_permissions.svg' },
  { id: 'rel-02', order: 2, figureNumber: 'الشكل (3-8)', titleAr: 'علاقة الدور الوظيفي بالمستخدمين', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الأدوار الوظيفية', leftEntityAr: 'المستخدمون', verbAr: 'يُسنَد إلى', filename: 'R02_roles_users.svg' },
  { id: 'rel-03', order: 3, figureNumber: 'الشكل (3-9)', titleAr: 'علاقة المستخدم بسجلات التدقيق', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'المستخدمون', leftEntityAr: 'سجلات التدقيق', verbAr: 'يُولّد', filename: 'R03_users_audit_logs.svg' },
  { id: 'rel-04', order: 4, figureNumber: 'الشكل (3-10)', titleAr: 'علاقة الواقف بالأوقاف', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الواقفون', leftEntityAr: 'الأوقاف', verbAr: 'ينشئ', filename: 'R04_waqifs_waqfs.svg' },
  { id: 'rel-05', order: 5, figureNumber: 'الشكل (3-11)', titleAr: 'علاقة الناظر (المستخدم) بالأوقاف', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الناظر (المستخدم)', leftEntityAr: 'الأوقاف', verbAr: 'يشرف على', filename: 'R05_nazir_waqfs.svg' },
  { id: 'rel-06', order: 6, figureNumber: 'الشكل (3-12)', titleAr: 'علاقة الوقف بالممتلكات الوقفية', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الأوقاف', leftEntityAr: 'الممتلكات الوقفية', verbAr: 'يضم', filename: 'R06_waqfs_properties.svg' },
  { id: 'rel-07', order: 7, figureNumber: 'الشكل (3-13)', titleAr: 'علاقة العقار الوقفي بالقطعة الجغرافية', cardinalityLabelEn: 'One-to-One', rightEntityAr: 'الممتلكات الوقفية', leftEntityAr: 'القطع الجغرافية', verbAr: 'يُحدَّد مكانياً بـ', filename: 'R07_properties_gis_parcels.svg' },
  { id: 'rel-08', order: 8, figureNumber: 'الشكل (3-14)', titleAr: 'علاقة الوقف بالوثائق المؤرشفة', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الأوقاف', leftEntityAr: 'الوثائق الوقفية', verbAr: 'يوثَّق بـ', filename: 'R08_waqfs_documents.svg' },
  { id: 'rel-09', order: 9, figureNumber: 'الشكل (3-15)', titleAr: 'علاقة الوقف بشروط الواقفين', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الأوقاف', leftEntityAr: 'شروط الواقفين', verbAr: 'يخضع لـ', filename: 'R09_waqfs_conditions.svg' },
  { id: 'rel-10', order: 10, figureNumber: 'الشكل (3-16)', titleAr: 'علاقة الأوقاف بالمستفيدين', cardinalityLabelEn: 'Many-to-Many', rightEntityAr: 'الأوقاف', leftEntityAr: 'المستفيدون', verbAr: 'يستحق عوائده', filename: 'R10_waqfs_beneficiaries.svg' },
  { id: 'rel-11', order: 11, figureNumber: 'الشكل (3-17)', titleAr: 'علاقة الاستحقاق بصرفيات العوائد', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'استحقاقات المستفيدين', leftEntityAr: 'صرفيات العوائد', verbAr: 'يُصرَف له', filename: 'R11_entitlements_disbursements.svg' },
  { id: 'rel-12', order: 12, figureNumber: 'الشكل (3-18)', titleAr: 'علاقة المستخدم بالمستأجر', cardinalityLabelEn: 'One-to-One', rightEntityAr: 'المستخدمون', leftEntityAr: 'المستأجرون', verbAr: 'يمتلك ملف', filename: 'R12_users_tenants.svg' },
  { id: 'rel-13', order: 13, figureNumber: 'الشكل (3-19)', titleAr: 'علاقة العقار الوقفي بعقود الإيجار', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الممتلكات الوقفية', leftEntityAr: 'عقود الإيجار', verbAr: 'يُؤجَّر عبر', filename: 'R13_properties_contracts.svg' },
  { id: 'rel-14', order: 14, figureNumber: 'الشكل (3-20)', titleAr: 'علاقة المستأجر بعقود الإيجار', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'المستأجرون', leftEntityAr: 'عقود الإيجار', verbAr: 'يُبرم', filename: 'R14_tenants_contracts.svg' },
  { id: 'rel-15', order: 15, figureNumber: 'الشكل (3-21)', titleAr: 'علاقة عقد الإيجار بالفواتير المالية', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'عقود الإيجار', leftEntityAr: 'الفواتير المالية', verbAr: 'يُولّد', filename: 'R15_contracts_invoices.svg' },
  { id: 'rel-16', order: 16, figureNumber: 'الشكل (3-22)', titleAr: 'علاقة الفاتورة بعمليات التحصيل والسداد', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'الفواتير المالية', leftEntityAr: 'عمليات السداد', verbAr: 'تُسدَّد عبر', filename: 'R16_invoices_payments.svg' },
  { id: 'rel-17', order: 17, figureNumber: 'الشكل (3-23)', titleAr: 'علاقة المستخدم بالطلبات الإلكترونية', cardinalityLabelEn: 'One-to-Many', rightEntityAr: 'المستخدمون', leftEntityAr: 'الطلبات الإلكترونية', verbAr: 'يقدم', filename: 'R17_users_service_requests.svg' },
];

export const ISOLATED_ERD_ENTITIES_META: IsolatedErdEntityMeta[] = [
  { id: 'ent-01', order: 1, figureNumber: 'الشكل (3-24)', tableNameEn: 'roles', tableNameAr: 'الأدوار الوظيفية', dataStoreId: 'D1', attributeCount: 3, filename: 'E01_roles.svg' },
  { id: 'ent-02', order: 2, figureNumber: 'الشكل (3-25)', tableNameEn: 'permissions', tableNameAr: 'الصلاحيات', dataStoreId: 'D1', attributeCount: 3, filename: 'E02_permissions.svg' },
  { id: 'ent-03', order: 3, figureNumber: 'الشكل (3-26)', tableNameEn: 'role_permissions', tableNameAr: 'صلاحيات الأدوار', dataStoreId: 'D1', attributeCount: 2, filename: 'E03_role_permissions.svg' },
  { id: 'ent-04', order: 4, figureNumber: 'الشكل (3-27)', tableNameEn: 'users', tableNameAr: 'المستخدمون', dataStoreId: 'D1', attributeCount: 9, filename: 'E04_users.svg' },
  { id: 'ent-05', order: 5, figureNumber: 'الشكل (3-28)', tableNameEn: 'audit_logs', tableNameAr: 'سجلات التدقيق', dataStoreId: 'D8', attributeCount: 6, filename: 'E05_audit_logs.svg' },
  { id: 'ent-06', order: 6, figureNumber: 'الشكل (3-29)', tableNameEn: 'waqifs', tableNameAr: 'الواقفون', dataStoreId: 'D4', attributeCount: 4, filename: 'E06_waqifs.svg' },
  { id: 'ent-07', order: 7, figureNumber: 'الشكل (3-30)', tableNameEn: 'waqfs', tableNameAr: 'الأوقاف', dataStoreId: 'D2', attributeCount: 7, filename: 'E07_waqfs.svg' },
  { id: 'ent-08', order: 8, figureNumber: 'الشكل (3-31)', tableNameEn: 'properties', tableNameAr: 'الممتلكات الوقفية', dataStoreId: 'D2', attributeCount: 8, filename: 'E08_properties.svg' },
  { id: 'ent-09', order: 9, figureNumber: 'الشكل (3-32)', tableNameEn: 'gis_parcels', tableNameAr: 'القطع الجغرافية', dataStoreId: 'D2', attributeCount: 5, filename: 'E09_gis_parcels.svg' },
  { id: 'ent-10', order: 10, figureNumber: 'الشكل (3-33)', tableNameEn: 'documents', tableNameAr: 'الوثائق الوقفية', dataStoreId: 'D3', attributeCount: 9, filename: 'E10_documents.svg' },
  { id: 'ent-11', order: 11, figureNumber: 'الشكل (3-34)', tableNameEn: 'waqif_conditions', tableNameAr: 'شروط الواقفين', dataStoreId: 'D4', attributeCount: 5, filename: 'E11_waqif_conditions.svg' },
  { id: 'ent-12', order: 12, figureNumber: 'الشكل (3-35)', tableNameEn: 'beneficiaries', tableNameAr: 'المستفيدون', dataStoreId: 'D4', attributeCount: 6, filename: 'E12_beneficiaries.svg' },
  { id: 'ent-13', order: 13, figureNumber: 'الشكل (3-36)', tableNameEn: 'waqf_beneficiaries', tableNameAr: 'استحقاقات المستفيدين', dataStoreId: 'D4', attributeCount: 5, filename: 'E13_waqf_beneficiaries.svg' },
  { id: 'ent-14', order: 14, figureNumber: 'الشكل (3-37)', tableNameEn: 'tenants', tableNameAr: 'المستأجرون', dataStoreId: 'D5', attributeCount: 4, filename: 'E14_tenants.svg' },
  { id: 'ent-15', order: 15, figureNumber: 'الشكل (3-38)', tableNameEn: 'lease_contracts', tableNameAr: 'عقود الإيجار', dataStoreId: 'D5', attributeCount: 9, filename: 'E15_lease_contracts.svg' },
  { id: 'ent-16', order: 16, figureNumber: 'الشكل (3-39)', tableNameEn: 'invoices', tableNameAr: 'الفواتير المالية', dataStoreId: 'D6', attributeCount: 5, filename: 'E16_invoices.svg' },
  { id: 'ent-17', order: 17, figureNumber: 'الشكل (3-40)', tableNameEn: 'payments', tableNameAr: 'عمليات السداد', dataStoreId: 'D6', attributeCount: 6, filename: 'E17_payments.svg' },
  { id: 'ent-18', order: 18, figureNumber: 'الشكل (3-41)', tableNameEn: 'disbursements', tableNameAr: 'صرفيات العوائد', dataStoreId: 'D6', attributeCount: 5, filename: 'E18_disbursements.svg' },
  { id: 'ent-19', order: 19, figureNumber: 'الشكل (3-42)', tableNameEn: 'service_requests', tableNameAr: 'الطلبات الإلكترونية', dataStoreId: 'D7', attributeCount: 7, filename: 'E19_service_requests.svg' },
];

