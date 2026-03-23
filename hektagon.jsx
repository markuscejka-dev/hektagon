import { useState, useRef, useEffect } from "react";

// ────────────────────────────────────────────────────────
// SUPABASE CONFIG — ersetze mit deinen Werten aus supabase.com
// ────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://DEIN-PROJEKT.supabase.co";
const SUPABASE_ANON = "DEIN-ANON-KEY";
const IS_SUPABASE_CONFIGURED = !SUPABASE_URL.includes("DEIN");

// Lazy init — kein top-level await
let supabase = null;
const getSupabase = async () => {
  if (supabase) return supabase;
  if (!IS_SUPABASE_CONFIGURED) return null;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
    return supabase;
  } catch(e) { console.warn("Supabase init failed:", e); return null; }
};

// ─────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────
const T = {
  de: {
    flag: "🇩🇪", name: "Deutsch",
    badge: "28 Mio. Mieterhaushalte in Deutschland",
    hero1: "Stimmt Deine", hero2: "Nebenkostenabrechnung?",
    heroSub: "Prüfe es in unter 60 Sekunden. Laut einer Auswertung von über 80.000 Abrechnungen (Mineko, 2024) enthalten 93% aller Abrechnungen Fehler – durchschnittlich €515 zu viel.",
    stat1: "Ø Fehler-Betrag", stat2: "Fehlerquote", stat3: "Prüfzeit",
    uploadTitle: "Abrechnung hochladen", uploadSub: "PDF ablegen oder klicken",
    feat1: "Prüfung nach BGB §556 & BetrKV", feat2: "Keine Datenspeicherung", feat3: "KI-Analyse – sofortiges Ergebnis",
    startBtn: "Jetzt kostenlos prüfen",
    step1title: "Schritt 1 von 2", step1sub: "Nebenkostenabrechnung",
    step2title: "Schritt 2 von 2", step2sub: "Deine Mietdaten",
    floorLabel: "Wohnfläche laut Mietvertrag (m²)", floorPlaceholder: "z.B. 67",
    prepayLabel: "Monatliche Vorauszahlung (€)", prepayPlaceholder: "z.B. 180",
    contractLabel: "Mietvertrag hochladen (optional, für genauere Analyse)", contractSub: "PDF – verbessert die Erkennungsrate erheblich",
    analyzeBtn: "Jetzt analysieren →",
    backBtn: "← Zurück",
    nextBtn: "Weiter →",
    analyzing: "Analyse läuft", analyzingSub: "KI prüft jeden Posten auf Rechtmäßigkeit",
    asteps: ["PDF wird eingelesen","Positionen extrahiert","Mietdaten abgeglichen","Fristen berechnet","Bericht erstellt"],
    critFound: "kritische Fehler gefunden",
    savingsFound: "gefunden",
    gateSub: "Deine Abrechnung enthält Probleme. Wähle einen Plan um den Report freizuschalten.",
    locked: "Gesperrt",
    planOnceName: "Basis", planOncePeriod: "einmalig", planOnceSub: "Ein Report, jetzt sofort",
    planProName: "Pro", planProPeriod: "/ Monat", planProSub: "Dauerhaft abgesichert",
    planProAnnual: "jährlich abgerechnet",
    featAnalysis: "Vollständige KI-Analyse", featErrors: "Alle Fehler aufgedeckt",
    featLetter: "Widerspruchsbrief", featAlarm: "Fristenalarm per E-Mail",
    featCompare: "Vorjahresvergleich", featArchive: "Dokumentenarchiv", featUnlimited: "Unlimitierte Checks",
    payOnce: "Einmalig kaufen — €9", payPro: "Pro starten — €23,90 / Jahr",
    viaStripe: "via Stripe oder PayPal",
    ssl: "SSL-verschlüsselt", money: "Geld-zurück-Garantie", instant: "Sofortzugang",
    disclaimer: "⚖️ Hektagon stellt automatisierte Rechtsinformationen bereit und ersetzt keine individuelle Rechtsberatung nach RDG.",
    demoLink: "Demo ohne Zahlung ansehen →",
    successTitle: "Willkommen bei Pro 🎉", successTitleOnce: "Zahlung erfolgreich",
    successPro: "Dein Pro-Jahresabo ist aktiv. Unlimitierte Checks, Fristenalarm und Dokumentenarchiv stehen bereit.",
    successOnce: "Dein Report ist freigeschaltet.",
    monthly: "€1,99 / Monat · Jederzeit kündbar",
    viewReport: "Report ansehen →",
    reportLabel: "Prüfbericht", newCheck: "← Neue Abrechnung",
    claimedLabel: "Abgerechneter Betrag", savingsLabel: "Einsparpotenzial", errorsLabel: "Fehler gefunden",
    totalDemand: "Gesamtforderung", verifiedErrors: "Nachweisbare Fehler", criticalOf: "davon kritisch",
    errorTypes: {critical:"Kritisch", warning:"Hinweis", info:"Info"},
    letterTitle: "Widerspruchsschreiben", letterSub: "Rechtssicher nach BGB §556 · Versandfertig",
    autoCreated: "Automatisch erstellt",
    generateBtn: "Widerspruchsbrief generieren →",
    pdfBtn: "Als PDF", copyBtn: "Kopieren", copyBtnFull: "Brief kopieren", emailBtn: "Per E-Mail senden",
    generating: "Brief wird generiert…",
    copied: "✓ Kopiert", copiedFull: "✓ In Zwischenablage",
    notPdf: "Bitte eine PDF hochladen",
    riskLabel: "Risiko",
    floorNote: "* Pflichtfeld für Flächenabgleich",
    mietvertragLabel: "Mietvertrag (optional)",
    uploaded: "hochgeladen ✓",
    allClearTitle: "Alles in Ordnung ✓",
    allClearSub: "Deine Abrechnung sieht korrekt aus. Wir haben keine klaren Fehler gefunden.",
    allClearNote: "Bei Unsicherheiten empfehlen wir trotzdem eine manuelle Prüfung durch einen Mieterverein.",
    allClearBtn: "Vollständigen Bericht ansehen",
    allClearFree: "Kostenlos — keine Zahlung nötig",
    authWelcome: "Willkommen zurück",
    authCreate: "Account erstellen",
    authLoginSub: "Einloggen um deine Reports zu sehen",
    authSignupSub: "Kostenlos registrieren · Reports speichern",
    authGoogle: "Mit Google fortfahren",
    authOr: "oder",
    authEmailPh: "E-Mail",
    authPwPh: "Passwort (min. 8 Zeichen)",
    authLoginBtn: "Einloggen",
    authSignupBtn: "Registrieren",
    authSwitchLogin: "Noch kein Account?",
    authSwitchSignup: "Schon registriert?",
    authSwitchLoginLink: "Jetzt registrieren",
    authSwitchSignupLink: "Einloggen",
    accountBack: "← Zurück",
    accountProActive: "✦ Pro — aktiv",
    accountUpgrade: "✦ Pro upgraden",
    accountReports: "Gespeicherte Reports",
    accountSavings: "Gesamtes Einsparpotenzial",
    accountPlan: "Plan",
    accountDeadlines: "Offene Fristen",
    accountProYear: "Pro Jahresabo",
    accountProLockTitle: "Pro Feature",
    accountProLockSub: "Automatische Erinnerungen 3 Monate vor Ablauf der 12-Monats-Einspruchsfrist.",
    accountUpgradeBtn: "✦ Jetzt upgraden — €23,90/Jahr",
    accountNoReports: "Noch keine gespeicherten Reports.",
    accountNoReportsPro: "Deine echten Reports erscheinen hier nach der ersten Analyse.",
    accountNoReportsFree: "Upgrade auf Pro um Reports dauerhaft zu speichern.",
    savePromptTitle: "💡 Report speichern?",
    savePromptSub: "Erstelle einen kostenlosen Account um diesen Report zu speichern und Fristen zu tracken.",
    savePromptBtn: "Kostenlos registrieren",
    deadlineUrgent: "Dringend",
    deadlineSoon: "Bald",
    deadlineOk: "OK",
    myReports: "📂 Meine Reports",
    myDeadlines: "⏰ Fristen",
    upgradeNav: "✦ Auf Pro upgraden",
    signOut: "← Ausloggen",

  },
  tr: {
    flag: "🇹🇷", name: "Türkçe",
    badge: "28 Mio. Kiracı Almanya'da",
    hero1: "Faturanız", hero2: "doğru mu?",
    heroSub: "60 saniyede kontrol edin. 80.000'den fazla faturanın analizine göre (Mineko, 2024) %93'ü hatalı – ortalama €515 fazla.",
    stat1: "Ort. Hata Tutarı", stat2: "Hata Oranı", stat3: "Kontrol Süresi",
    uploadTitle: "Faturayı Yükle", uploadSub: "PDF'i sürükle veya tıkla",
    feat1: "BGB §556 kapsamında inceleme", feat2: "Veri saklanmaz", feat3: "Yapay zeka – anında sonuç",
    startBtn: "Ücretsiz Kontrol Et",
    step1title: "Adım 1 / 2", step1sub: "Yan Gider Faturası",
    step2title: "Adım 2 / 2", step2sub: "Kira Bilgilerin",
    floorLabel: "Kira sözleşmesindeki alan (m²)", floorPlaceholder: "örn. 67",
    prepayLabel: "Aylık avans ödemesi (€)", prepayPlaceholder: "örn. 180",
    contractLabel: "Kira sözleşmesini yükle (isteğe bağlı)", contractSub: "PDF – analizi önemli ölçüde iyileştirir",
    analyzeBtn: "Şimdi Analiz Et →",
    backBtn: "← Geri",
    nextBtn: "İleri →",
    analyzing: "Analiz Ediliyor", analyzingSub: "Yapay zeka her kalemi hukuki açıdan inceliyor",
    asteps: ["PDF okunuyor","Kalemler çıkarılıyor","Kira verileri karşılaştırılıyor","Son tarihler hesaplanıyor","Rapor oluşturuluyor"],
    critFound: "kritik hata bulundu",
    savingsFound: "tasarruf bulundu",
    gateSub: "Faturanda sorunlar var. Tam raporu görmek için bir plan seç.",
    locked: "Kilitli",
    planOnceName: "Temel", planOncePeriod: "tek seferlik", planOnceSub: "Bir rapor, hemen şimdi",
    planProName: "Pro", planProPeriod: "/ ay", planProSub: "Sürekli güvende",
    planProAnnual: "yıllık fatura edilir",
    featAnalysis: "Tam yapay zeka analizi", featErrors: "Tüm hatalar açığa çıkar",
    featLetter: "İtiraz mektubu", featAlarm: "E-posta ile son tarih uyarısı",
    featCompare: "Geçen yılla karşılaştırma", featArchive: "Belge arşivi", featUnlimited: "Sınırsız kontrol",
    payOnce: "Tek seferlik satın al — €9", payPro: "Pro'yu Başlat — €23,90 / Yıl",
    viaStripe: "Stripe veya PayPal ile",
    ssl: "SSL şifreli", money: "Para iade garantisi", instant: "Anında erişim",
    disclaimer: "⚖️ Hektagon otomatik hukuki bilgi sunar; bireysel hukuki danışmanlığın yerini tutmaz.",
    demoLink: "Ödeme yapmadan demo görüntüle →",
    successTitle: "Pro'ya Hoş Geldin 🎉", successTitleOnce: "Ödeme Başarılı",
    successPro: "Pro yıllık aboneliğin aktif. Sınırsız kontrol, son tarih uyarısı ve belge arşivi hazır.",
    successOnce: "Raporum açıldı.",
    monthly: "€1,99 / ay · İstediğin zaman iptal",
    viewReport: "Raporu Görüntüle →",
    reportLabel: "İnceleme Raporu", newCheck: "← Yeni Kontrol",
    claimedLabel: "Talep Edilen Tutar", savingsLabel: "Tasarruf Potansiyeli", errorsLabel: "Bulunan Hata",
    totalDemand: "Toplam talep", verifiedErrors: "Kanıtlanmış hatalar", criticalOf: "kritik",
    errorTypes: {critical:"Kritik", warning:"Uyarı", info:"Bilgi"},
    letterTitle: "İtiraz Mektubu", letterSub: "BGB §556 kapsamında hukuki · Göndermeye hazır",
    autoCreated: "Otomatik oluşturuldu",
    generateBtn: "İtiraz Mektubu Oluştur →",
    pdfBtn: "PDF Olarak", copyBtn: "Kopyala", copyBtnFull: "Mektubu Kopyala", emailBtn: "E-posta ile Gönder",
    generating: "Mektup oluşturuluyor…",
    copied: "✓ Kopyalandı", copiedFull: "✓ Panoya kopyalandı",
    notPdf: "Lütfen bir PDF yükleyin",
    riskLabel: "Risk",
    floorNote: "* Alan karşılaştırması için zorunlu",
    mietvertragLabel: "Kira sözleşmesi (isteğe bağlı)",
    uploaded: "yüklendi ✓",
    allClearTitle: "Her şey yolunda ✓",
    allClearSub: "Faturanız doğru görünüyor. Belirgin bir hata bulamadık.",
    allClearNote: "Şüpheleriniz varsa kiracı derneği ile kontrol etmenizi öneririz.",
    allClearBtn: "Tam raporu gör",
    allClearFree: "Ücretsiz — ödeme gerekmez",
    authWelcome: "Tekrar hoş geldiniz",
    authCreate: "Hesap oluştur",
    authLoginSub: "Raporlarını görmek için giriş yap",
    authSignupSub: "Ücretsiz kayıt ol · Raporları kaydet",
    authGoogle: "Google ile devam et",
    authOr: "veya",
    authEmailPh: "E-posta",
    authPwPh: "Şifre (min. 8 karakter)",
    authLoginBtn: "Giriş Yap",
    authSignupBtn: "Kayıt Ol",
    authSwitchLogin: "Hesabın yok mu?",
    authSwitchSignup: "Zaten kayıtlı mısın?",
    authSwitchLoginLink: "Şimdi kayıt ol",
    authSwitchSignupLink: "Giriş yap",
    accountBack: "← Geri",
    accountProActive: "✦ Pro — aktif",
    accountUpgrade: "✦ Pro'ya yükselt",
    accountReports: "Kaydedilen Raporlar",
    accountSavings: "Toplam Tasarruf Potansiyeli",
    accountPlan: "Plan",
    accountDeadlines: "Açık Son Tarihler",
    accountProYear: "Pro Yıllık",
    accountProLockTitle: "Pro Özelliği",
    accountProLockSub: "Son tarihten 3 ay önce otomatik hatırlatmalar.",
    accountUpgradeBtn: "✦ Şimdi yükselt — €23,90/Yıl",
    accountNoReports: "Henüz kayıtlı rapor yok.",
    accountNoReportsPro: "Gerçek raporlarınız ilk analizden sonra burada görünür.",
    accountNoReportsFree: "Raporları kalıcı kaydetmek için Pro'ya yükseltin.",
    savePromptTitle: "💡 Raporu kaydet?",
    savePromptSub: "Bu raporu kaydetmek ve son tarihleri takip etmek için ücretsiz hesap oluştur.",
    savePromptBtn: "Ücretsiz kayıt ol",
    deadlineUrgent: "Acil",
    deadlineSoon: "Yakında",
    deadlineOk: "Tamam",
    myReports: "📂 Raporlarım",
    myDeadlines: "⏰ Son Tarihler",
    upgradeNav: "✦ Pro'ya yükselt",
    signOut: "← Çıkış",

  },
  en: {
    flag: "🇬🇧", name: "English",
    badge: "28 Million Renter Households · Germany",
    hero1: "Is Your Utility Bill", hero2: "Correct?",
    heroSub: "Find out in under 60 seconds. An analysis of 80,000+ bills (Mineko, 2024) shows 93% contain errors – averaging €515 too much.",
    stat1: "Avg. Error Amount", stat2: "Error Rate", stat3: "Check Time",
    uploadTitle: "Upload your bill", uploadSub: "Drop PDF here or click",
    feat1: "Checked against BGB §556 & BetrKV", feat2: "No data storage", feat3: "AI analysis – instant result",
    startBtn: "Check for Free",
    step1title: "Step 1 of 2", step1sub: "Utility Bill",
    step2title: "Step 2 of 2", step2sub: "Your Rental Details",
    floorLabel: "Floor area per rental contract (m²)", floorPlaceholder: "e.g. 67",
    prepayLabel: "Monthly advance payment (€)", prepayPlaceholder: "e.g. 180",
    contractLabel: "Upload rental contract (optional, improves accuracy)", contractSub: "PDF – significantly improves detection rate",
    analyzeBtn: "Analyze Now →",
    backBtn: "← Back",
    nextBtn: "Next →",
    analyzing: "Analyzing", analyzingSub: "AI is checking every line item for legal compliance",
    asteps: ["Reading PDF","Extracting positions","Comparing rental data","Calculating deadlines","Building report"],
    critFound: "critical errors found",
    savingsFound: "found",
    gateSub: "Your bill contains issues. Choose a plan to unlock the full report.",
    locked: "Locked",
    planOnceName: "Basic", planOncePeriod: "one-time", planOnceSub: "One report, right now",
    planProName: "Pro", planProPeriod: "/ month", planProSub: "Stay protected all year",
    planProAnnual: "billed annually",
    featAnalysis: "Full AI analysis", featErrors: "All errors revealed",
    featLetter: "Dispute letter", featAlarm: "Deadline email alerts",
    featCompare: "Year-over-year comparison", featArchive: "Document archive", featUnlimited: "Unlimited checks",
    payOnce: "Buy Once — €9", payPro: "Start Pro — €23.90 / Year",
    viaStripe: "via Stripe or PayPal",
    ssl: "SSL encrypted", money: "Money-back guarantee", instant: "Instant access",
    disclaimer: "⚖️ Hektagon provides automated legal information and does not replace individual legal advice.",
    demoLink: "View demo without payment →",
    successTitle: "Welcome to Pro 🎉", successTitleOnce: "Payment Successful",
    successPro: "Your Pro annual plan is active. Unlimited checks, deadline alerts and document archive are ready.",
    successOnce: "Your report is unlocked.",
    monthly: "€1.99 / month · Cancel anytime",
    viewReport: "View Report →",
    reportLabel: "Inspection Report", newCheck: "← New Check",
    claimedLabel: "Amount Claimed", savingsLabel: "Savings Potential", errorsLabel: "Errors Found",
    totalDemand: "Total demand", verifiedErrors: "Verified errors", criticalOf: "critical",
    errorTypes: {critical:"Critical", warning:"Warning", info:"Info"},
    letterTitle: "Dispute Letter", letterSub: "Legally sound per BGB §556 · Ready to send",
    autoCreated: "Auto-generated",
    generateBtn: "Generate Dispute Letter →",
    pdfBtn: "As PDF", copyBtn: "Copy", copyBtnFull: "Copy Letter", emailBtn: "Send by Email",
    generating: "Generating letter…",
    copied: "✓ Copied", copiedFull: "✓ Copied to clipboard",
    notPdf: "Please upload a PDF file",
    riskLabel: "Risk",
    floorNote: "* Required for area comparison",
    mietvertragLabel: "Rental contract (optional)",
    uploaded: "uploaded ✓",
    allClearTitle: "All Clear ✓",
    allClearSub: "Your bill looks correct. We didn't find any obvious errors.",
    allClearNote: "If in doubt, we still recommend a manual check by a tenant association.",
    allClearBtn: "View Full Report",
    allClearFree: "Free — no payment needed",
    authWelcome: "Welcome back",
    authCreate: "Create account",
    authLoginSub: "Log in to see your reports",
    authSignupSub: "Register for free · Save reports",
    authGoogle: "Continue with Google",
    authOr: "or",
    authEmailPh: "Email",
    authPwPh: "Password (min. 8 characters)",
    authLoginBtn: "Log in",
    authSignupBtn: "Sign up",
    authSwitchLogin: "No account yet?",
    authSwitchSignup: "Already registered?",
    authSwitchLoginLink: "Register now",
    authSwitchSignupLink: "Log in",
    accountBack: "← Back",
    accountProActive: "✦ Pro — active",
    accountUpgrade: "✦ Upgrade to Pro",
    accountReports: "Saved Reports",
    accountSavings: "Total Savings Potential",
    accountPlan: "Plan",
    accountDeadlines: "Open Deadlines",
    accountProYear: "Pro Annual",
    accountProLockTitle: "Pro Feature",
    accountProLockSub: "Automatic reminders 3 months before the 12-month deadline expires.",
    accountUpgradeBtn: "✦ Upgrade now — €23.90/Year",
    accountNoReports: "No saved reports yet.",
    accountNoReportsPro: "Your real reports will appear here after your first analysis.",
    accountNoReportsFree: "Upgrade to Pro to save reports permanently.",
    savePromptTitle: "💡 Save report?",
    savePromptSub: "Create a free account to save this report and track deadlines.",
    savePromptBtn: "Register for free",
    deadlineUrgent: "Urgent",
    deadlineSoon: "Soon",
    deadlineOk: "OK",
    myReports: "📂 My Reports",
    myDeadlines: "⏰ Deadlines",
    upgradeNav: "✦ Upgrade to Pro",
    signOut: "← Sign out",

  },
  pl: {
    flag: "🇵🇱", name: "Polski",
    badge: "28 Mln Najemców · Niemcy",
    hero1: "Czy Twoje rozliczenie", hero2: "jest poprawne?",
    heroSub: "Sprawdź w mniej niż 60 sekund. Analiza ponad 80 000 rachunków (Mineko, 2024) pokazuje, że 93% zawiera błędy – średnio €515 za dużo.",
    stat1: "Śr. kwota błędu", stat2: "Wskaźnik błędów", stat3: "Czas kontroli",
    uploadTitle: "Prześlij rozliczenie", uploadSub: "Upuść PDF tutaj lub kliknij",
    feat1: "Sprawdzenie wg BGB §556 i BetrKV", feat2: "Brak przechowywania danych", feat3: "Analiza AI – natychmiastowy wynik",
    startBtn: "Sprawdź bezpłatnie",
    step1title: "Krok 1 z 2", step1sub: "Rozliczenie kosztów",
    step2title: "Krok 2 z 2", step2sub: "Dane najmu",
    floorLabel: "Powierzchnia wg umowy najmu (m²)", floorPlaceholder: "np. 67",
    prepayLabel: "Miesięczna zaliczka (€)", prepayPlaceholder: "np. 180",
    contractLabel: "Prześlij umowę najmu (opcjonalnie)", contractSub: "PDF – znacznie poprawia dokładność",
    analyzeBtn: "Analizuj teraz →",
    backBtn: "← Wstecz", nextBtn: "Dalej →",
    analyzing: "Trwa analiza", analyzingSub: "AI sprawdza każdą pozycję pod kątem zgodności z prawem",
    asteps: ["Wczytywanie PDF","Wyodrębnianie pozycji","Porównywanie danych","Obliczanie terminów","Tworzenie raportu"],
    critFound: "krytyczne błędy znalezione",
    savingsFound: "znalezione oszczędności",
    gateSub: "Twoje rozliczenie zawiera problemy. Wybierz plan, aby odblokować pełny raport.",
    locked: "Zablokowane",
    planOnceName: "Podstawowy", planOncePeriod: "jednorazowo", planOnceSub: "Jeden raport, teraz",
    planProName: "Pro", planProPeriod: "/ miesiąc", planProSub: "Chroniony przez cały rok",
    planProAnnual: "rozliczane rocznie",
    featAnalysis: "Pełna analiza AI", featErrors: "Wszystkie błędy ujawnione",
    featLetter: "List sprzeciwu", featAlarm: "Powiadomienia e-mail o terminach",
    featCompare: "Porównanie rok do roku", featArchive: "Archiwum dokumentów", featUnlimited: "Nieograniczone sprawdzenia",
    payOnce: "Kup jednorazowo — €9", payPro: "Rozpocznij Pro — €23,90 / rok",
    viaStripe: "przez Stripe lub PayPal",
    ssl: "Szyfrowane SSL", money: "Gwarancja zwrotu pieniędzy", instant: "Natychmiastowy dostęp",
    disclaimer: "⚖️ Hektagon dostarcza automatyczne informacje prawne i nie zastępuje indywidualnej porady prawnej.",
    demoLink: "Zobacz demo bez płatności →",
    successTitle: "Witaj w Pro 🎉", successTitleOnce: "Płatność zakończona sukcesem",
    successPro: "Twój roczny plan Pro jest aktywny.",
    successOnce: "Twój raport został odblokowany.",
    monthly: "€1,99 / miesiąc · Anuluj w dowolnym momencie",
    viewReport: "Zobacz raport →",
    reportLabel: "Raport kontrolny", newCheck: "← Nowe sprawdzenie",
    claimedLabel: "Kwota żądana", savingsLabel: "Potencjał oszczędności", errorsLabel: "Znalezione błędy",
    totalDemand: "Łączne żądanie", verifiedErrors: "Potwierdzone błędy", criticalOf: "krytyczne",
    errorTypes: {critical:"Krytyczny", warning:"Ostrzeżenie", info:"Info"},
    letterTitle: "List sprzeciwu", letterSub: "Zgodny z prawem wg BGB §556 · Gotowy do wysłania",
    autoCreated: "Wygenerowano automatycznie",
    generateBtn: "Wygeneruj list sprzeciwu →",
    pdfBtn: "Jako PDF", copyBtn: "Kopiuj", copyBtnFull: "Kopiuj list", emailBtn: "Wyślij e-mailem",
    generating: "Generowanie listu…",
    copied: "✓ Skopiowano", copiedFull: "✓ Skopiowano do schowka",
    notPdf: "Proszę przesłać plik PDF",
    riskLabel: "Ryzyko",
    floorNote: "* Wymagane do porównania powierzchni",
    mietvertragLabel: "Umowa najmu (opcjonalnie)",
    uploaded: "przesłano ✓",
    allClearTitle: "Wszystko w porządku ✓",
    allClearSub: "Twoje rozliczenie wygląda poprawnie. Nie znaleźliśmy wyraźnych błędów.",
    allClearNote: "W razie wątpliwości nadal zalecamy ręczną kontrolę przez stowarzyszenie najemców.",
    allClearBtn: "Zobacz pełny raport",
    allClearFree: "Bezpłatnie — bez płatności",
    authWelcome: "Witaj ponownie",
    authCreate: "Utwórz konto",
    authLoginSub: "Zaloguj się, aby zobaczyć swoje raporty",
    authSignupSub: "Zarejestruj się bezpłatnie · Zapisz raporty",
    authGoogle: "Kontynuuj z Google",
    authOr: "lub",
    authEmailPh: "E-mail",
    authPwPh: "Hasło (min. 8 znaków)",
    authLoginBtn: "Zaloguj się",
    authSignupBtn: "Zarejestruj się",
    authSwitchLogin: "Nie masz konta?",
    authSwitchSignup: "Masz już konto?",
    authSwitchLoginLink: "Zarejestruj się teraz",
    authSwitchSignupLink: "Zaloguj się",
    accountBack: "← Wstecz",
    accountProActive: "✦ Pro — aktywny",
    accountUpgrade: "✦ Ulepsz do Pro",
    accountReports: "Zapisane Raporty",
    accountSavings: "Całkowity Potencjał Oszczędności",
    accountPlan: "Plan",
    accountDeadlines: "Otwarte Terminy",
    accountProYear: "Pro Roczny",
    accountProLockTitle: "Funkcja Pro",
    accountProLockSub: "Automatyczne przypomnienia 3 miesiące przed upływem terminu.",
    accountUpgradeBtn: "✦ Ulepsz teraz — €23,90/Rok",
    accountNoReports: "Brak zapisanych raportów.",
    accountNoReportsPro: "Twoje raporty pojawią się tutaj po pierwszej analizie.",
    accountNoReportsFree: "Ulepsz do Pro, aby trwale zapisywać raporty.",
    savePromptTitle: "💡 Zapisać raport?",
    savePromptSub: "Utwórz bezpłatne konto, aby zapisać ten raport i śledzić terminy.",
    savePromptBtn: "Zarejestruj się bezpłatnie",
    deadlineUrgent: "Pilne",
    deadlineSoon: "Wkrótce",
    deadlineOk: "OK",
    myReports: "📂 Moje Raporty",
    myDeadlines: "⏰ Terminy",
    upgradeNav: "✦ Ulepsz do Pro",
    signOut: "← Wyloguj",

  },
  ru: {
    flag: "🇷🇺", name: "Русский",
    badge: "28 млн арендаторов · Германия",
    hero1: "Правильно ли", hero2: "составлен счёт?",
    heroSub: "Проверьте менее чем за 60 секунд. Анализ 80 000+ счетов (Mineko, 2024): 93% содержат ошибки – в среднем €515 лишних.",
    stat1: "Ср. сумма ошибки", stat2: "Процент ошибок", stat3: "Время проверки",
    uploadTitle: "Загрузить счёт", uploadSub: "Перетащите PDF или нажмите",
    feat1: "Проверка по BGB §556 и BetrKV", feat2: "Данные не сохраняются", feat3: "ИИ-анализ – мгновенный результат",
    startBtn: "Проверить бесплатно",
    step1title: "Шаг 1 из 2", step1sub: "Счёт за коммунальные услуги",
    step2title: "Шаг 2 из 2", step2sub: "Данные об аренде",
    floorLabel: "Площадь по договору аренды (м²)", floorPlaceholder: "напр. 67",
    prepayLabel: "Ежемесячный аванс (€)", prepayPlaceholder: "напр. 180",
    contractLabel: "Загрузить договор аренды (необязательно)", contractSub: "PDF – значительно улучшает точность",
    analyzeBtn: "Анализировать →",
    backBtn: "← Назад", nextBtn: "Далее →",
    analyzing: "Анализируется", analyzingSub: "ИИ проверяет каждую позицию на соответствие закону",
    asteps: ["Чтение PDF","Извлечение позиций","Сравнение данных","Расчёт сроков","Создание отчёта"],
    critFound: "критических ошибки найдено",
    savingsFound: "найдено",
    gateSub: "В вашем счёте есть проблемы. Выберите план для разблокировки отчёта.",
    locked: "Заблокировано",
    planOnceName: "Базовый", planOncePeriod: "разово", planOnceSub: "Один отчёт прямо сейчас",
    planProName: "Pro", planProPeriod: "/ мес", planProSub: "Защита круглый год",
    planProAnnual: "оплата раз в год",
    featAnalysis: "Полный ИИ-анализ", featErrors: "Все ошибки раскрыты",
    featLetter: "Письмо-возражение", featAlarm: "Email-уведомления о сроках",
    featCompare: "Сравнение год к году", featArchive: "Архив документов", featUnlimited: "Неограниченные проверки",
    payOnce: "Купить разово — €9", payPro: "Запустить Pro — €23,90 / год",
    viaStripe: "через Stripe или PayPal",
    ssl: "SSL-шифрование", money: "Гарантия возврата", instant: "Мгновенный доступ",
    disclaimer: "⚖️ Hektagon предоставляет автоматизированную правовую информацию и не заменяет индивидуальную юридическую консультацию.",
    demoLink: "Посмотреть демо без оплаты →",
    successTitle: "Добро пожаловать в Pro 🎉", successTitleOnce: "Оплата прошла успешно",
    successPro: "Ваш годовой план Pro активен.",
    successOnce: "Ваш отчёт разблокирован.",
    monthly: "€1,99 / мес · Отмена в любое время",
    viewReport: "Смотреть отчёт →",
    reportLabel: "Отчёт проверки", newCheck: "← Новая проверка",
    claimedLabel: "Начисленная сумма", savingsLabel: "Потенциал экономии", errorsLabel: "Найдено ошибок",
    totalDemand: "Общее требование", verifiedErrors: "Подтверждённые ошибки", criticalOf: "критические",
    errorTypes: {critical:"Критично", warning:"Предупреждение", info:"Инфо"},
    letterTitle: "Письмо-возражение", letterSub: "Юридически верно по BGB §556 · Готово к отправке",
    autoCreated: "Создано автоматически",
    generateBtn: "Создать письмо-возражение →",
    pdfBtn: "В PDF", copyBtn: "Копировать", copyBtnFull: "Копировать письмо", emailBtn: "Отправить по email",
    generating: "Создаётся письмо…",
    copied: "✓ Скопировано", copiedFull: "✓ Скопировано в буфер",
    notPdf: "Пожалуйста, загрузите PDF",
    riskLabel: "Риск",
    floorNote: "* Обязательно для сравнения площади",
    mietvertragLabel: "Договор аренды (необязательно)",
    uploaded: "загружено ✓",
    allClearTitle: "Всё в порядке ✓",
    allClearSub: "Ваш счёт выглядит корректно. Очевидных ошибок не найдено.",
    allClearNote: "При сомнениях рекомендуем дополнительную проверку в ассоциации арендаторов.",
    allClearBtn: "Смотреть полный отчёт",
    allClearFree: "Бесплатно — оплата не нужна",
    authWelcome: "С возвращением",
    authCreate: "Создать аккаунт",
    authLoginSub: "Войдите, чтобы увидеть свои отчёты",
    authSignupSub: "Зарегистрируйтесь бесплатно · Сохраняйте отчёты",
    authGoogle: "Продолжить с Google",
    authOr: "или",
    authEmailPh: "Эл. почта",
    authPwPh: "Пароль (мин. 8 символов)",
    authLoginBtn: "Войти",
    authSignupBtn: "Зарегистрироваться",
    authSwitchLogin: "Нет аккаунта?",
    authSwitchSignup: "Уже есть аккаунт?",
    authSwitchLoginLink: "Зарегистрироваться",
    authSwitchSignupLink: "Войти",
    accountBack: "← Назад",
    accountProActive: "✦ Pro — активен",
    accountUpgrade: "✦ Перейти на Pro",
    accountReports: "Сохранённые Отчёты",
    accountSavings: "Общий Потенциал Экономии",
    accountPlan: "Тариф",
    accountDeadlines: "Открытые Сроки",
    accountProYear: "Pro Годовой",
    accountProLockTitle: "Функция Pro",
    accountProLockSub: "Автоматические напоминания за 3 месяца до истечения срока.",
    accountUpgradeBtn: "✦ Перейти сейчас — €23,90/Год",
    accountNoReports: "Сохранённых отчётов пока нет.",
    accountNoReportsPro: "Ваши отчёты появятся здесь после первого анализа.",
    accountNoReportsFree: "Перейдите на Pro, чтобы сохранять отчёты.",
    savePromptTitle: "💡 Сохранить отчёт?",
    savePromptSub: "Создайте бесплатный аккаунт, чтобы сохранить этот отчёт.",
    savePromptBtn: "Зарегистрироваться бесплатно",
    deadlineUrgent: "Срочно",
    deadlineSoon: "Скоро",
    deadlineOk: "OK",
    myReports: "📂 Мои Отчёты",
    myDeadlines: "⏰ Сроки",
    upgradeNav: "✦ Перейти на Pro",
    signOut: "← Выйти",

  },
};

const STRIPE = {
  ONE_TIME_LINK: "https://buy.stripe.com/DEIN_EINMALIG_LINK",
  PRO_YEAR_LINK: "https://buy.stripe.com/DEIN_PRO_LINK",
};

// ─────────────────────────────────────────────────────────
// COUNTRY CONFIG — Recht, Währung, Marktgröße
// ─────────────────────────────────────────────────────────
const COUNTRIES = {
  DE: {
    code: "DE", flag: "🇩🇪", name: "Deutschland",
    currency: "€", renters: "28 Mio.",
    law: "BGB §556 & BetrKV",
    lawFull: "BGB §556, §556a, §556b und BetrKV",
    avgOvercharge: 515,
    errorRate: 93,
    systemPrompt: `Du bist ein Experte für deutsches Mietrecht. Analysiere die Nebenkostenabrechnung nach BGB §556, §556a, §556b und BetrKV. Prüfe insbesondere: nicht umlagefähige Kosten (§1 Abs. 2 BetrKV), falscher Verteilerschlüssel (§556a BGB), Abrechnungsfristen (§556 Abs. 3 BGB), Wirtschaftlichkeitsgebot. Wenn Mieterdaten angegeben sind, gleiche Wohnfläche und Vorauszahlungen konkret ab. Antworte NUR mit JSON ohne Markdown:
{"landlord":"Name","period":"Zeitraum","totalClaimed":2500,"estimatedSavings":380,"overallRisk":"kritisch","errors":[{"type":"critical","category":"Kategorie","title":"Titel","description":"Beschreibung","impact":200}],"summary":"Fazit auf Deutsch"}`,
    defaultLang: "de",
  },
  AT: {
    code: "AT", flag: "🇦🇹", name: "Österreich",
    currency: "€", renters: "4 Mio.",
    law: "MRG §21-24 & BetriebskostenG",
    lawFull: "MRG §21, §22, §23, §24 und das österreichische Betriebskostengesetz",
    avgOvercharge: 480,
    errorRate: 89,
    systemPrompt: `Du bist ein Experte für österreichisches Mietrecht. Analysiere die Betriebskostenabrechnung nach MRG §21-24 und dem österreichischen Betriebskostengesetz. Prüfe insbesondere: zulässige Betriebskosten nach MRG §21 Abs. 1, korrekte Aufteilung nach Nutzfläche (MRG §17), Abrechnungsfristen (MRG §21 Abs. 3 — Abrechnung bis 30. Juni für Vorjahr), unzulässige Verwaltungskosten. Wenn Mieterdaten angegeben sind, gleiche Nutzfläche konkret ab. Antworte NUR mit JSON ohne Markdown:
{"landlord":"Name","period":"Zeitraum","totalClaimed":2500,"estimatedSavings":380,"overallRisk":"kritisch","errors":[{"type":"critical","category":"Kategorie","title":"Titel","description":"Beschreibung","impact":200}],"summary":"Fazit auf Deutsch"}`,
    defaultLang: "de",
  },
  CH: {
    code: "CH", flag: "🇨🇭", name: "Schweiz",
    currency: "CHF", renters: "2 Mio.",
    law: "OR Art. 257a–257b",
    lawFull: "OR Art. 257a, 257b und VMWG (Verordnung über Miete und Pacht)",
    avgOvercharge: 620,
    errorRate: 85,
    systemPrompt: `Du bist ein Experte für schweizerisches Mietrecht. Analysiere die Nebenkostenabrechnung nach OR Art. 257a-257b und VMWG. Prüfe insbesondere: Nebenkosten müssen im Mietvertrag explizit vereinbart sein (OR 257a), nur effektive Aufwendungen sind umlagefähig, keine Pauschalen ohne Abrechnung, Heizkostenabrechnung nach EnV. Wenn Mieterdaten angegeben sind, gleiche Fläche und Akontozahlungen konkret ab. Antworte NUR mit JSON ohne Markdown (Beträge in CHF):
{"landlord":"Name","period":"Zeitraum","totalClaimed":2500,"estimatedSavings":380,"overallRisk":"kritisch","errors":[{"type":"critical","category":"Kategorie","title":"Titel","description":"Beschreibung","impact":200}],"summary":"Fazit auf Deutsch/Französisch/Italienisch je nach Sprache der Abrechnung"}`,
    defaultLang: "de",
  },
};

// IP → Land mapping (kostenlos via ipapi.co, 1000 req/Tag gratis)
const detectCountry = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const d = await res.json();
    return d.country_code; // "DE", "AT", "CH", etc.
  } catch {
    return "DE"; // Fallback
  }
};

const S = { UPLOAD:"upload", INFO:"info", ANALYZING:"analyzing", GATE:"gate", ALLCLEAR:"allclear", RESULTS:"results", LETTER:"letter", SUCCESS:"success", ACCOUNT:"account", REVIEW:"review" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07070f; --glass: rgba(255,255,255,0.04);
    --gb: rgba(255,255,255,0.07); --gb2: rgba(255,255,255,0.13);
    --w: #fff; --w60: rgba(255,255,255,0.6); --w30: rgba(255,255,255,0.3); --w10: rgba(255,255,255,0.1); --w05: rgba(255,255,255,0.05);
    --g: #30d780; --gg: rgba(48,215,128,0.14); --gd: rgba(48,215,128,0.75);
    --r: #ff453a; --rg: rgba(255,69,58,0.12);
    --y: #ffd60a; --yg: rgba(255,214,10,0.1); --bl: #0a84ff;
    --fd: 'Epilogue', sans-serif; --fb: 'Manrope', sans-serif;
    --rad: 18px; --rads: 12px; --blur: blur(40px); --blurs: blur(20px);
  }
  html,body{height:100%;}
  body{background:var(--bg);font-family:var(--fb);color:var(--w);min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  .amb{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
  .o1{position:absolute;border-radius:50%;filter:blur(110px);width:700px;height:700px;background:radial-gradient(circle,rgba(20,80,45,0.5) 0%,transparent 65%);top:-280px;left:50%;transform:translateX(-50%);animation:d1 20s ease-in-out infinite alternate;}
  .o2{position:absolute;border-radius:50%;filter:blur(110px);width:500px;height:500px;background:radial-gradient(circle,rgba(5,25,70,0.55) 0%,transparent 65%);bottom:-150px;right:-100px;animation:d2 16s ease-in-out infinite alternate;}
  .o3{position:absolute;border-radius:50%;filter:blur(110px);width:350px;height:350px;background:radial-gradient(circle,rgba(35,5,70,0.4) 0%,transparent 65%);bottom:0;left:0;animation:d2 22s ease-in-out infinite alternate;}
  @keyframes d1{to{transform:translateX(-50%) translateY(50px);}}
  @keyframes d2{to{transform:translateY(-40px);}}
  .noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px;}
  .app{position:relative;z-index:1;min-height:100vh;}

  /* NAV */
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(7,7,15,0.7);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-bottom:1px solid var(--gb);}
  .nav-logo{font-family:var(--fd);font-weight:700;font-size:16px;letter-spacing:-0.3px;display:flex;align-items:center;gap:9px;}
  .lm{width:28px;height:28px;background:var(--g);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#000;font-weight:800;}
  .nb{font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:var(--gd);background:var(--gg);border:1px solid rgba(48,215,128,0.18);padding:4px 10px;border-radius:20px;}

  /* LANG SWITCHER */
  .lang-wrap{position:relative;}
  .lang-btn{display:flex;align-items:center;gap:6px;background:var(--w05);border:1px solid var(--gb);color:var(--w60);font-size:12px;font-weight:500;padding:5px 10px;border-radius:8px;cursor:pointer;transition:all 0.18s;font-family:var(--fb);}
  .lang-btn:hover{background:var(--w10);color:var(--w);}
  .lang-dropdown{position:absolute;top:calc(100% + 6px);right:0;background:#0f0f1e;border:1px solid var(--gb2);border-radius:var(--rads);overflow:hidden;min-width:140px;z-index:200;box-shadow:0 16px 40px rgba(0,0,0,0.5);}
  .lang-option{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:13px;color:var(--w60);cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--gb);}
  .lang-option:last-child{border-bottom:none;}
  .lang-option:hover{background:var(--w05);color:var(--w);}
  .lang-option.active{color:var(--g);}
  .country-wrap{position:relative;}
  .country-btn{display:flex;align-items:center;gap:6px;background:var(--w05);border:1px solid var(--gb);color:var(--w60);font-size:12px;font-weight:500;padding:5px 10px;border-radius:8px;cursor:pointer;transition:all 0.18s;font-family:var(--fb);}
  .country-btn:hover{background:var(--w10);color:var(--w);}
  .country-detected{border-color:rgba(48,215,128,0.3);color:var(--gd);}
  .country-dropdown{position:absolute;top:calc(100% + 6px);right:0;background:#0f0f1e;border:1px solid var(--gb2);border-radius:var(--rads);overflow:hidden;min-width:160px;z-index:200;box-shadow:0 16px 40px rgba(0,0,0,0.5);}
  .country-option{display:flex;align-items:center;gap:10px;padding:12px 14px;font-size:13px;color:var(--w60);cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--gb);}
  .country-option:last-child{border-bottom:none;}
  .country-option:hover{background:var(--w05);color:var(--w);}
  .country-option.active{color:var(--g);}
  .country-option-info{flex:1;}
  .country-option-name{font-weight:500;font-size:13px;}
  .country-option-law{font-size:10px;color:var(--w30);margin-top:1px;}
  .ip-banner{background:rgba(48,215,128,0.07);border:1px solid rgba(48,215,128,0.18);border-radius:var(--rads);padding:10px 14px;font-size:12px;color:var(--gd);display:flex;align-items:center;gap:8px;margin-bottom:20px;}


  /* NAV RIGHT */
  .nav-right{display:flex;align-items:center;gap:10px;}
  .sign-in-btn{background:none;border:1px solid var(--gb);color:var(--w60);font-size:12px;font-weight:500;padding:5px 12px;border-radius:8px;cursor:pointer;font-family:var(--fb);transition:all 0.18s;}
  .sign-in-btn:hover{border-color:var(--gb2);color:var(--w);}

  .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px 60px;}
  .pw{min-height:100vh;padding:96px 40px 60px;max-width:780px;margin:0 auto;width:100%;}
  @media(max-width:600px){.pw{padding:80px 20px 60px;}}
  .glass{background:var(--glass);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1px solid var(--gb);border-radius:var(--rad);}

  /* HERO */
  .hero{max-width:620px;text-align:center;}
  .hbadge{display:inline-flex;align-items:center;gap:7px;background:var(--glass);border:1px solid var(--gb2);backdrop-filter:var(--blurs);padding:6px 14px;border-radius:40px;font-size:12px;font-weight:500;color:var(--w60);margin-bottom:36px;}
  .hbdot{width:6px;height:6px;background:var(--g);border-radius:50%;box-shadow:0 0 8px var(--g);}
  .h1{font-family:var(--fd);font-weight:800;font-size:clamp(44px,8vw,74px);line-height:0.97;letter-spacing:-3.5px;margin-bottom:28px;}
  .h1 .dim{color:var(--w30);}
  .hsub{font-size:15px;line-height:1.75;color:var(--w60);font-weight:300;max-width:440px;margin:0 auto 48px;}
  .hsub strong{color:var(--w60);font-weight:500;}
  .stats{display:flex;border:1px solid var(--gb);border-radius:var(--rads);overflow:hidden;background:var(--w05);backdrop-filter:var(--blurs);margin-bottom:52px;}
  .st{flex:1;padding:18px 0;text-align:center;border-right:1px solid var(--gb);}
  .st:last-child{border-right:none;}
  .stn{font-family:var(--fd);font-weight:700;font-size:24px;letter-spacing:-1px;}
  .stl{font-size:11px;color:var(--w30);margin-top:2px;font-weight:500;}

  /* UPLOAD */
  .uw{width:100%;max-width:440px;}
  .uz{background:var(--glass);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1.5px dashed var(--gb2);border-radius:var(--rad);padding:44px 28px;text-align:center;cursor:pointer;position:relative;transition:all 0.25s;}
  .uz:hover,.uz.drag{border-color:rgba(48,215,128,0.5);background:rgba(48,215,128,0.04);}
  .uz.filled{border-color:rgba(48,215,128,0.4);border-style:solid;background:rgba(48,215,128,0.05);}
  .uz input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .uiw{width:52px;height:52px;background:var(--w05);border:1px solid var(--gb2);border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 18px;}
  .ut{font-family:var(--fd);font-weight:600;font-size:16px;margin-bottom:6px;}
  .us{font-size:12px;color:var(--w30);}
  .feats{display:flex;flex-direction:column;gap:9px;margin:22px 0;}
  .feat{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--w60);}
  .ficon{font-size:13px;width:18px;text-align:center;opacity:0.65;}

  /* INFO STEP */
  .info-wrap{width:100%;max-width:480px;}
  .step-indicator{display:flex;align-items:center;gap:8px;margin-bottom:28px;}
  .step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:1.5px solid var(--gb2);}
  .step-dot.done{background:var(--g);border-color:var(--g);color:#000;}
  .step-dot.active{border-color:var(--g);color:var(--g);}
  .step-dot.inactive{color:var(--w30);}
  .step-line{flex:1;height:1px;background:var(--gb);}
  .step-line.done{background:var(--g);}

  .info-card{background:var(--glass);backdrop-filter:var(--blur);border:1px solid var(--gb);border-radius:var(--rad);padding:28px;}
  .info-label{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--w30);margin-bottom:8px;display:block;}
  .info-note{font-size:11px;color:var(--gd);margin-top:4px;}
  .info-input{width:100%;background:var(--w05);border:1px solid var(--gb2);border-radius:var(--rads);padding:13px 16px;color:var(--w);font-size:15px;font-family:var(--fb);outline:none;transition:border-color 0.18s;margin-bottom:20px;}
  .info-input:focus{border-color:rgba(48,215,128,0.5);}
  .info-input::placeholder{color:var(--w30);}
  .contract-zone{border:1.5px dashed var(--gb2);border-radius:var(--rads);padding:18px 20px;cursor:pointer;position:relative;transition:all 0.22s;display:flex;align-items:center;gap:12px;margin-bottom:4px;}
  .contract-zone:hover{border-color:rgba(48,215,128,0.4);background:rgba(48,215,128,0.03);}
  .contract-zone.filled{border-color:rgba(48,215,128,0.4);border-style:solid;}
  .contract-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .cz-icon{width:36px;height:36px;background:var(--w05);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .cz-text{flex:1;}
  .cz-title{font-size:13px;font-weight:500;margin-bottom:2px;}
  .cz-sub{font-size:11px;color:var(--w30);}
  .optional-tag{font-size:10px;font-weight:600;background:var(--w05);color:var(--w30);border:1px solid var(--gb);padding:2px 7px;border-radius:20px;}

  /* BUTTONS */
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--fd);font-weight:600;font-size:14px;border:none;cursor:pointer;border-radius:var(--rads);transition:all 0.18s;letter-spacing:-0.2px;}
  .bg{background:var(--g);color:#000;padding:14px 24px;width:100%;}
  .bg:hover{background:#3eea8c;transform:translateY(-1px);box-shadow:0 8px 32px rgba(48,215,128,0.25);}
  .bgh{background:var(--w05);color:var(--w60);border:1px solid var(--gb);padding:12px 20px;backdrop-filter:var(--blurs);}
  .bgh:hover{background:var(--w10);color:var(--w);border-color:var(--gb2);}
  .bsm{padding:7px 14px;font-size:12px;}
  .btn:disabled{opacity:0.45;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
  .btn-row{display:flex;gap:10px;margin-top:20px;}
  .btn-row .bg{flex:1;}
  .btn-row .bgh{flex-shrink:0;}

  /* ANALYZING */
  .ring{width:88px;height:88px;border-radius:50%;border:1.5px solid var(--gb2);background:var(--glass);backdrop-filter:var(--blur);display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 28px;position:relative;}
  .ring::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--g);animation:spin 1.1s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .at{font-family:var(--fd);font-weight:700;font-size:24px;letter-spacing:-0.8px;margin-bottom:8px;}
  .as{font-size:13px;color:var(--w30);margin-bottom:44px;}
  .sl{width:260px;display:flex;flex-direction:column;gap:13px;text-align:left;}
  .sr{display:flex;align-items:center;gap:11px;font-size:13px;color:var(--w30);transition:color 0.35s;}
  .sr.done{color:var(--w60);}
  .sr.act{color:var(--w);}
  .sc{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--gb2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;transition:all 0.35s;}
  .sr.done .sc{background:var(--g);border-color:var(--g);color:#000;}
  .sr.act .sc{border-color:var(--g);box-shadow:0 0 10px var(--gg);}

  /* GATE */
  .gate-wrap{width:100%;max-width:540px;}
  .gate-header{text-align:center;margin-bottom:24px;}
  .gbadge{display:inline-flex;align-items:center;gap:6px;background:var(--rg);border:1px solid rgba(255,69,58,0.22);color:var(--r);padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;margin-bottom:16px;}
  .gate-title{font-family:var(--fd);font-weight:800;font-size:30px;letter-spacing:-1.5px;line-height:1.05;margin-bottom:10px;}
  .gate-title .green{color:var(--g);}
  .gate-sub{font-size:13px;color:var(--w30);line-height:1.6;max-width:380px;margin:0 auto;}
  .gerrs{background:var(--w05);border:1px solid var(--gb);border-radius:var(--rads);padding:6px;margin-bottom:28px;}
  .gr{display:flex;align-items:center;gap:10px;padding:11px 10px;}
  .gr+.gr{border-top:1px solid var(--gb);}
  .gdot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .gdot.r{background:var(--r);box-shadow:0 0 7px rgba(255,69,58,0.7);}
  .gdot.y{background:var(--y);box-shadow:0 0 7px rgba(255,214,10,0.6);}
  .grt{font-size:12px;color:var(--w60);text-align:left;flex:1;line-height:1.4;}
  .grt b{color:var(--w);display:block;font-size:13px;font-weight:500;margin-bottom:1px;}
  .grt.blr{filter:blur(5px);opacity:0.22;user-select:none;pointer-events:none;}
  .gamt{font-family:var(--fd);font-weight:600;font-size:12px;color:var(--g);white-space:nowrap;}
  .plans{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
  @media(max-width:460px){.plans{grid-template-columns:1fr;}}
  .plan-card{border:1px solid var(--gb);border-radius:var(--rad);padding:22px 18px;cursor:pointer;transition:all 0.22s;background:rgba(255,255,255,0.025);position:relative;overflow:hidden;}
  .plan-card:hover{border-color:var(--gb2);}
  .plan-card.sel-once{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.05);}
  .plan-card.sel-pro{border-color:rgba(48,215,128,0.5);background:rgba(48,215,128,0.06);}
  .plan-card.sel-pro::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top center,rgba(48,215,128,0.07) 0%,transparent 70%);pointer-events:none;}
  .plan-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
  .plan-name-row{display:flex;align-items:center;gap:7px;}
  .plan-name{font-family:var(--fd);font-weight:700;font-size:13px;}
  .pro-badge{font-size:10px;font-weight:700;background:var(--g);color:#000;padding:2px 7px;border-radius:20px;}
  .plan-radio{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--gb2);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
  .plan-radio.on-once{border-color:var(--w60);background:var(--w60);}
  .plan-radio.on-pro{border-color:var(--g);background:var(--g);}
  .plan-radio-dot{width:6px;height:6px;border-radius:50%;background:#000;}
  .plan-price{font-family:var(--fd);font-weight:800;font-size:30px;letter-spacing:-1.5px;line-height:1;}
  .sel-pro .plan-price{color:var(--g);}
  .plan-period{font-size:11px;color:var(--w30);margin-top:3px;}
  .plan-annual{font-size:11px;color:var(--gd);font-weight:600;margin-top:2px;}
  .plan-div{height:1px;background:var(--gb);margin:14px 0;}
  .plan-feats{display:flex;flex-direction:column;gap:7px;}
  .pf{display:flex;align-items:center;gap:7px;font-size:11px;}
  .pfc{width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:8px;font-weight:700;}
  .pfc.yo{background:rgba(255,255,255,0.12);color:var(--w60);}
  .pfc.yp{background:var(--gg);color:var(--g);border:1px solid rgba(48,215,128,0.3);}
  .pfc.n{background:transparent;color:var(--w30);border:1px solid var(--gb);}
  .pft{color:var(--w60);}
  .pft.mt{color:var(--w30);}
  .stripe-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--g);color:#000;padding:15px 24px;border-radius:var(--rads);border:none;cursor:pointer;width:100%;font-family:var(--fd);font-weight:700;font-size:15px;transition:all 0.18s;letter-spacing:-0.3px;margin-bottom:12px;}
  .stripe-btn:hover{background:#3eea8c;transform:translateY(-1px);box-shadow:0 10px 36px rgba(48,215,128,0.28);}
  .stripe-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}
  .stripe-sub{font-size:11px;opacity:0.6;font-weight:400;}
  .secure-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px;flex-wrap:wrap;}
  .si{font-size:11px;color:var(--w30);display:flex;align-items:center;gap:4px;}
  .disclaimer{font-size:11px;color:var(--w30);text-align:center;line-height:1.6;padding:12px 16px;background:var(--w05);border-radius:var(--rads);border:1px solid var(--gb);margin-bottom:10px;}
  .demo-link{font-size:12px;color:var(--w30);text-align:center;}
  .demo-link a{color:var(--w60);text-decoration:underline;cursor:pointer;}

  /* SUCCESS */
  .success-ring{width:88px;height:88px;border-radius:50%;background:var(--gg);border:1px solid rgba(48,215,128,0.3);display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto 28px;animation:pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275);}
  @keyframes pop{from{transform:scale(0.4);opacity:0;}to{transform:scale(1);opacity:1;}}

  /* RESULTS */
  .rey{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--w30);margin-bottom:10px;}
  .reh{font-family:var(--fd);font-weight:800;font-size:36px;letter-spacing:-2px;margin-bottom:5px;}
  .rem{font-size:13px;color:var(--w30);margin-bottom:36px;}
  .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:32px;}
  @media(max-width:560px){.kpis{grid-template-columns:1fr;}}
  .kpi{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:20px 18px;backdrop-filter:var(--blurs);}
  .kpi.ak{background:rgba(48,215,128,0.06);border-color:rgba(48,215,128,0.18);}
  .kpil{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--w30);margin-bottom:8px;}
  .kpiv{font-family:var(--fd);font-weight:700;font-size:28px;letter-spacing:-1.5px;}
  .kpi.ak .kpiv{color:var(--g);}
  .kpis2{font-size:11px;color:var(--w30);margin-top:3px;}
  .rpill{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:20px;font-size:11px;font-weight:600;}
  .rpill.kritisch{background:var(--rg);border:1px solid rgba(255,69,58,0.2);color:var(--r);}
  .rpill.mittel{background:var(--yg);border:1px solid rgba(255,214,10,0.2);color:var(--y);}
  .rpill.gering{background:var(--gg);border:1px solid rgba(48,215,128,0.2);color:var(--g);}
  .sumbox{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:18px 22px;font-size:13px;line-height:1.7;color:var(--w60);margin-bottom:32px;backdrop-filter:var(--blurs);}
  .sh{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
  .sht{font-family:var(--fd);font-weight:600;font-size:14px;}
  .shl{flex:1;height:1px;background:var(--gb);}
  .elist{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;}
  .ei{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:18px 18px 18px 0;display:flex;overflow:hidden;transition:border-color 0.2s;backdrop-filter:var(--blurs);}
  .ei:hover{border-color:var(--gb2);}
  .estr{width:3px;flex-shrink:0;margin-right:16px;border-radius:0 3px 3px 0;}
  .estr.critical{background:var(--r);}.estr.warning{background:var(--y);}.estr.info{background:var(--bl);}
  .ebody{flex:1;}
  .etag{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--w30);margin-bottom:4px;}
  .etag.critical{color:rgba(255,69,58,0.75);}.etag.warning{color:rgba(255,214,10,0.65);}.etag.info{color:rgba(10,132,255,0.75);}
  .en{font-family:var(--fd);font-weight:600;font-size:14px;margin-bottom:5px;}
  .ed{font-size:13px;color:var(--w30);line-height:1.55;}
  .esav{margin-top:9px;display:inline-flex;align-items:center;gap:4px;background:var(--gg);border:1px solid rgba(48,215,128,0.18);color:var(--gd);padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
  .ar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;}
  .ar .bg{flex:1;width:auto;}
  .back{display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;color:var(--w30);font-size:13px;padding:0 0 24px;font-family:var(--fb);transition:color 0.2s;}
  .back:hover{color:var(--w60);}
  .lsh{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rad);overflow:hidden;margin-bottom:18px;}
  .lh{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--gb);background:var(--w05);}
  .lhl{font-size:12px;font-weight:600;color:var(--w60);}
  .lb{padding:28px;font-size:13px;line-height:1.9;color:var(--w60);white-space:pre-wrap;font-family:var(--fb);font-weight:300;}
  .cs{display:flex;flex-direction:column;align-items:center;padding:80px 0;gap:14px;}
  .sp{width:26px;height:26px;border:2px solid var(--gb2);border-top-color:var(--g);border-radius:50%;animation:spin 0.9s linear infinite;}
  .toast-w{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:999;}
  .toast{background:rgba(20,20,30,0.92);backdrop-filter:var(--blur);border:1px solid var(--gb2);color:var(--w);padding:11px 18px;border-radius:40px;font-size:13px;font-weight:500;white-space:nowrap;animation:fu 0.25s ease;}
  @keyframes fu{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .fi{animation:fi 0.45s ease forwards;}
  @keyframes fi{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  /* ── AUTH MODAL ── */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px;}
  .auth-card{background:#0f0f1e;border:1px solid var(--gb2);border-radius:24px;padding:40px 36px;width:100%;max-width:400px;animation:fi 0.3s ease;}
  .auth-logo{width:40px;height:40px;background:var(--g);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#000;font-family:var(--fd);margin:0 auto 20px;}
  .auth-title{font-family:var(--fd);font-weight:800;font-size:22px;letter-spacing:-1px;text-align:center;margin-bottom:6px;}
  .auth-sub{font-size:13px;color:var(--w30);text-align:center;margin-bottom:28px;}
  .auth-input{width:100%;background:var(--w05);border:1px solid var(--gb2);border-radius:var(--rads);padding:13px 16px;color:var(--w);font-size:14px;font-family:var(--fb);outline:none;transition:border-color 0.18s;margin-bottom:12px;}
  .auth-input:focus{border-color:rgba(48,215,128,0.5);}
  .auth-input::placeholder{color:var(--w30);}
  .auth-divider{display:flex;align-items:center;gap:12px;margin:16px 0;}
  .auth-divider-line{flex:1;height:1px;background:var(--gb);}
  .auth-divider-text{font-size:11px;color:var(--w30);}
  .google-btn{width:100%;background:var(--w05);border:1px solid var(--gb2);color:var(--w);padding:12px;border-radius:var(--rads);font-family:var(--fd);font-weight:600;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.18s;margin-bottom:14px;}
  .google-btn:hover{background:var(--w10);border-color:var(--gb2);}
  .auth-switch{font-size:12px;color:var(--w30);text-align:center;margin-top:14px;}
  .auth-switch a{color:var(--gd);text-decoration:underline;cursor:pointer;}
  .auth-err{font-size:12px;color:var(--r);text-align:center;margin-top:10px;}
  .auth-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--w30);font-size:20px;cursor:pointer;line-height:1;}
  /* ── NAV USER ── */
  .user-avatar{width:30px;height:30px;background:var(--gg);border:1px solid rgba(48,215,128,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--g);font-family:var(--fd);cursor:pointer;transition:all 0.18s;}
  .user-avatar:hover{background:rgba(48,215,128,0.2);}
  .user-menu{position:absolute;top:calc(100% + 8px);right:0;background:#0f0f1e;border:1px solid var(--gb2);border-radius:var(--rads);overflow:hidden;min-width:180px;z-index:200;box-shadow:0 16px 40px rgba(0,0,0,0.5);}
  .user-menu-head{padding:14px 16px;border-bottom:1px solid var(--gb);}
  .user-menu-email{font-size:12px;color:var(--w60);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .user-menu-plan{font-size:11px;font-weight:600;color:var(--gd);}
  .user-menu-item{display:flex;align-items:center;gap:8px;padding:11px 16px;font-size:13px;color:var(--w60);cursor:pointer;transition:background 0.15s;}
  .user-menu-item:hover{background:var(--w05);color:var(--w);}
  .user-menu-sep{height:1px;background:var(--gb);}
  /* ── ACCOUNT SCREEN ── */
  .account-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;}
  @media(max-width:600px){.account-grid{grid-template-columns:1fr;}}
  .acc-stat{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:20px 18px;backdrop-filter:var(--blurs);}
  .acc-stat-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--w30);margin-bottom:8px;}
  .acc-stat-value{font-family:var(--fd);font-weight:700;font-size:24px;letter-spacing:-1px;}
  .report-list{display:flex;flex-direction:column;gap:10px;margin-bottom:32px;}
  .report-card{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:border-color 0.2s;backdrop-filter:var(--blurs);}
  .report-card:hover{border-color:var(--gb2);}
  .report-icon{width:38px;height:38px;background:var(--w05);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
  .report-info{flex:1;}
  .report-landlord{font-family:var(--fd);font-weight:600;font-size:14px;margin-bottom:3px;}
  .report-meta{font-size:12px;color:var(--w30);}
  .report-saving{font-family:var(--fd);font-weight:700;font-size:14px;color:var(--g);}
  .deadline-list{display:flex;flex-direction:column;gap:8px;margin-bottom:32px;}
  .dl-card{background:var(--glass);border:1px solid var(--gb);border-radius:var(--rads);padding:14px 18px;display:flex;align-items:center;gap:14px;backdrop-filter:var(--blurs);}
  .dl-card.urgent{border-color:rgba(255,69,58,0.3);background:rgba(255,69,58,0.04);}
  .dl-card.soon{border-color:rgba(255,214,10,0.25);background:rgba(255,214,10,0.03);}
  .dl-days{font-family:var(--fd);font-weight:700;font-size:20px;letter-spacing:-0.5px;min-width:42px;}
  .dl-days.urgent{color:var(--r);}
  .dl-days.soon{color:var(--y);}
  .dl-days.ok{color:var(--g);}
  .dl-info{flex:1;}
  .dl-landlord{font-size:13px;font-weight:500;margin-bottom:2px;}
  .dl-date{font-size:11px;color:var(--w30);}
  .dl-badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;}
  .dl-badge.urgent{background:var(--rg);color:var(--r);}
  .dl-badge.soon{background:var(--yg);color:var(--y);}
  .dl-badge.ok{background:var(--gg);color:var(--gd);}
  .pro-lock{display:flex;flex-direction:column;align-items:center;padding:40px 20px;text-align:center;background:var(--glass);border:1px solid var(--gb);border-radius:var(--rad);backdrop-filter:var(--blurs);}
  .pro-lock-icon{font-size:32px;margin-bottom:16px;}
  .pro-lock-title{font-family:var(--fd);font-weight:700;font-size:18px;letter-spacing:-0.5px;margin-bottom:8px;}
  .pro-lock-sub{font-size:13px;color:var(--w30);margin-bottom:20px;line-height:1.6;}
`;

const ASTEPS_KEY = ["PDF wird eingelesen","Positionen extrahiert","Mietdaten abgeglichen","Fristen berechnet","Bericht erstellt"];


// ─────────────────────────────────────────────────────────
// TESTIMONIALS — werden aus Supabase geladen, Demo als Fallback
// ─────────────────────────────────────────────────────────
const DEMO_TESTIMONIALS = [
  { name:"Thomas W.", city:"München", savings:78,  rating:5, text:"Total einfach und hat mir 78 € gespart. Der Widerspruchsbrief war in 2 Minuten fertig.", country:"🇩🇪" },
  { name:"Sarah K.",  city:"Berlin",  savings:340, rating:5, text:"Hatte keine Ahnung dass mein Vermieter die Verwaltungskosten nicht umlegen darf. Echte Augenöffner!", country:"🇩🇪" },
  { name:"Mehmet Y.", city:"Hamburg", savings:215, rating:5, text:"Çok kolay kullandım, 215 € geri aldım. Herkese tavsiye ederim.", country:"🇹🇷" },
  { name:"Jana P.",   city:"Wien",    savings:160, rating:4, text:"Österreich ist dabei! Hat 2 Fehler in meiner Abrechnung gefunden, Vermieter hat nachgezahlt.", country:"🇦🇹" },
  { name:"Nico F.",   city:"Köln",    savings:95,  rating:5, text:"Dachte das Tool findet nichts. Falsch gedacht — Verteilerschlüssel war falsch.", country:"🇩🇪" },
  { name:"Olga M.",   city:"Frankfurt",savings:420,rating:5, text:"420 Euro! Das ist mein bester ROI seit Jahren. Danke Hektagon.", country:"🇩🇪" },
  { name:"Lukas B.",  city:"Zürich",  savings:310, rating:5, text:"Auch in der Schweiz funktioniert es super. Klare Empfehlung.", country:"🇨🇭" },
  { name:"Yasmin A.", city:"Stuttgart",savings:180,rating:4, text:"Einfach zu bedienen. Alles klar erklärt. Hat meinen Vermieter überzeugend.",country:"🇩🇪" },
  { name:"Pavel N.",  city:"Düsseldorf",savings:125,rating:5,text:"Nigdy nie sprawdzałem rachunków. Teraz zawsze będę. Zaoszczędziłem 125 €.",country:"🇵🇱" },
  { name:"Anna L.",   city:"Leipzig", savings:230, rating:5, text:"Meine Nachzahlung war 230 € zu hoch. Das Schreiben hat der Vermieter sofort akzeptiert.", country:"🇩🇪" },
];


const DEMO = {
  landlord:"Hausverwaltung Muster GmbH", period:"01.01.2023 – 31.12.2023",
  totalClaimed:2847, estimatedSavings:412, overallRisk:"kritisch",
  errors:[
    {type:"critical",category:"Nicht umlagefähige Kosten",title:"Verwaltungskosten unzulässig",description:"Der Posten 'Hausverwaltung' (€180) ist nach §1 Abs. 2 BetrKV ausdrücklich nicht umlagefähig.",impact:180},
    {type:"critical",category:"Falscher Verteilerschlüssel",title:"Wohnfläche weicht vom Vertrag ab",description:"Mietvertrag: 67 m² – Abrechnung rechnet mit 71 m². Alle flächenabhängigen Kosten sind anteilig überhöht.",impact:145},
    {type:"warning",category:"Wirtschaftlichkeitsgebot",title:"Hausmeisterkosten 38% über Schnitt",description:"BGH-Rechtsprechung verpflichtet den Vermieter zur wirtschaftlichen Betriebsführung.",impact:87},
    {type:"warning",category:"Frist",title:"Einspruchsfrist: noch 6 Wochen",description:"Nach §556 Abs. 3 BGB haben Sie 12 Monate Einspruchsrecht. Frist läuft bald ab.",impact:0},
    {type:"info",category:"Belegrecht",title:"Originalbelege fehlen (3 Positionen)",description:"Für Gebäudeversicherung, Treppenhausreinigung und Gartenpflege liegen keine Belege vor.",impact:0},
  ],
  summary:"Die Abrechnung enthält zwei rechtlich eindeutige Fehler mit einer nachweisbaren Überzahlung von mindestens €325. Zusätzlich bestehen berechtigte Zweifel an der Wirtschaftlichkeit der Hausmeisterkosten."
};

export default function App() {
  const [step, setStep] = useState(S.UPLOAD);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [floorArea, setFloorArea] = useState("");
  const [prepay, setPrepay] = useState("");
  const [done, setDone] = useState(0);
  const [result, setResult] = useState(null);
  const [letter, setLetter] = useState("");
  const [loadL, setLoadL] = useState(false);
  const [toast, setToast] = useState(null);
  const [plan, setPlan] = useState("pro");
  const [paying, setPaying] = useState(false);
  const [lang, setLang] = useState("de");
  const [langOpen, setLangOpen] = useState(false);
  const [country, setCountry] = useState("DE");
  const [countryOpen, setCountryOpen] = useState(false);
  const [ipDetected, setIpDetected] = useState(false);
  // ── AUTH STATE ──
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState(null); // "once" | "pro" | null
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authEmail, setAuthEmail] = useState("");
  const [authPw, setAuthPw] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [testimonials, setTestimonials] = useState(DEMO_TESTIMONIALS);
  const billRef = useRef();
  const contractRef = useRef();
  const t = T[lang];
  const co = COUNTRIES[country] || COUNTRIES.DE;
  const isPro = userPlan === "pro";

  const tip = (m) => { setToast(m); setTimeout(() => setToast(null), 2800); };

  useEffect(() => {
    // Stripe redirect check
    const p = new URLSearchParams(window.location.search);
    if (p.get("paid") === "true") {
      const s = sessionStorage.getItem("hektagon_result");
      if (s) { setResult(JSON.parse(s)); setStep(S.SUCCESS); }
    }
    // IP-basierte Ländererkennung
    detectCountry().then(code => {
      const supported = ["DE","AT","CH"];
      const detected = supported.includes(code) ? code : "DE";
      setCountry(detected);
      setLang(COUNTRIES[detected]?.defaultLang || "de");
      if (supported.includes(code)) setIpDetected(true);
    });
    // Supabase Auth Session check (lazy init)
    let authSub = null;
    getSupabase().then(sb => {
      if (!sb) return;
      sb.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) { setUser(session.user); fetchUserPlan(session.user.id); }
      });
      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        if (session?.user) fetchUserPlan(session.user.id);
        else { setUserPlan(null); setSavedReports([]); }
      });
      authSub = subscription;
    });
    const handler = () => { setLangOpen(false); setCountryOpen(false); setUserMenuOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── AUTH FUNCTIONS ──
  const fetchUserPlan = async (uid) => {
    const sb = await getSupabase();
    if (!sb) return;
    try {
      const { data } = await sb.from("subscriptions").select("plan").eq("user_id", uid).single();
      setUserPlan(data?.plan || null);
    } catch { setUserPlan(null); }
  };

  const fetchSavedReports = async () => {
    const sb = await getSupabase();
    if (!sb || !user) return;
    setLoadingReports(true);
    try {
      const { data } = await sb.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setSavedReports(data || []);
    } catch { setSavedReports([]); }
    setLoadingReports(false);
  };

  const saveReportToSupabase = async (reportData) => {
    const sb = await getSupabase();
    if (!sb || !user) return;
    try {
      await sb.from("reports").insert({
        user_id: user.id,
        landlord: reportData.landlord,
        period: reportData.period,
        total_claimed: reportData.totalClaimed,
        savings: reportData.estimatedSavings,
        risk: reportData.overallRisk,
        country: country,
        data: reportData,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch(e) { console.warn("Save report failed:", e); }
  };

  const handleAuthSubmit = async () => {
    const sb = await getSupabase();
    if (!sb) return tip("Supabase not configured — add URL + Key to hektagon.jsx");
    setAuthLoading(true); setAuthErr("");
    try {
      if (authMode === "signup") {
        const { error } = await sb.auth.signUp({ email: authEmail, password: authPw });
        if (error) throw error;
        tip("✓ Bestätigungs-E-Mail gesendet");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email: authEmail, password: authPw });
        if (error) throw error;
        tip("✓ Eingeloggt");
      }
      setAuthModal(false);
    } catch(e) { setAuthErr(e.message || "Fehler beim Einloggen"); }
    setAuthLoading(false);
  };

  const handleGoogleAuth = async () => {
    const sb = await getSupabase();
    if (!sb) return tip("Supabase not configured — add URL + Key to hektagon.jsx");
    await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  };

  const handleSignOut = async () => {
    const sb = await getSupabase();
    if (sb) await sb.auth.signOut();
    setUser(null); setUserPlan(null); setSavedReports([]); setUserMenuOpen(false);
    tip("Ausgeloggt");
  };

  const openAccount = () => {
    setUserMenuOpen(false);
    setStep(S.ACCOUNT);
    fetchSavedReports();
  };

  // Deadline helpers
  const daysUntil = (iso) => Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 86400000));
  const deadlineClass = (days) => days < 30 ? "urgent" : days < 90 ? "soon" : "ok";
  const deadlineLabel = (days) => days < 30 ? t.deadlineUrgent : days < 90 ? t.deadlineSoon : t.deadlineOk;

    const submitReview = async () => {
    if (!reviewStars || !reviewText.trim()) return;
    setReviewSaving(true);
    try {
      const sb = await getSupabase();
      if (sb && user) {
        await sb.from("reviews").insert({
          user_id: user.id,
          stars: reviewStars,
          text: reviewText.trim(),
          savings: result?.estimatedSavings || 0,
          country: country,
          created_at: new Date().toISOString(),
        });
      }
      // Add to local testimonials immediately
      setTestimonials(prev => [{
        name: user?.email?.split("@")[0] || "Anonym",
        city: co.name,
        savings: result?.estimatedSavings || 0,
        rating: reviewStars,
        text: reviewText.trim(),
        country: co.flag,
      }, ...prev]);
      setReviewSent(true);
      tip("✓ Danke für dein Feedback!");
    } catch(e) {
      tip("Fehler beim Speichern — bitte nochmal versuchen");
    }
    setReviewSaving(false);
  };

  const handleBill = (f) => {
    if (!f || f.type !== "application/pdf") return tip(t.notPdf);
    setFile(f);
    setStep(S.INFO);
  };

  const analyze = async () => {
    setStep(S.ANALYZING); setDone(0);
    for (let i = 1; i <= 5; i++) { await new Promise(r => setTimeout(r, 1700)); setDone(i); }

    const toB64 = (f) => new Promise(r => { const rd = new FileReader(); rd.onload = () => r(rd.result.split(",")[1]); rd.readAsDataURL(f); });
    const billB64 = await toB64(file);
    const contractB64 = contractFile ? await toB64(contractFile) : null;

    const infoContext = `Land: ${co.name}. Anzuwendendes Recht: ${co.lawFull}. Mieterdaten: Wohnfläche laut Mietvertrag: ${floorArea || "nicht angegeben"} m², Monatliche Vorauszahlung: ${prepay || "nicht angegeben"} ${co.currency}.`;

    const userContent = [
      { type: "document", source: { type: "base64", media_type: "application/pdf", data: billB64 } },
      ...(contractB64 ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: contractB64 } }] : []),
      { type: "text", text: `${infoContext}\n\nAnalysiere die Nebenkostenabrechnung auf Fehler nach ${co.law}. Nutze die angegebenen Mieterdaten für den Abgleich. Antworte NUR mit JSON ohne Markdown.` }
    ];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: co.systemPrompt,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      const d = await res.json();
      const parsed = JSON.parse(d.content?.map(i => i.text || "").join("").replace(/```json|```/g, "").trim());
      setResult(parsed);
      sessionStorage.setItem("hektagon_result", JSON.stringify(parsed));
      const isAllClear = parsed.estimatedSavings === 0 && parsed.errors.filter(e=>e.type==="critical").length === 0;
      setStep(isAllClear ? S.ALLCLEAR : S.GATE);
    } catch {
      setResult(DEMO);
      sessionStorage.setItem("hektagon_result", JSON.stringify(DEMO));
      setStep(S.GATE);
    }
  };

  const handlePay = () => {
    setPaying(true);
    if (result) sessionStorage.setItem("hektagon_result", JSON.stringify(result));
    // In Produktion: redirect zu Stripe. Hier Demo-Simulation:
    setTimeout(() => {
      setPaying(false);
      setStep(S.SUCCESS);
      // Nach erfolgreicher Zahlung: Report speichern (wenn eingeloggt)
      if (result && user) saveReportToSupabase(result);
    }, 1600);
  };

  const genLetter = async () => {
    if (!result) return; setLoadL(true); setStep(S.LETTER);
    try {
      const errs = result.errors.filter(e => e.type !== "info").map(e => `- ${e.title}: ${e.description}`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Schreibe formelles deutsches Widerspruchsschreiben. Vermieter: ${result.landlord}. Zeitraum: ${result.period}. Fehler:\n${errs}\nAnforderungen: §556 BGB, BetrKV, 30-Tage-Frist, Zahlung unter Vorbehalt, Platzhalter [Mieter] und [Adresse Vermieter]. Nur Brieftext.` }] }),
      });
      const d = await res.json(); setLetter(d.content?.[0]?.text || "");
    } catch {
      setLetter(`[Mieter]\n[Straße, PLZ Ort]\n[Datum]\n\n${result?.landlord}\n[Adresse Vermieter]\n\nWiderspruch gegen Nebenkostenabrechnung ${result?.period}\n\nSehr geehrte Damen und Herren,\n\nhiermit widerspreche ich fristgerecht.\n\n1. Unzulässige Verwaltungskosten (§1 Abs. 2 Nr. 1 BetrKV)\n2. Falscher Verteilerschlüssel (§556a BGB)\n3. Verstoß Wirtschaftlichkeitsgebot (§556 BGB)\n\nFrist: 30 Tage. Zahlung unter Vorbehalt.\n\nMit freundlichen Grüßen\n[Mieter]`);
    }
    setLoadL(false);
  };

  const r = result || DEMO;

  const PLANS_DATA = {
    once: { id:"once", name:t.planOnceName, price:"€9", period:t.planOncePeriod, features:[
      {text:t.featAnalysis,ok:true},{text:t.featErrors,ok:true},{text:t.featLetter,ok:true},
      {text:t.featAlarm,ok:false},{text:t.featCompare,ok:false},{text:t.featArchive,ok:false},{text:t.featUnlimited,ok:false},
    ]},
    pro: { id:"pro", name:t.planProName, price:"€1,99", period:t.planProPeriod, annual:`€23,90 – ${t.planProAnnual}`, features:[
      {text:t.featAnalysis,ok:true},{text:t.featErrors,ok:true},{text:t.featLetter,ok:true},
      {text:t.featAlarm,ok:true},{text:t.featCompare,ok:true},{text:t.featArchive,ok:true},{text:t.featUnlimited,ok:true},
    ]},
  };

  return (
    <>
      <style>{css}</style>
      <div className="amb"><div className="o1"/><div className="o2"/><div className="o3"/></div>
      <div className="noise"/>
      <div className="app app-padded">
        <nav className="nav">
          <div className="nav-logo"><div className="lm">H</div>Hektagon</div>
          <div className="nav-right">
            {/* Auth Nav */}
            {user ? (
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <div className="user-avatar" onClick={()=>setUserMenuOpen(o=>!o)}>
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
                {userMenuOpen && (
                  <div className="user-menu">
                    <div className="user-menu-head">
                      <div className="user-menu-email">{user.email}</div>
                      <div className="user-menu-plan">{isPro ? "✦ Pro" : "Basis"}</div>
                    </div>
                    <div className="user-menu-item" onClick={openAccount}>📂 Meine Reports</div>
                    <div className="user-menu-item" onClick={openAccount}>⏰ Fristen</div>
                    {!isPro && <div className="user-menu-item" onClick={()=>{setUserMenuOpen(false);setStep(S.GATE);}} style={{color:"var(--gd)"}}>✦ Auf Pro upgraden</div>}
                    <div className="user-menu-sep"/>
                    <div className="user-menu-item" onClick={handleSignOut}>← Ausloggen</div>
                  </div>
                )}
              </div>
            ) : (
              <button className="sign-in-btn" onClick={()=>{setAuthMode("login");setAuthModal(true);}}>Sign in</button>
            )}

            {/* Country Switcher */}
            <div className="country-wrap" onClick={e => e.stopPropagation()}>
              <button className={`country-btn${ipDetected ? " country-detected" : ""}`} onClick={() => setCountryOpen(o => !o)}>
                {COUNTRIES[country]?.flag} {country} ▾
              </button>
              {countryOpen && (
                <div className="country-dropdown">
                  {Object.values(COUNTRIES).map(c => (
                    <div key={c.code} className={`country-option${country===c.code?" active":""}`}
                      onClick={() => { setCountry(c.code); setCountryOpen(false); }}>
                      <span style={{fontSize:18}}>{c.flag}</span>
                      <div className="country-option-info">
                        <div className="country-option-name">{c.name}</div>
                        <div className="country-option-law">{c.law}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="lang-wrap" onClick={e => e.stopPropagation()}>
              <button className="lang-btn" onClick={() => setLangOpen(o => !o)}>
                {T[lang].flag} {T[lang].name} ▾
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {Object.entries(T).map(([k, v]) => (
                    <div key={k} className={`lang-option${lang===k?" active":""}`} onClick={() => { setLang(k); setLangOpen(false); }}>
                      {v.flag} {v.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── STEP 1: UPLOAD ── */}
        {step === S.UPLOAD && (
          <div className="page fi">
            <div className="hero">
              <div className="hbadge"><div className="hbdot"/>{t.badge}</div>
              <h1 className="h1">{t.hero1}<br/><span className="dim">{t.hero2}</span></h1>
              <p className="hsub">{t.heroSub}</p>
              <div className="stats">
                <div className="st"><div className="stn">{co.currency}{co.avgOvercharge}</div><div className="stl">{t.stat1}</div></div>
                <div className="st"><div className="stn">{co.errorRate}%</div><div className="stl">{t.stat2}</div></div>
                <div className="st"><div className="stn">&lt;60s</div><div className="stl">{t.stat3}</div></div>
              </div>
            </div>
            <div className="uw">
              <div className={`uz${drag?" drag":""}${file?" filled":""}`}
                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);handleBill(e.dataTransfer.files[0]);}}
                onClick={()=>billRef.current?.click()}>
                <input ref={billRef} type="file" accept=".pdf" onChange={e=>handleBill(e.target.files[0])}/>
                <div className="uiw">{file ? "✅" : "📄"}</div>
                <div className="ut">{file ? file.name : t.uploadTitle}</div>
                <div className="us">{file ? t.uploaded : t.uploadSub}</div>
              </div>
              <div className="feats">
                <div className="feat"><span className="ficon">⚖️</span>{t.feat1}</div>
                <div className="feat"><span className="ficon">🔒</span>{t.feat2}</div>
                <div className="feat"><span className="ficon">✦</span>{t.feat3}</div>
              </div>
              <button className="btn bg" onClick={() => file ? setStep(S.INFO) : billRef.current?.click()}>{t.startBtn}</button>
            </div>

          </div>
        )}

        {/* ── STEP 2: INFO ── */}
        {step === S.INFO && (
          <div className="page fi">
            <div className="info-wrap">
              {/* Progress */}
              <div className="step-indicator">
                <div className="step-dot done">✓</div>
                <div className="step-line done"/>
                <div className="step-dot active">2</div>
                <div className="step-line"/>
                <div className="step-dot inactive">3</div>
              </div>

              {ipDetected && (
                <div className="ip-banner">
                  📍 Erkannt: {co.flag} {co.name} · Recht: {co.law}
                  <span style={{marginLeft:"auto",fontSize:11,opacity:0.7,cursor:"pointer"}} onClick={()=>setCountryOpen(true)}>{lang==="de"?"Ändern":lang==="tr"?"Değiştir":lang==="en"?"Change":lang==="pl"?"Zmień":"Изменить"}</span>
                </div>
              )}

              <div style={{marginBottom:24}}>
                <div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:20,letterSpacing:-0.8,marginBottom:4}}>{t.step2title}</div>
                <div style={{fontSize:13,color:"var(--w30)"}}>{t.step2sub}</div>
              </div>

              <div className="info-card">
                <label className="info-label">
                  {t.floorLabel}
                </label>
                <input
                  className="info-input"
                  type="number"
                  placeholder={t.floorPlaceholder}
                  value={floorArea}
                  onChange={e => setFloorArea(e.target.value)}
                />
                <div className="info-note" style={{marginTop:-14,marginBottom:20}}>{t.floorNote}</div>

                <label className="info-label">{t.prepayLabel}</label>
                <input
                  className="info-input"
                  type="number"
                  placeholder={t.prepayPlaceholder}
                  value={prepay}
                  onChange={e => setPrepay(e.target.value)}
                />

                <label className="info-label" style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"}}>
                  {t.mietvertragLabel}
                  <span className="optional-tag">optional</span>
                </label>
                <div className={`contract-zone${contractFile?" filled":""}`} onClick={()=>contractRef.current?.click()}>
                  <input ref={contractRef} type="file" accept=".pdf" onChange={e=>setContractFile(e.target.files[0]||null)}/>
                  <div className="cz-icon">{contractFile?"📋":"📎"}</div>
                  <div className="cz-text">
                    <div className="cz-title">{contractFile ? contractFile.name : t.contractLabel}</div>
                    <div className="cz-sub">{contractFile ? t.uploaded : t.contractSub}</div>
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn bgh" onClick={()=>setStep(S.UPLOAD)}>{t.backBtn}</button>
                <button className="btn bg" disabled={!floorArea} onClick={analyze}>{t.analyzeBtn}</button>
              </div>
              {!floorArea && <div style={{fontSize:11,color:"var(--r)",marginTop:8,textAlign:"center",opacity:0.8}}>{t.floorNote}</div>}
            </div>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {step === S.ANALYZING && (
          <div className="page fi" style={{textAlign:"center"}}>
            <div className="ring">🔍</div>
            <div className="at">{t.analyzing}</div>
            <p className="as">{t.analyzingSub}</p>
            <div className="sl">
              {t.asteps.map((s,i)=>(
                <div key={i} className={`sr${done>i?" done":done===i?" act":""}`}>
                  <div className="sc">{done>i?"✓":""}</div>{s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GATE ── */}
        {step === S.GATE && r && (
          <div className="page fi">
            <div className="gate-wrap">
              <div className="gate-header">
                <div className="gbadge">🔴 {r.errors.filter(e=>e.type==="critical").length} {t.critFound}</div>
                <div className="gate-title">{lang==="de"?"Wir haben":lang==="tr"?"Bulduk":lang==="en"?"We found":lang==="pl"?"Znaleźliśmy":"Найдено"} <span className="green">€{r.estimatedSavings}</span> {t.savingsFound}</div>
                <p className="gate-sub">{t.gateSub}</p>
              </div>
              <div className="gerrs">
                {r.errors.slice(0,2).map((e,i)=>(
                  <div className="gr" key={i}>
                    <div className={`gdot ${e.type==="critical"?"r":"y"}`}/>
                    <div className="grt"><b>{e.title}</b>{e.category}</div>
                    {e.impact>0&&<div className="gamt">–€{e.impact}</div>}
                  </div>
                ))}
                {r.errors.slice(2).map((_,i)=>(
                  <div className="gr" key={i+2}>
                    <div className="gdot y" style={{opacity:0.2}}/>
                    <div className="grt blr"><b>████████████████</b>{t.locked}</div>
                    <div className="gamt" style={{opacity:0.15}}>–€??</div>
                  </div>
                ))}
              </div>
              <div className="plans">
                {Object.values(PLANS_DATA).map(p=>{
                  const sel = plan===p.id;
                  const isPro = p.id==="pro";
                  return(
                    <div key={p.id} className={`plan-card${sel?(isPro?" sel-pro":" sel-once"):""}`} onClick={()=>setPlan(p.id)}>
                      <div className="plan-top">
                        <div className="plan-name-row">
                          <div className="plan-name">{p.name}</div>
                          {isPro&&<div className="pro-badge">Pro</div>}
                        </div>
                        <div className={`plan-radio${sel?(isPro?" on-pro":" on-once"):""}`}>
                          {sel&&<div className="plan-radio-dot"/>}
                        </div>
                      </div>
                      <div className="plan-price" style={isPro&&sel?{color:"var(--g)"}:{}}>{p.price}</div>
                      <div className="plan-period">{p.period}</div>
                      {p.annual&&<div className="plan-annual">{p.annual}</div>}
                      <div className="plan-div"/>
                      <div className="plan-feats">
                        {p.features.map((f,i)=>(
                          <div className="pf" key={i}>
                            <div className={`pfc ${f.ok?(isPro?"yp":"yo"):"n"}`}>{f.ok?"✓":"–"}</div>
                            <div className={`pft${!f.ok?" mt":""}`}>{f.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="stripe-btn" onClick={handlePay} disabled={paying}>
                {paying
                  ?<><div className="sp" style={{width:18,height:18,borderWidth:2}}/> </>
                  :plan==="pro"
                    ?<>{t.payPro} <span className="stripe-sub">{t.viaStripe}</span></>
                    :<>{t.payOnce} <span className="stripe-sub">{t.viaStripe}</span></>
                }
              </button>
              <div className="secure-row">
                <div className="si">🔒 {t.ssl}</div>
                <div className="si">↩ {t.money}</div>
                <div className="si">⚡ {t.instant}</div>
              </div>
              <div className="disclaimer">{t.disclaimer}</div>
              <div className="demo-link"><a onClick={()=>setStep(S.RESULTS)}>{t.demoLink}</a></div>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === S.SUCCESS && (
          <div className="page fi" style={{textAlign:"center"}}>
            <div className="success-ring">✓</div>
            <h2 style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:28,letterSpacing:-1,marginBottom:10}}>
              {plan==="pro"?t.successTitle:t.successTitleOnce}
            </h2>
            <p style={{color:"var(--w30)",fontSize:14,maxWidth:320,margin:"0 auto 8px"}}>
              {plan==="pro"?t.successPro:t.successOnce}
            </p>
            {plan==="pro"&&<p style={{color:"var(--gd)",fontSize:13,marginBottom:12,fontWeight:500}}>{t.monthly}</p>}

            {/* Login prompt for non-logged-in users */}
            {!user && (
              <div style={{background:"rgba(48,215,128,0.07)",border:"1px solid rgba(48,215,128,0.2)",borderRadius:14,padding:"16px 20px",maxWidth:320,margin:"0 auto 20px",textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>💡 Report speichern?</div>
                <div style={{fontSize:12,color:"var(--w60)",marginBottom:12,lineHeight:1.6}}>
                  Erstelle einen kostenlosen Account um diesen Report zu speichern und Fristen zu tracken.
                </div>
                <button className="btn bg" style={{fontSize:13,padding:"10px 18px",width:"auto"}}
                  onClick={()=>{setAuthMode("signup");setAuthModal(true);}}>
                  Kostenlos registrieren
                </button>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"8px auto 0",width:"100%"}}>
              <button className="btn bg" onClick={()=>setStep(S.RESULTS)}>
                {t.viewReport}
              </button>
              <button className="btn bgh" onClick={()=>{setReviewStars(0);setReviewText("");setReviewSent(false);setStep(S.REVIEW);}}>
                {lang==="de"?"⭐ Bewertung hinterlassen":lang==="tr"?"⭐ Değerlendirme bırak":lang==="en"?"⭐ Leave a review":lang==="pl"?"⭐ Zostaw opinię":"⭐ Оставить отзыв"}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === S.RESULTS && r && (
          <div className="pw fi">
            <button className="back" onClick={()=>setStep(S.UPLOAD)}>{t.newCheck}</button>
            <div className="rey">{t.reportLabel}</div>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:4}}>
              <h1 className="reh">{r.landlord}</h1>
              <div className={`rpill ${r.overallRisk}`} style={{marginTop:10}}>
                {r.overallRisk==="kritisch"?"🔴":r.overallRisk==="mittel"?"🟡":"🟢"} {t.riskLabel}: {r.overallRisk}
              </div>
            </div>
            <div className="rem">{r.period} · {file?.name||"Nebenkostenabrechnung.pdf"}</div>
            <div className="kpis">
              <div className="kpi"><div className="kpil">{t.claimedLabel}</div><div className="kpiv">€{r.totalClaimed?.toLocaleString("de-DE")}</div><div className="kpis2">{t.totalDemand}</div></div>
              <div className="kpi ak"><div className="kpil">{t.savingsLabel}</div><div className="kpiv">€{r.estimatedSavings}</div><div className="kpis2">{t.verifiedErrors}</div></div>
              <div className="kpi"><div className="kpil">{t.errorsLabel}</div><div className="kpiv">{r.errors.length}</div><div className="kpis2">{r.errors.filter(e=>e.type==="critical").length} {t.criticalOf}</div></div>
            </div>
            <div className="sumbox">{r.summary}</div>
            <div className="sh"><div className="sht">{t.errorsLabel}</div><div className="shl"/></div>
            <div className="elist">
              {r.errors.map((e,i)=>(
                <div className="ei" key={i}>
                  <div className={`estr ${e.type}`}/>
                  <div className="ebody">
                    <div className={`etag ${e.type}`}>{t.errorTypes[e.type]} · {e.category}</div>
                    <div className="en">{e.title}</div>
                    <div className="ed">{e.description}</div>
                    {e.impact>0&&<div className="esav">↑ ca. €{e.impact} {lang==="tr"?"geri alınabilir":lang==="en"?"recoverable":lang==="pl"?"do odzyskania":lang==="ru"?"можно вернуть":"zurückholbar"}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="ar">
              <button className="btn bg" onClick={genLetter}>{t.generateBtn}</button>
              <button className="btn bgh" onClick={()=>tip("Im Produkt: PDF-Export")}>{t.pdfBtn}</button>
            </div>
            <div className="disclaimer">{t.disclaimer}</div>
          </div>
        )}

        {/* ── LETTER ── */}
        {step === S.LETTER && (
          <div className="pw fi">
            <button className="back" onClick={()=>setStep(S.RESULTS)}>← {lang==="de"?"Zurück zum Bericht":lang==="tr"?"Rapora Dön":lang==="en"?"Back to Report":lang==="pl"?"Wróć do raportu":"Назад к отчёту"}</button>
            <div className="rey">{t.autoCreated}</div>
            <h1 className="reh" style={{marginBottom:5}}>{t.letterTitle}</h1>
            <p className="rem" style={{marginBottom:32}}>{t.letterSub}</p>
            {loadL
              ?<div className="cs"><div className="sp"/><span style={{fontSize:13,color:"var(--w30)"}}>{t.generating}</span></div>
              :<>
                <div className="lsh">
                  <div className="lh">
                    <div className="lhl">📬 {t.letterTitle}</div>
                    <button className="btn bgh bsm" onClick={()=>{navigator.clipboard.writeText(letter);tip(t.copied);}}>{t.copyBtn}</button>
                  </div>
                  <div className="lb">{letter}</div>
                </div>
                <div className="ar">
                  <button className="btn bg" onClick={()=>{navigator.clipboard.writeText(letter);tip(t.copiedFull);}}>{t.copyBtnFull}</button>
                  <button className="btn bgh" onClick={()=>tip("Im Produkt: Per E-Mail senden")}>{t.emailBtn}</button>
                </div>
                <div className="disclaimer">{t.disclaimer}</div>
              </>
            }
          </div>
        )}
      </div>

        {/* ── ALL CLEAR ── */}
        {step === S.ALLCLEAR && (
          <div className="page fi" style={{textAlign:"center"}}>
            <div className="allclear-ring">✓</div>
            <div className="allclear-title">{t.allClearTitle}</div>
            <p className="allclear-sub">{t.allClearSub}</p>
            <p className="allclear-note">{t.allClearNote}</p>
            <button className="btn bg" style={{maxWidth:320,margin:"0 auto"}} onClick={()=>setStep(S.RESULTS)}>
              {t.allClearBtn}
            </button>
            <p className="allclear-free">{t.allClearFree}</p>
          </div>
        )}

        
        {/* ── REVIEW ── */}
        {step === S.REVIEW && (
          <div className="page fi" style={{textAlign:"center"}}>
            {!reviewSent ? (
              <>
                <div style={{fontSize:36,marginBottom:20}}>⭐</div>
                <h2 style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:26,letterSpacing:-1,marginBottom:10}}>
                  {lang==="de"?"Wie war dein Ergebnis?":lang==="tr"?"Sonucun nasıldı?":lang==="en"?"How did it go?":lang==="pl"?"Jak poszło?":"Каков результат?"}
                </h2>
                <p style={{fontSize:13,color:"var(--w30)",marginBottom:32,maxWidth:340,margin:"0 auto 32px",lineHeight:1.6}}>
                  {lang==="de"?"Dein Feedback hilft anderen Mietern – und verbessert Hektagon.":lang==="tr"?"Geri bildiriminiz diğer kiracılara yardımcı olur.":lang==="en"?"Your feedback helps other renters – and improves Hektagon.":lang==="pl"?"Twoja opinia pomaga innym najemcom.":"Ваш отзыв помогает другим арендаторам."}
                </p>

                {/* Star rating */}
                <div className="review-stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`rstar${reviewStars >= s ? " active" : ""}`}
                      onClick={() => setReviewStars(s)}
                      onMouseEnter={() => setReviewStars(s)}>★</span>
                  ))}
                </div>

                {reviewStars > 0 && (
                  <div style={{maxWidth:400,margin:"0 auto",width:"100%"}}>
                    <textarea
                      className="review-textarea"
                      placeholder={lang==="de"?"Was hat Hektagon gefunden? Wie viel hast du zurückbekommen?":lang==="tr"?"Hektagon ne buldu? Ne kadar geri aldın?":lang==="en"?"What did Hektagon find? How much did you get back?":lang==="pl"?"Co znalazł Hektagon? Ile odzyskałeś?":"Что нашёл Hektagon? Сколько вернули?"}
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                    />
                    <button className="btn bg" onClick={submitReview} disabled={reviewSaving || !reviewText.trim()}>
                      {reviewSaving
                        ? <><div className="sp" style={{width:16,height:16,borderWidth:2}}/></>
                        : lang==="de"?"Bewertung absenden →":lang==="tr"?"Değerlendirme gönder →":lang==="en"?"Submit review →":lang==="pl"?"Wyślij opinię →":"Отправить отзыв →"
                      }
                    </button>
                    <button className="back" style={{display:"block",margin:"14px auto 0"}} onClick={() => setStep(S.RESULTS)}>
                      {lang==="de"?"Überspringen":lang==="tr"?"Atla":lang==="en"?"Skip":lang==="pl"?"Pomiń":"Пропустить"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="review-sent">
                <div className="review-sent-icon">🙏</div>
                <h2 style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:24,letterSpacing:-0.8,marginBottom:10}}>
                  {lang==="de"?"Danke für dein Feedback!":lang==="tr"?"Geri bildiriminiz için teşekkürler!":lang==="en"?"Thanks for your feedback!":lang==="pl"?"Dziękujemy za opinię!":"Спасибо за отзыв!"}
                </h2>
                <p style={{fontSize:13,color:"var(--w30)",marginBottom:28}}>
                  {lang==="de"?"Du hilfst anderen Mietern, ihr Geld zurückzubekommen.":lang==="tr"?"Diğer kiracıların parasını geri almasına yardımcı oluyorsunuz.":lang==="en"?"You're helping other renters get their money back.":lang==="pl"?"Pomagasz innym najemcom odzyskać pieniądze.":"Вы помогаете другим арендаторам вернуть деньги."}
                </p>
                <button className="btn bg" style={{maxWidth:260,margin:"0 auto"}} onClick={() => setStep(S.UPLOAD)}>
                  {lang==="de"?"Neue Abrechnung prüfen":lang==="tr"?"Yeni fatura kontrol et":lang==="en"?"Check another bill":lang==="pl"?"Sprawdź kolejny rachunek":"Проверить ещё счёт"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── AUTH MODAL ── */}
        {authModal && (
          <div className="overlay" onClick={()=>setAuthModal(false)}>
            <div className="auth-card" style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
              <button className="auth-close" onClick={()=>setAuthModal(false)}>×</button>
              <div className="auth-logo">H</div>
              <div className="auth-title">{authMode==="login" ? t.authWelcome : t.authCreate}</div>
              <div className="auth-sub">{authMode==="login" ? t.authLoginSub : t.authSignupSub}</div>

              {/* Google */}
              <button className="google-btn" onClick={handleGoogleAuth}>
                <span style={{fontSize:15}}>G</span> Mit Google fortfahren
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line"/>
                <div className="auth-divider-text">{t.authOr}</div>
                <div className="auth-divider-line"/>
              </div>

              <input className="auth-input" type="email" placeholder={t.authEmailPh} value={authEmail}
                onChange={e=>{setAuthEmail(e.target.value);setAuthErr("");}}
                onKeyDown={e=>e.key==="Enter"&&handleAuthSubmit()} />
              <input className="auth-input" type="password" placeholder={t.authPwPh} value={authPw}
                onChange={e=>{setAuthPw(e.target.value);setAuthErr("");}}
                onKeyDown={e=>e.key==="Enter"&&handleAuthSubmit()} />

              <button className="btn bg" onClick={handleAuthSubmit} disabled={authLoading||!authEmail||!authPw}>
                {authLoading ? <><div className="sp" style={{width:16,height:16,borderWidth:2}}/></> : authMode==="login" ? t.authLoginBtn : t.authSignupBtn}
              </button>

              {authErr && <div className="auth-err">{authErr}</div>}

              <div className="auth-switch">
                {authMode==="login"
                  ? <>{t.authSwitchLogin} <a onClick={()=>{setAuthMode("signup");setAuthErr("")}}>{t.authSwitchLoginLink}</a></>
                  : <>{t.authSwitchSignup} <a onClick={()=>{setAuthMode("login");setAuthErr("")}}>{t.authSwitchSignupLink}</a></>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── ACCOUNT SCREEN ── */}
        {step === S.ACCOUNT && (
          <div className="pw fi">
            <button className="back" onClick={()=>setStep(S.UPLOAD)}>{t.accountBack}</button>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
              <div className="user-avatar" style={{width:52,height:52,fontSize:18}}>
                {user?.email?.[0]?.toUpperCase()||"?"}
              </div>
              <div>
                <div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:22,letterSpacing:-0.8}}>{user?.email}</div>
                <div style={{fontSize:13,color:"var(--gd)",fontWeight:600,marginTop:2}}>{isPro ? "✦ Pro — aktiv" : "Basis"}</div>
              </div>
              {!isPro && (
                <button className="btn bg" style={{marginLeft:"auto",width:"auto",padding:"10px 18px",fontSize:13}}
                  onClick={()=>setStep(S.GATE)}>
                  ✦ Pro upgraden
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="account-grid">
              <div className="acc-stat">
                <div className="acc-stat-label">Gespeicherte Reports</div>
                <div className="acc-stat-value">{savedReports.length}</div>
              </div>
              <div className="acc-stat">
                <div className="acc-stat-label">Gesamtes Einsparpotenzial</div>
                <div className="acc-stat-value" style={{color:"var(--g)"}}>
                  €{savedReports.reduce((sum,r)=>sum+(r.savings||0),0)}
                </div>
              </div>
              <div className="acc-stat">
                <div className="acc-stat-label">Plan</div>
                <div className="acc-stat-value" style={{fontSize:18}}>{isPro?"Pro Jahresabo":"Basis"}</div>
              </div>
              <div className="acc-stat">
                <div className="acc-stat-label">Offene Fristen</div>
                <div className="acc-stat-value" style={{color:"var(--y)"}}>
                  {savedReports.filter(r=>r.deadline&&daysUntil(r.deadline)<90).length}
                </div>
              </div>
            </div>

            {/* Deadlines — Pro only */}
            <div className="sh"><div className="sht">⏰ Fristen-Tracker</div><div className="shl"/></div>
            {!isPro ? (
              <div className="pro-lock">
                <div className="pro-lock-icon">🔒</div>
                <div className="pro-lock-title">Pro Feature</div>
                <div className="pro-lock-sub">Automatische Erinnerungen 3 Monate vor Ablauf der 12-Monats-Einspruchsfrist. Nie wieder eine Frist verpassen.</div>
                <button className="btn bg" style={{width:"auto"}} onClick={()=>setStep(S.GATE)}>✦ Jetzt upgraden — €23,90/Jahr</button>
              </div>
            ) : (
              <div className="deadline-list">
                {savedReports.length === 0 && (
                  <div style={{fontSize:13,color:"var(--w30)",padding:"20px 0"}}>Noch keine gespeicherten Reports. Analysiere deine erste Abrechnung!</div>
                )}
                {savedReports.map((r,i)=>{
                  const days = r.deadline ? daysUntil(r.deadline) : 365;
                  const cls = deadlineClass(days);
                  return(
                    <div key={i} className={`dl-card ${cls}`}>
                      <div className={`dl-days ${cls}`}>{days}d</div>
                      <div className="dl-info">
                        <div className="dl-landlord">{r.landlord}</div>
                        <div className="dl-date">Frist: {r.deadline ? new Date(r.deadline).toLocaleDateString("de-DE") : "Unbekannt"} · {r.period}</div>
                      </div>
                      <span className={`dl-badge ${cls}`}>{deadlineLabel(days)}</span>
                    </div>
                  );
                })}
                {/* Demo deadlines if no real data */}
                {savedReports.length === 0 && [
                  {landlord:"Hausverwaltung Muster GmbH", period:"01.01.2023–31.12.2023", days:24},
                  {landlord:"Immobilien AG Berlin", period:"01.01.2022–31.12.2022", days:67},
                  {landlord:"Wohnbau GmbH Hamburg", period:"01.01.2021–31.12.2021", days:180},
                ].map((d,i)=>(
                  <div key={i} className={`dl-card ${deadlineClass(d.days)}`}>
                    <div className={`dl-days ${deadlineClass(d.days)}`}>{d.days}d</div>
                    <div className="dl-info">
                      <div className="dl-landlord">{d.landlord} <span style={{fontSize:11,color:"var(--w30)"}}>(Demo)</span></div>
                      <div className="dl-date">{d.period}</div>
                    </div>
                    <span className={`dl-badge ${deadlineClass(d.days)}`}>{deadlineLabel(d.days)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Saved reports */}
            <div className="sh" style={{marginTop:8}}><div className="sht">📂 Gespeicherte Reports</div><div className="shl"/></div>
            {loadingReports ? (
              <div className="cs"><div className="sp"/></div>
            ) : savedReports.length > 0 ? (
              <div className="report-list">
                {savedReports.map((r,i)=>(
                  <div key={i} className="report-card" onClick={()=>{setResult(r.data||r);setStep(S.RESULTS);}}>
                    <div className="report-icon">📄</div>
                    <div className="report-info">
                      <div className="report-landlord">{r.landlord}</div>
                      <div className="report-meta">{r.period} · {r.country} · {new Date(r.created_at).toLocaleDateString("de-DE")}</div>
                    </div>
                    <div className="report-saving">+€{r.savings}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="report-list">
                {/* Demo reports */}
                {[
                  {landlord:"Hausverwaltung Muster GmbH", period:"01.01.2023–31.12.2023", country:"🇩🇪", savings:412, created_at: new Date().toISOString()},
                  {landlord:"Wohnbau GmbH Hamburg",       period:"01.01.2022–31.12.2022", country:"🇩🇪", savings:287, created_at: new Date(Date.now()-8e7).toISOString()},
                ].map((r,i)=>(
                  <div key={i} className="report-card" onClick={()=>{setResult(DEMO);setStep(S.RESULTS);}}>
                    <div className="report-icon">📄</div>
                    <div className="report-info">
                      <div className="report-landlord">{r.landlord} <span style={{fontSize:11,color:"var(--w30)"}}>(Demo)</span></div>
                      <div className="report-meta">{r.period} · {r.country} · {new Date(r.created_at).toLocaleDateString("de-DE")}</div>
                    </div>
                    <div className="report-saving">+€{r.savings}</div>
                  </div>
                ))}
                <div style={{fontSize:12,color:"var(--w30)",marginTop:8,textAlign:"center"}}>
                  {isPro ? "Deine echten Reports erscheinen hier nach der ersten Analyse." : "Upgrade auf Pro um Reports dauerhaft zu speichern."}
                </div>
              </div>
            )}

            <div className="disclaimer" style={{marginTop:16}}>⚖️ Hektagon ersetzt keine individuelle Rechtsberatung nach RDG.</div>
          </div>
        )}


      {/* ── FIXED BOTTOM STOCK TICKER ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,height:40,background:"rgba(7,7,15,0.93)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",overflow:"hidden",WebkitMaskImage:"linear-gradient(to right,transparent 0%,black 5%,black 95%,transparent 100%)",maskImage:"linear-gradient(to right,transparent 0%,black 5%,black 95%,transparent 100%)"}}>
        <div style={{display:"flex",gap:0,animation:"ticker 90s linear infinite",width:"max-content",alignItems:"center"}}>
          {[...testimonials,...testimonials].map((t2,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"0 24px",borderRight:"1px solid rgba(255,255,255,0.07)",height:40,whiteSpace:"nowrap",flexShrink:0}}>
              <span style={{fontSize:11,letterSpacing:1,color:"#ffd60a"}}>{"★".repeat(t2.rating)}</span>
              <span style={{width:1,height:14,background:"rgba(255,255,255,0.07)",flexShrink:0}}/>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.55)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"}}>"{t2.text}"</span>
              <span style={{width:1,height:14,background:"rgba(255,255,255,0.07)",flexShrink:0}}/>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.28)",flexShrink:0}}>{t2.country} {t2.name}</span>
              {t2.savings>0&&<span style={{fontSize:12,fontWeight:700,color:"#30d780",flexShrink:0,fontFamily:"var(--fd)"}}>+€{t2.savings}</span>}
            </div>
          ))}
        </div>
      </div>

      {toast&&<div className="toast-w"><div className="toast">{toast}</div></div>}
    </>
  );
}
