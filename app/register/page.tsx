'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [step, setStep] = useState<'loading' | 'valid' | 'invalid' | 'used' | 'success'>('loading')
  const [invite, setInvite] = useState<any>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setStep('invalid'); return }
    checkToken()
  }, [token])

  async function checkToken() {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !data) { setStep('invalid'); return }
    if (data.used) { setStep('used'); return }
    if (new Date(data.expires_at) < new Date()) { setStep('invalid'); return }

    setInvite(data)
    setStep('valid')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('كلمات المرور غير متطابقة'); return }
    if (password.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, email: invite.email }),
    })

    const result = await res.json()
    if (!res.ok) { setError(result.error || 'حدث خطأ'); setLoading(false); return }

    setStep('success')
  }

  if (step === 'loading') return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm">جاري التحقق من الرابط...</p>
      </div>
    </div>
  )

  if (step === 'invalid') return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-3xl">❌</div>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">رابط غير صالح أو منتهي</h2>
        <p className="text-sm text-slate-500">تواصل مع الوكالة للحصول على رابط جديد</p>
      </div>
    </div>
  )

  if (step === 'used') return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-3xl">🔒</div>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">الرابط مستخدم مسبقاً</h2>
        <p className="text-sm text-slate-500 mb-6">كل رابط دعوة يُستخدم مرة واحدة فقط</p>
        <a href="/" className="inline-block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full py-3.5 text-sm font-bold transition-all">
          تسجيل الدخول بحسابك
        </a>
      </div>
    </div>
  )

  if (step === 'success') return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-3xl">✅</div>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">تم إنشاء حسابك بنجاح!</h2>
        <p className="text-sm text-slate-500 mb-8">يمكنك الآن الدخول إلى المنصة</p>
        <a href="/" className="inline-block w-full bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-full py-4 text-sm font-bold transition-all shadow-lg shadow-emerald-600/20">
          تسجيل الدخول الآن
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-100/50 -top-40 -right-40 blur-3xl pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-slate-200/50 -bottom-20 -left-20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-rose-100 rounded-[24px] flex items-center justify-center mx-auto text-3xl shadow-sm border border-rose-100">
            🇨🇳
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">تفعيل الحساب</h1>
            <div className="inline-flex items-center gap-1.5 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[11px] font-semibold text-slate-600 truncate max-w-[200px]" dir="ltr">{invite?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 mr-4">كلمة المرور الجديدة</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                required
                className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 rounded-full pr-11 pl-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 mr-4">تأكيد كلمة المرور</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔑</span>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="أعد كتابة كلمة المرور"
                required
                className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 rounded-full pr-11 pl-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 animate-pulse">
              <span className="text-rose-500 text-sm">⚠️</span>
              <p className="text-xs font-semibold text-rose-700 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-70 text-white rounded-full py-4 text-sm font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 group mt-2"
          >
            <span>{loading ? 'جاري الإنشاء...' : 'إنشاء الحساب وتفعيل'}</span>
            {!loading && <span className="group-hover:-translate-x-1 transition-transform duration-300">✓</span>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
