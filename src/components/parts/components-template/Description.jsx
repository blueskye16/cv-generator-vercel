import Tiptap from "@layout/Tiptap.jsx";
import { useCvStore } from "@stores";

export default function Description({ sectionKey, entryId }) {
  const { cvData, updateEntryField } = useCvStore();
  const entry = cvData[sectionKey]?.entries.find((e) => e.id === entryId);
  const description = entry.description || "";

  const handleFieldChange = (fieldName, value) => {
    updateEntryField(sectionKey, entryId, fieldName, value);
  };

  return (
    <section className="dark:bg-dark-second bg-white dark:text-white">
      <label className="border-t pt-1 text-lg font-semibold dark:text-gray-300">
        Profile Summary
      </label>
      <Tiptap
        value={description}
        onChange={(value) => handleFieldChange("description", value)}
      />
    </section>
  );
}
