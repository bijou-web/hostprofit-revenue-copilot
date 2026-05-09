import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "https://kaoxxfggcgmrjozridaa.supabase.co/functions/v1/analyze-listing-public";

export async function POST(req: NextRequest) {
  const { listing_url } = await req.json();
  const clean_url = listing_url.split("?")[0];
  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_url: clean_url })
    });
    const d = await r.json();
    const cats: Record<string,number> = {};
    Object.entries(d.categories || {}).forEach(([k,v]:any) => {
      cats[k] = v.monthly_loss || 0;
    });
    const topAction = Array.isArray(d.top_actions) && d.top_actions.length > 0
      ? d.top_actions[0].action + " (" + d.top_actions[0].dollar_impact + ")"
      : d.upgrade_message || "Review listing optimization opportunities";
    return NextResponse.json({
      name: d.listing_name || "STR Listing",
      market: d.location || "",
      score: d.overall_score || 0,
      monthly_gap: d.monthly_revenue_gap || 0,
      annual_gap: (d.monthly_revenue_gap || 0) * 12,
      status_color: "Blue",
      top_action: topAction,
      categories: cats,
    });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
