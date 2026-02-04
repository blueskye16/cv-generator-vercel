import { useState } from "react";
import { useModalStore } from "@stores/useModalStore";
import { useCvStore } from "@stores";
import { FaPlus } from "react-icons/fa";
import { FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { GrEdit } from "react-icons/gr";
import DOMPurify from "dompurify";

export default function AccordionItem({ sectionKey, isOpen, onClick }) {
  const [toggleEditTitle, setToggleEditTitle] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const addEntry = useCvStore((state) => state.addEntry);
  const cvData = useCvStore((state) => state.cvData);

  if (!cvData[sectionKey]) {
    return null;
  }

  const title = cvData[sectionKey].title;

  const { updateSectionTitle } = useCvStore();
  const toggleVisibility = useCvStore((state) => state.toggleEntryVisibility);

  const handleToggleEye = (e, sectionKey, entryId) => {
    e.stopPropagation();

    toggleVisibility(sectionKey, entryId);
  };

  const handleSideModalClick = (e, entryId) => {
    e.stopPropagation();
    openModal({
      type: "editMode",
      sectionKey,
      entryId,
    });
  };

  const handleAddEntry = (e, sectionKey) => {
    e.stopPropagation();

    const newEntryId = addEntry(sectionKey);
    openModal({
      sectionKey,
      entryId: newEntryId,
    });
  };

  const handleEditTitleClick = (e) => {
    e.stopPropagation();
    setToggleEditTitle(!toggleEditTitle);
  };

  const handleEditTitleChange = (value) => {
    updateSectionTitle(sectionKey, value);
  };

  const getEntryPreview = (entry, template) => {
    const { title = "", subtitle = "", description = "" } = entry;
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };
    const cleanDescription = stripHtml(description);

    if (template === "normal") {
      if (title && subtitle) {
        return `
        <span class="font-semibold text-gray-700 dark:text-white">${title}</span>
        <span class="text-gray-400 dark:text-white mx-1">|</span>
        <span class="text-gray-500 dark:text-white">${subtitle}</span>
        `;
      }
      return title || subtitle || description;
    }
    if (template === "simple") {
      if (title && description) {
        return `
        <span class="font-semibold text-gray-700 dark:text-white">${title}</span>
        <span class="text-gray-400 dark:text-white mx-1">|</span>
        <span class="text-gray-500 dark:text-white">${description}</span>
          `;
      }

      return title || description;
    }
    return cleanDescription;
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-xl">
      <div
        onClick={onClick}
        className={`dark:bg-dark-second bg-light-second w-full cursor-pointer items-center gap-4 p-4 focus:outline-none ${isOpen ? "border-b-2 border-gray-300 dark:border-white" : ""}`}
      >
        {toggleEditTitle ? (
          <div className="flex justify-between gap-2 dark:text-white">
            <div className="space-y-1">
              <label
                htmlFor="editTitle"
                className="block text-left text-xs font-bold"
              >
                Heading:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleEditTitleChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="rounded-md bg-gray-200 p-1 focus:outline-none dark:bg-gray-700"
              />
            </div>
            <button
              type="button"
              className="btn-dark mt-auto h-fit cursor-pointer rounded-md bg-gray-200 p-2 text-center hover:bg-gray-300"
              onClick={(e) =>
                e.stopPropagation(setToggleEditTitle(!toggleEditTitle))
              }
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex justify-between gap-3">
            <span className="truncate font-semibold text-gray-800 dark:text-white">
              {cvData[sectionKey].title}
            </span>
            <div className="flex gap-2">
              <div
                hidden={!isOpen}
                onClick={(e) => handleEditTitleClick(e)}
                className="btn-dark flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-2 text-sm hover:bg-gray-300"
              >
                <GrEdit />
                <span>Edit</span>
              </div>
              <FiChevronDown
                size={12}
                className={`h-5 w-5 transition-transform duration-300 dark:text-white ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Transition Section */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="dark:bg-dark-second bg-light-second space-y-1.5 overflow-hidden dark:text-white">
          {sectionKey &&
            cvData[sectionKey] &&
            cvData[sectionKey].entries.map((entry) => {
              const templateType = cvData[sectionKey].template;
              const previewHTML = getEntryPreview(entry, templateType);
              const safeHtml = DOMPurify.sanitize(previewHTML);
              return (
                <div
                  key={entry.id}
                  className="m-0 border-b-2 border-gray-300 p-0"
                >
                  <div className="group flex cursor-pointer items-center gap-4 p-2.5 hover:bg-gray-200 dark:hover:bg-[#293444]">
                    <RxDragHandleDots2
                      size={22}
                      className="group-hover:text-gray-800: cursor-pointer text-gray-500 dark:text-white"
                    />

                    <div
                      className="min-w-0 flex-1"
                      onClick={(e) => handleSideModalClick(e, entry.id)}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                        className="block truncate text-sm select-none"
                      />
                    </div>

                    <button
                      className="btn-dark ml-auto rounded-md p-1"
                      onClick={(e) => handleToggleEye(e, sectionKey, entry.id)}
                    >
                      {entry.isVisible !== false ? (
                        <FiEye
                          size={22}
                          className="right-0 cursor-pointer text-gray-500 dark:text-white"
                        />
                      ) : (
                        <FiEyeOff
                          size={22}
                          className="right-0 cursor-pointer text-gray-500 dark:text-white"
                        />
                      )}
                    </button>
                  </div>
                  {/* <hr className="border border-gray-300 dark:border-white" /> */}
                </div>
              );
            })}
          <button
            onClick={(e) => handleAddEntry(e, sectionKey)}
            className="mx-auto my-4 flex cursor-pointer items-center gap-1.5 rounded-md bg-green-300 px-8 py-4 text-sm hover:bg-green-400 dark:bg-green-800 dark:hover:bg-green-700"
          >
            <FaPlus />
            <span>Add Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
