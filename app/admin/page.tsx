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
  const [inputText, setInputText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  // 1. جلب البيانات الأولية (آخر إشعار والتأكيدات الحالية) عند فتح الصفحة
  useEffect(() => {
    const fetchInitialData = async () => {
      // جلب آخر إشعار
      const { data: noticeData } = await supabase
        .from("daily_notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (noticeData && noticeData[0]) {
        setCurrentNotice(noticeData[0].content);

        // جلب التأكيدات المرتبطة بهذا الإشعار بالتحديد
        const { data: confData } = await supabase
          .from("traveler_confirmations")
          .select("*")
          .eq("notice_id", noticeData[0].id);

        // هنا يمكنك دمج قائمة المسافرين المسجلين لديك مع حالات التأكيد المسترجعة
        // كمثال تفاعلي، سنعرض التأكيدات القادمة مباشرة من الجدول:
        if (confData) {
          const mapped: Traveler[] = confData.map((c) => ({
            id: c.id,
            name: c.traveler_name,
            room: c.room_number,
            status: "confirmed",
            time: new Date(c.confirmed_at).toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit' })
          }));
          setTravelers(mapped);
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
            ...prev.filter(t => t.name !== newConf.traveler_name) // تفادي التكرار
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
      // إرسال الملاحظة لقاعدة البيانات (ستنبثق فوراً عند المستخدمين)
      const { data, error } = await supabase
        .from("daily_notices")
        .insert([{ content: inputText.trim() }])
        .select();

      if (!error && data) {
        setCurrentNotice(inputText);
        setInputText("");
        setTravelers([]); // تصفير القائمة استعداداً لاستقبال تأكيدات الإشعار الجديد
      }
    } catch (err) {
      console.error("Error inserting notice", err);
    } finally {
      setIsUpdating(false);
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
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{traveler.name}</h3>
                      <p className="text-xs text-text-dim mt-0.5">رقم الغرفة: <span className="font-inter font-bold text-text-muted">{traveler.room}</span></p>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">تم التأكيد</span>
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