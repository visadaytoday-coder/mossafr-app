import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/travelers?notice_id=xxx  — fetch confirmations for a notice
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const noticeId = searchParams.get("notice_id");

    let query = supabaseAdmin.from("traveler_confirmations").select("*");
    if (noticeId) query = query.eq("notice_id", noticeId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
