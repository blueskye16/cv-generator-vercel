import { RxReset } from "react-icons/rx";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import AccordionItem from "./AccordionItem";
import { useCvStore } from "@stores";
import { useModalStore } from "@stores/useModalStore";

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const refMenu = useRef(null);
  const cvData = useCvStore((state) => state.cvData);
  const sectionKeys = Object.keys(cvData);
  const openModal = useModalStore((state) => state.openModal);
  const { updateSectionTemplate, addNewSection } = useCvStore();
  const resetAllData = useCvStore((state) => state.resetAllData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refMenu.current && !refMenu.current.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refMenu]);

  const handleItemClick = (index) => {
    if (isSelectOpen == true) {
      setIsSelectOpen(!isSelectOpen);
    }
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleAddSection = (e, template) => {
    e.stopPropagation();
    setIsSelectOpen(!isSelectOpen);
    const { sectionKey, id } = addNewSection(template);
    openModal({
      sectionKey: sectionKey,
      entryId: id,
    });
  };

  const handleResetClick = () => {
    if (
      confirm("Yakin ingin mereset ke data awal? Perubahan anda akan hilang.")
    ) {
      resetAllData();
    }
  };

  if (sectionKeys.entries.length < 1) {
  }

  return (
    <section ref={refMenu} className="mt-2 w-full space-y-2">
      {sectionKeys.map((sectionKey, index) => {
        const section = cvData[sectionKey];
        const templateName = section.template || "normal";

        return (
          <AccordionItem
            key={sectionKey}
            title={sectionKey}
            sectionKey={sectionKey}
            isOpen={index === activeIndex}
            onClick={() => handleItemClick(index)}
            templateName={templateName}
            onTemplateChange={(newTemplate) =>
              updateSectionTemplate(sectionKey, newTemplate)
            }
          />
        );
      })}
      <div>
        <div
          className={`absolute bottom-full left-1/2 mb-2 w-full -translate-x-1/2 rounded-md border border-gray-300 bg-white p-2 shadow-lg transition-all duration-200 ease-in-out ${isSelectOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
        >
          <ul className="space-y-1">
            <li
              className="cursor-pointer rounded-md p-2 text-gray-800 hover:bg-gray-100"
              onClick={(e) => handleAddSection(e, "normal")}
            >
              Normal
            </li>
            <li
              className="cursor-pointer rounded-md p-2 text-gray-800 hover:bg-gray-100"
              onClick={(e) => handleAddSection(e, "simple")}
            >
              Simple
            </li>
          </ul>
        </div>
        <div className="mx-2 mt-4 flex gap-2 text-sm">
          <button
            onClick={() => handleResetClick()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-400 p-2.5 hover:bg-orange-500 dark:bg-orange-800 dark:text-white dark:hover:bg-orange-700"
          >
            <RxReset size={20} className="font-bold" />
            Reset All
          </button>
          <button
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-green-400 p-2.5 hover:bg-green-500 dark:bg-green-800 dark:text-white dark:hover:bg-green-700"
          >
            <MdOutlinePlaylistAdd size={20} className="font-bold" />
            Add Section
          </button>
        </div>
      </div>
    </section>
  );
}
