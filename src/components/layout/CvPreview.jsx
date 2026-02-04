import { useCvStore } from "@stores";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { FiMapPin, FiPhone, FiMail, FiAlertTriangle } from "react-icons/fi";
import { FaLinkedin, FaGithubSquare } from "react-icons/fa";
import { useModalStore } from "@stores/useModalStore";
import { previewTemplateMap } from "@stores/ComponentMap";
import { EntryNormal } from "./PreviewComponents";
import { useThemeStore } from "@hooks/useThemeStore";
import { BsStars } from "react-icons/bs";

export default function CvPreview({
  customCvData = null,
  customBiodata = null,
}) {
  const { theme } = useThemeStore();

  const storeCvData = useCvStore((state) => state.cvData);
  const storeBiodata = useCvStore((state) => state.biodata);
  const aiDraftData = useCvStore((state) => state.aiDraftData);
  const isAiPreviewMode = useCvStore((state) => state.isAiPreviewMode);

  const openModal = useModalStore((state) => state.openModal);
  const isModalEntryOpen = useModalStore((state) => state.isModalEntryOpen);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paperRef = useRef(null);
  const setPrintRef = useCvStore((state) => state.setPrintRef);

  let displayData = storeCvData;
  let displayBio = storeBiodata;
  let isReadOnly = false;

  if (customCvData && customBiodata) {
    displayData = customCvData;
    displayBio = customBiodata;
    isReadOnly = true;
  } else if (isAiPreviewMode && aiDraftData) {
    displayData = aiDraftData;
  }

  const configCv = {
    fontSize: "9.5pt",
    fontFamily: "Lato, sans-serif",
    leadingSize: 1.25,
    borderBottomSection: "2px",
    gapHeading: "2px",
    gapBetweenSection: "12px",
    gapBetweenEntry: "2px",
  };

  useEffect(() => {
    if (!isReadOnly) setPrintRef(paperRef);
  }, [isReadOnly]);

  useLayoutEffect(() => {
    if (paperRef.current) {
      const element = paperRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight + 2);
    }
  }, [displayData, displayBio, configCv]);

  useLayoutEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    if (el.scrollHeight > el.clientHeight) {
      console.warn("⚠️ CV OVERFLOW");
    }
  }, [displayData]);

  const handlePreviewClick = (e) => {
    e.stopPropagation();

    if (!isReadOnly) {
      openModal({ type: "preview" });
    }
  };

  const displayEntries = (sectionKey) => {
    const section = displayData[sectionKey];
    if (!section?.entries) return null;

    const visibleEntries = section.entries.filter(
      (entry) => entry.isVisible !== false,
    );
    if (!visibleEntries.length) return null;

    const templateType = section.template || "normal";
    const EntryComponent = previewTemplateMap[templateType] || EntryNormal;

    return (
      <div>
        {/* <div style={{ marginBottom: configCv.gapBetweenSection }}> */}
        <div
          className="flex flex-col"
          style={{ gap: configCv.gapBetweenEntry }}
        >
          <h2
            className="border-black pb-0.5 font-semibold tracking-wide uppercase dark:border-gray-500"
            style={{ borderBottomWidth: configCv.borderBottomSection }}
          >
            {section.title}
          </h2>
          {visibleEntries.map((entry) => (
            <EntryComponent
              key={entry.id}
              {...entry}
              url={entry.linkUrl}
              configCv={configCv}
              entry={section}
              templateType={templateType}
              sectionKey={sectionKey}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative ${isOverflowing && !isModalEntryOpen ? "border-t-8 border-b-8 border-l-8 border-orange-600" : ""}`}
    >
      {isOverflowing && !isModalEntryOpen && (
        <div className="absolute top-0 right-0 z-50 h-full translate-x-full print:hidden">
          <div className="flex h-full rotate-180 items-center justify-center rounded-r-md bg-orange-600 px-2 font-bold tracking-[0.2em] text-white [writing-mode:vertical-rl]">
            <FiAlertTriangle className="mb-2 rotate-90" size={16} />
            OVERFLOW DETECTED
          </div>
        </div>
      )}

      {/* Warning Overflow */}
      {isOverflowing && isModalEntryOpen && (
        <div className="absolute -top-12 right-0 left-0 z-50 flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-100 p-2 text-red-600 shadow-md print:hidden">
          <FiAlertTriangle />
          <span className="text-xs font-semibold">
            Konten melebihi 1 Halaman A4!
          </span>
        </div>
      )}

      <div
        id="cv-paper"
        ref={paperRef}
        className={`dark:bg-dark-second relative bg-white text-black transition-all duration-300 dark:text-white`}
        style={{
          width: "210mm",
          height: "297mm",
          overflow: "hidden",
          fontSize: configCv.fontSize,
          fontFamily: configCv.fontFamily,
          lineHeight: configCv.leadingSize,

          pointerEvents: isReadOnly ? "none" : "auto",
        }}
        onClick={handlePreviewClick}
      >
        <div className="flex h-full w-full flex-col px-[12mm] py-[8mm]">
          {/* HEADER BIODATA (Gunakan displayBio) */}
          <div className="mb-2 text-center">
            <h3 className="text-3xl font-semibold tracking-wide uppercase">
              {displayBio.name}
            </h3>
            <div
              className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 leading-tight"
              style={{ fontSize: configCv.fontSize }}
            >
              <div className="flex items-center gap-1">
                <FiMapPin
                  size={11}
                  className="text-black dark:text-white print:text-black"
                />
                <span className="ml-1">{displayBio.location}</span>
              </div>
              <span>|</span>
              <a
                href={`tel:${displayBio.phoneNumber}`}
                className="flex items-center gap-1"
              >
                <FiPhone
                  size={11}
                  className="text-black dark:text-white print:text-black"
                />
                <span className="ml-1">{displayBio.phoneNumber}</span>
              </a>
              <span>|</span>
              <a
                href={`mailto:${displayBio.gmail}`}
                className="flex items-center gap-1"
              >
                <FiMail
                  size={11}
                  className="text-black dark:text-white print:text-black"
                />
                <span className="ml-1">{displayBio.gmail}</span>
              </a>
              <span>|</span>
              <a
                href={`${displayBio.linkedin}`}
                className="flex items-center gap-1"
              >
                <FaLinkedin
                  size={11}
                  className="text-black dark:text-white print:text-black"
                />
                <span className="ml-1">Linkedin</span>
              </a>
              <span>|</span>
              <a
                href={`${displayBio.github}`}
                className="flex items-center gap-1"
              >
                <FaGithubSquare
                  size={11}
                  className="text-black dark:text-white print:text-black"
                />
                <span className="ml-1">Github</span>
              </a>
            </div>
          </div>

          <div
            className="flex flex-col"
            style={{ gap: configCv.gapBetweenSection }}
          >
            {displayEntries("summary")}
            {displayEntries("education")}
            {displayEntries("workExperience")}
            {displayEntries("msib")}
            {displayEntries("organization")}
            {displayEntries("certification")}
            {displayEntries("skills")}
          </div>
        </div>
      </div>
    </div>
  );
}
