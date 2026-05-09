"use client";
import React from "react";

const statusConfig = {
  Blue: { dot: "#378ADD", bg: "#E6F1FB", border: "#B5D4F4", label: "Outperforming market", textColor: "#0C447C" },
  Green: { dot: "#639922", bg: "#EAF3DE", border: "#C0DD97", label: "Healthy", textColor: "#27500A" },
  Yellow: { dot: "#EF9F27", bg: "#FAEEDA", border: "#FAC775", label: "Needs attention", textColor: "#633806" },
  Red: { dot: "#E24B4A", bg: "#FCEBEB", border: "#F7C1C1", label: "Underperforming", textColor: "#791F1F" },
};

export function RevenueAuditCard({ listingName, market, basePrice, bedrooms, status, marketSection, recommendations, estimatedRevenueAtRiskUsd }: any) {
  const cfg = statusConfig[status.color as keyof typeof statusConfig] || statusConfig.Blue;
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.15)", padding: "20px 22px", fontFamily: "system-ui", color: "#1a1a1a", maxWidth: 520 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{listingName}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{market} · ${basePrice}/night{bedrooms ? ` · ${bedrooms} BR` : ""}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: cfg.bg, color: cfg.textColor, border: `0.5px solid ${cfg.border}`, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
          {cfg.label}
        </div>
      </div>
      {estimatedRevenueAtRiskUsd !== undefined && (
        <div style={{ background: "#FAEEDA", border: "0.5px solid #FAC775", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#854F0B", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>Recoverable revenue</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#412402", marginTop: 2 }}>${Math.round(estimatedRevenueAtRiskUsd).toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#633806", marginTop: 2 }}>Found in 3 seconds across this listing</div>
        </div>
      )}
      <div style={{ fontSize: 13, color: "#444", marginBottom: 16, lineHeight: 1.5 }}>{status.text}</div>
      {marketSection && marketSection.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500, marginBottom: 8 }}>Pacing vs market</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {marketSection.slice(0, 3).map((row: any) => (
              <div key={row.period} style={{ background: "#f6f5f1", borderRadius: 8, padding: "10px 12px", fontSize: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{row.period}</div>
                <div style={{ color: "#444" }}>{row.marketBlurb}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {recommendations && recommendations.map((rec: any, idx: number) => (
        <div key={rec.key} style={{ background: "#fafaf7", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "12px 14px", marginBottom: idx < recommendations.length - 1 ? 8 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{rec.header}</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{rec.text}</div>
        </div>
      ))}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: "0.5px solid rgba(0,0,0,0.1)", fontSize: 12, color: "#888" }}>Powered by HostProfit + PriceLabs</div>
    </div>
  );
}

export default RevenueAuditCard;
