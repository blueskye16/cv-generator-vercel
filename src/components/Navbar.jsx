import { FiMenu, FiX, FiEdit, FiLink, FiDownload, FiCpu } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsCollection } from "react-icons/bs";
import { RxReset, RxDownload } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import TemplateManager from "./parts/TemplateManager";
import { useCvStore } from "../stores/index.mjs";
import { usePrintCv } from "../hooks/usePrintCv";
import ThemeToggle from "./parts/ThemeToggle";
import { RiFolderHistoryLine } from "react-icons/ri";
import { useModalStore } from "@stores/useModalStore";

export default function Navbar() {
  const [sideBar, setSideBar] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const isMobile = useMediaQuery({ maxWidth: 900 });
  const printRef = useCvStore((state) => state.printRef);
  const handlePrint = usePrintCv(printRef);

  const handleSidePanel = () => {
    setSideBar(!sideBar);
  };

  const handleOpenAi = () => {
    openModal({
      type: "sideModal",
      sectionKey: "ai-optimizer",
    });
  };

  const handleOpenTemplateManager = () => {
    openModal({
      type: "sideModal",
      sectionKey: "templates",
    });
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 p-2">
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${
          sideBar ? "opacity-50" : "pointer-events-none opacity-0"
        }`}
        onClick={handleSidePanel}
      ></div>

      <nav className="flex items-center justify-between rounded-md bg-gray-800 px-8 py-4 text-white">
        {!isMobile && (
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-700 px-2.5 py-1 hover:bg-gray-600"
            >
              <IoDocumentTextOutline size={18} />
              <h2>Content</h2>
            </Link>
            <button
              onClick={handleOpenTemplateManager}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-700 px-3 py-2 hover:bg-gray-600"
              // className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
            >
              <BsCollection />
              <span>Templates</span>
            </button>
            <Link
              to="/record"
              className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-700 px-3 py-2 hover:bg-gray-600"
              // className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
            >
              <RiFolderHistoryLine />
              <span>Record</span>
            </Link>
            <button
              onClick={handleOpenAi}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-linear-to-r from-blue-600 to-purple-600 px-3 py-1 text-white transition-all hover:shadow-lg"
            >
              <FiCpu />
              <span>AI Optimize</span>
            </button>
          </div>
        )}
        {isMobile ? (
          <div
            className="group flex cursor-pointer items-center gap-1.5 rounded-md p-2 duration-100 ease-in-out hover:bg-gray-500 hover:text-black"
            onClick={handleSidePanel}
          >
            <p className="text-sm text-gray-400 group-hover:text-black">Menu</p>
            <FiMenu />
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 hover:bg-gray-700"
            >
              <RxDownload size={18} />
              <h2>Download CV</h2>
            </button>
            <ThemeToggle />
          </div>
          // <ul className="flex gap-4 text-xs">
          //   <li>
          //     <Link to="/">Home</Link>
          //   </li>
          //   <li>
          //     <Link to="/about">About</Link>
          //   </li>
          //   <li>
          //     <Link to="#">More</Link>
          //   </li>
          // </ul>
        )}
      </nav>

      <div
        className={`fixed top-0 right-0 z-40 h-screen w-64 bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out ${
          sideBar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-1 rounded-md p-1 text-gray-700 hover:bg-gray-100">
            <span className="font-semibold">Menu</span>
          </div>
          <FiX
            size={32}
            className="rounded-md p-0.5 text-gray-600 hover:bg-gray-200"
            onClick={handleSidePanel}
          />
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          <Link
            to="#"
            className="flex items-center gap-3 rounded-lg bg-gray-200 p-3 text-sm font-medium text-gray-600 hover:bg-gray-400"
          >
            <FiEdit size={18} />
            <span>Customize</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-lg bg-gray-200 p-3 text-sm font-medium text-gray-600 hover:bg-gray-400"
          >
            <FiLink size={18} />
            <span>Links</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-lg bg-gray-200 p-3 text-sm font-medium text-gray-600 hover:bg-gray-400"
          >
            <RxReset size={18} />
            <span>Back to Dashboard</span>
          </Link>
        </nav>

        <div className="flex flex-col gap-3 pt-2">
          <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
            <FiDownload size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>
    </header>
  );
}
