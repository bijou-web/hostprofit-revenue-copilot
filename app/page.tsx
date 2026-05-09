"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const LISTINGS: Record<string, any> = {
  maui_g110: {
    name: "G110 - Maui Banyan", market: "Maui", base_price: 238,
    status_color: "Blue",
    occupancy: [
      { month: "May", yours: 67, market: 49 },
      { month: "Jun", yours: 60, market: 31 },
      { month: "Jul", yours: 42, market: 21 },
    ],
    top_action: "Reduce cleaning fee from $350 to $142 — it exceeds your $238 base nightly rate and actively repels bookings.",
    revenue_gap: 8420,
  },
  usvi_villa: {
    name: "Entire Villa USVI", market: "St. John USVI", base_price: 1852,
    status_color: "Blue",
    occupancy: [
      { month: "May", yours: 96, market: 53 },
      { month: "Jun", yours: 80, market: 48 },
      { month: "Jul", yours: 74, market: 42 },
    ],
    top_action: "93 blocked dates: May 10-30 and Jun 6-25. At $1,852/night this is $172,236 in recoverable revenue — open your calendar now.",
    revenue_gap: 172236,
  },
};

function RevenueCard({ data }: { data: any }) {
  const color = "#2563eb";
  return (
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:16,padding:24,margin:"8px 0",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",fontFamily:"system-ui",maxWidth:420}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:11,color:"#888",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Revenue Audit</div>
          <div style={{fontSize:16,fontWeight:700}}>{data.name}</div>
          <div style={{fontSize:13,color:"#666"}}>{data.market}</div>
        </div>
        <div style={{background:color,color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600}}>{data.status_color}</div>
      </div>
      <div style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:12,padding:"14px 16px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:11,color:"#92400e",fontWeight:600,marginBottom:4}}>REVENUE GAP IDENTIFIED</div>
        <div style={{fontSize:32,fontWeight:800,color:"#92400e"}}>${(data.monthly_gap || data.revenue_gap || 0).toLocaleString()}</div>
        <div style={{fontSize:12,color:"#b45309"}}>recoverable revenue</div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,color:"#888",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Occupancy vs Market</div>
        {(data.occupancy || []).map((row: any) => (
          <div key={row.month} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
              <span style={{fontWeight:600}}>{row.month}</span>
              <span style={{color,fontWeight:700}}>{row.yours}% <span style={{color:"#999",fontWeight:400}}>vs {row.market}% market</span></span>
            </div>
            <div style={{position:"relative",height:6,background:"#f0f0f0",borderRadius:3}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:row.market+"%",background:"#e5e5e5",borderRadius:3}}/>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:row.yours+"%",background:color,borderRadius:3,opacity:0.8}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#475569",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Top Action</div>
        <div style={{fontSize:13,color:"#1e293b",lineHeight:1.5}}>{data.top_action}</div>
      </div>
      <div style={{marginTop:12,fontSize:11,color:"#aaa",textAlign:"center"}}>Powered by HostProfit.ai · PriceLabs data</div>
    </div>
  );
}

function Tools() {
  useCopilotAction({
    name: "audit_listing",
    description: "Audit a short-term rental listing and display a revenue intelligence card",
    parameters: [
      { name: "listing_url", type: "string", description: "Airbnb listing URL if provided", required: false },
      { name: "listing_key", type: "string", description: "maui_g110 or usvi_villa for demo listings", required: false }
    ],
    handler: async ({ listing_url, listing_key }) => {
      if (listing_url && listing_url.includes("airbnb.com")) {
        try {
          const res = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listing_url })
          });
          const data = await res.json();
          if (!data.error && data.monthly_gap) return JSON.stringify(data);
        } catch(e) {}
      }
      const key = listing_key as string;
      return JSON.stringify(LISTINGS[key] || LISTINGS.usvi_villa);
    },
    render: ({ result, status }) => {
      if (status === "inProgress") return <div style={{padding:12,background:"#f8fafc",borderRadius:12,fontSize:13,color:"#666"}}>Analyzing listing...</div>;
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
      <div style={{display:"flex",height:"100vh",fontFamily:"system-ui"}}>
        <div style={{flex:1,padding:48,background:"#fafaf8"}}>
          <div style={{maxWidth:480}}>
            <div style={{fontSize:13,fontWeight:600,letterSpacing:2,color:"#888",textTransform:"uppercase",marginBottom:12}}>HostProfit.ai</div>
            <h1 style={{fontSize:32,fontWeight:700,margin:"0 0 8px"}}>Revenue Copilot</h1>
            <p style={{color:"#666",marginBottom:32,lineHeight:1.6}}>The Bloomberg Terminal for STR operators. 42 listings across USVI, Maui, Napa, Miami, Paris, and South of France.</p>
            <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:20,marginBottom:12}}>
              <div style={{fontSize:12,color:"#888",marginBottom:4}}>Demo audit</div>
              <div style={{fontWeight:600}}>Audit my Maui Banyan G110 listing</div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:20}}>
              <div style={{fontSize:12,color:"#888",marginBottom:4}}>Closer moment</div>
              <div style={{fontWeight:600}}>Audit my USVI villa and find the revenue gap</div>
            </div>
          </div>
        </div>
        <div style={{width:460,borderLeft:"1px solid #e5e5e5"}}>
          <CopilotChat
            instructions="You are HostProfit Revenue Copilot. When asked to audit any listing, ALWAYS call audit_listing immediately. If the user provides an Airbnb URL, pass it as listing_url. Otherwise use listing_key: maui_g110 for Maui/G110 requests, usvi_villa for USVI/villa requests. The tool renders a visual card. After the card, add one brief insight."
            labels={{title:"HostProfit Revenue Copilot",placeholder:"Try: Audit my USVI villa and find the revenue gap"}}
          />
        </div>
      </div>
    </CopilotKit>
  );
}
