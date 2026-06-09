"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: loginErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginErr) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center p-4 overflow-hidden bg-bg">

      {/* ── خلفية الصورة المحسّنة — تمنع Layout Shift تماماً ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1200&auto=format&fit=crop"
          alt="أفق مدينة قوانغتشو، الصين"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none pointer-events-none"
        />
        {/* تدرج الغامق لضمان قراءة النص */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/78 to-slate-950/97" />
        {/* أوربس ضوئية محيطية */}
        <div className="orb" style={{ top: '-8rem', right: '-8rem', width: '500px', height: '500px', background: 'rgba(245,158,11,0.10)', filter: 'blur(80px)' }} aria-hidden />
        <div className="orb" style={{ bottom: '-6rem', left: '-6rem', width: '400px', height: '400px', background: 'rgba(30,58,138,0.12)', filter: 'blur(70px)' }} aria-hidden />
      </div>

      {/* ── صندوق تسجيل الدخول الزجاجي ── */}
      <div className="relative z-10 w-full max-w-md p-6 xs:p-8 rounded-card-lg glass shadow-2xl">

        {/* الشعار والعنوان */}
        <div className="text-center mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>
          {/* أيقونة الطائرة SVG بدلاً من الإيموجي */}
          <div
            className="w-20 h-20 rounded-card-sm mx-auto mb-4 flex items-center justify-center relative"
            style={{ background: 'var(--btn-primary-bg)', boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}
            role="img"
            aria-label="منصة المسافر"
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            {/* هالة التوهج */}
            <div className="absolute -inset-1 rounded-card-sm opacity-25 blur-sm" style={{ background: 'var(--btn-primary-bg)' }} aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(to left, var(--color-amber-400), var(--color-orange-600))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            منصة المسافر
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            بوابتك الرقمية الحصرية للتجارة والسياحة في الصين
          </p>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* حقل البريد الإلكتروني */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              البريد الإلكتروني
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none" style={{ color: 'var(--color-text-dim)' }} aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L2.25 8.91" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@domain.com"
                dir="ltr"
                className="w-full pr-11 pl-4 text-base text-white placeholder:text-slate-600 outline-none rounded-card-sm transition-all"
                style={{
                  height: 'var(--input-height)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--color-border)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid var(--color-border-focus)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-border-ring)';
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              كلمة المرور
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none" style={{ color: 'var(--color-text-dim)' }} aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-11 pl-4 text-base text-white outline-none rounded-card-sm transition-all"
                style={{
                  height: 'var(--input-height)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--color-border)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid var(--color-border-focus)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-border-ring)';
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* رسائل الخطأ */}
          {error && (
            <div role="alert" className="p-4 rounded-card-sm flex items-center gap-3 text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)', color: '#fca5a5' }}>
              <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* زر الدخول */}
          <button
            type="submit"
            id="login-submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-card-sm text-lg font-bold btn-primary touch-manipulation select-none mt-2"
            style={{ height: 'var(--btn-height-lg)' }}
            aria-label={isLoading ? 'جاري التحقق من بياناتك' : 'دخول للمنصة'}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <>
                <span>دخول للمنصة</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* فاصل وروابط المساعدة */}
        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-disabled)' }}>منصة المسافر © 2026</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-disabled)' }}>
            هذه المنصة خاصة بالمسافرين المسجلين فقط<br />
            تواصل مع الوكالة إذا واجهت مشكلة في الدخول
          </p>
        </div>
      </div>
    </div>
  );
}
