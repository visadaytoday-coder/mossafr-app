"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Fixed Picsum IDs — bright, colorful travel imagery ──────────────────────
const IMGS = {
  hero: "https://scontent.forn3-2.fna.fbcdn.net/v/t39.30808-6/673821975_1284772367092762_5596392718504523700_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NOCl4d-xpZgQ7kNvwFKaXZ2&_nc_oc=AdpMfzkns5rHqt9CCOZXUooWV_6nIbnKYmSKDihsdwNYLDYzg_sqQX6cqJ2qna2Lm5M&_nc_zt=23&_nc_ht=scontent.forn3-2.fna&_nc_gid=a_kjwJ57lmV7maNcvYqa8g&_nc_ss=7b2a8&oh=00_Af_UOVYcjKzvpQHMy87NfARYsaOaV8inZVzN3zXB4lDhUQ&oe=6A404B38",   // Mountain lake — vivid
  market1: "https://picsum.photos/id/164/700/400",    // Architecture — colorful
  market2: "https://picsum.photos/id/392/700/400",    // City street — vibrant
  place1: "https://picsum.photos/id/1036/700/400",   // Aerial city view
  place2: "https://picsum.photos/id/1000/700/400",   // Mountain landscape
  trip1: "https://picsum.photos/id/232/700/500",    // Airport runway
  trip2: "https://picsum.photos/id/1071/700/500",   // Exhibition hall
  trip3: "https://picsum.photos/id/342/700/500",    // Busy marketplace
  trip4: "https://picsum.photos/id/485/700/500",    // Departure gate
};

type TabType = "dashboard" | "trips" | "guides" | "emergency" | "settings";

// ─── Brand constants (Day To Day Voyage) ─────────────────────────────────────
const GOLD = "#FFB353";   // Warm gold crescent
const NAVY = "#034170";   // Deep corporate blue
const SKY = "#2FA3DC";   // Sky blue accent
const BLACK = "#000000";   // Pure black background
const WHITE = "#FFFFFF";   // White text
const MUTED = "#8BA8C8";   // Warm blue-gray — readable on dark bg (NOT purple)

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const IcHome = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IcList = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.4" : "0"} />
    <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.4" : "0"} />
    <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.4" : "0"} />
    <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.4" : "0"} />
  </svg>
);
const IcBook = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.15" : "0"} />
  </svg>
);
const IcPhone = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.15" : "0"} />
  </svg>
);
const IcSettings = ({ active }: { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.3" : "0"} />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IcUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);
const IcBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
const IcCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
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
const IcChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const IcMap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IcStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IcPhoneCall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS: { id: TabType; label: string; Icon: React.FC<{ active?: boolean }> }[] = [
  { id: "dashboard", label: "الرئيسية", Icon: IcHome },
  { id: "trips", label: "رحلتي", Icon: IcList },
  { id: "guides", label: "الأدلة", Icon: IcBook },
  { id: "emergency", label: "الطوارئ", Icon: IcPhone },
  { id: "settings", label: "إعدادات", Icon: IcSettings },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const APPS = [
  { id: "wechat", name: "WeChat", nameAr: "ويشات", desc: "التواصل والدفع مع الموردين داخل الصين.", badge: "إجباري", color: "#07C160", shadow: "rgba(7,193,96,0.30)", emoji: "💬" },
  { id: "alipay", name: "Alipay", nameAr: "ألي باي", desc: "المحفظة الإلكترونية الأساسية — مقبولة في كل مكان.", badge: "إجباري", color: "#1677FF", shadow: "rgba(22,119,255,0.30)", emoji: "💳" },
  { id: "didi", name: "DiDi", nameAr: "ديدي", desc: "تطبيق التاكسي الأرخص والأسهل.", badge: "موصى به", color: "#FF6600", shadow: "rgba(255,102,0,0.30)", emoji: "🚕" },
  { id: "trip", name: "Trip.com", nameAr: "تريب", desc: "حجز قطارات الرصاصة والطيران والفنادق.", badge: "مفيد جداً", color: "#007DFF", shadow: "rgba(0,125,255,0.30)", emoji: "✈️" },
  { id: "baidu", name: "Baidu Maps", nameAr: "بايدو", desc: "أدق نظام خرائط داخل الصين.", badge: "موصى به", color: "#2932E1", shadow: "rgba(41,50,225,0.30)", emoji: "🗺️" },
  { id: "trans", name: "Baidu Translate", nameAr: "مترجم", desc: "مترجم نصوص وصور فوري.", badge: "ضروري", color: GOLD, shadow: "rgba(255,179,83,0.30)", emoji: "🔤" },
];

const MARKETS = [
  { city: "قوانغتشو", img: IMGS.market1, name: "مجمع معرض الكانتون", suitability: "كبار المستوردين وأصحاب المشاريع.", difficulty: "متوسط", diffColor: SKY, rating: "4.9", km: "12 كم" },
  { city: "قوانغتشو", img: IMGS.market2, name: "سوق بايما للملابس", suitability: "تجار الملابس الجاهزة والمنسوجات.", difficulty: "متقدم", diffColor: "#ef4444", rating: "4.7", km: "8 كم" },
  { city: "ييوو", img: IMGS.market1, name: "سوق الفوتيان الدولي", suitability: "تجار السلع الصغيرة والهدايا.", difficulty: "مبتدئ", diffColor: "#10b981", rating: "4.8", km: "عبر القطار" },
  { city: "شنزن", img: IMGS.market2, name: "سوق هواكيانبي للإلكترونيات", suitability: "تجار الهواتف والإكسسوارات.", difficulty: "متقدم", diffColor: "#ef4444", rating: "4.6", km: "2 ساعة" },
];

const SIGHTS = [
  { name: "برج كانتون", img: IMGS.place1, desc: "أيقونة مدينة قوانغتشو — تجربة الصعود ليلاً رائعة.", duration: "ساعتان", rating: "4.9", km: "5 كم" },
  { name: "حديقة يويشيو", img: IMGS.place2, desc: "حديقة تاريخية كبيرة — رمز الخراف الخمسة الشهير.", duration: "3 ساعات", rating: "4.7", km: "3 كم" },
  { name: "شارع بكين للمشاة", img: IMGS.place1, desc: "شارع تسوق تاريخي يضم محلات حديثة.", duration: "3 ساعات", rating: "4.8", km: "4 كم" },
  { name: "نافورة على العالم", img: IMGS.place2, desc: "حديقة ترفيهية بمجسمات لأهم معالم العالم.", duration: "4 ساعات", rating: "4.6", km: "شنزن" },
];

const HALAL = [
  { name: "مطعم الهلال الذهبي", desc: "أطعمة إسلامية صينية تقليدية — لحم الضأن المشوي.", location: "منطقة تيانهي", rating: "4.8", type: "صيني إسلامي" },
  { name: "مطعم البسفور التركي", desc: "أكل تركي وعربي حلال 100% — مناسب لغداء الأعمال.", location: "قرب شارع تاو جين", rating: "4.7", type: "تركي عربي" },
  { name: "مطاعم الأويغور", desc: "منتشرة في كل الشوارع — ابحث عن كلمة (清真).", location: "متوفر في كافة المناطق", rating: "4.5", type: "أويغوري" },
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
      { name: "سوق الفوتيان", desc: "أكبر سوق جملة للسلع الصغيرة في العالم", amap: "Yiwu International Trade City" },
      { name: "سوق هوانغ يوان", desc: "متخصص في الملابس", amap: "Huangyuan Clothing Market Yiwu" },
      { name: "شارع بينوانغ الليلي", desc: "سوق ليلي مفعم بالحيوية", amap: "Binwang Night Market Yiwu" },
    ],
    halal: [
      { name: "مطعم المائدة", desc: "مأكولات عربية متنوعة", amap: "Al Maida Restaurant Yiwu" },
      { name: "مطعم الأقصى", desc: "أكل شامي أصيل", amap: "Aqsa Restaurant Yiwu" },
      { name: "مطعم طربوش", desc: "شاورما ومشويات", amap: "Tarboush Restaurant Yiwu" },
    ]
  }
};

const GUIDE_FILTERS = [
  { id: "apps", label: "التطبيقات" },
  { id: "markets", label: "الأسواق" },
  { id: "tourism", label: "السياحة" },
  { id: "halal", label: "الحلال" },
];

const TRIP_PHASES = [
  { day: "اليوم 1 — الوصول", status: "completed", title: "الاستقبال في المطار", desc: "الوصول لمطار قوانغتشو بايون الدولي. مندوب الوكالة بانتظارك في صالة الوصول بعد الجمارك.", img: IMGS.trip1, cat: "مطار" },
  { day: "اليوم 2 إلى 4 — معرض الكانتون", status: "active", title: "حضور فعاليات معرض كانتون", desc: "التوجه صباحاً إلى Pazhou Complex. جولات داخل المعرض والاجتماع مع الموردين الصينيين.", img: IMGS.trip2, cat: "معرض" },
  { day: "اليوم 5 و 6 — الأسواق", status: "pending", title: "جولات الجملة والتسوق", desc: "زيارة أسواق الملابس (Baima / Zhanxi) والجلود والأحذية في قوانغتشو.", img: IMGS.trip3, cat: "أسواق" },
  { day: "اليوم 7 — المغادرة", status: "pending", title: "ترتيبات اللوجستي والعودة", desc: "تنسيق الشحن مع مكتب الوكالة ثم الاستعداد للمغادرة والعودة إلى الجزائر.", img: IMGS.trip4, cat: "عودة" },
];

// ─── Helper: glass card style ─────────────────────────────────────────────────
const GLASS = {
  background: "rgba(3,65,112,0.25)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid rgba(47,163,220,0.18)`,
  borderRadius: "28px",
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeGuideFilter, setActiveGuideFilter] = useState("apps");
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [expandedCity, setExpandedCity] = useState<"guangzhou" | "yiwu" | null>(null);
  const [liveNotice, setLiveNotice] = useState("جاري جلب ملاحظة اليوم...");
  const [currentNoticeId, setCurrentNoticeId] = useState<string | null>(null);
  const [hasConfirmedNotice, setHasConfirmedNotice] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
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
    const fetchNotice = async () => {
      try {
        const res = await fetch("/api/notices");
        if (res.ok) {
          const { data } = await res.json();
          if (data && data[0]) { setLiveNotice(data[0].content); setCurrentNoticeId(data[0].id); }
          else { setLiveNotice("التجمع في بهو الفندق الساعة 08:30 صباحاً للانطلاق إلى معرض الكانتون"); }
        }
      } catch { setLiveNotice("التجمع في بهو الفندق الساعة 08:30 صباحاً للانطلاق إلى معرض الكانتون"); }
    };
    fetchNotice();
    const ch = supabase.channel("live-notices").on("postgres_changes",
      { event: "INSERT", schema: "public", table: "daily_notices" },
      (payload: any) => {
        setLiveNotice(payload.new.content); setCurrentNoticeId(payload.new.id);
        setHasConfirmedNotice(false);
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function handleLogout() { await supabase.auth.signOut(); router.push("/"); }

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
    } finally { setUpdatingSettings(false); }
  }

  const daysLeft = (() => {
    if (!profile?.trip_date) return null;
    const t = new Date(profile.trip_date), d = new Date();
    t.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0);
    return Math.ceil((t.getTime() - d.getTime()) / 86400000);
  })();

  const handleConfirmNotice = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch("/api/travelers/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traveler_name: profile?.full_name || user?.email?.split("@")[0] || "مسافر",
          room_number: profile?.room_number || "غير محدد",
          notice_id: currentNoticeId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Confirm error:", err);
      } else {
        setHasConfirmedNotice(true);
      }
    } catch (e) { console.error(e); }
    finally { setIsConfirming(false); }
  };

  const switchTab = (id: TabType) => setActiveTab(id);

  if (loading) return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4" style={{ background: BLACK }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: NAVY }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </div>
      <div className="w-7 h-7 rounded-full border-2" style={{ borderColor: `rgba(255,179,83,0.20)`, borderTopColor: GOLD, animation: "spin 0.8s linear infinite" }} />
      <p className="text-sm font-semibold" style={{ color: MUTED }}>جاري تحميل البوابة...</p>
    </div>
  );

  return (
    <div dir="rtl" className="relative min-h-dvh w-full"
      style={{ background: BLACK, color: WHITE, paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }}>

      {/* ── Ambient background orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="orb" style={{ top: "-5rem", right: "-5rem", width: "400px", height: "400px", background: "rgba(3,65,112,0.45)", filter: "blur(90px)" }} />
        <div className="orb" style={{ top: "45%", left: "-5rem", width: "350px", height: "350px", background: "rgba(47,163,220,0.12)", filter: "blur(80px)" }} />
        <div className="orb" style={{ bottom: "10%", right: "25%", width: "280px", height: "280px", background: "rgba(255,179,83,0.08)", filter: "blur(70px)" }} />
        {/* Subtle grid texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(47,163,220,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full flex items-center justify-between px-5"
        style={{
          height: "72px",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid rgba(47,163,220,0.14)`,
        }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>
            {activeTab === "dashboard" ? "DAY TO DAY VOYAGE" :
              activeTab === "trips" ? "خطة الرحلة" :
                activeTab === "guides" ? "الأدلة والمعلومات" :
                  activeTab === "emergency" ? "الطوارئ والدعم" : "الإعدادات"}
          </p>
          <h1 className="text-2xl font-black text-white" style={{ lineHeight: "1.1" }}>
            {activeTab === "dashboard" ? "اكتشف" :
              activeTab === "trips" ? "رحلتي" :
                activeTab === "guides" ? "الأدلة" :
                  activeTab === "emergency" ? "الطوارئ" : "إعدادات"}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Bell icon — navy glass circle */}
          <button className="w-11 h-11 rounded-full flex items-center justify-center relative press-scale"
            style={{ background: `rgba(3,65,112,0.50)`, border: `1px solid rgba(47,163,220,0.22)`, color: SKY }}
            aria-label="الإشعارات" onClick={() => switchTab("dashboard")}>
            <IcBell />
            {!hasConfirmedNotice && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-black"
                style={{ background: GOLD, animation: "pulseDot 2s ease-in-out infinite" }} aria-hidden />
            )}
          </button>
          {/* Gold avatar circle */}
          <button className="w-11 h-11 rounded-full flex items-center justify-center press-scale"
            style={{ background: GOLD, color: BLACK, boxShadow: `0 4px 16px rgba(255,179,83,0.35)` }}
            aria-label="إعدادات الحساب" onClick={() => switchTab("settings")}>
            <IcUser />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full max-w-lg md:max-w-3xl mx-auto px-4 py-5">

        {/* ── TAB: DASHBOARD ──────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6" style={{ animation: "slideInUp 0.25s ease-out both" }}>

            {/* Greeting + countdown */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: MUTED }}>مرحباً بعودتك 👋</p>
                <p className="text-xl font-black text-white">
                  {profile?.full_name || user?.email?.split("@")[0] || "مسافرنا العزيز"}
                </p>
              </div>
              {daysLeft !== null && (
                <div className="text-center px-4 py-2 rounded-2xl" style={{
                  background: `rgba(255,179,83,0.12)`, border: `1px solid rgba(255,179,83,0.30)`
                }}>
                  <p className="text-2xl font-black" style={{ color: GOLD }}>{daysLeft}</p>
                  <p className="text-[10px] font-bold" style={{ color: GOLD }}>يوم متبقٍ</p>
                </div>
              )}
            </div>

            {/* Admin notice card — navy gradient */}
            <section aria-labelledby="notice-heading" className="rounded-3xl p-5" style={{
              background: "linear-gradient(135deg, #022B49 0%, #011830 100%)",
              border: "1px solid rgba(47,163,220,0.30)",
              boxShadow: "0 8px 32px rgba(3,65,112,0.50), inset 0 1px 0 rgba(255,179,83,0.10)"
            }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(255,179,83,0.15)` }}>
                  <svg className="w-5 h-5" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 id="notice-heading" className="text-sm font-bold mb-1" style={{ color: GOLD }}>ملاحظة اليوم</h3>
                  <p className="text-sm leading-relaxed text-white/85">{liveNotice}</p>
                </div>
              </div>
              {hasConfirmedNotice ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }} role="status">
                  <span style={{ color: "#10b981" }}><IcCheck /></span>
                  <div>
                    <span className="text-sm font-bold text-white block">أنا جاهز ✓</span>
                    <span className="text-[11px]" style={{ color: MUTED }}>تم إبلاغ المشرف بجاهزيتك</span>
                  </div>
                </div>
              ) : (
                <button onClick={handleConfirmNotice} disabled={isConfirming}
                  className="w-full h-12 rounded-2xl font-bold text-sm press-scale flex items-center justify-center gap-2"
                  style={{ background: GOLD, color: BLACK }}>
                  {isConfirming
                    ? <div className="w-4 h-4 border-2 rounded-full" style={{ borderColor: "rgba(0,0,0,0.2)", borderTopColor: BLACK, animation: "spin 0.8s linear infinite" }} />
                    : <><IcCheck /><span>أنا جاهز</span></>
                  }
                </button>
              )}
            </section>

            {/* Hero trip card */}
            <section className="relative overflow-hidden rounded-3xl shadow-xl" style={{ aspectRatio: "4/2.5" }}>
              <div className="absolute inset-0 skeleton rounded-3xl" />
              <Image src={IMGS.hero} alt="أفق مدينة قوانغتشو" fill sizes="(max-width:512px) 100vw, 512px" className="object-cover" priority />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: `1px solid rgba(255,179,83,0.30)` }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>التسجيل مؤكد ✓</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold mb-1" style={{ color: SKY }}>معرض الكانتون — قوانغتشو</p>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-2xl font-black text-white">رحلتك إلى الصين</h2>
                  {/* Gold circle CTA */}
                  <button onClick={() => switchTab("trips")}
                    className="btn-gold-circle press-scale flex-shrink-0" style={{ width: "48px", height: "48px" }}
                    aria-label="تفاصيل الرحلة">
                    <IcChevronLeft />
                  </button>
                </div>
              </div>
            </section>

            {/* Essential Apps — Horizontal pill tab row */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-white">تطبيقات لا غنى عنها</h2>
                <button onClick={() => { switchTab("guides"); setActiveGuideFilter("apps"); }}
                  className="text-xs font-bold" style={{ color: SKY }}>عرض الكل</button>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                {APPS.map((app, i) => (
                  <button key={app.id} onClick={() => setActiveAppIndex(i)}
                    className={`pill-tab flex-shrink-0 ${activeAppIndex === i ? "active" : ""}`}
                    aria-pressed={activeAppIndex === i}>
                    <span className="mr-1">{app.emoji}</span>{app.name}
                  </button>
                ))}
              </div>
              {/* Sky blue underline progress */}
              <div className="flex gap-1.5 mt-2 px-1">
                {APPS.map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i === activeAppIndex ? SKY : "rgba(47,163,220,0.14)" }} />
                ))}
              </div>
              {/* Active app detail */}
              <div className="mt-3 p-4 rounded-3xl flex items-start gap-3" style={GLASS}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: APPS[activeAppIndex].color, boxShadow: `0 4px 16px ${APPS[activeAppIndex].shadow}` }}
                  role="img" aria-label={APPS[activeAppIndex].name}>
                  {APPS[activeAppIndex].emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-black text-sm text-white">{APPS[activeAppIndex].name}</p>
                    <span className="status-badge text-[9px]" style={{ background: `rgba(255,179,83,0.12)`, color: GOLD, border: `1px solid rgba(255,179,83,0.28)` }}>
                      {APPS[activeAppIndex].badge}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: MUTED }}>{APPS[activeAppIndex].desc}</p>
                </div>
              </div>
            </section>

            {/* Trip plan carousel */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-white">مخطط الرحلة</h2>
                <button onClick={() => switchTab("trips")} className="text-xs font-bold" style={{ color: SKY }}>التفاصيل</button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 snap-x snap-mandatory">
                {[
                  { icon: "🛬", label: "الوصول", sub: "مطار قوانغتشو", status: "completed", img: IMGS.trip1 },
                  { icon: "🎪", label: "الكانتون", sub: "اليوم 2-4", status: "active", img: IMGS.trip2 },
                  { icon: "🛍️", label: "الأسواق", sub: "اليوم 5-6", status: "pending", img: IMGS.trip3 },
                  { icon: "🛫", label: "العودة", sub: "اليوم 7", status: "pending", img: IMGS.trip4 },
                ].map((step) => (
                  <div key={step.label} onClick={() => switchTab("trips")}
                    className="flex-shrink-0 w-40 h-52 relative rounded-3xl overflow-hidden snap-center press-scale"
                    style={{ boxShadow: "var(--shadow-md)", cursor: "pointer", border: `1px solid rgba(47,163,220,0.15)` }}
                    role="button" tabIndex={0} aria-label={`مرحلة: ${step.label}`}
                    onKeyDown={(e) => e.key === "Enter" && switchTab("trips")}>
                    <div className="absolute inset-0 skeleton" />
                    <Image src={step.img} alt={step.label} fill sizes="160px" className="object-cover" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, transparent 55%)" }} />
                    <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full border-2 border-black"
                      style={{ background: step.status === "completed" ? "#10b981" : step.status === "active" ? GOLD : "#444" }} aria-hidden />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="px-2 py-1 rounded-xl inline-block mb-1" style={{ background: `rgba(3,65,112,0.55)`, backdropFilter: "blur(8px)", border: `1px solid rgba(47,163,220,0.22)` }}>
                        <span className="text-[10px] font-bold" style={{ color: SKY }}>{step.sub}</span>
                      </div>
                      <p className="text-white font-black text-sm">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* City quick guide */}
            <section>
              <h2 className="text-base font-black text-white mb-3">دليل المدن السريع</h2>
              <div className="flex gap-3 mb-3">
                {(["guangzhou", "yiwu"] as const).map((city) => (
                  <button key={city} onClick={() => setExpandedCity(expandedCity === city ? null : city)}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm press-scale transition-all"
                    style={{
                      background: expandedCity === city ? GOLD : "rgba(3,65,112,0.30)",
                      color: expandedCity === city ? BLACK : MUTED,
                      border: expandedCity === city ? `1px solid ${GOLD}` : `1px solid rgba(47,163,220,0.18)`
                    }}>
                    📍 {city === "guangzhou" ? "قوانغتشو" : "ييوو"}
                  </button>
                ))}
              </div>
              {expandedCity && (
                <div className="space-y-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
                  {[
                    { title: `أهم الأسواق في ${CITY_DATA[expandedCity].name}`, items: CITY_DATA[expandedCity].markets },
                    { title: `مطاعم حلال في ${CITY_DATA[expandedCity].name}`, items: CITY_DATA[expandedCity].halal },
                  ].map((sec) => (
                    <div key={sec.title} className="rounded-3xl p-4" style={GLASS}>
                      <h4 className="text-xs font-bold mb-3" style={{ color: SKY }}>{sec.title}</h4>
                      <div className="space-y-2">
                        {sec.items.map((m: any) => (
                          <div key={m.name} className="flex items-center justify-between p-3 rounded-2xl"
                            style={{ background: "rgba(0,0,0,0.35)", border: `1px solid rgba(47,163,220,0.12)` }}>
                            <div>
                              <p className="text-xs font-bold text-white">{m.name}</p>
                              <p className="text-[10px]" style={{ color: MUTED }}>{m.desc}</p>
                            </div>
                            <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(m.amap)}`} target="_blank" rel="noreferrer"
                              className="btn-sky-circle press-scale" style={{ width: "36px", height: "36px" }}
                              aria-label={`Amap ${m.name}`}><IcMap /></a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── TAB: TRIPS ──────────────────────────────────────────────── */}
        {activeTab === "trips" && (
          <div className="space-y-4" style={{ animation: "slideInUp 0.25s ease-out both" }}>
            <p className="text-sm" style={{ color: MUTED }}>البرنامج اليومي للمعرض والأسواق.</p>
            <div className="space-y-3">
              {TRIP_PHASES.map((step, idx) => {
                const sColor = step.status === "completed" ? "#10b981" : step.status === "active" ? GOLD : "#555";
                const sBg = step.status === "completed" ? "rgba(16,185,129,0.10)" : step.status === "active" ? `rgba(255,179,83,0.10)` : "rgba(80,80,80,0.10)";
                const sLabel = step.status === "completed" ? "تمت" : step.status === "active" ? "جاري الآن" : "قادمة";
                return (
                  <div key={idx} className="flex gap-3 items-center rounded-3xl p-3"
                    style={{ ...GLASS, borderRadius: "24px" }}>
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0">
                      <div className="absolute inset-0 skeleton" />
                      <Image src={step.img} alt={step.title} fill sizes="80px" className="object-cover" loading="lazy" />
                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.65)", color: SKY }}>{step.cat}</span>
                      </div>
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: sBg, color: sColor, border: `1px solid ${sColor}30` }}>
                        {sLabel}
                      </span>
                      <p className="text-[10px] font-semibold mt-1" style={{ color: SKY }}>{step.day}</p>
                      <h3 className="text-sm font-black text-white leading-tight">{step.title}</h3>
                      <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: MUTED }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: GUIDES ─────────────────────────────────────────────── */}
        {activeTab === "guides" && (
          <div className="space-y-5" style={{ animation: "slideInUp 0.25s ease-out both" }}>

            {/* Wave-cut navy hero banner */}
            <div className="relative overflow-hidden" style={{ borderRadius: "0 0 28px 28px", margin: "-1.25rem -1rem 0 -1rem" }}>
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, #022B49)`, padding: "1.5rem 1.5rem 3rem", borderBottom: `1px solid rgba(47,163,220,0.18)` }}>
                <h2 className="text-2xl font-black text-white mb-1">الأدلة والمعلومات</h2>
                <p className="text-sm" style={{ color: MUTED }}>تصفح التطبيقات، الأسواق، السياحة، والمطاعم الحلال</p>
                <div className="relative mt-3">
                  <label htmlFor="guides-search" className="sr-only">البحث في الأدلة</label>
                  <input id="guides-search" type="search" placeholder="ابحث عن مدينة، سوق، أو تطبيق..."
                    className="input-capsule" style={{ borderColor: "rgba(47,163,220,0.30)" }} />
                </div>
              </div>
              <svg viewBox="0 0 400 40" className="absolute bottom-0 left-0 right-0 w-full" style={{ display: "block" }} aria-hidden>
                <path d="M0,20 Q100,40 200,20 Q300,0 400,20 L400,40 L0,40 Z" fill="black" />
              </svg>
            </div>

            {/* Category pill tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {GUIDE_FILTERS.map((f) => (
                <button key={f.id} onClick={() => setActiveGuideFilter(f.id)}
                  className={`pill-tab flex-shrink-0 ${activeGuideFilter === f.id ? "active" : ""}`}
                  aria-pressed={activeGuideFilter === f.id}>{f.label}</button>
              ))}
            </div>
            {/* Sky underline indicator */}
            <div className="tab-underline-track"><div className="tab-underline-active" style={{
              width: `${(GUIDE_FILTERS.findIndex(f => f.id === activeGuideFilter) + 1) * 25}%`
            }} /></div>

            {/* APPS */}
            {activeGuideFilter === "apps" && (
              <div className="space-y-3" role="tabpanel">
                {APPS.map((app) => (
                  <div key={app.id} className="rounded-3xl p-4 flex items-center gap-3" style={GLASS}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: app.color, boxShadow: `0 4px 16px ${app.shadow}` }} role="img" aria-label={app.name}>
                      {app.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-sm text-white">{app.name}</p>
                        <span className="status-badge text-[9px]" style={{ background: `rgba(255,179,83,0.12)`, color: GOLD, border: `1px solid rgba(255,179,83,0.28)` }}>{app.badge}</span>
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: MUTED }}>{app.desc}</p>
                    </div>
                    <button className="btn-sky-circle flex-shrink-0" aria-label={`تثبيت ${app.name}`}><IcChevronLeft /></button>
                  </div>
                ))}
              </div>
            )}

            {/* MARKETS */}
            {activeGuideFilter === "markets" && (
              <div className="space-y-4" role="tabpanel">
                {MARKETS.map((m) => (
                  <div key={m.name} className="rounded-3xl overflow-hidden" style={{ ...GLASS, padding: 0 }}>
                    <div className="h-44 relative overflow-hidden">
                      <div className="absolute inset-0 skeleton" />
                      <Image src={m.img} alt={m.name} fill sizes="(max-width:512px) 100vw, 512px" className="object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)" }} />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: SKY, border: `1px solid rgba(47,163,220,0.25)` }}>
                        📍 {m.city}
                      </div>
                    </div>
                    {/* 3-column metric chips */}
                    <div className="grid grid-cols-3 gap-2 p-4 pb-3">
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">المسافة</p>{m.km}</div>
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">التقييم</p>⭐ {m.rating}</div>
                      <div className="metric-chip" style={{ fontSize: "0.65rem" }}><p className="text-[10px] opacity-60 mb-0.5">المستوى</p>{m.difficulty}</div>
                    </div>
                    <div className="px-4 pb-4">
                      <h3 className="font-black text-sm text-white mb-1">{m.name}</h3>
                      <p className="text-xs mb-3" style={{ color: MUTED }}>{m.suitability}</p>
                      {/* Sticky footer: label left + sky circle CTA right */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">موردون ومعارض</p>
                          <p className="text-[10px]" style={{ color: MUTED }}>اضغط للاتجاهات</p>
                        </div>
                        <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(m.name)}`} target="_blank" rel="noreferrer"
                          className="btn-sky-circle press-scale" style={{ width: "48px", height: "48px" }} aria-label={`Amap ${m.name}`}>
                          <IcChevronLeft />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TOURISM */}
            {activeGuideFilter === "tourism" && (
              <div className="space-y-4" role="tabpanel">
                {SIGHTS.map((s) => (
                  <div key={s.name} className="rounded-3xl overflow-hidden" style={{ ...GLASS, padding: 0 }}>
                    <div className="h-44 relative overflow-hidden">
                      <div className="absolute inset-0 skeleton" />
                      <Image src={s.img} alt={s.name} fill sizes="(max-width:512px) 100vw, 512px" className="object-cover" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)" }} />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: GOLD, border: `1px solid rgba(255,179,83,0.25)` }}>
                        ⏱ {s.duration}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-4 pb-3">
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">المسافة</p>{s.km}</div>
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">التقييم</p>⭐ {s.rating}</div>
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">المدة</p>{s.duration}</div>
                    </div>
                    <div className="px-4 pb-4">
                      <h3 className="font-black text-sm text-white mb-1">{s.name}</h3>
                      <p className="text-xs mb-3" style={{ color: MUTED }}>{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex" style={{ color: GOLD }}>{[...Array(5)].map((_, i) => <IcStar key={i} />)}</div>
                        <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(s.name)}`} target="_blank" rel="noreferrer"
                          className="btn-sky-circle press-scale" style={{ width: "48px", height: "48px" }} aria-label={`Amap ${s.name}`}>
                          <IcChevronLeft />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HALAL */}
            {activeGuideFilter === "halal" && (
              <div className="space-y-3" role="tabpanel">
                {HALAL.map((r) => (
                  <div key={r.name} className="rounded-3xl p-4" style={GLASS}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `rgba(255,179,83,0.12)`, border: `1px solid rgba(255,179,83,0.25)` }} role="img" aria-label="مطعم">
                        🍽️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-black text-sm text-white">{r.name}</p>
                          <span className="status-badge text-[9px]" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.28)" }}>حلال ✓</span>
                        </div>
                        <p className="text-[10px] font-semibold" style={{ color: SKY }}>{r.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">التقييم</p>⭐ {r.rating}</div>
                      <div className="metric-chip col-span-2"><p className="text-[10px] opacity-60 mb-0.5">الموقع</p><span className="truncate">{r.location}</span></div>
                    </div>
                    <p className="text-xs mb-3" style={{ color: MUTED }}>{r.desc}</p>
                    {/* Sticky footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{r.name}</p>
                        <p className="text-[10px]" style={{ color: MUTED }}>📍 {r.location}</p>
                      </div>
                      <a href={`https://ditu.amap.com/search?query=${encodeURIComponent(r.name)}`} target="_blank" rel="noreferrer"
                        className="btn-sky-circle press-scale" style={{ width: "48px", height: "48px" }} aria-label={`Amap ${r.name}`}>
                        <IcChevronLeft />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: EMERGENCY ──────────────────────────────────────────── */}
        {activeTab === "emergency" && (
          <div className="space-y-5" style={{ animation: "slideInUp 0.25s ease-out both" }}>

            {/* Navy hero banner — emergency */}
            <div className="relative overflow-hidden" style={{ borderRadius: "0 0 28px 28px", margin: "-1.25rem -1rem 0 -1rem" }}>
              <div style={{ background: `linear-gradient(135deg, #1A0505, #3B0000)`, padding: "1.5rem 1.5rem 3rem" }}>
                <h2 className="text-2xl font-black text-white mb-1">أرقام الطوارئ</h2>
                <p className="text-sm" style={{ color: "rgba(255,160,160,0.70)" }}>معلومات حيوية للحالات الطارئة خلال رحلتك</p>
              </div>
              <svg viewBox="0 0 400 40" className="absolute bottom-0 left-0 right-0 w-full" style={{ display: "block" }} aria-hidden>
                <path d="M0,20 Q100,40 200,20 Q300,0 400,20 L400,40 L0,40 Z" fill="black" />
              </svg>
            </div>

            {/* Emergency numbers */}
            <div className="space-y-3">
              {[
                { icon: "🚔", title: "الشرطة الصينية", num: "110", note: "للسرقات والمشاكل الأمنية", metric: "متاح 24/7" },
                { icon: "🚑", title: "الإسعاف الطبي", num: "120", note: "للحالات الطبية المستعجلة", metric: "أسرع خدمة" },
                { icon: "🚒", title: "الدفاع المدني", num: "119", note: "للطوارئ والحرائق", metric: "طوارئ" },
                { icon: "📞", title: "دعم السياحة", num: "12301", note: "مخصص للسياح", metric: "عربي / إنجليزي" },
              ].map((item) => (
                <div key={item.num} className="rounded-3xl p-4" style={GLASS}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `rgba(255,179,83,0.10)`, border: `1px solid rgba(255,179,83,0.22)` }}
                      role="img" aria-label={item.title}>{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white">{item.title}</h4>
                      <p className="text-[11px]" style={{ color: MUTED }}>{item.note}</p>
                    </div>
                  </div>
                  {/* 3-column metric chips */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="metric-chip col-span-2"><p className="text-[10px] opacity-60 mb-0.5">الرقم</p>
                      <span className="font-black text-lg" dir="ltr">{item.num}</span>
                    </div>
                    <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">الخدمة</p>{item.metric}</div>
                  </div>
                  {/* Sticky footer: bold white number left + sky circle CTA right */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black text-white" dir="ltr">{item.num}</p>
                      <p className="text-xs" style={{ color: MUTED }}>اتصال فوري</p>
                    </div>
                    <a href={`tel:${item.num}`} id={`emergency-${item.num}`}
                      className="btn-sky-circle press-scale" style={{ width: "52px", height: "52px" }}
                      aria-label={`اتصال بـ ${item.title}`}>
                      <IcPhoneCall />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Agency support card */}
            <div className="rounded-3xl overflow-hidden" style={{ ...GLASS, padding: 0 }}>
              <div className="p-5 pb-4" style={{ background: `linear-gradient(135deg, ${NAVY}, #022B49)`, borderBottom: `1px solid rgba(47,163,220,0.18)` }}>
                <h3 className="text-base font-black text-white mb-1">دعم وكالة السفر</h3>
                <p className="text-sm" style={{ color: MUTED }}>مكتب الوكالة متواجد طوال فترة إقامتك — فريقنا يتحدث العربية والصينية.</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">متاح</p>24/7</div>
                  <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">اللغة</p>عربي</div>
                  <div className="metric-chip"><p className="text-[10px] opacity-60 mb-0.5">الدعم</p>فوري</div>
                </div>
                {/* Footer: text left + sky circle (call) + whatsapp green */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-white">اتصال / واتساب</p>
                    <p className="text-[10px]" style={{ color: MUTED }}>فريق الوكالة جاهز</p>
                  </div>
                  <div className="flex gap-2.5">
                    <a href="tel:+8612345678910" id="agency-call-btn"
                      className="btn-sky-circle press-scale" style={{ width: "52px", height: "52px" }} aria-label="اتصال بالوكالة">
                      <IcPhoneCall />
                    </a>
                    <a href="https://wa.me/2135000000" id="agency-whatsapp-btn" target="_blank" rel="noreferrer"
                      className="press-scale flex items-center justify-center rounded-full"
                      style={{ width: "52px", height: "52px", background: "#25D366", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }} aria-label="واتساب الوكالة">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SETTINGS ────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="space-y-5 max-w-xl mx-auto" style={{ animation: "slideInUp 0.25s ease-out both" }}>

            {/* Profile header */}
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 relative"
                style={{ background: NAVY, border: `2px solid ${GOLD}`, boxShadow: `0 8px 32px rgba(255,179,83,0.25)` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </div>
              <p className="font-black text-lg text-white">{profile?.full_name || "مسافرنا العزيز"}</p>
              <p className="text-sm" style={{ color: MUTED }}>{profile?.email || user?.email || ""}</p>
              <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: `rgba(255,179,83,0.12)`, color: GOLD, border: `1px solid rgba(255,179,83,0.28)` }}>
                DAY TO DAY VOYAGE
              </span>
            </div>

            <form onSubmit={updateProfile} className="space-y-4" noValidate>
              {/* Profile fields */}
              <div className="rounded-3xl p-5 space-y-4" style={GLASS}>
                <h3 className="text-sm font-black text-white">بيانات الحساب</h3>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold" style={{ color: SKY }}>البريد الإلكتروني (غير قابل للتعديل)</label>
                  <input type="email" value={profile?.email || ""} disabled dir="ltr" className="input-capsule" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="s-fullname" className="block text-xs font-bold" style={{ color: SKY }}>الاسم الكامل</label>
                  <input id="s-fullname" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="محمد أحمد" required autoComplete="name" className="input-capsule" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="s-phone" className="block text-xs font-bold" style={{ color: SKY }}>رقم الهاتف</label>
                  <input id="s-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+213 500 00 00 00" dir="ltr" autoComplete="tel" className="input-capsule" />
                </div>
              </div>

              <div className="rounded-3xl p-5 space-y-4" style={GLASS}>
                <h3 className="text-sm font-black text-white">تغيير كلمة المرور <span className="font-medium text-xs" style={{ color: MUTED }}>(اختياري)</span></h3>
                <input id="s-newpwd" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة" autoComplete="new-password" className="input-capsule" />
                <input id="s-confirmpwd" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور" autoComplete="new-password" className="input-capsule" />
              </div>

              {settingsError && (
                <div role="alert" className="flex items-center gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#fca5a5" }}>
                  <IcAlert /><p className="text-xs font-semibold">{settingsError}</p>
                </div>
              )}
              {settingsSuccess && (
                <div role="status" className="flex items-center gap-2.5 p-3.5 rounded-2xl" style={{ background: "rgba(47,163,220,0.10)", border: `1px solid rgba(47,163,220,0.28)`, color: SKY }}>
                  <IcCheck /><p className="text-xs font-semibold">{settingsSuccess}</p>
                </div>
              )}

              {/* Save — navy gradient button */}
              <button id="s-save" type="submit" disabled={updatingSettings}
                className="w-full flex items-center justify-center gap-2 font-bold press-scale"
                style={{ height: "var(--btn-height-lg)", background: `linear-gradient(135deg, ${NAVY}, #022B49)`, color: WHITE, borderRadius: "var(--radius-button)", border: `1px solid rgba(47,163,220,0.28)`, boxShadow: "var(--btn-primary-shadow)" }}>
                {updatingSettings
                  ? <div className="w-5 h-5 border-2 rounded-full" style={{ borderColor: "rgba(255,255,255,0.20)", borderTopColor: WHITE, animation: "spin 0.8s linear infinite" }} />
                  : <><IcSave /><span>حفظ التغييرات</span></>
                }
              </button>

              {/* Logout — gold circle style */}
              <div className="flex items-center justify-between p-4 rounded-3xl" style={GLASS}>
                <div>
                  <p className="text-sm font-black text-white">تسجيل الخروج</p>
                  <p className="text-xs" style={{ color: MUTED }}>سيتم إعادتك لشاشة الدخول</p>
                </div>
                {/* Gold circle = brand exit trigger */}
                <button id="s-logout" type="button" onClick={handleLogout}
                  className="btn-gold-circle press-scale" aria-label="تسجيل الخروج">
                  <IcLogOut />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FLOATING BOTTOM NAV DOCK — frosted deep blue glass
      ═══════════════════════════════════════════════════════════════════ */}
      <nav id="bottom-nav-dock" className="fixed bottom-0 inset-x-0 z-50 flex justify-center"
        style={{ padding: `0.75rem 1.25rem max(1.25rem, env(safe-area-inset-bottom))` }}
        aria-label="التنقل الرئيسي">
        {/* Frosted blue pill dock */}
        <div className="flex items-center gap-1 px-3 py-2.5"
          style={{
            background: "rgba(3,65,112,0.40)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderRadius: "var(--radius-screen)",
            border: `1px solid rgba(47,163,220,0.22)`,
            boxShadow: `0 8px 40px rgba(3,65,112,0.45), 0 2px 8px rgba(0,0,0,0.30)`,
          }}>
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} id={`nav-${id}`} onClick={() => switchTab(id)}
                aria-current={isActive ? "page" : undefined} aria-label={label}
                className="relative flex flex-col items-center justify-center press-scale"
                style={{ transition: "all var(--dur-base) var(--ease-spring)", width: isActive ? "64px" : "52px", height: "52px" }}>
                {isActive ? (
                  /* ★ Solid Gold circle for active icon */
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: GOLD, boxShadow: `0 4px 20px rgba(255,179,83,0.45)`, transition: "all var(--dur-base) var(--ease-spring)" }}>
                    <span style={{ color: BLACK, display: "flex" }}>
                      <Icon active={isActive} />
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center gap-0.5"
                    style={{ color: MUTED }}>
                    <span style={{ display: "flex" }}><Icon active={false} /></span>
                    <span className="text-[8px] font-bold leading-none">{label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}