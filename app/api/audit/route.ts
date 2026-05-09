import { NextRequest, NextResponse } from "next/server";

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb3h4ZmdnY2dtcmpvenJpZGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODQ3MjgsImV4cCI6MjA4NzQ2MDcyOH0.hpOVf21OmFQOtTzgp0FBy5CHDqcu8C8PXFWMTlmJzyU";
const ENDPOINT = "https://kaoxxfggcgmrjozridaa.supabase.co/functions/v1/analyze-listing";

export async function POST(req: NextRequest) {
  const { listing_url } = await req.json();
  const clean_url = listing_url.split("?")[0];
  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ANON_KEY,
        "apikey": ANON_KEY,
      },
      body: JSON.stringify({ listing_url: clean_url, api_key: process.env.HOSTPROFIT_API_KEY })
    });
    const d = await r.json();

    const cats: Record<string, any> = {};
    (d.issues || []).forEach((issue: any) => {
      cats[issue.type] = {
        grade: "C",
        monthly_loss: issue.estimatedLoss || 0,
        headline: issue.headline || "",
        stat: issue.supportingStat || ""
      };
    });

    const actions = (d.fixes || []).slice(0, 4).map((f: any, i: number) => {
      const issue = (d.issues || []).find((iss: any) => iss.id === f.issueId) || {};
      return {
        rank: i + 1,
        category: (issue as any).type || "general",
        action: f.recommendation || "",
        detail: f.detail || "",
        dollar_impact: (issue as any).estimatedLoss || 0,
        stat: (issue as any).supportingStat || ""
      };
    });

    return NextResponse.json({
      listing_name: d.listingName || "STR Listing",
      location: d.listingLocation || "",
      overall_score: d.overallScore || 0,
      monthly_revenue_gap: d.estimatedMonthlyLoss || 0,
      annual_revenue_gap: (d.estimatedMonthlyLoss || 0) * 12,
      review_score: d.reviewScore || 0,
      review_count: d.reviewCount || 0,
      suggested_title: d.suggestedTitle || "",
      plan: "pro",
      categories: cats,
      top_actions: actions,
    });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
