import { useState } from "react";
import { useCvStore } from "@stores"; 

export const useGeminiOptimizer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentCvData = useCvStore((state) => state.cvData);
  const setAiDraft = useCvStore((state) => state.setAiDraft);
  const applyAiDraft = useCvStore((state) => state.applyAiDraft);
  const discardAiDraft = useCvStore((state) => state.discardAiDraft);

  const optimizeCv = async (userJobDesc, userInstruction, selectedSections) => {
    setLoading(true);
    setError(null);

    try {
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userJobDesc,
          userInstruction,
          selectedSections,
          currentCvData,
        }),
      });

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error(`Server Error: ${textResponse}`);
      }

      const jsonResult = JSON.parse(textResponse);

      
      const finalDraft = { ...currentCvData };
      Object.keys(jsonResult).forEach((key) => {
        if (finalDraft[key]) {
          finalDraft[key] = jsonResult[key]; 
        }
      });

      setAiDraft(finalDraft);
    } catch (err) {
      console.error("Gemini Error:", err);
      setError(err.message || "Failed to optimize CV");
    } finally {
      setLoading(false);
    }
  };

  return { optimizeCv, applyAiDraft, discardAiDraft, loading, error };
};
