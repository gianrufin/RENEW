import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini API client (lazy getter)
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Task Recommendation Endpoint
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { query, category } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query item is required" });
      }

      const ai = getAI();
      if (!ai) {
        // Fallback realistic heuristics if API key is not ready
        return res.json({
          title: query,
          category: category || "Home & Living",
          intervalValue: 90,
          intervalUnit: "days",
          description: `Regular scheduled maintenance and inspection for ${query}.`,
          tips: [
            "Inspect physical condition before replacing or cleaning",
            "Set an advance notification 3 days prior",
            "Keep spare replacements or cleaning supplies stocked"
          ],
          signsDue: ["Visible wear or buildup", "Drop in efficiency or performance", "Elapsed recommended manufacturer timeframe"],
          estimatedCost: "$15 - $50",
          difficulty: "Easy"
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `You are an expert home maintenance, personal care, pet health, and automotive specialist.
Provide an accurate, realistic maintenance schedule and replacement frequency recommendation for: "${query}".
Category hint: "${category || 'General'}".
Calculate the best recurring frequency in days, weeks, or months, along with practical tips, signs it is due, estimated cost range, and difficulty.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Clean standardized name of the task" },
              category: { 
                type: Type.STRING, 
                description: "Category: 'Personal Care', 'Bedding & Linen', 'HVAC & Appliances', 'Vehicle', 'Pet Care', 'Safety & Electrical', or 'Outdoor & Garden'" 
              },
              intervalValue: { type: Type.INTEGER, description: "Numerical interval count (e.g., 3, 30, 90, 180, 365)" },
              intervalUnit: { type: Type.STRING, description: "Unit: 'days', 'weeks', 'months', or 'years'" },
              description: { type: Type.STRING, description: "Concise summary of why and how this should be maintained" },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 practical tips or best practices"
              },
              signsDue: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 physical signs or indicators that replacement/cleaning is overdue"
              },
              estimatedCost: { type: Type.STRING, description: "Typical cost range or 'Free / DIY'" },
              difficulty: { type: Type.STRING, description: "'Quick (5m)', 'Moderate (15-30m)', or 'Professional / In-depth'" }
            },
            required: ["title", "category", "intervalValue", "intervalUnit", "description", "tips", "signsDue"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("AI recommend error:", error);
      res.status(500).json({ error: error.message || "Failed to generate recommendation" });
    }
  });

  // AI Household Audit & Task Suggestion Engine
  app.post("/api/ai/audit", async (req, res) => {
    try {
      const { lifestyle, currentTasks } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.json({
          suggestions: [
            {
              title: "Wash Pillowcases",
              category: "Bedding & Linen",
              intervalValue: 7,
              intervalUnit: "days",
              reason: "Pillowcases accumulate natural oils and allergens faster than rest of bed sheets."
            },
            {
              title: "Descaling Coffee Machine",
              category: "HVAC & Appliances",
              intervalValue: 60,
              intervalUnit: "days",
              reason: "Prevents mineral buildup and extends pump longevity."
            },
            {
              title: "Check Fire Extinguisher Gauge",
              category: "Safety & Electrical",
              intervalValue: 365,
              intervalUnit: "days",
              reason: "Ensure pressure needle is in the green zone."
            }
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Analyze this user's lifestyle profile and existing task list to identify essential, high-value recurring maintenance tasks they might be missing.
User Profile: ${JSON.stringify(lifestyle || {})}
Current Tracked Items: ${JSON.stringify(currentTasks || [])}

Provide 4 to 6 highly relevant, specific missing tasks with optimal intervals and a short explanation of why it matters.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              auditSummary: { type: Type.STRING, description: "A friendly 1-2 sentence assessment of their maintenance coverage" },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    intervalValue: { type: Type.INTEGER },
                    intervalUnit: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    priority: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" }
                  },
                  required: ["title", "category", "intervalValue", "intervalUnit", "reason"]
                }
              }
            },
            required: ["auditSummary", "suggestions"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("AI audit error:", error);
      res.status(500).json({ error: error.message || "Failed to audit tasks" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Maintenance Alert Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
