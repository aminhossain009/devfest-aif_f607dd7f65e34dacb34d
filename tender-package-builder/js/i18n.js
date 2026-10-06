// Minimal EN / BN dictionary for dynamic text
const I18N = {
  en: {
    badJson: 'Invalid requirements file.', notPdf: '{name} is not a PDF.', dupFile: '{name} was already added.',
    tooMany: 'Maximum 30 files allowed.', tooBig: '{name} would exceed the 50 MB limit.',
    pages: 'pages', matchTo: 'Match to requirement', unassigned: '— Not assigned —', remove: 'Remove',
    encrypted: 'Password-protected PDF. Remove the password and upload again.',
    unreadable: 'This PDF is damaged or unreadable.',
    missingMsg: 'Required document not uploaded.', optionalMsg: 'Optional — not provided.',
    duplicate: 'More than one file is assigned. Keep only one.',
    st_ok: 'OK', st_missing: 'Missing', st_problem: 'Problem', st_optional: 'Optional',
    blockingMsg: 'Add all missing documents and fix problems first.',
    ready: 'Ready', blocked: 'Blocked',
    generateBlocked: 'Resolve all blocking issues before generating the final PDF.',
    generateReady: 'All required documents are valid. Generate the final ordered PDF.',
    processing: 'Building package…', genFailed: 'Could not generate the package.'
  },
  bn: {
    badJson: 'অবৈধ requirements ফাইল।', notPdf: '{name} একটি PDF নয়।', dupFile: '{name} আগেই যোগ করা হয়েছে।',
    tooMany: 'সর্বোচ্চ ৩০টি ফাইল অনুমোদিত।', tooBig: '{name} যোগ করলে ৫০ এমবি সীমা ছাড়িয়ে যাবে।',
    pages: 'পৃষ্ঠা', matchTo: 'প্রয়োজনীয় নথির সাথে মেলান', unassigned: '— নির্ধারিত নয় —', remove: 'সরান',
    encrypted: 'পাসওয়ার্ড-সুরক্ষিত PDF। পাসওয়ার্ড সরিয়ে আবার আপলোড করুন।',
    unreadable: 'এই PDF নষ্ট বা পড়া যাচ্ছে না।',
    missingMsg: 'প্রয়োজনীয় নথি আপলোড করা হয়নি।', optionalMsg: 'ঐচ্ছিক — দেওয়া হয়নি।',
    duplicate: 'একাধিক ফাইল নির্ধারিত। শুধু একটি রাখুন।',
    st_ok: 'ঠিক আছে', st_missing: 'অনুপস্থিত', st_problem: 'সমস্যা', st_optional: 'ঐচ্ছিক',
    blockingMsg: 'আগে সব অনুপস্থিত নথি যোগ করুন ও সমস্যা ঠিক করুন।',
    ready: 'প্রস্তুত', blocked: 'আটকে আছে',
    generateBlocked: 'চূড়ান্ত PDF তৈরির আগে সব সমস্যা সমাধান করুন।',
    generateReady: 'সব প্রয়োজনীয় নথি বৈধ। ক্রমানুযায়ী চূড়ান্ত PDF তৈরি করুন।',
    processing: 'প্যাকেজ তৈরি হচ্ছে…', genFailed: 'প্যাকেজ তৈরি করা যায়নি।'
  }
};

function t(key, vars = {}) {
  const s = (I18N[State.lang] && I18N[State.lang][key]) || I18N.en[key] || key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function toggleLanguage() {
  State.lang = State.lang === 'en' ? 'bn' : 'en';
  document.documentElement.lang = State.lang;
  $('languageLabel').textContent = State.lang.toUpperCase();
  refresh();
}
