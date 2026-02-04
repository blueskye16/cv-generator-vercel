import { useState } from "react";
import { useGeminiOptimizer } from "@hooks/useGeminiOptimizer";
import {
  FiCpu,
  FiCheck,
  FiX,
  FiArrowRight,
  FiLoader,
  FiEye,
  FiRotateCcw,
  FiSquare,
  FiCheckSquare,
} from "react-icons/fi";
import { useModalStore } from "@stores/useModalStore";
import { useCvStore } from "@stores";
import { BsStars } from "react-icons/bs";

const SECTION_LIST = [
  { id: "summary", label: "Summary / Deskripsi", default: true },
  { id: "workExperience", label: "Work Experience", default: true },
  { id: "education", label: "Education", default: false },
  { id: "skills", label: "Skills", default: false },
  { id: "certification", label: "Certification", default: false },
  { id: "organization", label: "Organization", default: false },
  { id: "msib", label: "MSIB / Internship", default: false },
];

export default function AiOptimizer() {
  const [jobDesc, setJobDesc] = useState("");
  const [instruction, setInstruction] = useState("");

  const [selectedSections, setSelectedSections] = useState(
    SECTION_LIST.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr.default }),
      {},
    ),
  );

  const { optimizeCv, loading, error, applyAiDraft, discardAiDraft } =
    useGeminiOptimizer();

  const { aiDraftData, isAiPreviewMode, toggleAiPreviewMode } = useCvStore();
  const { closeModal } = useModalStore();

  const handleToggleSection = (id) => {
    setSelectedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGenerate = () => {
    if (!jobDesc.trim()) return;

    optimizeCv(jobDesc, instruction, selectedSections);
  };

  const handleApply = () => {
    applyAiDraft();
    closeModal();
    alert("CV berhasil diperbarui oleh Gemini!");
  };

  if (aiDraftData) {
    return (
      <div className="flex h-full flex-col gap-4 dark:text-white">
        <div className="rounded-md border border-purple-500 bg-purple-100 p-4 dark:bg-purple-900/30">
          <div className="mb-2 flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300">
            <BsStars />
            <h3>Optimization Ready!</h3>
          </div>
          <p className="text-sm">
            Lihat perubahannya langsung pada panel <strong>CV Preview</strong>{" "}
            di sebelah kanan.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">
            Compare Result
          </h4>
          <button
            onClick={toggleAiPreviewMode}
            className={`flex w-full items-center justify-center gap-3 rounded-full px-6 py-3 font-bold shadow-md transition-all ${
              isAiPreviewMode
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {isAiPreviewMode ? (
              <>
                <FiEye /> Showing: AI Result
              </>
            ) : (
              <>
                <FiRotateCcw /> Showing: Original
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">
            Klik tombol di atas untuk bolak-balik melihat perbedaan "Before &
            After".
          </p>
        </div>

        <div className="mt-auto flex gap-2 border-t pt-4">
          <button
            onClick={discardAiDraft}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-100 py-3 font-semibold text-red-700 hover:bg-red-200"
          >
            <FiX /> Discard
          </button>
          <button
            onClick={handleApply}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            <FiCheck /> Apply & Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 dark:text-white">
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
          <FiCpu /> AI Resume Optimizer
        </h3>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          Paste job description. Gemini akan menulis ulang CV Anda agar sesuai
          dengan kata kunci (ATS Friendly).
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Target Job Description</label>
        <textarea
          className="h-24 w-full rounded-md border bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          placeholder="Paste Job Description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Additional Instruction</label>
        <input
          type="text"
          className="w-full rounded-md border bg-gray-50 p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
          placeholder="e.g. Focus on leadership, keep it concise..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </div>

      {/* --- SECTION SELECTOR --- */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Select Sections to Optimize:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SECTION_LIST.map((section) => (
            <div
              key={section.id}
              onClick={() => handleToggleSection(section.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-xs transition-all ${
                selectedSections[section.id]
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                  : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              {selectedSections[section.id] ? (
                <FiCheckSquare size={16} />
              ) : (
                <FiSquare size={16} />
              )}
              <span>{section.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-100 p-3 text-sm text-red-700">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !jobDesc}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            Optimize My CV <FiArrowRight />
          </>
        )}
      </button>
    </div>
  );
}
