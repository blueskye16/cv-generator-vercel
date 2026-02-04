import { RxReset, RxCross2 } from "react-icons/rx";
import { MdOutlinePlaylistAdd, MdOutlineArticle } from "react-icons/md";
import { BsListTask, BsListUl, BsCardText } from "react-icons/bs";
import { useState, useRef } from "react";
import AccordionItem from "./AccordionItem";
import { useCvStore } from "@stores";
import { useModalStore } from "@stores/useModalStore";

// Mapping Metadata UI untuk 4 fungsi di cvSectionTemplate.js
const TEMPLATE_OPTIONS = [
  {
    key: "normal", // Sesuai dengan createNormalTemplate
    label: "Normal Section",
    desc: "Standard (Title, Subtitle, Date, Desc)",
    icon: <MdOutlineArticle size={24} />,
    color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
  },
  {
    key: "simple", // Sesuai dengan createSimpleTemplate
    label: "Simple Section",
    desc: "Minimalis (Title, Desc, Link)",
    icon: <BsListTask size={24} />,
    color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400",
  },
  {
    key: "simple_no_link", // Sesuai dengan createSimpleNoLinkTemplate
    label: "List Only",
    desc: "Tanpa Link (Title, Desc)",
    icon: <BsListUl size={24} />,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400",
  },
  {
    key: "description", // Sesuai dengan createDescriptionTemplate
    label: "Paragraph",
    desc: "Hanya teks deskripsi panjang",
    icon: <BsCardText size={24} />,
    color: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400",
  },
];

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAddingMode, setIsAddingMode] = useState(false); // State untuk toggle tampilan selector
  const refMenu = useRef(null);
  
  const cvData = useCvStore((state) => state.cvData);
  const sectionKeys = Object.keys(cvData);
  
  const openModal = useModalStore((state) => state.openModal);
  const { updateSectionTemplate, addNewSection, resetAllData } = useCvStore();

  const handleItemClick = (index) => {
    // Jika user klik item lain saat mode adding, tutup mode adding
    if (isAddingMode) setIsAddingMode(false);
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleSelectTemplate = (templateKey) => {
    // 1. Buat section baru sesuai key template
    const { sectionKey, id } = addNewSection(templateKey);
    
    // 2. Reset UI
    setIsAddingMode(false);
    
    // 3. Langsung buka modal edit untuk entry pertama
    openModal({
      type: "editMode", 
      sectionKey: sectionKey,
      entryId: id,
    });
  };

  const handleResetClick = () => {
    if (confirm("Yakin ingin mereset ke data awal? Perubahan anda akan hilang.")) {
      resetAllData();
      setIsAddingMode(false);
    }
  };

  return (
    <section ref={refMenu} className="mt-2 w-full space-y-3 pb-24">
      {/* 1. LIST SECTION YANG SUDAH ADA */}
      <div className="space-y-2">
        {sectionKeys.map((sectionKey, index) => {
          const section = cvData[sectionKey];
          if (!section) return null; // Guard clause
          
          const templateName = section.template || "normal";

          return (
            <AccordionItem
              key={sectionKey}
              sectionKey={sectionKey}
              isOpen={index === activeIndex}
              onClick={() => handleItemClick(index)}
              templateName={templateName}
              // Opsional: jika ingin ganti template section yang sudah ada
              onTemplateChange={(newTemplate) =>
                updateSectionTemplate(sectionKey, newTemplate)
              }
            />
          );
        })}
      </div>

      {/* 2. AREA ADD SECTION (INLINE EXPANSION) */}
      <div className="mt-6 px-1 transition-all duration-300 ease-in-out">
        
        {isAddingMode ? (
          // --- TAMPILAN PILIH TEMPLATE ---
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-700 dark:text-gray-200">
                Pilih Tipe Section Baru
              </h3>
              <button 
                onClick={() => setIsAddingMode(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
              >
                <RxCross2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TEMPLATE_OPTIONS.map((tpl) => (
                <button
                  key={tpl.key}
                  onClick={() => handleSelectTemplate(tpl.key)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${tpl.color}`}
                >
                  <div className="shrink-0 rounded-md bg-white/50 p-2 shadow-sm dark:bg-black/20">
                    {tpl.icon}
                  </div>
                  <div>
                    <span className="block text-sm font-bold">
                      {tpl.label}
                    </span>
                    <span className="text-xs opacity-80">
                      {tpl.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // --- TAMPILAN TOMBOL UTAMA ---
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsAddingMode(true)}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-800 p-3.5 text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg dark:bg-blue-600"
            >
              <MdOutlinePlaylistAdd size={24} className="text-gray-300 group-hover:text-white dark:text-white" />
              <span className="font-semibold">Add New Section</span>
            </button>

            <button
              onClick={handleResetClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-2 text-xs font-medium text-gray-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:hover:bg-red-900/10"
            >
              <RxReset size={14} />
              Reset All Data
            </button>
          </div>
        )}
      </div>
    </section>
  );
}