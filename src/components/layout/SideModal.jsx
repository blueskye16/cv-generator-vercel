import { useModalStore } from "@stores/useModalStore";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { templateMap } from "@stores/ComponentMap";
import { useCvStore } from "@stores";
import SideTemplateManager from "@parts/components-template/SideTemplateManager";
import AiOptimizer from "@parts/components-template/AiOptimizer";
import { useState } from "react";
import { useEffect } from "react";

export default function SideModal() {
  const [toggleEye, setToggleeye] = useState(false);
  const { isModalEntryOpen, modalData, closeModal } = useModalStore();
  const { cvData, biodata } = useCvStore();
  const toggleVisibility = useCvStore((state) => state.toggleEntryVisibility);
  const deleteEntry = useCvStore((state) => state.deleteEntry);

  if (!isModalEntryOpen) return null;

  const sectionKey = modalData?.sectionKey;
  const entryId = modalData?.entryId;

  const handleDelete = (e, sectionKey, entryId) => {
    e.stopPropagation();
    if (window.confirm("Hapus entry ini?")) {
      deleteEntry(sectionKey, entryId);
      closeModal();
    }
  };

  const handleToggleEye = (e, sectionKey, entryId) => {
    e.stopPropagation();
    setToggleeye(!toggleEye);

    toggleVisibility(sectionKey, entryId);
  };

  if (sectionKey === "ai-optimizer") {
    return (
      <div className="dark:bg-dark-second relative flex h-full flex-col rounded-lg bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between dark:text-white">
          <h2 className="text-2xl font-bold">Gemini Assistant</h2>
          <button
            onClick={closeModal}
            className="cursor-pointer rounded-md bg-gray-600 px-2 py-1 hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <AiOptimizer />
        </div>
      </div>
    );
  }

  if (sectionKey === "templates") {
    return (
      <div className="dark:bg-dark-second relative flex h-full flex-col rounded-lg bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between dark:text-white">
          <h2 className="text-2xl font-bold">Manage Templates</h2>
          <button
            onClick={closeModal}
            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <SideTemplateManager />
        </div>
      </div>
    );
  }

  let section = null;
  let title = "Entry";
  let FormToRender = null;

  if (sectionKey === "profile") {
    section = biodata;
    title = "Edit Profile";
    FormToRender = templateMap["profile"];
  } else if (sectionKey && cvData[sectionKey]) {
    section = cvData[sectionKey];
    title = `Edit ${section.title || "Entry"}`;
    FormToRender = templateMap[section.template];
  }

  useEffect(() => {
    const unsub = useCvStore.subscribe(
      (state) => state
    )
  }, [])

  if (!section) return null;

  return (
    <div className="dark:bg-dark-second relative rounded-lg bg-white p-5 shadow-2xl">
      <div className="flex items-center justify-between dark:text-white mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {sectionKey !== "profile" && (
          <div className="flex gap-2">
            <button
              onClick={(e) => handleToggleEye(e, sectionKey, entryId)}
              className="cursor-pointer rounded-md bg-gray-700 px-4 py-1 hover:bg-gray-500"
            >
              {!toggleEye ? <FiEye size={22} /> : <FiEyeOff size={22} />}
            </button>
            <button
              onClick={(e) => handleDelete(e, sectionKey, entryId)}
              className="cursor-pointer rounded-md bg-gray-700 px-4 py-1 hover:bg-gray-500"
            >
              <MdOutlineDelete size={22} />
            </button>
          </div>
        )}
      </div>

      <FormToRender sectionKey={sectionKey} entryId={entryId} />

      <div className="bottom-0 left-0 mt-4 flex w-full gap-2">
        <button
          onClick={closeModal}
          className="w-full cursor-pointer rounded-md bg-green-400 px-2 py-3 text-lg font-semibold hover:bg-green-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
