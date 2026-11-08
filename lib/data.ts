export type Practice = { title: string; text: string; tags: string[]; image: string; art: ArtKind };
export type ArtKind = 'city' | 'contract' | 'family' | 'gavel' | 'house' | 'idea';

/**
 * Card photos: put them in /public/images/practice/ with these names.
 * Until a photo exists, the card shows its line illustration instead.
 */
export const practiceAreas: Practice[] = [
  { title: 'القانون التجاري', text: 'تأسيس الشركات والشراكات، الاندماج والاستحواذ، وأنظمة الحوكمة.', tags: ['تأسيس', 'حوكمة', 'شراكات'], image: '/images/practice/01.jpg', art: 'city' },
  { title: 'صياغة العقود', text: 'عقود محكمة تسدّ الثغرات قبل أن تتحول إلى نزاع، ومراجعة دقيقة لكل بند.', tags: ['عقود عمل', 'توريد', 'امتياز'], image: '/images/practice/02.jpg', art: 'contract' },
  { title: 'الأحوال الشخصية', text: 'قضايا الأسرة بحسّ إنساني واحترافية عالية، مع خصوصية مطلقة.', tags: ['حضانة', 'نفقة', 'مواريث'], image: '/images/practice/03.jpg', art: 'family' },
  { title: 'التقاضي والتحكيم', text: 'مرافعة قوية أمام المحاكم وهيئات التحكيم في أعقد القضايا.', tags: ['مرافعة', 'تحكيم', 'تنفيذ'], image: '/images/practice/04.jpg', art: 'gavel' },
  { title: 'العقارات', text: 'نقل الملكية، عقود الإيجار، ونزاعات التطوير العقاري.', tags: ['ملكية', 'إيجار', 'تطوير'], image: '/images/practice/05.jpg', art: 'house' },
  { title: 'الملكية الفكرية', text: 'تسجيل العلامات التجارية وحماية حقوق المؤلف والابتكار.', tags: ['علامات', 'براءات', 'حقوق نشر'], image: '/images/practice/06.jpg', art: 'idea' },
];

export const stats = [
  { value: 12, suffix: '+', label: 'عامًا في المحاماة' },
  { value: 480, suffix: '+', label: 'قضية مُنجزة' },
  { value: 94, suffix: '%', label: 'أحكام لصالح موكّلينا' },
  { value: 150, suffix: '+', label: 'شركة تثق بنا' },
];

export const credentials = [
  { title: 'عضو نقابة المحامين', text: 'مرخّصة للترافع أمام جميع المحاكم' },
  { title: 'ماجستير القانون التجاري', text: 'تخصص في العقود الدولية' },
  { title: 'محكّمة معتمدة', text: 'في النزاعات التجارية' },
  { title: 'سرية تامة', text: 'حماية كاملة لبيانات الموكّلين' },
];

export const steps = [
  { title: 'نستمع أولًا', text: 'جلسة أولى نفهم فيها تفاصيل وضعك وما تريد الوصول إليه.' },
  { title: 'ندرس الملف', text: 'تحليل المستندات والسوابق القضائية وتحديد نقاط القوة.' },
  { title: 'نرسم الطريق', text: 'خطة واضحة بالخيارات المتاحة والتكلفة والجدول الزمني.' },
  { title: 'نمضي حتى النهاية', text: 'تمثيل كامل وتقارير مستمرة حتى إغلاق الملف.' },
];

export const values = ['النزاهة', 'الدقة', 'السرية', 'الالتزام', 'الخبرة', 'الإنصاف'];
