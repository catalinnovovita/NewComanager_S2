import OpenAI from 'openai';
import { OpenAIStream } from 'ai';
import { getProducts, getLatestOrders, getShopStats } from '@/lib/shopify/service';
import { recallContext, rememberInteraction } from '@/lib/memory/service';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const MARKETING_AGENT_SYSTEM_PROMPT = `
You are the Marketing AI Co-Manager (Terminal 1), an elite Marketing Strategist and Creative Director.
Your goal is to assist the user with marketing strategy, content creation, campaign analysis, and data-driven decision making.

Capabilities:
1.  **Content Strategy**: Create compelling marketing briefs, campaign concepts, and content calendars.
2.  **Copywriting**: Write engaging ad copy, email campaigns, social media posts, and product descriptions.
3.  **Campaign Analysis**: Analyze campaign performance, identify trends, and provide actionable recommendations.
4.  **Market Research**: Understand customer behavior, competitive landscape, and market opportunities.
5.  **Data-Driven Insights**: Use real store data (products, orders, inventory) to inform marketing decisions.

Guidelines:
- **Be Creative**: Think outside the box while staying aligned with brand voice.
- **Be Strategic**: Every recommendation should tie back to business goals (sales, engagement, brand awareness).
- **Be Data-Driven**: Use actual store data when available to make informed suggestions.
- **Be Concise**: Clear, actionable advice over lengthy explanations.

**Data Presentation**:
- When displaying data from tools (e.g., product lists, orders), **ALWAYS** format it as a readable Markdown Table.
- **NEVER** output raw JSON objects unless explicitly asked for debugging.
- Example Table Format:
  | Product | Price | Stock | Recommendation |
  |---------|-------|-------|----------------|
  | Product A | $50 | 120 | High stock - good for promotions |

**Brand Voice**:
- Remember and apply any brand voice preferences shared by the user.
- If unsure, ask about tone and style preferences.
`;

// Define tools available to the marketing agent
const tools = [
    {
        type: 'function',
        function: {
            name: 'get_products',
            description: 'Get a list of products from the Shopify store to analyze inventory, pricing, and identify promotion opportunities.',
            parameters: {
                type: 'object',
                properties: {
                    limit: {
                        type: 'integer',
                        description: 'Number of products to fetch (default 10)',
                    },
                },
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_latest_orders',
            description: 'Get the most recent orders to analyze customer behavior, popular products, and sales trends.',
            parameters: {
                type: 'object',
                properties: {
                    limit: {
                        type: 'integer',
                        description: 'Number of orders to fetch (default 10)',
                    },
                },
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_shop_stats',
            description: 'Get basic shop information (name, currency, domain) to understand the business context.',
            parameters: {
                type: 'object',
                properties: {},
            },
        },
    },
];

// Helper to format data as Markdown Table
function formatDataAsMarkdown(toolName: string, data: any): string {
    if (!data || (Array.isArray(data) && data.length === 0)) return 'No data found.';

    if (toolName === 'get_products' && Array.isArray(data)) {
        let md = '| Product | Status | Price | Inventory | Category |\n|---|---|---|---|---|\n';
        data.forEach((p: any) => {
            md += `| ${p.title} | ${p.status} | ${p.price} ${p.currency} | ${p.inventory} | ${p.category || 'N/A'} |\n`;
        });
        return md;
    }

    if (toolName === 'get_latest_orders' && Array.isArray(data)) {
        let md = '| Order | Date | Total | Payment Status | Fulfillment |\n|---|---|---|---|---|\n';
        data.forEach((o: any) => {
            md += `| ${o.orderNumber} | ${new Date(o.date).toLocaleDateString()} | ${o.total} ${o.currency} | ${o.paymentStatus} | ${o.fulfillmentStatus} |\n`;
        });
        return md;
    }

    if (toolName === 'get_shop_stats') {
        return `
### Shop Information
- **Name**: ${data.name}
- **Domain**: ${data.myshopifyDomain || data.domain}
- **Currency**: ${data.currencyCode || data.currency}
`;
    }

    return JSON.stringify(data, null, 2);
}

export async function streamMarketingChat(messages: any[], userId: string) {
    // 1. Context: Memory (RAG)
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user')?.content || '';
    let memoryContext = '';

    if (lastUserMessage && userId) {
        try {
            memoryContext = await recallContext(userId, lastUserMessage);
        } catch (e) {
            console.error('Failed to recall context:', e);
        }
    }

    // Construct system message with memory context
    const systemMessage = `${MARKETING_AGENT_SYSTEM_PROMPT}

${memoryContext}

[INTEGRATIONS]
You have access to the Shopify store data via tools:
- Use 'get_products' to see current inventory and identify promotion opportunities.
- Use 'get_latest_orders' to understand customer behavior and trending products.
- Use 'get_shop_stats' to get basic store information.

Always use these tools when relevant to provide data-driven recommendations.
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        stream: true,
        messages: [
            { role: 'system', content: systemMessage },
            ...messages,
        ],
        tools: tools as any,
        tool_choice: 'auto',
        temperature: 0.7, // Slightly higher for creativity
    });

    return OpenAIStream(response as any, {
        experimental_onToolCall: async (call: any, { messages }: any) => {
            console.log('Marketing Agent Tool Call:', JSON.stringify(call, null, 2));

            let toolCallObject = call;

            // Check for nested tools array
            if (call.tools && Array.isArray(call.tools) && call.tools.length > 0) {
                toolCallObject = call.tools[0];
            }

            // Extract tool name
            let toolName = toolCallObject.function?.name || toolCallObject.tool?.name || toolCallObject.name;
            if (!toolName && toolCallObject.func?.name) {
                toolName = toolCallObject.func.name;
            }

            if (!toolName) {
                console.error('Unknown tool call structure - Missing Name:', call);
                return 'Error: Could not determine tool name';
            }

            // Parse arguments
            let args = toolCallObject.function?.arguments || toolCallObject.tool?.arguments || toolCallObject.arguments || toolCallObject.func?.arguments || {};
            if (typeof args === 'string') {
                try {
                    args = JSON.parse(args);
                } catch (e) {
                    console.error('Failed to parse tool arguments:', e);
                    return 'Error: Invalid tool arguments';
                }
            }

            let result = '';
            let rawData: any = null;
            try {
                if (toolName === 'get_products') {
                    rawData = await getProducts(args.limit || 10);
                } else if (toolName === 'get_latest_orders') {
                    rawData = await getLatestOrders(args.limit || 10);
                } else if (toolName === 'get_shop_stats') {
                    rawData = await getShopStats();
                } else {
                    return `Error: Tool ${toolName} not found`;
                }

                // Format the output for the user
                result = formatDataAsMarkdown(toolName, rawData);

            } catch (err: any) {
                console.error(`Tool execution failed (${toolName}):`, err);
                result = `Error executing tool: ${err.message}`;
            }

            return result;
        },
        onCompletion: async (completion) => {
            if (lastUserMessage && completion && userId) {
                try {
                    await rememberInteraction(userId, lastUserMessage, completion, 'marketing_agent');
                } catch (e) {
                    console.error('Failed to save memory:', e);
                }
            }
        }
    });
}
