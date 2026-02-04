import { FaCheck, FaTrash } from "react-icons/fa";
import { RiLink } from "react-icons/ri";
import Tiptap from "@layout/Tiptap";
import { useCvStore } from "@stores";
import { useState, useRef, useEffect } from "react";

export default function NormalColumn({ sectionKey, entryId }) {
  const { cvData, updateEntryField } = useCvStore();
  const [toggleAttachLink, setToggleAttachLink] = useState(false);
  const popopverRef = useRef(null);

  const entry = cvData[sectionKey]?.entries.find((e) => e.id === entryId);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popopverRef.current && !popopverRef.current.contains(event.target)) {
        setToggleAttachLink(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popopverRef]);

  if (!entry) {
    return <div>{entry}Loading or Entry not found...</div>;
  }

  const handleFieldChange = (fieldName, value) => {
    updateEntryField(sectionKey, entryId, fieldName, value);
  };

  const hasLink = entry.linkUrl && entry.linkUrl.trim() !== "";

  return (
    <section className="dark:bg-dark-second bg-white dark:text-white">
      <div className="flex flex-col gap-2">
        <label className="text-sm">Title</label>
        <div className="relative" ref={popopverRef}>
          <input
            type="text"
            className="relative w-full rounded-md bg-gray-100 p-2.5 align-middle focus:outline-hidden dark:bg-gray-700"
            value={entry.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
          />
          <button
            onClick={() => setToggleAttachLink(!toggleAttachLink)}
            className={`absolute top-0 right-0 flex cursor-pointer items-center justify-center rounded-md border-2 p-2.5 transition-colors duration-200 ${
              hasLink
                ? "border border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "border border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            title={hasLink ? "Edit Link" : "Add Link"}
          >
            <RiLink size={18} />
          </button>
          {toggleAttachLink && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 w-72 origin-top-right rounded-lg bg-white p-3 shadow-xl ring-1 ring-black/5 duration-100"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  Attach URL
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  type="url"
                  placeholder="https://..."
                  value={entry.linkUrl || ""}
                  autoFocus
                  onChange={(e) => handleFieldChange("linkUrl", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setToggleAttachLink(false);
                  }}
                />

                <button
                  onClick={() => setToggleAttachLink(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
                  title="Save"
                >
                  <FaCheck size={14} />
                </button>
              </div>

              {hasLink && (
                <button
                  onClick={() => {
                    handleFieldChange("linkUrl", "");
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  <FaTrash size={12} />
                  <span>Remove Link</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="text-sm">SubTitle</label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
            value={entry.subtitle || ""}
            onChange={(e) => handleFieldChange("subtitle", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Date</label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
            value={entry.date || ""}
            onChange={(e) => handleFieldChange("date", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Location</label>
          <input
            type="text"
            className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
            value={entry.location || ""}
            onChange={(e) => handleFieldChange("location", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Description</label>
          <Tiptap
            value={entry.description || ""}
            onChange={(value) => handleFieldChange("description", value)}
          />
        </div>
      </div>
    </section>
  );
}
