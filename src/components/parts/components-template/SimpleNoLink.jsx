import { useCvStore } from "@stores";
import { useState, useRef, useEffect } from "react";
import Tiptap from "@layout/Tiptap";

export default function SimpleNoLink({ sectionKey, entryId }) {
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
    <section className="dark:bg-dark-first bg-white">
      <div>
        <label>Title</label>
        <div className="relative" ref={popopverRef}>
          <input
            type="text"
            className="relative w-full rounded-md bg-gray-100 p-2.5 align-middle focus:outline-hidden"
            value={entry.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label>Description</label>
        <Tiptap
          value={entry.description || ""}
          onChange={(value) => handleFieldChange("description", value)}
        />
      </div>
    </section>
  );
}
