import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    discover: "Discover",
    chalets: "Chalets",
    dashboard: "Dashboard",
    signIn: "Sign In",
    logOut: "Log Out",
    welcome: "Welcome",
    heroTitle: "Find Your Sanctuary",
    heroSubtitle: "in the Heart of",
    heroSubtitleHighlight: "Jordan",
    heroText: "Discover a curated collection of Jordan's most exclusive chalets, from Wadi Rum to the Dead Sea. Book your escape with Reva today.",
    searchWhere: "Where to?",
    searchDates: "Dates",
    searchButton: "Search",
    exclusiveCollection: "Exclusive Collection",
    collectionSub: "Handpicked properties for discerning travelers in Jordan.",
    viewAll: "View All",
    night: "/ night",
    details: "Details",
    guests: "guests",
    bdrm: "bdrm",
    listProperty: "List Your Property on Reva",
    listPropertySub: "Join our exclusive network of owners and reach high-end travelers worldwide.",
    becomeHost: "Become a Host",
    adminDash: "Admin Dashboard",
    ownerDash: "Owner Dashboard",
    revenue: "Total Revenue",
    activeBookings: "Active Bookings",
    totalProps: "Total Properties",
    pendingReq: "Pending Requests",
    revOverview: "Revenue Overview",
    recentBookings: "Recent Bookings",
    yourProps: "Your Properties",
    unknown: "Unknown",
    welcomeBack: "Welcome back",
    happening: "Here's what's happening today.",
    accessDenied: "Access Denied",
    createAccount: "Create Account",
    enterDetails: "Enter your details to access your account",
    joinReva: "Join Reva for exclusive chalet access",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    haveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    continueWith: "Or continue with",
    aiTitle: "Reva Concierge",
    aiSub: "Powered by Gemini AI",
    askRec: "Ask for recommendations...",
    thinking: "Reva is thinking...",
    rights: "© 2024 Reva Chalet Inc. All rights reserved.",
    destinations: "Destinations",
    collections: "Collections",
    experiences: "Experiences",
    aboutUs: "About Us",
    careers: "Careers",
    press: "Press",
    contact: "Contact",
    explore: "Explore",
    company: "Company",
    approve: "Approve",
    reject: "Reject",
    statusUpdated: "Booking status updated",
    actions: "Actions",
    invalidCredentials: "Invalid email or password",
    userExists: "User with this email already exists",
    loginSuccess: "Logged in successfully",
    signupSuccess: "Account created successfully",
    error: "An error occurred",
    otpLabel: "Verification Code",
    otpPlaceholder: "Enter 6-digit code",
    verify: "Verify & Create Account",
    otpSent: "OTP Sent!",
    invalidOtp: "Invalid OTP code",
    demoMode: "Demo Mode (Keys not configured)",
    demoOtpMessage: "Your verification code is:",
    emailSentSuccess: "Verification code sent to your email.",
    checkEmail: "Please check your inbox."
  },
  ar: {
    discover: "اكتشف",
    chalets: "شاليهات",
    dashboard: "لوحة التحكم",
    signIn: "تسجيل دخول",
    logOut: "خروج",
    welcome: "أهلاً بك",
    heroTitle: "اعثر على ملاذك",
    heroSubtitle: "في قلب",
    heroSubtitleHighlight: "الأردن",
    heroText: "اكتشف مجموعة مختارة من أرقى الشاليهات في الأردن، من وادي رم إلى البحر الميت. احجز رحلتك مع ريفا اليوم.",
    searchWhere: "إلى أين؟",
    searchDates: "التواريخ",
    searchButton: "بحث",
    exclusiveCollection: "مجموعة حصرية",
    collectionSub: "عقارات مختارة بعناية للمسافرين المميزين في الأردن.",
    viewAll: "عرض الكل",
    night: "/ ليلة",
    details: "تفاصيل",
    guests: "ضيوف",
    bdrm: "غرف",
    listProperty: "اعرض عقارك على ريفا",
    listPropertySub: "انضم إلى شبكتنا الحصرية من الملاك وتواصل مع مسافرين مميزين حول العالم.",
    becomeHost: "كن مضيفاً",
    adminDash: "لوحة تحكم المسؤول",
    ownerDash: "لوحة تحكم المالك",
    revenue: "إجمالي الإيرادات",
    activeBookings: "حجوزات نشطة",
    totalProps: "إجمالي العقارات",
    pendingReq: "طلبات معلقة",
    revOverview: "نظرة عامة على الإيرادات",
    recentBookings: "الحجوزات الأخيرة",
    yourProps: "عقاراتك",
    unknown: "غير معروف",
    welcomeBack: "أهلاً بعودتك",
    happening: "إليك ما يحدث اليوم.",
    accessDenied: "تم رفض الوصول",
    createAccount: "إنشاء حساب",
    enterDetails: "أدخل تفاصيلك للوصول إلى حسابك",
    joinReva: "انضم إلى ريفا للوصول الحصري",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    haveAccount: "لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    continueWith: "أو تابع باستخدام",
    aiTitle: "مساعد ريفا",
    aiSub: "مدعوم بواسطة Gemini AI",
    askRec: "اطلب توصيات...",
    thinking: "ريفا يفكر...",
    rights: "© 2024 ريفا شاليه. جميع الحقوق محفوظة.",
    destinations: "الوجهات",
    collections: "المجموعات",
    experiences: "التجارب",
    aboutUs: "من نحن",
    careers: "وظائف",
    press: "صحافة",
    contact: "اتصل بنا",
    explore: "استكشف",
    company: "الشركة",
    approve: "قبول",
    reject: "رفض",
    statusUpdated: "تم تحديث حالة الحجز",
    actions: "إجراءات",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    userExists: "مستخدم بهذا البريد الإلكتروني موجود بالفعل",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    signupSuccess: "تم إنشاء الحساب بنجاح",
    error: "حدث خطأ",
    otpLabel: "رمز التحقق",
    otpPlaceholder: "أدخل الرمز المكون من 6 أرقام",
    verify: "تحقق وإنشاء حساب",
    otpSent: "تم إرسال الرمز!",
    invalidOtp: "رمز التحقق غير صحيح",
    demoMode: "وضع تجريبي (المفاتيح غير معدة)",
    demoOtpMessage: "رمز التحقق الخاص بك هو:",
    emailSentSuccess: "تم إرسال رمز التحقق إلى بريدك الإلكتروني.",
    checkEmail: "يرجى التحقق من صندوق الوارد."
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');

  // Load saved preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('reva_lang') as Language;
    const savedTheme = localStorage.getItem('reva_theme') as Theme;
    if (savedLang) setLanguage(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Update DOM for Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('reva_theme', theme);
  }, [theme]);

  // Update DOM for Language (RTL)
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);
    
    // Toggle font family class on body
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }

    localStorage.setItem('reva_lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};