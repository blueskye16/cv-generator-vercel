import React, { useEffect, useState } from "react";
import ProfileManager from "../../notes/backup/ProfileManager";
import { GoogleGenAI } from "@google/genai";
import { ThinkingLevel } from "@google/genai";

export default function About() {
  const [status, setStatus] = useState("Checking connection");
  const [isConnected, setIsConnected] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "/api-deepl/v2/translate";
    const authKey = import.meta.env.VITE_DEEPEL_API_KEY;

    // Data HARUS dalam bentuk Object JSON
    const payload = {
      text: ["Hello World"], // DeepL minta array of string
      target_lang: "ID",
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${authKey}`,
        "Content-Type": "application/json", // Header JSON
      },
      body: JSON.stringify(payload), // Body juga harus diconvert jadi string JSON
    })
      .then((response) => {
        if (!response.ok) {
          // Trik Debugging: Baca pesan error asli dari DeepL biar tau kenapa
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setIsConnected(true);
        // DeepL mengembalikan array translations
        setStatus("Translated: " + data.translations[0].text);
      })
      .catch((error) => {
        setIsConnected(false);
        setError(error.message);
        setStatus("API connection failed.");
      });
  }, []);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  async function handleTestGemini() {
    setIsLoadingAi(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:
          "please analyze job market in indonesia especially in IT niche, are you remember my personal work data?",
        config: {
          thinkingLevel: ThinkingLevel.HIGH,
          systemInstruction:
            "You are a professional and experience worker in Human Resourse role, have a deep knowledge in recruiting new people for company and guide graduate student for their professional career. You have optimal skill in reaching out for job post, better CV / resume for applying job and are focused in Indonesia job market. You can also guide to international level of project and work and you always up to date with the newest news and method in work life. For time-sensitive user queries that require up-to-date information, you MUST follow the provided current time (date and year) when formulating search queries in tool calls. Remember it is 2026 this year.",
        },
      });

      setAiResult(response.text);
    } catch (err) {
      console.error("Gemini error: ", err);
      setAiResult("error: ", err.message);
    } finally {
      setIsLoadingAi(false);
    }
  }

  return (
    <div className="pt-20">
      <button
        onClick={handleTestGemini}
        disabled={isLoadingAi}
        className="cursor-pointer rounded-md bg-green-500 p-2"
      >
        {isLoadingAi ? "still thinking.." : "ask gemini"}
      </button>
      <p>{aiResult}</p>
      <h2>API connection status:</h2>
      {error ? (
        <p>
          {status} error: {error}
        </p>
      ) : (
        <p>sukses: {status}</p>
      )}
      <ProfileManager />
    </div>
  );
}
