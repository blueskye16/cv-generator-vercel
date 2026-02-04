import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://vercel-cv-ats-generator.vercel.app/", 
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle Preflight Request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userJobDesc, userInstruction, selectedSections, currentCvData } =
      req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Server API Key is missing");
    }

    // --- Logika Prompting ---
    const activeKeys = Object.keys(selectedSections).filter(
      (key) => selectedSections[key],
    );
    if (activeKeys.length === 0)
      throw new Error("Select at least one section.");

    const systemInstruction = `
      You are an expert CV Resume Optimizer.
      Rewrite descriptions for sections: ${activeKeys.join(", ")}.
      Return ONLY valid JSON. Keys: ${activeKeys.join(", ")}.
      Do NOT change dates/titles/locations. Use HTML tags (<ul>, <li>, <strong>) for descriptions.
    `;

    const userPrompt = `
      CV DATA: ${JSON.stringify(currentCvData)}
      JOB DESC: ${userJobDesc}
      INSTRUCTION: ${userInstruction}
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // model: "gemini-2.0-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: systemInstruction + "\n\n" + userPrompt }],
        },
      ],
    });

    const rawText =
      typeof response.text === "function" ? response.text() : response.text;

    // const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
    // model: "gemini-3-flash-preview",
    // model: "gemini-2.0-flash",
    // const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Versi Flash lebih cepat/murah

    // const result = await model.generateContent(systemInstruction + "\n\n" + userPrompt);
    // const response = await result.response;
    // let text = response.text();

    // Bersihkan Markdown formatting ```json ... ``` jika ada
    // text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    // const jsonResult = JSON.parse(text);
    const jsonResult = JSON.parse(rawText);
    return res.status(200).json(jsonResult);
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
