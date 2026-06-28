"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });

    if (loginErr) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", data.user.id).single();

    if (profile?.role === "admin") router.push("/admin");
    else router.push("/dashboard");
  };

  return (
    <div className="relative min-h-dvh w-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #01081A 0%, #000000 40%, #010810 100%)" }}>

      {/* ── Rich dark background — Day To Day Voyage brand depth ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main navy radial gradient — corporate blue atmosphere */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 70% at 50% -5%, rgba(3,65,112,0.70) 0%, rgba(3,65,112,0.20) 45%, transparent 70%)"
        }} />
        {/* Gold warm glow — crescent reference */}
        <div className="orb" style={{
          bottom: "25%", left: "-80px", width: "320px", height: "320px",
          background: "rgba(255,179,83,0.12)", filter: "blur(80px)"
        }} aria-hidden />
        {/* Sky blue left edge */}
        <div className="orb" style={{
          top: "-60px", right: "-60px", width: "350px", height: "350px",
          background: "rgba(47,163,220,0.15)", filter: "blur(90px)"
        }} aria-hidden />
        {/* Deep navy center fill */}
        <div className="orb" style={{
          top: "30%", left: "30%", width: "280px", height: "280px",
          background: "rgba(3,65,112,0.25)", filter: "blur(60px)"
        }} aria-hidden />

        {/* Brand SVG — airplane + concentric rings + gold crescent */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" fill="none"
          style={{ opacity: 0.12 }} aria-hidden>
          {/* Concentric rings — logo reference */}
          <circle cx="340" cy="120" r="220" stroke="rgba(47,163,220,1)" strokeWidth="0.8" fill="none" />
          <circle cx="340" cy="120" r="170" stroke="rgba(47,163,220,0.7)" strokeWidth="0.6" fill="none" />
          <circle cx="340" cy="120" r="120" stroke="rgba(255,179,83,1)" strokeWidth="0.9" fill="none" />
          <circle cx="340" cy="120" r="70"  stroke="rgba(255,179,83,0.5)" strokeWidth="0.6" fill="none" />
          {/* Gold crescent */}
          <path d="M50 700 Q150 620 250 700 Q150 780 50 700Z"
            stroke="rgba(255,179,83,1)" strokeWidth="1.2"
            fill="rgba(255,179,83,0.08)" />
          {/* Wing arc lines */}
          <path d="M-30 420 Q180 280 430 380"
            stroke="rgba(47,163,220,1)" strokeWidth="1.5" fill="none" />
          <path d="M-30 455 Q180 315 430 415"
            stroke="rgba(47,163,220,0.45)" strokeWidth="0.9" fill="none" />
          <path d="M-30 490 Q180 350 430 450"
            stroke="rgba(47,163,220,0.20)" strokeWidth="0.6" fill="none" />
          {/* Plane body line */}
          <line x1="80" y1="350" x2="320" y2="420"
            stroke="rgba(255,255,255,0.30)" strokeWidth="1" strokeDasharray="4,6" />
        </svg>

        {/* Subtle dot grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(47,163,220,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }} aria-hidden />

        {/* Floating brand dots */}
        <div style={{ position:"absolute", top:"20%", right:"20%", width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,179,83,0.80)", animation:"pulseDot 3s ease-in-out infinite" }} aria-hidden />
        <div style={{ position:"absolute", top:"45%", left:"10%", width:"4px", height:"4px", borderRadius:"50%", background:"rgba(47,163,220,0.70)", animation:"pulseDot 4s ease-in-out infinite 1s" }} aria-hidden />
        <div style={{ position:"absolute", top:"30%", left:"40%", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,255,255,0.40)", animation:"pulseDot 3.5s ease-in-out infinite 0.5s" }} aria-hidden />
        <div style={{ position:"absolute", top:"60%", right:"35%", width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,179,83,0.50)", animation:"pulseDot 5s ease-in-out infinite 2s" }} aria-hidden />
      </div>

      {/* ── Top Brand Section ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center"
        style={{ animation: "fadeIn 0.55s ease-out both" }}>

        {/* Logo mark — gold circle with plane SVG, animated glow */}
        <div
          className="w-22 h-22 mx-auto mb-6 flex items-center justify-center relative"
          style={{
            width: "88px", height: "88px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(3,65,112,0.70), rgba(1,30,51,0.90))",
            border: "1.5px solid rgba(255,179,83,0.35)",
            boxShadow: "0 8px 40px rgba(3,65,112,0.45), 0 0 0 1px rgba(47,163,220,0.15)",
            animation: "float 4s ease-in-out infinite",
            backdropFilter: "blur(16px)"
          }}
          role="img"
          aria-label="Day To Day Voyage — منصة المسافر"
        >
          {/* Outer gold ring accent */}
          <div style={{
            position: "absolute", inset: "-4px", borderRadius: "50%",
            border: "1px solid rgba(255,179,83,0.18)"
          }} aria-hidden />
          {/* Plane icon */}
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              stroke="var(--brand-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Sky blue glow underneath */}
          <div style={{
            position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "12px", borderRadius: "50%",
            background: "rgba(47,163,220,0.30)", filter: "blur(8px)"
          }} aria-hidden />
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-black text-white mb-1 tracking-tight" style={{ fontFamily: "'Cairo', sans-serif" }}>
          منصة المسافر
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--brand-sky)" }}>
          DAY TO DAY VOYAGE
        </p>
        <p className="text-sm" style={{ color: "var(--gray-muted)" }}>
          بوابتك الرقمية للتجارة والسياحة في الصين
        </p>

        {/* Feature pills — sky border */}
        <div className="flex gap-2 mt-5 flex-wrap justify-center">
          {["معرض الكانتون", "دليل الأسواق", "دعم فوري"].map((tag) => (
            <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full" style={{
              background: "rgba(47,163,220,0.10)",
              border: "1px solid rgba(47,163,220,0.28)",
              color: "var(--brand-sky)"
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom Sheet — Navy Frosted Glass Form ── */}
        <div className="relative z-10 w-full"
        style={{
          background: "linear-gradient(180deg, rgba(1,10,20,0.97) 0%, rgba(2,18,34,0.99) 100%)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderRadius: "var(--radius-screen) var(--radius-screen) 0 0",
          borderTop: "1px solid rgba(47,163,220,0.22)",
          boxShadow: "0 -16px 60px rgba(3,65,112,0.50), inset 0 1px 0 rgba(47,163,220,0.08)",
          padding: "2rem 1.5rem max(2rem, env(safe-area-inset-bottom))",
          animation: "slideUpSheet 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both",
        }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(47,163,220,0.25)" }} aria-hidden />

        <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
          أهلاً بعودتك
        </h2>
        <p className="text-sm mb-6" style={{ color: "#8BA8C8" }}>
          سجّل دخولك للوصول إلى بوابتك المخصصة
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold" style={{ color: "var(--brand-sky)" }}>
              البريد الإلكتروني
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none" style={{ color: "rgba(139,168,200,0.60)" }} aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L2.25 8.91" />
                </svg>
              </span>
              <input id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="username@domain.com" dir="ltr"
                className="input-capsule pr-11" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold" style={{ color: "var(--brand-sky)" }}>
              كلمة المرور
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none" style={{ color: "rgba(139,168,200,0.60)" }} aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input id="password" type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="input-capsule pr-11" />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div role="alert" className="flex items-center gap-2.5 p-3.5 rounded-2xl text-sm font-medium" style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#fca5a5"
            }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit row — label left + GOLD CIRCLE button right */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-black text-base text-white">دخول للمنصة</p>
              <p className="text-xs" style={{ color: "var(--gray-muted)" }}>
                {isLoading ? "جاري التحقق من بياناتك..." : "اضغط للمتابعة"}
              </p>
            </div>
            {/* ★ Gold circle — brand accent CTA */}
            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-gold-circle press-scale"
              aria-label={isLoading ? "جاري التحقق" : "دخول"}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 rounded-full" style={{
                  borderColor: "rgba(0,0,0,0.20)",
                  borderTopColor: "var(--brand-black)",
                  animation: "spin 0.8s linear infinite"
                }} />
              ) : (
                /* Arrow pointing left (RTL direction = forward) */
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    style={{ transform: "scaleX(-1)", transformOrigin: "center" }} />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(47,163,220,0.14)" }} />
          <span className="text-[11px] font-semibold" style={{ color: "var(--gray-300)" }}>تحميل التطبيق</span>
          <div className="flex-1 h-px" style={{ background: "rgba(47,163,220,0.14)" }} />
        </div>

        {/* App Store / Google Play — sky border pill style */}
        <div className="flex gap-3 justify-center">
          <a href="#" className="pill-outline" aria-label="تحميل من App Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.8 1.44.03 2.59.54 3.37 1.48-2.92 1.64-2.45 5.51.52 6.78-.71 1.76-1.57 3.51-2.7 4.71zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            App Store
          </a>
          <a href="#" className="pill-outline" aria-label="تحميل من Google Play">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3.18 23.76a2 2 0 001.37-.4l.06-.06L16.02 12 4.61.7a2 2 0 00-1.43-.57C2.53.13 2 .75 2 1.56v20.88c0 .81.53 1.43 1.18 1.32zm14.3-12.94l-2.63-2.63-9.6 5.54 12.23-2.91zm-2.63-5.53l2.63-2.63-12.23-2.9 9.6 5.53zm3.97 3.47L17 11.24l1.85-1.07 2.19-1.26c.92-.54.92-1.41 0-1.94L19 5.71l-1.85-1.07 1.67-.96 2.02.52 2.35 4.58-2.37 4.01z" />
            </svg>
            Google Play
          </a>
        </div>

        <p className="text-center text-[11px] mt-5" style={{ color: "rgba(165,180,252,0.35)" }}>
          Day To Day Voyage © 2026 — خاصة بالمسافرين المسجلين
        </p>
      </div>
    </div>
  );
}
