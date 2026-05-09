import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await (client.beta.messages.create as any)({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    betas: ["mcp-client-2025-04-04"],
    system: "You are an STR revenue intelligence assistant for Bijou Getaways with 42 listings across USVI, Maui, Napa, Miami, Paris, South of France. When asked to audit a listing, ALWAYS call the get_listing_health_and_recommendations tool. For Maui G110 use listing_id=6894674e2e3de8000f0b488a and pms_name=guesty. For USVI Villa use listing_id=689462b3d615d7000eabf27b and pms_name=guesty. Present results with the dollar gap prominently.",
    messages: messages,
    tools: [
      {
        type: "mcp",
        server_name: "hostprofit",
        server_url: "https://hostprofit-mcp-production.up.railway.app/sse",
      }
    ],
  });

  const text = response.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n");

  return NextResponse.json({ type: "text", content: text });
}
