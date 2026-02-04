import Accordion from "@layout/Accordion";
import ProfileCard from "@parts/ProfileCard";
import ModalEntry from "@layout/ModalEntry";
import CvPreview from "@layout/CvPreview";
import { useModalStore } from "@stores/useModalStore";
import { useMediaQuery } from "react-responsive";
import { createPortal } from "react-dom";
import { PiFileMagnifyingGlassLight } from "react-icons/pi";
import { useState } from "react";
import SideModal from "../components/layout/SideModal";

export default function Home() {
  const { openModal, closeModal, isModalEntryOpen, modalData } =
    useModalStore();
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const isPreviewMode = modalData?.type === "preview";

  const isSideEditMode = isModalEntryOpen && !isPreviewMode;

  const handleCvPreviewClick = (e) => {
    e.stopPropagation();
    if (isPreviewOpen === false) {
      setPreviewOpen(!isPreviewOpen);
      openModal({ type: "preview" });
    } else {
      setPreviewOpen(!isPreviewOpen);
      closeModal();
    }
  };

  return (
    <main className="dark:bg-dark-first bg-light-first flex h-screen w-full flex-col overflow-hidden pt-16 lg:flex-row">
      <ModalEntry />
      <div className="no-scrollbar h-full w-full overflow-y-auto px-6 py-8 lg:w-[45%] xl:w-[50%]">
        <div className="mx-auto max-w-2xl space-y-6">
          {isSideEditMode ? (
            <SideModal />
          ) : (
            <>
              <ProfileCard />
              <Accordion />
            </>
          )}
        </div>
      </div>
      {!isMobile && (
        <div className="flex h-full flex-1 items-start justify-center overflow-x-hidden overflow-y-auto p-8">
          <div className="origin-top scale-75 cursor-zoom-in transition-transform duration-300">
            <CvPreview />
          </div>
        </div>
      )}

      {isMobile &&
        createPortal(
          <button
            onClick={(e) => handleCvPreviewClick(e)}
            className="fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-all hover:bg-blue-700 active:scale-95"
          >
            <PiFileMagnifyingGlassLight size={28} />
          </button>,
          document.body,
        )}
    </main>
  );
}
