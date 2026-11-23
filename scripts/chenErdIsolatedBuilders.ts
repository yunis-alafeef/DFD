import { escXml, PALETTE, wrapBidi } from './diagramBuilders';
import { getErdSvgFontsCss } from './svgFontEmbed';

const FONT_AR = 'Noto Kufi Arabic, Noto Sans Arabic, Tahoma, Arial, sans-serif';
const FONT_AR_BODY = 'Noto Sans Arabic, Noto Kufi Arabic, Tahoma, Arial, sans-serif';
const FONT_EN = 'Liberation Sans, Arial, Tahoma, sans-serif';

export interface IsolatedAttrSpec {
  fieldName: string;
  labelAr: string;
  isPk?: boolean;
  isDoubleEllipse?: boolean;
}

export interface IsolatedEntitySpec {
  id: string;
  order: number;
  figureNumber: string;
  tableNameEn: string;
  tableNameAr: string;
  dataStoreId: string;
  filename: string;
  attributes: IsolatedAttrSpec[];
}

export interface IsolatedRelationshipSpec {
  id: string;
  order: number;
  figureNumber: string;
  titleAr: string;
  cardinalityLabelEn: 'One-to-One' | 'One-to-Many' | 'Many-to-Many';
  rightEntityAr: string;
  rightEntityEn: string;
  rightCard: '1' | 'N' | 'M';
  verbAr: string;
  leftEntityAr: string;
  leftEntityEn: string;
  leftCard: '1' | 'N' | 'M';
  filename: string;
}

export const ISOLATED_ERD_RELATIONSHIPS: IsolatedRelationshipSpec[] = [
  {
    id: 'rel-01',
    order: 1,
    figureNumber: 'الشكل (3-7)',
    titleAr: 'علاقة الأدوار الوظيفية بالصلاحيات',
    cardinalityLabelEn: 'Many-to-Many',
    rightEntityAr: 'الأدوار الوظيفية',
    rightEntityEn: 'roles',
    rightCard: 'M',
    verbAr: 'تمتلك',
    leftEntityAr: 'الصلاحيات',
    leftEntityEn: 'permissions',
    leftCard: 'N',
    filename: 'R01_roles_permissions.svg',
  },
  {
    id: 'rel-02',
    order: 2,
    figureNumber: 'الشكل (3-8)',
    titleAr: 'علاقة الدور الوظيفي بالمستخدمين',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الأدوار الوظيفية',
    rightEntityEn: 'roles',
    rightCard: '1',
    verbAr: 'يُسنَد إلى',
    leftEntityAr: 'المستخدمون',
    leftEntityEn: 'users',
    leftCard: 'N',
    filename: 'R02_roles_users.svg',
  },
  {
    id: 'rel-03',
    order: 3,
    figureNumber: 'الشكل (3-9)',
    titleAr: 'علاقة المستخدم بسجلات التدقيق',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'المستخدمون',
    rightEntityEn: 'users',
    rightCard: '1',
    verbAr: 'يُولّد',
    leftEntityAr: 'سجلات التدقيق',
    leftEntityEn: 'audit_logs',
    leftCard: 'N',
    filename: 'R03_users_audit_logs.svg',
  },
  {
    id: 'rel-04',
    order: 4,
    figureNumber: 'الشكل (3-10)',
    titleAr: 'علاقة الواقف بالأوقاف',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الواقفون',
    rightEntityEn: 'waqifs',
    rightCard: '1',
    verbAr: 'ينشئ',
    leftEntityAr: 'الأوقاف',
    leftEntityEn: 'waqfs',
    leftCard: 'N',
    filename: 'R04_waqifs_waqfs.svg',
  },
  {
    id: 'rel-05',
    order: 5,
    figureNumber: 'الشكل (3-11)',
    titleAr: 'علاقة الناظر (المستخدم) بالأوقاف',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الناظر (المستخدم)',
    rightEntityEn: 'users',
    rightCard: '1',
    verbAr: 'يشرف على',
    leftEntityAr: 'الأوقاف',
    leftEntityEn: 'waqfs',
    leftCard: 'N',
    filename: 'R05_nazir_waqfs.svg',
  },
  {
    id: 'rel-06',
    order: 6,
    figureNumber: 'الشكل (3-12)',
    titleAr: 'علاقة الوقف بالممتلكات الوقفية',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الأوقاف',
    rightEntityEn: 'waqfs',
    rightCard: '1',
    verbAr: 'يضم',
    leftEntityAr: 'الممتلكات الوقفية',
    leftEntityEn: 'properties',
    leftCard: 'N',
    filename: 'R06_waqfs_properties.svg',
  },
  {
    id: 'rel-07',
    order: 7,
    figureNumber: 'الشكل (3-13)',
    titleAr: 'علاقة العقار الوقفي بالقطعة الجغرافية',
    cardinalityLabelEn: 'One-to-One',
    rightEntityAr: 'الممتلكات الوقفية',
    rightEntityEn: 'properties',
    rightCard: '1',
    verbAr: 'يُحدَّد مكانياً بـ',
    leftEntityAr: 'القطع الجغرافية',
    leftEntityEn: 'gis_parcels',
    leftCard: '1',
    filename: 'R07_properties_gis_parcels.svg',
  },
  {
    id: 'rel-08',
    order: 8,
    figureNumber: 'الشكل (3-14)',
    titleAr: 'علاقة الوقف بالوثائق المؤرشفة',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الأوقاف',
    rightEntityEn: 'waqfs',
    rightCard: '1',
    verbAr: 'يوثَّق بـ',
    leftEntityAr: 'الوثائق الوقفية',
    leftEntityEn: 'documents',
    leftCard: 'N',
    filename: 'R08_waqfs_documents.svg',
  },
  {
    id: 'rel-09',
    order: 9,
    figureNumber: 'الشكل (3-15)',
    titleAr: 'علاقة الوقف بشروط الواقفين',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الأوقاف',
    rightEntityEn: 'waqfs',
    rightCard: '1',
    verbAr: 'يخضع لـ',
    leftEntityAr: 'شروط الواقفين',
    leftEntityEn: 'waqif_conditions',
    leftCard: 'N',
    filename: 'R09_waqfs_conditions.svg',
  },
  {
    id: 'rel-10',
    order: 10,
    figureNumber: 'الشكل (3-16)',
    titleAr: 'علاقة الأوقاف بالمستفيدين',
    cardinalityLabelEn: 'Many-to-Many',
    rightEntityAr: 'الأوقاف',
    rightEntityEn: 'waqfs',
    rightCard: 'M',
    verbAr: 'يستحق عوائده',
    leftEntityAr: 'المستفيدون',
    leftEntityEn: 'beneficiaries',
    leftCard: 'N',
    filename: 'R10_waqfs_beneficiaries.svg',
  },
  {
    id: 'rel-11',
    order: 11,
    figureNumber: 'الشكل (3-17)',
    titleAr: 'علاقة الاستحقاق بصرفيات العوائد',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'استحقاقات المستفيدين',
    rightEntityEn: 'waqf_beneficiaries',
    rightCard: '1',
    verbAr: 'يُصرَف له',
    leftEntityAr: 'صرفيات العوائد',
    leftEntityEn: 'disbursements',
    leftCard: 'N',
    filename: 'R11_entitlements_disbursements.svg',
  },
  {
    id: 'rel-12',
    order: 12,
    figureNumber: 'الشكل (3-18)',
    titleAr: 'علاقة المستخدم بالمستأجر',
    cardinalityLabelEn: 'One-to-One',
    rightEntityAr: 'المستخدمون',
    rightEntityEn: 'users',
    rightCard: '1',
    verbAr: 'يمتلك ملف',
    leftEntityAr: 'المستأجرون',
    leftEntityEn: 'tenants',
    leftCard: '1',
    filename: 'R12_users_tenants.svg',
  },
  {
    id: 'rel-13',
    order: 13,
    figureNumber: 'الشكل (3-19)',
    titleAr: 'علاقة العقار الوقفي بعقود الإيجار',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الممتلكات الوقفية',
    rightEntityEn: 'properties',
    rightCard: '1',
    verbAr: 'يُؤجَّر عبر',
    leftEntityAr: 'عقود الإيجار',
    leftEntityEn: 'lease_contracts',
    leftCard: 'N',
    filename: 'R13_properties_contracts.svg',
  },
  {
    id: 'rel-14',
    order: 14,
    figureNumber: 'الشكل (3-20)',
    titleAr: 'علاقة المستأجر بعقود الإيجار',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'المستأجرون',
    rightEntityEn: 'tenants',
    rightCard: '1',
    verbAr: 'يُبرم',
    leftEntityAr: 'عقود الإيجار',
    leftEntityEn: 'lease_contracts',
    leftCard: 'N',
    filename: 'R14_tenants_contracts.svg',
  },
  {
    id: 'rel-15',
    order: 15,
    figureNumber: 'الشكل (3-21)',
    titleAr: 'علاقة عقد الإيجار بالفواتير المالية',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'عقود الإيجار',
    rightEntityEn: 'lease_contracts',
    rightCard: '1',
    verbAr: 'يُولّد',
    leftEntityAr: 'الفواتير المالية',
    leftEntityEn: 'invoices',
    leftCard: 'N',
    filename: 'R15_contracts_invoices.svg',
  },
  {
    id: 'rel-16',
    order: 16,
    figureNumber: 'الشكل (3-22)',
    titleAr: 'علاقة الفاتورة بعمليات التحصيل والسداد',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'الفواتير المالية',
    rightEntityEn: 'invoices',
    rightCard: '1',
    verbAr: 'تُسدَّد عبر',
    leftEntityAr: 'عمليات السداد',
    leftEntityEn: 'payments',
    leftCard: 'N',
    filename: 'R16_invoices_payments.svg',
  },
  {
    id: 'rel-17',
    order: 17,
    figureNumber: 'الشكل (3-23)',
    titleAr: 'علاقة المستخدم بالطلبات الإلكترونية',
    cardinalityLabelEn: 'One-to-Many',
    rightEntityAr: 'المستخدمون',
    rightEntityEn: 'users',
    rightCard: '1',
    verbAr: 'يقدم',
    leftEntityAr: 'الطلبات الإلكترونية',
    leftEntityEn: 'service_requests',
    leftCard: 'N',
    filename: 'R17_users_service_requests.svg',
  },
];

export const ISOLATED_ERD_ENTITIES: IsolatedEntitySpec[] = [
  {
    id: 'ent-01',
    order: 1,
    figureNumber: 'الشكل (3-24)',
    tableNameEn: 'roles',
    tableNameAr: 'الأدوار الوظيفية',
    dataStoreId: 'D1',
    filename: 'E01_roles.svg',
    attributes: [
      { fieldName: 'role_id', labelAr: 'رقم الدور الوظيفي', isPk: true },
      { fieldName: 'role_name', labelAr: 'اسم الدور الوظيفي', isDoubleEllipse: true },
      { fieldName: 'description', labelAr: 'وصف الدور' },
    ],
  },
  {
    id: 'ent-02',
    order: 2,
    figureNumber: 'الشكل (3-25)',
    tableNameEn: 'permissions',
    tableNameAr: 'الصلاحيات',
    dataStoreId: 'D1',
    filename: 'E02_permissions.svg',
    attributes: [
      { fieldName: 'permission_id', labelAr: 'رقم الصلاحية', isPk: true },
      { fieldName: 'permission_code', labelAr: 'الرمز البرمجي للصلاحية', isDoubleEllipse: true },
      { fieldName: 'module_name', labelAr: 'الوحدة الوظيفية' },
    ],
  },
  {
    id: 'ent-03',
    order: 3,
    figureNumber: 'الشكل (3-26)',
    tableNameEn: 'role_permissions',
    tableNameAr: 'صلاحيات الأدوار',
    dataStoreId: 'D1',
    filename: 'E03_role_permissions.svg',
    attributes: [
      { fieldName: 'role_id', labelAr: 'رقم الدور الوظيفي', isPk: true },
      { fieldName: 'permission_id', labelAr: 'رقم الصلاحية', isPk: true },
    ],
  },
  {
    id: 'ent-04',
    order: 4,
    figureNumber: 'الشكل (3-27)',
    tableNameEn: 'users',
    tableNameAr: 'المستخدمون',
    dataStoreId: 'D1',
    filename: 'E04_users.svg',
    attributes: [
      { fieldName: 'user_id', labelAr: 'رقم المستخدم', isPk: true },
      { fieldName: 'role_id', labelAr: 'رقم الدور' },
      { fieldName: 'full_name', labelAr: 'الاسم الكامل' },
      { fieldName: 'national_id', labelAr: 'رقم الهوية الوطنية', isDoubleEllipse: true },
      { fieldName: 'email', labelAr: 'البريد الإلكتروني', isDoubleEllipse: true },
      { fieldName: 'phone', labelAr: 'رقم الهاتف', isDoubleEllipse: true },
      { fieldName: 'password_hash', labelAr: 'كلمة المرور المشفرة' },
      { fieldName: 'is_active', labelAr: 'حالة التفعيل' },
      { fieldName: 'created_at', labelAr: 'تاريخ الإنشاء' },
    ],
  },
  {
    id: 'ent-05',
    order: 5,
    figureNumber: 'الشكل (3-28)',
    tableNameEn: 'audit_logs',
    tableNameAr: 'سجلات التدقيق',
    dataStoreId: 'D8',
    filename: 'E05_audit_logs.svg',
    attributes: [
      { fieldName: 'log_id', labelAr: 'رقم سجل التدقيق', isPk: true },
      { fieldName: 'user_id', labelAr: 'رقم المستخدم' },
      { fieldName: 'action_type', labelAr: 'نوع العملية' },
      { fieldName: 'target_table', labelAr: 'الكيان المستهدف' },
      { fieldName: 'record_id', labelAr: 'معرف السجل' },
      { fieldName: 'created_at', labelAr: 'وقت الحدث' },
    ],
  },
  {
    id: 'ent-06',
    order: 6,
    figureNumber: 'الشكل (3-29)',
    tableNameEn: 'waqifs',
    tableNameAr: 'الواقفون',
    dataStoreId: 'D4',
    filename: 'E06_waqifs.svg',
    attributes: [
      { fieldName: 'waqif_id', labelAr: 'رقم الواقف', isPk: true },
      { fieldName: 'full_name', labelAr: 'اسم الواقف' },
      { fieldName: 'national_id', labelAr: 'رقم الهوية المرجعي', isDoubleEllipse: true },
      { fieldName: 'waqf_date', labelAr: 'تاريخ إنشاء الوقف' },
    ],
  },
  {
    id: 'ent-07',
    order: 7,
    figureNumber: 'الشكل (3-30)',
    tableNameEn: 'waqfs',
    tableNameAr: 'الأوقاف',
    dataStoreId: 'D2',
    filename: 'E07_waqfs.svg',
    attributes: [
      { fieldName: 'waqf_id', labelAr: 'رقم الوقف', isPk: true },
      { fieldName: 'waqif_id', labelAr: 'رقم الواقف' },
      { fieldName: 'nazir_user_id', labelAr: 'رقم الناظر المسؤول' },
      { fieldName: 'waqf_name', labelAr: 'اسم الوقف' },
      { fieldName: 'waqf_type', labelAr: 'نوع الوقف' },
      { fieldName: 'deed_number', labelAr: 'رقم صك الوقفية', isDoubleEllipse: true },
      { fieldName: 'status', labelAr: 'حالة الوقف' },
    ],
  },
  {
    id: 'ent-08',
    order: 8,
    figureNumber: 'الشكل (3-31)',
    tableNameEn: 'properties',
    tableNameAr: 'الممتلكات الوقفية',
    dataStoreId: 'D2',
    filename: 'E08_properties.svg',
    attributes: [
      { fieldName: 'property_id', labelAr: 'رقم العقار الوقفي', isPk: true },
      { fieldName: 'waqf_id', labelAr: 'رقم الوقف' },
      { fieldName: 'property_code', labelAr: 'رمز الحصر العقاري', isDoubleEllipse: true },
      { fieldName: 'property_type', labelAr: 'تصنيف العقار' },
      { fieldName: 'address', labelAr: 'العنوان الوطني', isDoubleEllipse: true },
      { fieldName: 'area_sqm', labelAr: 'المساحة (م²)' },
      { fieldName: 'estimated_value', labelAr: 'القيمة التقديرية' },
      { fieldName: 'status', labelAr: 'الحالة التشغيلية' },
    ],
  },
  {
    id: 'ent-09',
    order: 9,
    figureNumber: 'الشكل (3-32)',
    tableNameEn: 'gis_parcels',
    tableNameAr: 'القطع الجغرافية',
    dataStoreId: 'D2',
    filename: 'E09_gis_parcels.svg',
    attributes: [
      { fieldName: 'parcel_id', labelAr: 'رقم القطعة الجغرافية', isPk: true },
      { fieldName: 'property_id', labelAr: 'رقم العقار الوقفي', isDoubleEllipse: true },
      { fieldName: 'boundary_geom', labelAr: 'المضلع الجغرافي PostGIS', isDoubleEllipse: true },
      { fieldName: 'centroid_point', labelAr: 'نقطة المركز الهندسي', isDoubleEllipse: true },
      { fieldName: 'survey_date', labelAr: 'تاريخ المسح الميداني' },
    ],
  },
  {
    id: 'ent-10',
    order: 10,
    figureNumber: 'الشكل (3-33)',
    tableNameEn: 'documents',
    tableNameAr: 'الوثائق الوقفية',
    dataStoreId: 'D3',
    filename: 'E10_documents.svg',
    attributes: [
      { fieldName: 'document_id', labelAr: 'رقم الوثيقة', isPk: true },
      { fieldName: 'waqf_id', labelAr: 'رقم الوقف' },
      { fieldName: 'property_id', labelAr: 'رقم العقار' },
      { fieldName: 'uploaded_by', labelAr: 'الموظف الرافع' },
      { fieldName: 'doc_type', labelAr: 'نوع الوثيقة' },
      { fieldName: 'file_path', labelAr: 'مسار الملف الرقمي' },
      { fieldName: 'sha256_hash', labelAr: 'البصمة SHA-256', isDoubleEllipse: true },
      { fieldName: 'ocr_text', labelAr: 'النص المستخلص OCR' },
      { fieldName: 'archived_at', labelAr: 'تاريخ الأرشفة' },
    ],
  },
  {
    id: 'ent-11',
    order: 11,
    figureNumber: 'الشكل (3-34)',
    tableNameEn: 'waqif_conditions',
    tableNameAr: 'شروط الواقفين',
    dataStoreId: 'D4',
    filename: 'E11_waqif_conditions.svg',
    attributes: [
      { fieldName: 'condition_id', labelAr: 'رقم الشرط', isPk: true },
      { fieldName: 'waqf_id', labelAr: 'رقم الوقف' },
      { fieldName: 'condition_title', labelAr: 'عنوان الشرط' },
      { fieldName: 'condition_text', labelAr: 'النص الشرعي للشرط' },
      { fieldName: 'priority_order', labelAr: 'أولوية التنفيذ' },
    ],
  },
  {
    id: 'ent-12',
    order: 12,
    figureNumber: 'الشكل (3-35)',
    tableNameEn: 'beneficiaries',
    tableNameAr: 'المستفيدون',
    dataStoreId: 'D4',
    filename: 'E12_beneficiaries.svg',
    attributes: [
      { fieldName: 'beneficiary_id', labelAr: 'رقم المستفيد', isPk: true },
      { fieldName: 'user_id', labelAr: 'رقم المستخدم', isDoubleEllipse: true },
      { fieldName: 'full_name', labelAr: 'اسم المستفيد' },
      { fieldName: 'national_id', labelAr: 'رقم الهوية الوطنية', isDoubleEllipse: true },
      { fieldName: 'category', labelAr: 'فئة الاستحقاق' },
      { fieldName: 'bank_iban', labelAr: 'رقم الآيبان المصرفي', isDoubleEllipse: true },
    ],
  },
  {
    id: 'ent-13',
    order: 13,
    figureNumber: 'الشكل (3-36)',
    tableNameEn: 'waqf_beneficiaries',
    tableNameAr: 'استحقاقات المستفيدين',
    dataStoreId: 'D4',
    filename: 'E13_waqf_beneficiaries.svg',
    attributes: [
      { fieldName: 'entitlement_id', labelAr: 'رقم الاستحقاق', isPk: true },
      { fieldName: 'waqf_id', labelAr: 'رقم الوقف' },
      { fieldName: 'beneficiary_id', labelAr: 'رقم المستفيد' },
      { fieldName: 'condition_id', labelAr: 'رقم الشرط' },
      { fieldName: 'share_percentage', labelAr: 'نسبة الاستحقاق (%)' },
    ],
  },
  {
    id: 'ent-14',
    order: 14,
    figureNumber: 'الشكل (3-37)',
    tableNameEn: 'tenants',
    tableNameAr: 'المستأجرون',
    dataStoreId: 'D5',
    filename: 'E14_tenants.svg',
    attributes: [
      { fieldName: 'tenant_id', labelAr: 'رقم المستأجر', isPk: true },
      { fieldName: 'user_id', labelAr: 'رقم المستخدم', isDoubleEllipse: true },
      { fieldName: 'full_name', labelAr: 'اسم المستأجر' },
      { fieldName: 'national_id_or_cr', labelAr: 'الهوية أو السجل التجاري', isDoubleEllipse: true },
    ],
  },
  {
    id: 'ent-15',
    order: 15,
    figureNumber: 'الشكل (3-38)',
    tableNameEn: 'lease_contracts',
    tableNameAr: 'عقود الإيجار',
    dataStoreId: 'D5',
    filename: 'E15_lease_contracts.svg',
    attributes: [
      { fieldName: 'contract_id', labelAr: 'رقم العقد', isPk: true },
      { fieldName: 'property_id', labelAr: 'رقم العقار' },
      { fieldName: 'tenant_id', labelAr: 'رقم المستأجر' },
      { fieldName: 'approved_by', labelAr: 'المعتمد للعقد' },
      { fieldName: 'contract_number', labelAr: 'الرقم المرجعي للعقد', isDoubleEllipse: true },
      { fieldName: 'start_date', labelAr: 'تاريخ البداية' },
      { fieldName: 'end_date', labelAr: 'تاريخ النهاية' },
      { fieldName: 'annual_rent', labelAr: 'الأجرة السنوية' },
      { fieldName: 'contract_status', labelAr: 'حالة العقد' },
    ],
  },
  {
    id: 'ent-16',
    order: 16,
    figureNumber: 'الشكل (3-39)',
    tableNameEn: 'invoices',
    tableNameAr: 'الفواتير المالية',
    dataStoreId: 'D6',
    filename: 'E16_invoices.svg',
    attributes: [
      { fieldName: 'invoice_id', labelAr: 'رقم الفاتورة', isPk: true },
      { fieldName: 'contract_id', labelAr: 'رقم العقد' },
      { fieldName: 'due_date', labelAr: 'تاريخ الاستحقاق' },
      { fieldName: 'amount_due', labelAr: 'المبلغ المستحق' },
      { fieldName: 'invoice_status', labelAr: 'حالة الفاتورة' },
    ],
  },
  {
    id: 'ent-17',
    order: 17,
    figureNumber: 'الشكل (3-40)',
    tableNameEn: 'payments',
    tableNameAr: 'عمليات السداد',
    dataStoreId: 'D6',
    filename: 'E17_payments.svg',
    attributes: [
      { fieldName: 'payment_id', labelAr: 'رقم السداد', isPk: true },
      { fieldName: 'invoice_id', labelAr: 'رقم الفاتورة' },
      { fieldName: 'collected_by', labelAr: 'رقم المحصل' },
      { fieldName: 'amount_paid', labelAr: 'المبلغ المدفوع' },
      { fieldName: 'payment_date', labelAr: 'تاريخ السداد' },
      { fieldName: 'receipt_number', labelAr: 'رقم سند القبض', isDoubleEllipse: true },
    ],
  },
  {
    id: 'ent-18',
    order: 18,
    figureNumber: 'الشكل (3-41)',
    tableNameEn: 'disbursements',
    tableNameAr: 'صرفيات العوائد',
    dataStoreId: 'D6',
    filename: 'E18_disbursements.svg',
    attributes: [
      { fieldName: 'disbursement_id', labelAr: 'رقم الصرفية', isPk: true },
      { fieldName: 'entitlement_id', labelAr: 'رقم الاستحقاق' },
      { fieldName: 'approved_by', labelAr: 'المعتمد للصرف' },
      { fieldName: 'amount', labelAr: 'المبلغ المصروف' },
      { fieldName: 'disbursement_date', labelAr: 'تاريخ الصرف' },
    ],
  },
  {
    id: 'ent-19',
    order: 19,
    figureNumber: 'الشكل (3-42)',
    tableNameEn: 'service_requests',
    tableNameAr: 'الطلبات الإلكترونية',
    dataStoreId: 'D7',
    filename: 'E19_service_requests.svg',
    attributes: [
      { fieldName: 'request_id', labelAr: 'رقم الطلب', isPk: true },
      { fieldName: 'requester_user_id', labelAr: 'مقدم الطلب' },
      { fieldName: 'property_id', labelAr: 'رقم العقار' },
      { fieldName: 'handled_by', labelAr: 'الموظف المعالج' },
      { fieldName: 'request_type', labelAr: 'نوع الطلب' },
      { fieldName: 'request_status', labelAr: 'حالة الطلب' },
      { fieldName: 'submitted_at', labelAr: 'تاريخ التقديم' },
    ],
  },
];

// ============================================================================
// BUILDER 1: ISOLATED BINARY RELATIONSHIP SVG (Matching PDF Pages 3–5)
// ============================================================================
export function buildIsolatedRelationshipSvg(rel: IsolatedRelationshipSpec): string {
  const W = 940;
  const H = 310;
  const cy = 160;

  // Entity boxes: Right = Subject (RTL), Left = Target
  const rightBoxX = 635;
  const leftBoxX = 85;
  const boxW = 220;
  const boxH = 70;
  const boxY = cy - boxH / 2;

  // Center Diamond
  const diaCx = W / 2;
  const diaRx = 86;
  const diaRy = 46;

  // Connector endpoints
  const rightLineStart = diaCx + diaRx; // 556
  const rightLineEnd = rightBoxX; // 635
  const leftLineStart = diaCx - diaRx; // 384
  const leftLineEnd = leftBoxX + boxW; // 305

  // Cardinality markers
  const drawRightCard = () => {
    if (rel.rightCard === '1') {
      const tx = rightLineEnd - 22;
      return `
        <line x1="${tx}" y1="${cy - 14}" x2="${tx}" y2="${cy + 14}" stroke="${PALETTE.navy}" stroke-width="2.2" />
        <text x="${tx}" y="${cy - 20}" text-anchor="middle" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.teal}">1</text>
      `;
    }
    // Crow's foot opening toward right entity box (explicit <line> elements for clean Word shape conversion)
    const forkTipX = rightLineEnd - 24;
    return `
      <line x1="${rightLineEnd}" y1="${cy - 13}" x2="${forkTipX}" y2="${cy}" stroke="${PALETTE.navy}" stroke-width="2" />
      <line x1="${forkTipX}" y1="${cy}" x2="${rightLineEnd}" y2="${cy + 13}" stroke="${PALETTE.navy}" stroke-width="2" />
      <text x="${forkTipX - 2}" y="${cy - 18}" text-anchor="middle" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.teal}">${rel.rightCard}</text>
    `;
  };

  const drawLeftCard = () => {
    if (rel.leftCard === '1') {
      const tx = leftLineEnd + 22;
      return `
        <line x1="${tx}" y1="${cy - 14}" x2="${tx}" y2="${cy + 14}" stroke="${PALETTE.navy}" stroke-width="2.2" />
        <text x="${tx}" y="${cy - 20}" text-anchor="middle" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.teal}">1</text>
      `;
    }
    // Crow's foot opening toward left entity box (explicit <line> elements for clean Word shape conversion)
    const forkTipX = leftLineEnd + 24;
    return `
      <line x1="${leftLineEnd}" y1="${cy - 13}" x2="${forkTipX}" y2="${cy}" stroke="${PALETTE.navy}" stroke-width="2" />
      <line x1="${forkTipX}" y1="${cy}" x2="${leftLineEnd}" y2="${cy + 13}" stroke="${PALETTE.navy}" stroke-width="2" />
      <text x="${forkTipX + 2}" y="${cy - 18}" text-anchor="middle" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.teal}">${rel.leftCard}</text>
    `;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">
  <defs>
    <style type="text/css"><![CDATA[
${getErdSvgFontsCss()}
    ]]></style>
  </defs>
  <rect width="${W}" height="${H}" fill="#FFFFFF" />
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="8" fill="none" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />

  <!-- Top Academic Heading (PDF Page 3–5 style) -->
  <text x="${W / 2}" y="54" text-anchor="middle" font-family="${FONT_AR}" font-size="17" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(`${rel.order}- ${rel.titleAr} (${rel.cardinalityLabelEn})`))}</text>

  <!-- Connector Lines -->
  <line x1="${rightLineStart}" y1="${cy}" x2="${rightLineEnd}" y2="${cy}" stroke="${PALETTE.navy}" stroke-width="2" />
  <line x1="${leftLineStart}" y1="${cy}" x2="${leftLineEnd}" y2="${cy}" stroke="${PALETTE.navy}" stroke-width="2" />

  <!-- Cardinality Markers -->
  ${drawRightCard()}
  ${drawLeftCard()}

  <!-- Right Entity Rectangle -->
  <rect x="${rightBoxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="4" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="2.2" />
  <text x="${rightBoxX + boxW / 2}" y="${cy - 2}" text-anchor="middle" font-family="${FONT_AR}" font-size="16" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(rel.rightEntityAr))}</text>
  <text x="${rightBoxX + boxW / 2}" y="${cy + 20}" text-anchor="middle" font-family="${FONT_EN}" font-size="11.5" fill="${PALETTE.slateMuted}">${escXml(rel.rightEntityEn)}</text>

  <!-- Center Chen Diamond -->
  <polygon points="${diaCx},${cy - diaRy} ${diaCx + diaRx},${cy} ${diaCx},${cy + diaRy} ${diaCx - diaRx},${cy}" fill="${PALETTE.surfaceLight}" stroke="${PALETTE.navy}" stroke-width="2.2" />
  <text x="${diaCx}" y="${cy + 6}" text-anchor="middle" font-family="${FONT_AR}" font-size="15.5" font-weight="bold" fill="${PALETTE.navy}">${escXml(wrapBidi(rel.verbAr))}</text>

  <!-- Left Entity Rectangle -->
  <rect x="${leftBoxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="4" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="2.2" />
  <text x="${leftBoxX + boxW / 2}" y="${cy - 2}" text-anchor="middle" font-family="${FONT_AR}" font-size="16" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(rel.leftEntityAr))}</text>
  <text x="${leftBoxX + boxW / 2}" y="${cy + 20}" text-anchor="middle" font-family="${FONT_EN}" font-size="11.5" fill="${PALETTE.slateMuted}">${escXml(rel.leftEntityEn)}</text>

  <!-- Bottom Academic Caption -->
  <text x="${W / 2}" y="${H - 36}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="14.5" font-weight="600" fill="${PALETTE.slateMid}">${escXml(wrapBidi(`${rel.figureNumber}: ${rel.titleAr}`))}</text>
</svg>
`;
}

// ============================================================================
// BUILDER 2: ISOLATED CHEN ENTITY-WITH-ATTRIBUTES SVG (Matching PDF Pages 5–8)
// ============================================================================
interface PlacedAttr {
  attr: IsolatedAttrSpec;
  lines: string[];
  x: number;
  y: number;
  rx: number;
  ry: number;
}

function splitArabicLabel(label: string): string[] {
  if (label.length <= 18) return [label];
  const words = label.split(/\s+/);
  if (words.length <= 1) return [label];
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');
  return [line1, line2];
}

export function buildIsolatedEntitySvg(entity: IsolatedEntitySpec): string {
  const n = entity.attributes.length;

  // Adaptive canvas so small and large entities both look balanced & legible
  const W = n <= 4 ? 920 : n <= 6 ? 1080 : 1220;
  const H = n <= 4 ? 470 : n <= 6 ? 560 : 640;

  const entW = 240;
  const entH = 64;
  const entCx = W / 2;
  const entY = H - 140;
  const entCy = entY + entH / 2;

  // Fan arc radii
  const arcOriginY = entY + 12;
  const baseRx = n <= 3 ? 280 : n <= 4 ? 340 : n <= 6 ? 410 : 480;
  const baseRy = n <= 4 ? 225 : n <= 6 ? 290 : 345;

  // Symmetric angle range (in radians, from left 172deg down to right 8deg)
  const startDeg = n <= 3 ? 138 : n === 4 ? 152 : n <= 6 ? 166 : 173;
  const endDeg = 180 - startDeg;

  const placed: PlacedAttr[] = entity.attributes.map((attr, idx) => {
    const t = n === 1 ? 0.5 : idx / (n - 1);
    // Reverse order so PK (idx 0) sits cleanly on the bottom-right side like PDF (شكل 3-16..3-24)
    const angleDeg = endDeg + t * (startDeg - endDeg);
    const rad = (angleDeg * Math.PI) / 180;

    // Gentle radial staggering for >= 6 attributes to match PDF crown spacing
    const radialFactor = n >= 6 ? (idx % 2 === 0 ? 0.87 : 1.04) : 1.0;

    const lines = attr.isPk ? [attr.labelAr] : splitArabicLabel(attr.labelAr);
    const maxChars = Math.max(...lines.map((l) => l.length));
    const rx = Math.max(76, Math.round(maxChars * 4.2 + 34));
    const ry = lines.length > 1 ? 34 : 27;

    const x = entCx + baseRx * radialFactor * Math.cos(rad);
    const y = arcOriginY - baseRy * radialFactor * Math.sin(rad);

    return { attr, lines, x, y, rx, ry };
  });

  // Iterative collision-free relaxation pass (zero overlapping ellipses guaranteed)
  const marginX = 32;
  const marginTop = 36;
  for (let iter = 0; iter < 260; iter++) {
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i];
        const b = placed[j];
        const minDx = a.rx + b.rx + (a.attr.isDoubleEllipse || b.attr.isDoubleEllipse ? 26 : 18);
        const minDy = a.ry + b.ry + 18;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDx < minDx && absDy < minDy) {
          const overlapX = minDx - absDx;
          const overlapY = minDy - absDy;
          if (overlapX < overlapY) {
            const signX = dx >= 0 ? 1 : -1;
            const push = overlapX * 0.35;
            a.x -= signX * push;
            b.x += signX * push;
          } else {
            const signY = dy >= 0 ? 1 : -1;
            const push = overlapY * 0.35;
            a.y -= signY * push;
            b.y += signY * push;
          }
        }
      }
    }

    // Repel from entity rectangle & clamp within canvas bounds
    for (const p of placed) {
      const padOuter = p.attr.isDoubleEllipse ? 8 : 0;
      const minX = marginX + p.rx + padOuter;
      const maxX = W - marginX - p.rx - padOuter;
      const minY = marginTop + p.ry + padOuter;
      const maxY = entY - p.ry - 34;

      if (p.x < minX) p.x = minX;
      if (p.x > maxX) p.x = maxX;
      if (p.y < minY) p.y = minY;
      if (p.y > maxY) p.y = maxY;
    }
  }

  // Build SVG layers (connectors underneath -> entity box & ellipses on top)
  const linesSvg = placed
    .map(
      (p) =>
        `<line x1="${entCx}" y1="${entCy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${PALETTE.navy}" stroke-width="1.5" />`
    )
    .join('\n  ');

  const ellipsesSvg = placed
    .map((p) => {
      const cx = p.x.toFixed(1);
      const cy = p.y.toFixed(1);
      const outer = p.attr.isDoubleEllipse
        ? `<ellipse cx="${cx}" cy="${cy}" rx="${p.rx + 6}" ry="${p.ry + 5}" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="1.6" />`
        : '';
      const inner = `<ellipse cx="${cx}" cy="${cy}" rx="${p.rx}" ry="${p.ry}" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="1.8" />`;

      let textSvg = '';
      if (p.lines.length === 1) {
        textSvg = `<text x="${cx}" y="${(p.y + 5).toFixed(1)}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="13.5" font-weight="${p.attr.isPk ? 'bold' : '600'}" fill="${PALETTE.slateDark}">${escXml(wrapBidi(p.lines[0]))}</text>`;
      } else {
        textSvg = `
          <text x="${cx}" y="${(p.y - 4).toFixed(1)}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="13" font-weight="600" fill="${PALETTE.slateDark}">${escXml(wrapBidi(p.lines[0]))}</text>
          <text x="${cx}" y="${(p.y + 15).toFixed(1)}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="13" font-weight="600" fill="${PALETTE.slateDark}">${escXml(wrapBidi(p.lines[1]))}</text>
        `;
      }

      // Explicit crisp underline beneath PK text (guarantees visibility in all SVG viewers)
      let pkUnderline = '';
      if (p.attr.isPk) {
        const halfUl = Math.min(p.rx - 18, Math.round(p.lines[0].length * 3.8 + 10));
        const ulY = (p.y + 12).toFixed(1);
        pkUnderline = `<line x1="${(p.x - halfUl).toFixed(1)}" y1="${ulY}" x2="${(p.x + halfUl).toFixed(1)}" y2="${ulY}" stroke="${PALETTE.slateDark}" stroke-width="1.5" />`;
      }

      return `<g class="chen-attr">
    ${outer}
    ${inner}
    ${textSvg}
    ${pkUnderline}
  </g>`;
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">
  <defs>
    <style type="text/css"><![CDATA[
${getErdSvgFontsCss()}
    ]]></style>
  </defs>
  <rect width="${W}" height="${H}" fill="#FFFFFF" />
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="8" fill="none" stroke="${PALETTE.borderSubtle}" stroke-width="1.2" />

  <!-- Radiating Connector Lines -->
  ${linesSvg}

  <!-- Central Entity Rectangle at Bottom -->
  <rect x="${entCx - entW / 2}" y="${entY}" width="${entW}" height="${entH}" rx="4" fill="#FFFFFF" stroke="${PALETTE.navy}" stroke-width="2.4" />
  <text x="${entCx}" y="${entY + 28}" text-anchor="middle" font-family="${FONT_AR}" font-size="16" font-weight="bold" fill="${PALETTE.slateDark}">${escXml(wrapBidi(entity.tableNameAr))}</text>
  <text x="${entCx}" y="${entY + 49}" text-anchor="middle" font-family="${FONT_EN}" font-size="12" font-weight="bold" fill="${PALETTE.teal}">${escXml(entity.tableNameEn)}</text>

  <!-- Attribute Ellipses -->
  ${ellipsesSvg}

  <!-- Bottom Academic Figure Caption -->
  <text x="${entCx}" y="${H - 36}" text-anchor="middle" font-family="${FONT_AR_BODY}" font-size="15" font-weight="bold" fill="${PALETTE.slateMid}">${escXml(wrapBidi(`${entity.figureNumber}: كيان ${entity.tableNameAr} (${entity.tableNameEn})`))}</text>
</svg>
`;
}
