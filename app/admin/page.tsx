"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Traveler {
  id: string;
  name: string;
  room: string;
  status: "confirmed" | "pending";
  time: string;
}

export default function AdminPage() {
  const [currentNotice, setCurrentNotice] = useState("جاري جلب آخر إشعار...");
  const [currentNoticeId, setCurrentNoticeId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  
  // Invite state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error', text: string, link?: string } | null>(null);

  // 1. جلب البيانات الأولية (آخر إشعار والتأكيدات الحالية) عند فتح الصفحة
  useEffect(() => {
    const fetchInitialData = async () => {
      // جلب آخر إشعار عبر API (تجاوز RLS)
      const noticeRes = await fetch("/api/notices");
      if (!noticeRes.ok) return;
      const { data: noticeData } = await noticeRes.json();

      if (noticeData && noticeData[0]) {
        setCurrentNotice(noticeData[0].content);
        setCurrentNoticeId(noticeData[0].id);

        // جلب التأكيدات المرتبطة بهذا الإشعار عبر API
        const confRes = await fetch(`/api/travelers?notice_id=${noticeData[0].id}`);
        if (confRes.ok) {
          const { data: confData } = await confRes.json();
          if (confData) {
            const mapped: Traveler[] = confData.map((c: any) => ({
              id: c.id,
              name: c.traveler_name,
              room: c.room_number,
              status: "confirmed",
              time: new Date(c.confirmed_at).toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit' })
            }));
            setTravelers(mapped);
          }
        }
      }
    };

    fetchInitialData();

    // 2. الاستماع اللحظي (Realtime) لهواتف المستخدمين عند ضغط زر التأكيد
    const channel = supabase
      .channel("admin-monitor")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "traveler_confirmations" },
        (payload) => {
          const newConf = payload.new;
          const formattedTime = new Date(newConf.confirmed_at).toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit' });

          // إضافة المسافر الذي أكد حضوره فوراً وبشكل حي إلى الرادار
          setTravelers((prev) => [
            {
              id: newConf.id,
              name: newConf.traveler_name,
              room: newConf.room_number,
              status: "confirmed",
              time: formattedTime
            },
            ...prev.filter(t => t.name !== newConf.traveler_name)
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsUpdating(true);

    try {
      // إرسال الملاحظة عبر API (تجاوز RLS)
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText.trim() }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setCurrentNotice(inputText);
        if (data?.id) setCurrentNoticeId(data.id);
        setInputText("");
        setTravelers([]); // تصفير القائمة استعداداً لاستقبال تأكيدات الإشعار الجديد
      }
    } catch (err) {
      console.error("Error inserting notice", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    setInviteMessage(null);
    try {
      const res = await fetch("/api/invite/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), full_name: inviteName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMessage({ 
          type: 'success', 
          text: data.email_sent ? 'تم إرسال الدعوة بنجاح' : 'تعذر إرسال الإيميل، انسخ الرابط أدناه وأرسله للمسافر:',
          link: data.invite_url
        });
        setInviteName("");
        setInviteEmail("");
      } else {
        setInviteMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء الإرسال' });
      }
    } catch (err) {
      setInviteMessage({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-bg text-text p-4 font-sans max-w-xl mx-auto pb-12">

      <header className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          لوحة تحكم الوكالة والإدارة
        </h1>
        <p className="text-xs text-text-muted mt-1">تحديث الملاحظات اليومية وتتبع حضور العملاء في الصين</p>
      </header>

      <div className="space-y-6">

        <section aria-labelledby="admin-entry" className="p-5 rounded-card-lg glass shadow-md">
          <h2 id="admin-entry" className="text-base font-bold text-white mb-3">تحديث التوجيه اليومي الحالي</h2>

          <div className="p-4 rounded-card-sm bg-white/5 border border-amber-500/20 text-sm text-amber-300 leading-relaxed mb-4">
            <span className="block text-[11px] text-text-dim uppercase font-bold mb-1">الملاحظة النشطة حالياً:</span>
            {currentNotice}
          </div>

          <form onSubmit={handleUpdateNotice} className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب التنبيه اليومي الجديد هنا (مثال: التجمع لتناول العشاء الساعة 19:00)..."
              className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-card-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-white placeholder:text-text-dim transition-all"
            />
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-14 rounded-card-sm text-base font-bold btn-primary touch-manipulation flex items-center justify-center"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "بث وإرسال للمسافرين الآن ⚡"
              )}
            </button>
          </form>
        </section>

        <section aria-labelledby="admin-invite" className="p-5 rounded-card-lg glass shadow-md">
          <h2 id="admin-invite" className="text-base font-bold text-white mb-3">إرسال دعوة جديدة لمسافر</h2>
          
          <form onSubmit={handleSendInvite} className="space-y-4">
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="اسم المسافر (اختياري)"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-card-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-white placeholder:text-text-dim transition-all"
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="البريد الإلكتروني للمسافر"
              required
              className="w-full p-3 bg-white/5 border border-white/10 rounded-card-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-white placeholder:text-text-dim transition-all"
            />
            <button
              type="submit"
              disabled={isInviting}
              className="w-full h-14 rounded-card-sm text-base font-bold btn-primary touch-manipulation flex items-center justify-center bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isInviting ? (
                <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              ) : (
                "+ إرسال رابط الدعوة"
              )}
            </button>
          </form>

          {inviteMessage && (
            <div className={`mt-4 p-3 rounded-card-sm text-sm border ${inviteMessage.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="font-bold">{inviteMessage.text}</p>
              {inviteMessage.link && (
                <div className="mt-2 text-xs break-all bg-black/20 p-2 rounded select-all cursor-text font-mono border border-white/10 text-white/80">
                  {inviteMessage.link}
                </div>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="monitor-title" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 id="monitor-title" className="text-base font-bold text-white">رادار الحضور والجاهزية (تحديث حي)</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {travelers.filter(t => t.status === "confirmed").length} جاهزون
            </span>
          </div>

          <div className="space-y-2.5">
            {travelers.length === 0 ? (
              <p className="text-center text-xs text-text-dim py-4">في انتظار أولى تأكيدات المسافرين...</p>
            ) : (
              travelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="p-4 rounded-card-sm glass flex items-center justify-between gap-4 transform-gpu"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-3 h-3">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{traveler.name}</h3>
                      <p className="text-xs text-text-dim mt-0.5">رقم الغرفة: <span className="font-inter font-bold text-text-muted">{traveler.room}</span></p>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">جاهز ✓</span>
                      <span className="block text-[10px] text-text-dim font-inter mt-1">في الساعة {traveler.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}