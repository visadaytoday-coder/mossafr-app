import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { traveler_name, room_number, notice_id } = body;

    if (!traveler_name || !notice_id) {
      return NextResponse.json(
        { error: "traveler_name and notice_id are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("traveler_confirmations")
      .insert([{ traveler_name, room_number: room_number || "غير محدد", notice_id }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
