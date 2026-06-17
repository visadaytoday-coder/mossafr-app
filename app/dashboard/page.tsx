"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Image CDN ────────────────────────────────────────────────────────────────
const IMGS = {
  hero: "https://picsum.photos/seed/guangzhou-hero/900/600",
  apps: "https://picsum.photos/seed/mobile-apps/500/350",
  markets: "https://picsum.photos/seed/china-market/500/350",
  tourism: "https://picsum.photos/seed/china-tower/500/350",
  market1: "https://picsum.photos/seed/canton-fair/700/400",
  market2: "https://picsum.photos/seed/china-plaza/700/400",
  place1: "https://picsum.photos/seed/guangzhou-night/700/400",
  place2: "https://picsum.photos/seed/china-park/700/400",
};

type TabType = "dashboard" | "trips" | "guides" | "emergency" | "settings";

// ─── SVG Icons (UI/UX Pro Max: no-emoji-icons for functional UI) ───────────────
const IcHome = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill={active ? "rgba(245,158,11,0.18)" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IcList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

const IcBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IcPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IcUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const IcSave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

const IcLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const IcArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const IcCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IcAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12.01" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS: { id: TabType; label: string; Icon: React.FC<{ active?: boolean }> }[] = [
  { id: "dashboard", label: "الرئيسية", Icon: IcHome },
  { id: "trips", label: "رحلتي", Icon: IcList as any },
  { id: "guides", label: "الأدلة", Icon: IcBook as any },
  { id: "emergency", label: "الطوارئ", Icon: IcPhone as any },
  { id: "settings", label: "إعدادات", Icon: IcSettings as any },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const APPS = [
  { name: "WeChat (ويشات)", desc: "التواصل والدفع مع الموردين داخل الصين.", badge: "إجباري", color: "#10b981", shadow: "rgba(16,185,129,0.35)", emoji: "💬" },
  { name: "Alipay (ألي باي)", desc: "المحفظة الإلكترونية الأساسية — مقبولة في كل مكان.", badge: "إجباري", color: "#3b82f6", shadow: "rgba(59,130,246,0.35)", emoji: "💳" },
  { name: "DiDi (ديدي)", desc: "تطبيق التاكسي الأرخص والأسهل.", badge: "موصى به", color: "#f97316", shadow: "rgba(249,115,22,0.35)", emoji: "🚕" },
  { name: "Trip.com (تريب)", desc: "حجز قطارات الرصاصة والطيران والفنادق.", badge: "مفيد جداً", color: "#0ea5e9", shadow: "rgba(14,165,233,0.35)", emoji: "✈️" },
  { name: "Baidu Maps (بايدو)", desc: "أدق نظام خرائط داخل الصين.", badge: "موصى به", color: "#2563eb", shadow: "rgba(37,99,235,0.35)", emoji: "🗺️" },
  { name: "Baidu Translate", desc: "مترجم نصوص وصور فوري.", badge: "ضروري", color: "#d97706", shadow: "rgba(217,119,6,0.35)", emoji: "🔤" },
];

const MARKETS = [
  { city: "قوانغتشو", img: IMGS.market1, name: "مجمع معرض الكانتون (Canton Fair)", suitability: "كبار المستوردين وأصحاب المشاريع.", difficulty: "متوسط", diffColor: "#3b82f6", diffBg: "rgba(59,130,246,0.12)" },
  { city: "قوانغتشو", img: IMGS.market2, name: "سوق زهانباو للملابس (Zhanxi & Baima)", suitability: "تجار الملابس الجاهزة والمنسوجات.", difficulty: "متقدم", diffColor: "#ef4444", diffBg: "rgba(239,68,68,0.12)" },
  { city: "ييوو", img: IMGS.market1, name: "سوق الفوتيان الدولي (Yiwu Trade City)", suitability: "تجار السلع الصغيرة والهدايا والألعاب.", difficulty: "مبتدئ", diffColor: "#10b981", diffBg: "rgba(16,185,129,0.12)" },
  { city: "شنزن", img: IMGS.market2, name: "سوق هواكيانبي للإلكترونيات", suitability: "تجار الهواتف والإكسسوارات.", difficulty: "متقدم", diffColor: "#ef4444", diffBg: "rgba(239,68,68,0.12)" },
];

const SIGHTS = [
  { name: "برج كانتون (Canton Tower)", img: IMGS.place1, desc: "أيقونة مدينة قوانغتشو — تجربة الصعود ليلاً رائعة.", duration: "ساعتان" },
  { name: "حديقة يويشيو (Yuexiu Park)", img: IMGS.place2, desc: "حديقة تاريخية كبيرة — رمز الخراف الخمسة الشهير.", duration: "3 ساعات" },
  { name: "شارع بكين للمشاة", img: IMGS.place1, desc: "شارع تسوق تاريخي يضم محلات حديثة ومطاعم.", duration: "3 ساعات" },
  { name: "نافذة على العالم (Shenzhen)", img: IMGS.place2, desc: "حديقة ترفيهية بمجسمات لأهم معالم العالم.", duration: "4 ساعات" },
];

const HALAL = [
  { name: "مطعم الهلال الذهبي", desc: "أطعمة إسلامية صينية تقليدية — لحم الضأن المشوي.", location: "منطقة تيانهي (Tianhe)" },
  { name: "مطعم البسفور التركي", desc: "أكل تركي وعربي حلال 100% — مناسب لغداء الأعمال.", location: "قرب شارع تاو جين" },
  { name: "مطاعم الأويغور (Xinjiang)", desc: "منتشرة في كل الشوارع — ابحث عن كلمة (清真).", location: "متوفر في كافة المناطق" },
];

const CITY_DATA = {
  guangzhou: {
    name: "قوانغتشو",
    markets: [
      { name: "مجمع معرض الكانتون", desc: "أكبر معرض تجاري في الصين", amap: "Canton Fair Complex" },
      { name: "سوق بايما للملابس", desc: "أشهر سوق ملابس بالجملة", amap: "Baima Clothing Market" },
      { name: "سوق زهانشي للساعات", desc: "ساعات وإكسسوارات", amap: "Zhanxi Watch Market" },
    ],
    halal: [
      { name: "مطعم البسفور التركي", desc: "مأكولات تركية وشامية", amap: "Bosphorus Turkish Restaurant Guangzhou" },
      { name: "مطعم سبأ", desc: "مأكولات يمنية وعربية", amap: "Saba Restaurant Guangzhou" },
      { name: "مطعم 1001 ليلة", desc: "مشاوي وأطباق شرقية", amap: "1001 Nights Restaurant Guangzhou" },
    ]
  },
  yiwu: {
    name: "ييوو",
    markets: [
      { name: "سوق الفوتيان (المدينة التجارية)", desc: "أكبر سوق جملة للسلع الصغيرة في العالم", amap: "Yiwu International Trade City" },
      { name: "سوق هوانغ يوان", desc: "متخصص في الملابس", amap: "Huangyuan Clothing Market Yiwu" },
      { name: "شارع بينوانغ", desc: "سوق ليلي مفعم بالحيوية", amap: "Binwang Night Market Yiwu" },
    ],
    halal: [
      { name: "مطعم المائدة", desc: "مأكولات عربية متنوعة", amap: "Al Maida Restaurant Yiwu" },
      { name: "مطعم الأقصى", desc: "أكل شامي أصيل", amap: "Aqsa Restaurant Yiwu" },
      { name: "مطعم طربوش", desc: "شاورما ومشويات", amap: "Tarboush Restaurant Yiwu" },
    ]
  }
};

// ─── Style helpers using CSS tokens ──────────────────────────────────────────
const S_GLASS = {
  background: "var(--color-surface)",
  backdropFilter: "var(--blur-md)",
  WebkitBackdropFilter: "var(--blur-md)",
  border: "1px solid var(--color-border)",
};

const S_AMBER_BTN = {
  background: "var(--btn-primary-bg)",
  boxShadow: "var(--btn-primary-shadow)",
};

const S_GHOST = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeGuideFilter, setActiveGuideFilter] = useState("apps");
  const [expandedCity, setExpandedCity] = useState<"guangzhou" | "yiwu" | null>(null);

  // الاستماع الديناميكي لمعرف الإشعار النشط ومحتواه
  const [liveNotice, setLiveNotice] = useState("جاري جلب ملاحظة اليوم...");
  const [currentNoticeId, setCurrentNoticeId] = useState<string | null>(null);

  // Admin Notice interaction
  const [hasConfirmedNotice, setHasConfirmedNotice] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Settings
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [updatingSettings, setUpdatingSettings] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/"); return; }
      setUser(data.user);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (prof) { setProfile(prof); setFullName(prof.full_name || ""); setPhone(prof.phone || ""); }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    // 1. Fetch the latest notice
    const fetchLatestNotice = async () => {
      const { data } = await supabase
        .from("daily_notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data[0]) {
        setLiveNotice(data[0].content);
        setCurrentNoticeId(data[0].id); // تخزين الـ id لتأكيد الحضور لاحقاً
      } else {
        setLiveNotice("⏰ التجمع في بهو الفندق الساعة 08:30 صباحاً للانطلاق إلى معرض الكانتون");
        setCurrentNoticeId(null);
      }
    };
    fetchLatestNotice();

    // 2. Listen to real-time changes
    const channel = supabase
      .channel("live-notices")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "daily_notices" },
        (payload: any) => {
          setLiveNotice(payload.new.content);
          setCurrentNoticeId(payload.new.id); // تحديث الـ id فوراً للإشعار الجديد القادم من الآدمن
          setHasConfirmedNotice(false); // إعادة تصفير حالة القراءة للمسافر
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError(""); setSettingsSuccess(""); setUpdatingSettings(true);
    try {
      const { error: pe } = await supabase.from("profiles").update({ full_name: fullName, phone, updated_at: new Date().toISOString() }).eq("id", user.id);
      if (pe) throw pe;
      if (newPassword) {
        if (newPassword !== confirmPassword) { setSettingsError("كلمات المرور غير متطابقة"); setUpdatingSettings(false); return; }
        if (newPassword.length < 8) { setSettingsError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); setUpdatingSettings(false); return; }
        const { error: ae } = await supabase.auth.updateUser({ password: newPassword });
        if (ae) throw ae;
        setNewPassword(""); setConfirmPassword("");
      }
      setSettingsSuccess("تم تحديث بيانات الحساب بنجاح");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (prof) setProfile(prof);
    } catch (err: any) {
      setSettingsError(err.message || "حدث خطأ أثناء التحديث");
    } finally {
      setUpdatingSettings(false);
    }
  }

  const getCountdown = () => {
    if (!profile?.trip_date) return null;
    const tripDate = new Date(profile.trip_date);
    const today = new Date(); today.setHours(0, 0, 0, 0); tripDate.setHours(0, 0, 0, 0);
    return Math.ceil((tripDate.getTime() - today.getTime()) / 86400000);
  };
  const daysLeft = getCountdown();

  const switchTab = (id: TabType) => { setActiveTab(id); };

  // إرسال تأكيد القراءة الفعلي لقاعدة البيانات لحظياً
  const handleConfirmNotice = async () => {
    setIsConfirming(true);
    try {
      await supabase
        .from("traveler_confirmations")
        .insert([
          {
            traveler_name: profile?.full_name || user?.email?.split("@")[0] || "مسافر غير معروف",
            room_number: profile?.room_number || "غير محدد", // تأكد أن جدول الـ profiles يحتوي على رقم الغرفة
            notice_id: currentNoticeId
          }
        ]);
      setHasConfirmedNotice(true);
    } catch (err) {
      console.error("Error submitting confirmation:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  // Nav pill positions (RTL — tabs flow right to left)
  const pillRight = {
    dashboard: "4%",
    trips: "24%",
    guides: "44%",
    emergency: "64%",
    settings: "80%",
  }[activeTab];

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-5 bg-bg">
        <div className="w-16 h-16 rounded-card-sm flex items-center justify-center" style={S_AMBER_BTN} role="img" aria-label="منصة المسافر">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-t-amber-500" style={{ borderColor: "rgba(255,255,255,0.10)", borderTopColor: "#f59e0b", animation: "spin 0.8s linear infinite" }} />
        <p className="text-sm font-medium" style={{ color: "var(--color-text-dim)" }}>جاري تحميل البوابة...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="relative min-h-dvh w-full bg-bg text-text font-sans" style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }}>

      {/* ── AMBIENT ORBs ──────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="orb" style={{ top: "-6rem", right: "-6rem", width: "380px", height: "380px", background: "rgba(245,158,11,0.08)", filter: "blur(70px)" }} />
        <div className="orb" style={{ top: "50%", left: "-8rem", width: "420px", height: "420px", background: "rgba(30,58,138,0.08)", filter: "blur(70px)" }} />
        <div className="orb" style={{ bottom: "-6rem", right: "33%", width: "350px", height: "350px", background: "rgba(124,45,18,0.07)", filter: "blur(60px)" }} />
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full flex items-center justify-between px-4 transform-gpu glass-strong"
        style={{ minHeight: "var(--nav-height, 4rem)", height: "4rem" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => switchTab("settings")}
            className="w-10 h-10 rounded-full flex items-center justify-center press-scale btn-ghost"
            aria-label="إعدادات الحساب"
          >
            <span style={{ color: "var(--color-text-muted)" }}><IcUser /></span>
          </button>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--color-text-dim)" }}>مرحباً بعودتك</p>
            <p className="font-black text-sm text-white">
              {profile?.full_name || user?.email?.split("@")[0] || "مسافرنا العزيز"}
            </p>
          </div>
        </div>

        {!hasConfirmedNotice && (
          <div className="px-3 py-1.5 rounded-full text-xs font-bold animate-pulse-fast"
            style={{ background: "rgba(234,88,12,0.18)", border: "1px solid rgba(234,88,12,0.35)", color: "#fb923c" }}>
            🔔 إشعار تحديث حي نشط
          </div>
        )}
        {hasConfirmedNotice && (
          <div className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.28)", color: "var(--color-success)" }}>
            تم تأكيد الحضور
          </div>
        )}
      </header>

      {/* ── MAIN ──────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-lg md:max-w-3xl mx-auto px-4 py-5 space-y-5">

        {activeTab === "dashboard" && (
          <div className="space-y-5" style={{ animation: "slideInUp 0.25s var(--ease-enter) both" }}>

            {/* 1️⃣ ADMIN NOTICE CARD ── ملاحظة اليوم والتوجيه العاجل */}
            <section
              aria-labelledby="notice-heading"
              className="w-full p-5 rounded-card-lg shadow-xl"
              style={{ border: "1px solid rgba(245,158,11,0.28)", background: "rgba(10,8,4,0.70)", backdropFilter: "var(--blur-lg)", WebkitBackdropFilter: "var(--blur-lg)" }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-card-sm shrink-0" style={{ background: "rgba(245,158,11,0.12)", color: "var(--color-primary)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="w-full space-y-1">
                  <h3 id="notice-heading" className="text-base font-bold" style={{ color: "var(--color-amber-400, #fbbf24)" }}>
                    ملاحظة اليوم والتوجيه العاجل
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {liveNotice}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {hasConfirmedNotice ? (
                  <div
                    className="w-full h-14 rounded-card-sm flex items-center justify-center gap-2 font-bold text-sm"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "var(--color-success)" }}
                    role="status"
                  >
                    <IcCheck />
                    <span>تم تأكيد قراءتك — جاري التحرك</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmNotice}
                    disabled={isConfirming}
                    className="w-full h-14 rounded-card-sm text-white font-bold text-base press-scale touch-manipulation flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #10b981, #0d9488)", boxShadow: "0 6px 20px rgba(16,185,129,0.25)" }}
                  >
                    {isConfirming ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
                    ) : (
                      <>
                        <IcCheck />
                        <span>تم الاطلاع وأنا قادم</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>

            {/* 2️⃣ HERO ── العداد التنازلي وبطاقة الرحلة */}
            <section
              className="relative overflow-hidden rounded-card-lg aspect-[4/5] md:aspect-[21/9] shadow-2xl"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="absolute inset-0 skeleton" />
              <Image
                src={IMGS.hero}
                alt="أفق مدينة قوانغتشو"
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #020617 0%, rgba(2,6,23,0.38) 50%, transparent 100%)" }} />
              <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-8">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  {profile?.trip_date && daysLeft !== null && (
                    <div className="rounded-full px-4 py-2 flex items-center gap-2"
                      style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.30)", backdropFilter: "blur(8px)" }}>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden />
                      <span className="text-xs font-bold text-amber-300 font-inter">
                        {daysLeft === 0 ? "اليوم!" : `${daysLeft} يوم متبقٍ`}
                      </span>
                    </div>
                  )}
                  <div className="rounded-full px-3 py-1.5"
                    style={{ background: "rgba(15,23,42,0.70)", backdropFilter: "blur(8px)", border: "1px solid var(--color-border)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-success)" }}>التسجيل مؤكد</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: "var(--color-amber-400, #fbbf24)" }}>معرض الكانتون – قوانغتشو</p>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">رحلتك إلى الصين</h1>
                  </div>
                  <button
                    onClick={() => switchTab("trips")}
                    className="w-full h-16 rounded-card-sm text-base font-bold text-white flex items-center justify-center gap-2 press-scale"
                    style={S_AMBER_BTN}
                    aria-label="عرض تفاصيل الرحلة"
                  >
                    <span>عرض تفاصيل الرحلة</span>
                    <IcArrow />
                  </button>
                </div>
              </div>
            </section>

            {/* 3️⃣ FOR YOU ── تمرير أفقي سلس */}
            <section className="space-y-3">
              <h2 className="text-base font-black text-white px-1">لك خصيصاً</h2>
              <div className="flex gap-4 scrollbar-none pb-3 snap-x snap-mandatory overscroll-x-contain -mx-4 px-4 touch-pan-x">
                {[
                  { title: "التطبيقات الضرورية", sub: "تثبيت وتفعيل", img: IMGS.apps, color: "#10b981" },
                  { title: "دليل الأسواق", sub: "تصفح الدليل", img: IMGS.markets, color: "#f59e0b" },
                  { title: "الأماكن السياحية", sub: "استكشف", img: IMGS.tourism, color: "#8b5cf6" },
                ].map((card) => (
                  <div
                    key={card.title}
                    onClick={() => switchTab("guides")}
                    className="flex-shrink-0 w-[220px] h-[140px] relative rounded-card-sm overflow-hidden snap-center press-scale shadow-lg"
                    style={{ border: "1px solid var(--color-border)" }}
                    role="button"
                    tabIndex={0}
                    aria-label={card.title}
                    onKeyDown={(e) => e.key === "Enter" && switchTab("guides")}
                  >
                    <div className="absolute inset-0 skeleton" />
                    <Image src={card.img} alt={card.title} fill sizes="220px" className="object-cover" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,6,23,0.94) 0%, transparent 60%)" }} />
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} aria-hidden />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-black text-sm line-clamp-1">{card.title}</h3>
                      <span className="text-[10px] text-white/70 font-medium">{card.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4️⃣ ESSENTIAL APPS ── شريط الأيقونات */}
            <section className="rounded-card-lg p-5" style={S_GLASS}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white">تطبيقات لا غنى عنها</h3>
                <button onClick={() => switchTab("guides")} className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>عرض الكل</button>
              </div>
              <div className="flex gap-4 scrollbar-none pb-2 overscroll-x-contain">
                {APPS.slice(0, 5).map((app) => (
                  <button
                    key={app.name}
                    onClick={() => { switchTab("guides"); setActiveGuideFilter("apps"); }}
                    className="flex flex-col items-center gap-2 flex-shrink-0 w-[60px] press-scale"
                    aria-label={`فتح دليل ${app.name}`}
                  >
                    <div
                      className="w-14 h-14 rounded-card-sm flex items-center justify-center text-2xl shadow-md relative overflow-hidden"
                      style={{ background: app.color, boxShadow: `0 4px 16px ${app.shadow}` }}
                      role="img" aria-label={app.name}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} aria-hidden />
                      {app.emoji}
                    </div>
                    <span className="text-[10px] font-bold truncate w-full text-center" style={{ color: "var(--color-text-muted)" }}>
                      {app.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 5️⃣ TRIP TIMELINE */}
            <section className="rounded-card-lg p-5" style={S_GLASS}>
              <h3 className="text-sm font-black text-white mb-4">مخطط الرحلة</h3>
              <div className="flex gap-3 scrollbar-none pb-2 snap-x overscroll-x-contain">
                {[
                  { icon: "🛬", title: "الوصول", sub: "مطار قوانغتشو", dot: "#10b981", pulse: false },
                  { icon: "🎪", title: "معرض الكانتون", sub: "الموردين والصفقات", dot: "#f59e0b", pulse: true },
                  { icon: "🛍️", title: "الأسواق", sub: "جولات متخصصة", dot: "", pulse: false },
                  { icon: "🛫", title: "العودة", sub: "الجزائر الحبيبة", dot: "", pulse: false },
                ].map((step) => (
                  <div key={step.title} className="flex-shrink-0 w-[130px] rounded-card-sm p-4 snap-center relative"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}>
                    {step.dot && (
                      <span className={`absolute top-4 left-4 w-2 h-2 rounded-full ${step.pulse ? "animate-pulse" : ""}`}
                        style={{ background: step.dot, boxShadow: `0 0 8px ${step.dot}` }} aria-hidden />
                    )}
                    <div className="text-2xl mb-2 mt-1" role="img" aria-label={step.title}>{step.icon}</div>
                    <h4 className="text-xs font-black text-white mb-0.5">{step.title}</h4>
                    <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>{step.sub}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6️⃣ CITY PLACES (Yiwu & Guangzhou) */}
            <section className="rounded-card-lg p-5" style={S_GLASS}>
              <h3 className="text-sm font-black text-white mb-4">دليل المدن السريع</h3>
              <div className="flex gap-3 mb-2">
                <button 
                  onClick={() => setExpandedCity(expandedCity === 'guangzhou' ? null : 'guangzhou')}
                  className="flex-1 py-3 rounded-card-sm font-bold text-sm press-scale transition-all flex items-center justify-center gap-2"
                  style={{ background: expandedCity === 'guangzhou' ? "var(--btn-primary-bg)" : "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)", color: expandedCity === 'guangzhou' ? "#fff" : "var(--color-text-muted)" }}>
                  📍 قوانغتشو
                </button>
                <button 
                  onClick={() => setExpandedCity(expandedCity === 'yiwu' ? null : 'yiwu')}
                  className="flex-1 py-3 rounded-card-sm font-bold text-sm press-scale transition-all flex items-center justify-center gap-2"
                  style={{ background: expandedCity === 'yiwu' ? "var(--btn-primary-bg)" : "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)", color: expandedCity === 'yiwu' ? "#fff" : "var(--color-text-muted)" }}>
                  📍 ييوو
                </button>
              </div>
              
              {expandedCity && (
                <div className="mt-4 space-y-5" style={{ animation: "fadeIn 0.3s ease-out" }}>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs">🛍️</span>
                      أهم الأسواق في {CITY_DATA[expandedCity].name}
                    </h4>
                    <div className="space-y-2">
                      {CITY_DATA[expandedCity].markets.map(m => (
                        <div key={m.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <p className="text-xs font-bold text-white mb-0.5">{m.name}</p>
                            <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>{m.desc}</p>
                          </div>
                          <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(m.amap)}`} target="_blank" rel="noreferrer" 
                             className="flex-shrink-0 btn-ghost px-3 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 press-scale"
                             aria-label={`Amap ${m.name}`}>
                             📍 Amap
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs">🍽️</span>
                      مطاعم حلال في {CITY_DATA[expandedCity].name}
                    </h4>
                    <div className="space-y-2">
                      {CITY_DATA[expandedCity].halal.map(m => (
                        <div key={m.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div>
                            <p className="text-xs font-bold text-white mb-0.5">{m.name}</p>
                            <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>{m.desc}</p>
                          </div>
                          <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(m.amap)}`} target="_blank" rel="noreferrer" 
                             className="flex-shrink-0 btn-ghost px-3 h-8 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 press-scale"
                             aria-label={`Amap ${m.name}`}>
                             📍 Amap
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB ── TRIPS
        ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "trips" && (
          <div className="space-y-4" style={{ animation: "slideInUp 0.25s var(--ease-enter) both" }}>
            <div className="rounded-card-sm p-5" style={S_GLASS}>
              <h2 className="text-lg font-black text-white">تفاصيل خطة رحلتك التجارية</h2>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>البرنامج اليومي للمعرض والأسواق.</p>
            </div>
            {[
              { day: "اليوم 1 — الوصول", status: "completed", title: "الاستقبال في المطار والتسكين", desc: "الوصول لمطار قوانغتشو بايون الدولي. مندوب الوكالة بانتظارك في صالة الوصول." },
              { day: "اليوم 2 إلى 4 — معرض الكانتون", status: "active", title: "حضور فعاليات معرض كانتون الدولي", desc: "التوجه صباحاً إلى Pazhou Complex. جولات داخل المعرض والاجتماع مع الموردين." },
              { day: "اليوم 5 و 6 — جولات الأسواق", status: "pending", title: "التسوق والجملة من أسواق قوانغتشو", desc: "زيارة أسواق الملابس (Baima / Zhanxi) والجلود والأحذية." },
              { day: "اليوم 7 — الشحن والعودة", status: "pending", title: "ترتيبات اللوجستي والمغادرة", desc: "تنسيق الشحن مع مكتب الوكالة ثم الاستعداد للمغادرة." },
            ].map((step, idx) => {
              const s = step.status === "completed"
                ? { dot: "#10b981", glow: "rgba(16,185,129,0.5)", badge: "تمت", badgeBg: "rgba(16,185,129,0.12)", badgeC: "#10b981" }
                : step.status === "active"
                  ? { dot: "#f59e0b", glow: "rgba(245,158,11,0.5)", badge: "جاري الآن", badgeBg: "rgba(245,158,11,0.12)", badgeC: "#f59e0b" }
                  : { dot: "#475569", glow: "", badge: "قادمة", badgeBg: "rgba(71,85,105,0.12)", badgeC: "#64748b" };
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                      style={{ background: s.dot, boxShadow: s.glow ? `0 0 16px ${s.glow}` : "none" }}>
                      {idx + 1}
                    </div>
                    {idx < 3 && <div className="w-0.5 h-16 mt-2" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden />}
                  </div>
                  <div className="flex-1 rounded-card-sm p-4" style={S_GLASS}>
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>{step.day}</span>
                      <span className="text-[9px] px-2.5 py-1 rounded-full font-bold"
                        style={{ background: s.badgeBg, color: s.badgeC, border: `1px solid ${s.badgeC}40` }}>
                        {s.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB ── GUIDES
        ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "guides" && (
          <div className="space-y-5" style={{ animation: "slideInUp 0.25s var(--ease-enter) both" }}>
            <div className="rounded-card-lg p-5 relative overflow-hidden" style={S_GLASS}>
              <h2 className="text-lg font-black text-white mb-3">عن ماذا تبحث؟</h2>
              <div className="relative">
                <label htmlFor="guides-search" className="sr-only">البحث في الأدلة</label>
                <input
                  id="guides-search"
                  type="search"
                  placeholder="ابحث عن مدينة، سوق، أو تطبيق..."
                  className="w-full pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none rounded-card-sm"
                  style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                  onFocus={e => { e.currentTarget.style.border = "1px solid var(--color-border-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-border-ring)"; }}
                  onBlur={e => { e.currentTarget.style.border = "1px solid var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex gap-2 scrollbar-none pb-1 overscroll-x-contain -mx-4 px-4" role="tablist" aria-label="تصفية الأدلة">
              {[
                { id: "apps", label: "تطبيقات" },
                { id: "markets", label: "أسواق الجملة" },
                { id: "tourism", label: "سياحة" },
                { id: "halal", label: "دليل حلال" },
              ].map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={activeGuideFilter === f.id}
                  onClick={() => setActiveGuideFilter(f.id)}
                  className="flex-shrink-0 h-11 px-5 text-sm font-bold rounded-full press-scale"
                  style={activeGuideFilter === f.id
                    ? { background: "var(--btn-primary-bg)", color: "#fff", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", border: "none" }
                    : { background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {activeGuideFilter === "apps" && (
              <div className="space-y-3" role="tabpanel">
                {APPS.map((app) => (
                  <div key={app.name} className="rounded-card-sm p-4 flex gap-4 items-center press-scale" style={S_GLASS}>
                    <div className="w-16 h-16 rounded-card-sm flex items-center justify-center text-3xl flex-shrink-0 relative overflow-hidden"
                      style={{ background: app.color, boxShadow: `0 6px 20px ${app.shadow}` }} role="img" aria-label={app.name}>
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%)" }} aria-hidden />
                      {app.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-black text-white text-sm">{app.name.split(" ")[0]}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.14)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }}>
                          {app.badge}
                        </span>
                      </div>
                      <p className="text-xs line-clamp-1" style={{ color: "var(--color-text-muted)" }}>{app.desc}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <a href="#" className="btn-ghost px-3 rounded-card-sm text-[10px] font-bold flex items-center justify-center gap-1.5" style={{ height: "26px" }} aria-label={`iOS ${app.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.8 1.44.03 2.59.54 3.37 1.48-2.92 1.64-2.45 5.51.52 6.78-.71 1.76-1.57 3.51-2.7 4.71zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                        iOS
                      </a>
                      <a href="#" className="btn-ghost px-3 rounded-card-sm text-[10px] font-bold flex items-center justify-center gap-1.5" style={{ height: "26px" }} aria-label={`Android ${app.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414l3.124-5.412a.22.22 0 0 0-.081-.301.226.226 0 0 0-.306.082l-3.17 5.492A11.164 11.164 0 0 0 12 14.127c-1.848 0-3.585.437-5.09 1.205L3.74 9.84a.226.226 0 0 0-.306-.082.22.22 0 0 0-.081.301l3.124 5.412C3.123 17.202 1 20.315 1 23.953h22c0-3.638-2.123-6.751-5.477-8.611zM8.136 21.054a1.085 1.085 0 1 1 0-2.17 1.085 1.085 0 0 1 0 2.17zm7.728 0a1.085 1.085 0 1 1 0-2.17 1.085 1.085 0 0 1 0 2.17z"/></svg>
                        Android
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeGuideFilter === "markets" && (
              <div className="space-y-4" role="tabpanel">
                {MARKETS.map((m) => (
                  <div key={m.name} className="rounded-card-sm overflow-hidden" style={S_GLASS}>
                    <div className="h-40 relative overflow-hidden">
                      <div className="absolute inset-0 skeleton" />
                      <Image src={m.img} alt={m.name} fill sizes="(max-width:512px) 100vw,512px" className="object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(2,6,23,0.90) 0%,transparent 60%)" }} />
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(to right,transparent,rgba(245,158,11,0.55),transparent)" }} aria-hidden />
                      <span className="absolute bottom-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        📍 {m.city}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-white text-sm mb-1">{m.name}</h3>
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--color-text-muted)" }}>{m.suitability}</p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                          style={{ background: m.diffBg, color: m.diffColor, border: `1px solid ${m.diffColor}40` }}>
                          {m.difficulty}
                        </span>
                        <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(m.name)}`} target="_blank" rel="noreferrer" className="btn-ghost px-4 rounded-card-sm text-xs font-bold flex items-center justify-center gap-1.5" style={{ height: "var(--btn-height)" }}
                          aria-label={`فتح ${m.name} في Amap`}>
                          📍 Amap
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeGuideFilter === "tourism" && (
              <div className="space-y-4" role="tabpanel">
                {SIGHTS.map((s) => (
                  <div key={s.name} className="rounded-card-sm overflow-hidden" style={S_GLASS}>
                    <div className="h-40 relative overflow-hidden">
                      <div className="absolute inset-0 skeleton" />
                      <Image src={s.img} alt={s.name} fill sizes="(max-width:512px) 100vw,512px" className="object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(2,6,23,0.90) 0%,transparent 60%)" }} />
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(to right,transparent,rgba(139,92,246,0.55),transparent)" }} aria-hidden />
                      <span className="absolute bottom-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        ⏱️ {s.duration}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-white text-sm mb-1">{s.name}</h3>
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--color-text-muted)" }}>{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "var(--color-primary)" }} aria-label="تقييم 5 نجوم">★★★★★</span>
                        <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(s.name)}`} target="_blank" rel="noreferrer" className="btn-ghost px-4 rounded-card-sm text-xs font-bold flex items-center justify-center gap-1.5" style={{ height: "var(--btn-height)" }}
                          aria-label={`فتح ${s.name} في Amap`}>
                          📍 Amap
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeGuideFilter === "halal" && (
              <div className="space-y-3" role="tabpanel">
                {HALAL.map((r) => (
                  <div key={r.name} className="rounded-card-sm p-5" style={S_GLASS}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-black text-white text-sm">{r.name}</h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: "rgba(16,185,129,0.12)", color: "var(--color-success)", border: "1px solid rgba(16,185,129,0.28)" }}>
                          حلال 100%
                        </span>
                      </div>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                        role="img" aria-label="مطعم">
                        🍽️
                      </div>
                    </div>
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--color-text-muted)" }}>{r.desc}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold" style={{ color: "var(--color-text-dim)" }}>📍 {r.location}</span>
                      <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(r.name)}`} target="_blank" rel="noreferrer" className="btn-ghost px-4 rounded-card-sm text-xs font-bold flex items-center justify-center gap-1.5" style={{ height: "var(--btn-height)" }}
                        aria-label={`فتح ${r.name} في Amap`}>
                        📍 Amap
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB ── EMERGENCY
        ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "emergency" && (
          <div className="space-y-5" style={{ animation: "slideInUp 0.25s var(--ease-enter) both" }}>
            <div className="rounded-card-sm p-5" style={S_GLASS}>
              <h2 className="text-lg font-black text-white">أرقام الطوارئ والدعم</h2>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>معلومات حيوية للحالات الطارئة خلال رحلتك.</p>
            </div>
            <div className="rounded-card-sm p-5 space-y-3" style={S_GLASS}>
              <h3 className="font-bold text-white text-sm mb-2">الاتصال بالطوارئ الصينية</h3>
              {[
                { icon: "🚔", title: "الشرطة الصينية", num: "110", note: "للسرقات والمشاكل الأمنية", color: "#3b82f6" },
                { icon: "🚑", title: "الإسعاف الطبي", num: "120", note: "للحالات الطبية المستعجلة", color: "#ef4444" },
                { icon: "🚒", title: "الدفاع المدني", num: "119", note: "للطوارئ والحرائق", color: "#f97316" },
                { icon: "📞", title: "دعم السياحة", num: "12301", note: "مخصص للسياح", color: "#10b981" },
              ].map((item) => (
                <div key={item.num} className="rounded-2xl p-3 flex items-center justify-between gap-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                      role="img" aria-label={item.title}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>{item.note}</p>
                    </div>
                  </div>
                  <a href={`tel:${item.num}`} id={`emergency-${item.num}`}
                    className="font-extrabold text-sm px-4 py-2 rounded-xl press-scale"
                    style={{ background: item.color, color: "#fff", boxShadow: `0 4px 12px ${item.color}40` }}
                    dir="ltr" aria-label={`اتصال بـ ${item.title}`}>
                    {item.num}
                  </a>
                </div>
              ))}
            </div>
            <div className="rounded-card-sm p-5 space-y-4" style={S_GLASS}>
              <h3 className="font-bold text-white text-sm">دعم وكالة السفر</h3>
              <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  مكتب الوكالة متواجد طوال فترة إقامتك — فريقنا يتحدث العربية والصينية.
                </p>
                <div className="flex gap-3 pt-1">
                  <a href="tel:+8612345678910" id="agency-call-btn"
                    className="flex-1 text-center flex items-center justify-center gap-2 font-bold text-sm press-scale text-white rounded-card-sm"
                    style={{ height: "var(--btn-height)", background: "var(--btn-primary-bg)", boxShadow: "var(--btn-primary-shadow)" }}
                    aria-label="اتصال بالوكالة">
                    <IcPhone />
                    اتصال
                  </a>
                  <a href="https://wa.me/2135000000" id="agency-whatsapp-btn" target="_blank" rel="noreferrer"
                    className="flex-1 text-center flex items-center justify-center gap-2 font-bold text-sm press-scale rounded-card-sm"
                    style={{ height: "var(--btn-height)", background: "rgba(16,185,129,0.14)", color: "#10b981", border: "1px solid rgba(16,185,129,0.28)" }}
                    aria-label="واتساب الوكالة">
                    واتساب
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB ── SETTINGS
        ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <div className="space-y-5 max-w-xl mx-auto" style={{ animation: "slideInUp 0.25s var(--ease-enter) both" }}>
            <div className="rounded-card-sm p-5" style={S_GLASS}>
              <h2 className="text-lg font-black text-white">إعدادات حساب المسافر</h2>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>تحديث بياناتك أو تغيير كلمة مرور الدخول.</p>
            </div>

            <form onSubmit={updateProfile} className="space-y-4" noValidate>
              <div className="rounded-card-sm p-5 space-y-4" style={S_GLASS}>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--color-text-dim)" }}>
                    البريد الإلكتروني (غير قابل للتعديل)
                  </label>
                  <input type="email" value={profile?.email || ""} disabled dir="ltr"
                    className="w-full px-4 rounded-card-sm text-sm outline-none"
                    style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--color-text-disabled)", cursor: "not-allowed" }} />
                </div>
                <div>
                  <label htmlFor="s-fullname" className="block text-xs font-bold mb-1.5" style={{ color: "var(--color-text-muted)" }}>الاسم الكامل</label>
                  <input id="s-fullname" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="محمد أحمد" required autoComplete="name"
                    className="w-full px-4 text-sm text-white placeholder:text-slate-600 outline-none rounded-card-sm transition-all"
                    style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                    onFocus={e => { e.currentTarget.style.border = "1px solid var(--color-border-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-border-ring)"; }}
                    onBlur={e => { e.currentTarget.style.border = "1px solid var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label htmlFor="s-phone" className="block text-xs font-bold mb-1.5" style={{ color: "var(--color-text-muted)" }}>رقم الهاتف</label>
                  <input id="s-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+213 500 00 00 00" dir="ltr" autoComplete="tel"
                    className="w-full px-4 text-sm text-white placeholder:text-slate-600 outline-none rounded-card-sm transition-all"
                    style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                    onFocus={e => { e.currentTarget.style.border = "1px solid var(--color-border-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-border-ring)"; }}
                    onBlur={e => { e.currentTarget.style.border = "1px solid var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div className="rounded-card-sm p-5 space-y-4" style={S_GLASS}>
                <h4 className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>تغيير كلمة المرور (اختياري)</h4>
                <input id="s-newpwd" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة" autoComplete="new-password"
                  className="w-full px-4 text-sm text-white placeholder:text-slate-600 outline-none rounded-card-sm transition-all"
                  style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                  onFocus={e => { e.currentTarget.style.border = "1px solid var(--color-border-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-border-ring)"; }}
                  onBlur={e => { e.currentTarget.style.border = "1px solid var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }} />
                <input id="s-confirmpwd" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور" autoComplete="new-password"
                  className="w-full px-4 text-sm text-white placeholder:text-slate-600 outline-none rounded-card-sm transition-all"
                  style={{ height: "var(--input-height)", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}
                  onFocus={e => { e.currentTarget.style.border = "1px solid var(--color-border-focus)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-border-ring)"; }}
                  onBlur={e => { e.currentTarget.style.border = "1px solid var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }} />
              </div>

              {settingsError && (
                <div role="alert" className="rounded-2xl px-4 py-3 flex items-center gap-2"
                  style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)" }}>
                  <span style={{ color: "var(--color-error)" }}><IcAlert /></span>
                  <p className="text-xs font-semibold" style={{ color: "#fca5a5" }}>{settingsError}</p>
                </div>
              )}
              {settingsSuccess && (
                <div role="status" className="rounded-2xl px-4 py-3 flex items-center gap-2"
                  style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.22)" }}>
                  <span style={{ color: "var(--color-success)" }}><IcCheck /></span>
                  <p className="text-xs font-semibold" style={{ color: "#6ee7b7" }}>{settingsSuccess}</p>
                </div>
              )}

              <button id="s-save" type="submit" disabled={updatingSettings}
                className="w-full flex items-center justify-center gap-2 rounded-card-sm font-bold press-scale btn-primary"
                style={{ height: "var(--btn-height-lg, 4rem)" }}>
                {updatingSettings ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <><IcSave /><span>حفظ التغييرات</span></>
                )}
              </button>

              <button id="s-logout" type="button" onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 font-bold text-sm press-scale btn-ghost rounded-card-sm"
                style={{ height: "3rem" }} aria-label="تسجيل الخروج">
                <IcLogOut />
                <span>تسجيل الخروج</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── PREMIUM SPRING-ACTION BOTTOM NAV DOCK ── */}
      <nav
        id="bottom-nav-dock"
        className="fixed bottom-0 inset-x-0 z-50 transform-gpu glass-strong"
        style={{
          height: "calc(5rem + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTop: "1px solid var(--color-border)",
        }}
        aria-label="التنقل الرئيسي"
      >
        <div
          className="absolute top-2 h-12 rounded-full pointer-events-none"
          style={{
            width: "18%",
            right: pillRight,
            background: "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(234,88,12,0.16))",
            border: "1px solid rgba(245,158,11,0.30)",
            transition: `right var(--dur-base) var(--ease-spring)`,
            boxShadow: "0 4px 16px rgba(245,158,11,0.18)",
          }}
          aria-hidden
        />

        <div className="flex items-center justify-around w-full h-20 px-2">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => switchTab(id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className="relative flex flex-col items-center justify-center w-16 h-16 rounded-full z-10 touch-manipulation select-none press-scale"
                style={{
                  color: isActive ? "var(--color-primary)" : "var(--color-text-dim)",
                  transition: `color var(--dur-base) var(--ease-enter)`,
                }}
              >
                <span style={{
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  filter: isActive ? "drop-shadow(0 0 6px rgba(245,158,11,0.65))" : "none",
                  transition: `transform var(--dur-base) var(--ease-spring), filter var(--dur-base) var(--ease-enter)`,
                  display: "flex",
                  alignItems: "center",
                }}>
                  <Icon active={isActive} />
                </span>
                <span className="text-[9px] mt-0.5 tracking-tight font-bold"
                  style={{
                    opacity: isActive ? 1 : 0.6,
                    transition: `opacity var(--dur-micro) var(--ease-enter)`,
                  }}>
                  {label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ background: "var(--color-primary)", boxShadow: "0 0 6px var(--color-primary)", animation: "fadeIn 0.15s ease-out" }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}