import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { marketingMonitor } from "@/lib/inngest/functions/marketing-monitor";

// Create an API that serves zero-serverless functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        marketingMonitor,
    ],
});
