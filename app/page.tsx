
"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const LISTINGS: Record<string, any> = {
  maui_g110: {
    listing_name: "G110 - Maui Banyan", location: "Maui", overall_score: 8,
    monthly_revenue_gap: 8420, annual_revenue_gap: 101040,
    categories: {
      pricing: { grade: "B", monthly_loss: 4200, headline: "Cleaning fee exceeds base nightly rate" },
      photos: { grade: "C", monthly_loss: 2100, headline: "Hero shot lacks exterior golden hour" },
      amenities: { grade: "B", monthly_loss: 1200, headline: "Missing workspace and parking details" },
      title: { grade: "B", monthly_loss: 580, headline: "Title missing key search terms" },
    },
    top_actions: [
      { rank: 1, category: "pricing", action: "Reduce cleaning fee from $350 to $142 — it exceeds your $238 base nightly rate and actively repels bookings.", detail: "Guests abandon when cleaning fee > 50% of nightly rate", dollar_impact: 4200 },
      { rank: 2, category: "photos", action: "Lead with an exterior hero shot at golden hour. Add 8+ interior photos with natural lighting.", detail: "Professional photos increase bookings by 24%", dollar_impact: 2100 },
      { rank: 3, category: "amenities", action: "Add missing high-value amenities: dedicated workspace, fast WiFi speed, parking details.", detail: "Workspace and parking are top search filters", dollar_impact: 1200 },
    ],
  },
  usvi_villa: {
    listing_name: "Entire Villa USVI", location: "St. John USVI", overall_score: 9,
    monthly_revenue_gap: 172236, annual_revenue_gap: 2066832,
    categories: {
      availability: { grade: "D", monthly_loss: 168000, headline: "93 blocked dates in peak season" },
      pricing: { grade: "B", monthly_loss: 3200, headline: "Competitor ADR 18% higher" },
      photos: { grade: "A", monthly_loss: 800, headline: "Add drone aerial shots" },
    },
    top_actions: [
      { rank: 1, category: "availability", action: "93 blocked dates: May 10-30 and Jun 6-25. At $1,852/night this is $172,236 in recoverable revenue — open your calendar now.", detail: "Unblocking peak season dates is your #1 priority", dollar_impact: 168000 },
      { rank: 2, category: "pricing", action: "Implement demand-based surge pricing for peak USVI season.", detail: "Competitor ADR is 18% higher during peak weeks", dollar_impact: 3200 },
      { rank: 3, category: "photos", action: "Add drone aerial shots of the property and ocean views.", detail: "Top USVI listings average 47 photos", dollar_impact: 800 },
    ],
  },
};

const GRADE_COLOR: Record<string, string> = { A: "#16a34a", B: "#2563eb", C: "#ca8a04", D: "#dc2626" };
const CAT_ICON: Record<string, string> = { pricing: "💰", photos: "📸", title: "✏️", amenities: "🏠", description: "📝", reviews: "⭐", availability: "📅" };

function RevenueCard({ data }: { data: any }) {
  const gap = data.monthly_revenue_gap || data.monthly_gap || data.revenue_gap || 0;
  const annual = data.annual_revenue_gap || gap * 12;
  const score = data.overall_score || data.score || 0;
  const cats = data.categories || {};
  const actions = data.top_actions || [];
  const maxLoss = Math.max(...Object.values(cats).map((c: any) => c.monthly_loss || 0), 1);
  const scoreColor = score >= 8 ? "#16a34a" : score >= 6 ? "#ca8a04" : "#dc2626";

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", margin: "8px 0", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "system-ui", maxWidth: 460 }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "18px 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>HostProfit Audit</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{data.listing_name || data.name || "STR Listing"}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{data.location || data.market || ""}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor }}>{score}</div>
            <div style={{ fontSize: 9, color: "#64748b" }}>/ 10</div>
          </div>
        </div>
        {data.review_score ? <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>⭐ {data.review_score} ({data.review_count} reviews)</div> : null}
      </div>

      <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Monthly Revenue Gap</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#92400e" }}>${annual.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 500 }}>/yr</span></div>
        <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>${annual.toLocaleString()} per year left on the table</div>
      </div>

      {Object.keys(cats).length > 0 && (
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Revenue Leaks by Category</div>
          {Object.entries(cats).sort((a: any, b: any) => (b[1].monthly_loss || 0) - (a[1].monthly_loss || 0)).map(([cat, val]: any) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{CAT_ICON[cat] || "📊"}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{cat}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: GRADE_COLOR[val.grade] || "#6b7280", borderRadius: 4, padding: "1px 6px" }}>{val.grade || "C"}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: val.monthly_loss > 0 ? "#dc2626" : "#16a34a" }}>
                  {val.monthly_loss > 0 ? `-$${val.monthly_loss.toLocaleString()}/mo` : "✓"}
                </span>
              </div>
              {val.headline && <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{val.headline}</div>}
              <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2 }}>
                <div style={{ height: "100%", width: Math.min((val.monthly_loss / maxLoss) * 100, 100) + "%", background: val.monthly_loss > maxLoss * 0.5 ? "#dc2626" : val.monthly_loss > maxLoss * 0.2 ? "#f59e0b" : "#3b82f6", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {actions.length > 0 && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Ranked Action Plan</div>
          {actions.map((action: any, i: number) => (
            <div key={i} style={{ marginBottom: 10, padding: "12px 14px", background: i === 0 ? "#fef3c7" : "#f8fafc", borderRadius: 10, border: `1px solid ${i === 0 ? "#fde68a" : "#e2e8f0"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: i === 0 ? "#92400e" : "#94a3b8" }}>#{action.rank || i + 1}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "capitalize" }}>{CAT_ICON[action.category] || "📊"} {action.category}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>+${(action.dollar_impact || 0).toLocaleString()}/mo</span>
              </div>
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{action.action}</div>
              {action.detail && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{action.detail}</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: "8px 20px 14px", fontSize: 10, color: "#94a3b8", textAlign: "center" }}>Powered by HostProfit.ai · Live AI audit</div>
    </div>
  );
}

function Tools() {
  useCopilotAction({
    name: "audit_listing",
    description: "Audit any Airbnb listing URL or demo listing and display a live revenue intelligence card",
    parameters: [
      { name: "listing_url", type: "string", description: "Airbnb listing URL if provided", required: false },
      { name: "listing_key", type: "string", description: "maui_g110 or usvi_villa for demo listings", required: false }
    ],
    handler: async ({ listing_url, listing_key }: any) => {
      if (listing_url && listing_url.includes("airbnb.com")) {
        const res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_url })
        });
        const data = await res.json();
        if (!data.error) return JSON.stringify(data);
      }
      return JSON.stringify(LISTINGS[listing_key as string] || LISTINGS.usvi_villa);
    },
    render: ({ result, status }: any) => {
      if (status === "inProgress") return (
        <div style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: 12, fontSize: 13, color: "#666" }}>
          Auditing listing with AI... (~30s)
        </div>
      );
      if (!result) return null;
      try {
        const data = typeof result === "string" ? JSON.parse(result) : result;
        return <RevenueCard data={data} />;
      } catch { return null; }
    }
  });
  return null;
}

export default function Home() {
  return (
    <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}>
      <Tools />
      <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui" }}>
        <div style={{ flex: 1, padding: 48, background: "#fafaf8" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 12 }}>HostProfit.ai</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Revenue Copilot</h1>
            <p style={{ color: "#666", marginBottom: 32, lineHeight: 1.6 }}>The Bloomberg Terminal for STR operators. Kill the dashboard.</p>
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 20, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Demo</div>
              <div style={{ fontWeight: 600 }}>Audit my USVI villa and find the revenue gap</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 20, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Demo</div>
              <div style={{ fontWeight: 600 }}>Audit my Maui Banyan G110 listing</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Try live (~30s)</div>
              <div style={{ fontWeight: 600, color: "#2563eb" }}>Paste any Airbnb URL...</div>
            </div>
          </div>
        </div>
        <div style={{ width: 500, borderLeft: "1px solid #e5e5e5" }}>
          <CopilotChat
            instructions="You are HostProfit Revenue Copilot. ALWAYS call audit_listing immediately when asked. Use listing_key usvi_villa for USVI/villa, maui_g110 for Maui/G110. For Airbnb URLs pass as listing_url. After card renders say ONE sentence only about the biggest opportunity."
            labels={{ title: "HostProfit Revenue Copilot", placeholder: "Paste any Airbnb URL or ask to audit a listing..." }}
          />
        </div>
      </div>
    </CopilotKit>
  );
}
