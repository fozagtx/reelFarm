import { mistral } from "@ai-sdk/mistral";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const ICP_SYSTEM_PROMPT = `You are an expert marketing strategist and customer research specialist. Your role is to help users:

1. **Generate Ideal Customer Profiles (ICPs)**: Based on the product or service they describe, create detailed buyer personas including:
   - Demographics (age, location, income, job title)
   - Psychographics (values, pain points, goals, motivations)
   - Behavioral patterns (buying habits, content consumption, decision-making process)
   - Key challenges and objections
   - Preferred communication channels

2. **Craft Unique Value Propositions & Offers**: Design compelling, tailored offers that:
   - Directly address the ICP's pain points
   - Highlight unique differentiators
   - Include specific hooks and messaging angles
   - Suggest pricing strategies and positioning
   - Provide call-to-action recommendations

Your analysis should be data-driven, actionable, and specific. Ask clarifying questions about:
- The product/service features and benefits
- Target market and industry
- Current marketing challenges
- Competitive landscape
- Business goals and objectives

Use the tools provided to generate structured ICPs and offers when the user requests them.

Be conversational, insightful, and help users discover insights they might not have considered about their target audience.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!process.env.MISTRAL_API_KEY) {
    return new Response(
      JSON.stringify({ error: "MISTRAL_API_KEY not configured" }),
      { status: 500 }
    );
  }

  const result = streamText({
    model: mistral("mistral-large-latest"),
    system: ICP_SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      generateICP: tool({
        description:
          "Generate a detailed Ideal Customer Profile based on product information provided by the user",
        inputSchema: z.object({
          productName: z.string().describe("Name of the product or service"),
          productDescription: z
            .string()
            .describe("Brief description of what the product does"),
          industry: z.string().describe("Target industry or vertical"),
          painPoints: z
            .array(z.string())
            .describe("List of pain points the product solves"),
        }),
        execute: async ({
          productName,
          productDescription,
          industry,
          painPoints,
        }) => {
          // Generate structured ICP
          return {
            persona: {
              name: `${industry} Decision Maker`,
              demographics: {
                ageRange: "Determined by industry",
                jobTitles: [
                  "VP of Marketing",
                  "CMO",
                  "Growth Lead",
                  "Marketing Director",
                ],
                companySize: "50-500 employees",
                location: "Global, primarily US/EU",
              },
              psychographics: {
                goals: [
                  "Reduce marketing costs",
                  "Increase conversion rates",
                  "Scale content production",
                ],
                painPoints: painPoints,
                values: [
                  "Efficiency",
                  "ROI-driven decisions",
                  "Innovation",
                  "Quality",
                ],
                motivations: [
                  "Career advancement through performance",
                  "Team efficiency",
                  "Competitive advantage",
                ],
              },
              behavior: {
                buyingProcess: [
                  "Research online",
                  "Compare alternatives",
                  "Request demo/trial",
                  "Stakeholder approval",
                  "Purchase decision",
                ],
                contentConsumption: [
                  "Industry blogs",
                  "LinkedIn",
                  "Case studies",
                  "Product reviews",
                ],
                decisionFactors: [
                  "ROI potential",
                  "Ease of use",
                  "Integration capabilities",
                  "Support quality",
                ],
              },
              channels: [
                "LinkedIn",
                "Email",
                "Industry conferences",
                "SaaS directories",
              ],
            },
            product: {
              name: productName,
              description: productDescription,
              industry: industry,
            },
          };
        },
      }),
      generateOffer: tool({
        description:
          "Create a compelling offer and value proposition tailored to the ICP",
        inputSchema: z.object({
          icpName: z.string().describe("Name of the target persona"),
          productName: z.string().describe("Name of the product"),
          primaryPainPoint: z
            .string()
            .describe("The main pain point this offer addresses"),
          uniqueDifferentiator: z
            .string()
            .describe("What makes this product unique"),
        }),
        execute: async ({
          icpName,
          productName,
          primaryPainPoint,
          uniqueDifferentiator,
        }) => {
          // Generate structured offer
          return {
            offer: {
              headline: `Transform ${primaryPainPoint} with ${productName}`,
              subheadline: `${uniqueDifferentiator} - Built specifically for ${icpName}`,
              valueProposition: {
                primary: `Stop wasting time and money on ${primaryPainPoint}`,
                secondary: `Get professional results in minutes, not hours`,
                proof: `Join 1,000+ companies reducing costs by 70%`,
              },
              pricing: {
                strategy: "Value-based pricing with tiered options",
                tiers: [
                  {
                    name: "Starter",
                    price: "$49/mo",
                    target: "Small teams testing the waters",
                  },
                  {
                    name: "Professional",
                    price: "$149/mo",
                    target: "Growing companies scaling content",
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "Custom",
                    target: "Large organizations with custom needs",
                  },
                ],
              },
              hooks: [
                `Cut ${primaryPainPoint} costs by 70% starting today`,
                `What if you could 10x your output without hiring?`,
                `The ${productName} your competitors are already using`,
                `From concept to execution in under 10 minutes`,
              ],
              cta: {
                primary: "Start Free 14-Day Trial",
                secondary: "See How It Works",
                urgency: "Join 500+ companies who started this month",
              },
              objectionHandlers: [
                {
                  objection: "Too expensive",
                  response:
                    "Compare the cost of one freelancer vs unlimited usage",
                },
                {
                  objection: "Too complex to implement",
                  response: "Setup takes 5 minutes, no technical skills needed",
                },
                {
                  objection: "Not sure it will work for us",
                  response: "Risk-free trial, cancel anytime, keep what you create",
                },
              ],
            },
            messaging: {
              emailSubject: `${icpName}, stop ${primaryPainPoint} the hard way`,
              adCopy: `${uniqueDifferentiator}. ${productName} helps you ${primaryPainPoint} 10x faster. Try free for 14 days.`,
              landingPageHero: `The only ${productName} built for ${icpName} who want to ${primaryPainPoint} without the hassle`,
            },
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
