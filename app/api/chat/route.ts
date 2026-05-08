import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AUDIT_DATA: Record<string, any> = {
  maui: {
    listingName: "G110 - Maui Banyan",
    market: "Maui",
    basePrice: 238,
    status: {
      color: "Blue",
      flag: "Your listing is outperforming the market.",
      text: "G110 is beating the Maui market by 16-29 points across all upcoming months. You have strong occupancy momentum going into summer."
    },
    marketSection: [
      { period: "May", marketBlurb: "64% vs market 48%", pacingBlurb: "+16pts ahead" },
      { period: "June", marketBlurb: "60% vs market 31%", pacingBlurb: "+29pts ahead" },
      { period: "July", marketBlurb: "42% vs market 20%", pacingBlurb: "+22pts ahead" }
    ],
    recommendations: [
      { key: "cleaning_fee", header: "Reduce cleaning fee from $350 to $142", text: "Your cleaning fee exceeds your base nightly rate of $238. Guests see a first-night total cost that actively repels bookings. Cut to $142 immediately." }
    ],
    estimatedRevenueAtRiskUsd: 8420
  },
  usvi: {
    listingName: "Entire Villa USVI",
    market: "St. John USVI",
    basePrice: 1852,
    bedrooms: 13,
    status: {
      color: "Blue",
      flag: "Your listing is outperforming the market.",
      text: "Villa is at 96% occupancy vs 52% market in May — but 94 blocked dates are costing you $174,088 in recoverable revenue right now."
    },
    marketSection: [
      { period: "May", marketBlurb: "96% vs market 52%", pacingBlurb: "+44pts ahead" },
      { period: "June", marketBlurb: "80% vs market 48%", pacingBlurb: "+32pts ahead" },
      { period: "July", marketBlurb: "74% vs market 42%", pacingBlurb: "+32pts ahead" }
    ],
    recommendations: [
      { key: "blocked_dates", header: "Open 94 blocked dates immediately", text: "May 9-30 and Jun 6-25 are blocked but bookable. At $1,852/night, these 94 nights represent $174,088 in direct recoverable revenue." }
    ],
    estimatedRevenueAtRiskUsd: 174088
  }
};

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
  
  const isAudit = lastMessage.includes("audit") || lastMessage.includes("g110") || lastMessage.includes("maui") || lastMessage.includes("usvi") || lastMessage.includes("villa");
  const isUSVI = lastMessage.includes("usvi") || lastMessage.includes("villa") || lastMessage.includes("174");
  
  if (isAudit) {
    const data = isUSVI ? AUDIT_DATA.usvi : AUDIT_DATA.maui;
    return NextResponse.json({ type: "card", data });
  }
  
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "You are an STR revenue intelligence assistant for Bijou Getaways, a luxury short-term rental portfolio with 42 listings across USVI, Maui, Napa Valley, Miami, Paris, and South of France. Be concise and helpful. For audit requests, tell the user to try the suggested prompts on the left.",
    messages: messages
  });
  
  return NextResponse.json({ type: "text", content: response.content[0].type === "text" ? response.content[0].text : "" });
}
