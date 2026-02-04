import { useModalStore } from "@stores/useModalStore";
import { useCvStore } from "@stores";
import { FiTrash, FiX, FiPrinter } from "react-icons/fi";
import { templateMap } from "@stores/ComponentMap";
import { useRef } from "react";
import { usePrintCv } from "../../hooks/usePrintCv";

export default function ModalEntry() {
  const { isModalEntryOpen, modalData, closeModal } = useModalStore();
  const { deleteEntry, cvData } = useCvStore();

  const printRef = useRef();

  const handlePrint = usePrintCv(printRef);

  if (!isModalEntryOpen) return null;

  const isPreviewMode = modalData?.type === "preview";

  if (!isPreviewMode) {
    return null;
  }

  let FormToRender = null;
  let title = "";
  let showDeleteButton = false;
  let sectionKey = null;
  let entryId = null;

  if (isPreviewMode) {
    FormToRender = templateMap["preview"];
    title = "CV Preview";
  } else {
    sectionKey = modalData?.sectionKey;
    entryId = modalData?.entryId;
    if (!entryId || !sectionKey) return null;
    const section = cvData[sectionKey];
    FormToRender = templateMap[section?.template];
    title = `Edit ${section?.title || "Entry"}`;
    showDeleteButton = true;
  }

  if (!FormToRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div className="flex min-h-full w-full items-start justify-center py-12">
        <div
          className="relative flex flex-col items-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8 flex translate-x-4 gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
            >
              <FiPrinter size={18} />
              Print PDF
            </button>
            <button
              onClick={closeModal}
              className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-red-500"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="origin-top scale-75 transform shadow-2xl transition-transform duration-200">
            <FormToRender sectionKey={sectionKey} entryId={entryId} />
          </div>
          <div style={{ display: "none" }}>
            <div ref={printRef}>
              <FormToRender sectionKey={sectionKey} entryId={entryId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
