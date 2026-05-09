import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const runtime = new CopilotRuntime();
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    publicApiKey: process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
