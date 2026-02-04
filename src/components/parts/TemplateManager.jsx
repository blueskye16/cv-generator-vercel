import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { HiDuplicate } from "react-icons/hi";
import { FiAlertCircle, FiCheck } from "react-icons/fi";
import { MdNoteAdd, MdCancel, MdDriveFileRenameOutline } from "react-icons/md";
import { IoTrashBinOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { useCvStore } from "../../stores/index.mjs";
import useClickOutside from "../../hooks/useClickOutside";
import { BsStars } from "react-icons/bs";

export default function TemplateManager() {
  const { savedProfiles, saveAsNewProfile, loadProfile, deleteProfile } =
    useCvStore();
  const [newProfileName, setNewProfileName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [activeMoreIdProfile, setActiveMoreIdProfile] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    action: null,
  });

  const containerRef = useClickOutside(() => {
    setIsOpen(false);

    setActiveMoreIdProfile(null);
  });

  const toggleMenu = (id, e) => {
    e.stopPropagation();

    setActiveMoreIdProfile(activeMoreIdProfile === id ? null : id);
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const askConfirm = (msg, actionCallback) => {
    setConfirmModal({
      show: true,
      message: msg,
      action: actionCallback,
    });
  };

  const handleConfirmYes = () => {
    if (confirmModal.action) confirmModal.action();
    setConfirmModal({ show: false, message: "", action: null });
  };

  const handleDelete = (profile) => {
    askConfirm(`Yakin ingin menghapus permanen "${profile.name}"?`, () => {
      deleteProfile(profile.id);
      showToast("Profile dihapus.", "error");
    });
  };

  const handleSave = () => {
    if (!newProfileName.trim()) {
      showToast("Nama profile tidak boleh kosong!", "error");
      return;
    }
    saveAsNewProfile(newProfileName);
    setNewProfileName("");
    showToast("Profile berhasil disimpan!");
  };

  const handleLoad = (profile) => {
    askConfirm(
      `Timpa pekerjaan saat ini dengan "${profile.name}"? Data yang belum disave akan hilang.`,
      () => {
        loadProfile(profile.id);
        showToast(`Profile "${profile.name}" dimuat!`);
        setIsOpen(false);
      },
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-40 cursor-pointer items-center justify-between rounded-md border border-gray-500 bg-gray-600 px-2 py-1 hover:bg-gray-700"
      >
        <h3>CV Template</h3>
        <MdKeyboardArrowDown size={18} />
      </button>

      {isOpen && (
        <div className="animate-in slide-in-from-bottom-5 bg-v-panel absolute right-0 mt-5 min-h-36 w-96 rounded-md pb-2 shadow-xl">
          <div className="flex items-center justify-between border-b-2 border-gray-900 px-4 py-1">
            <h3 className="text-lg">My Resumes</h3>
            <h4 className="font-semibold">[{savedProfiles.length}]</h4>
          </div>

          <div className="max-h-52 overflow-y-auto pb-16">
            {savedProfiles.length === 0 && (
              <p className="p-2">Belum ada template tersimpan</p>
            )}

            {savedProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleLoad(profile)}
                className="hover:bg-v-panel-hover flex cursor-pointer items-center justify-between border-b-2 border-gray-900 px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <GoDotFill size={12} />
                  <div className="flex flex-col">
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-xs">
                      {new Date(profile.lastModified).toLocaleDateString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-2">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex cursor-pointer items-center gap-1 rounded-md border p-0.5 px-2 hover:bg-gray-800"
                  >
                    <HiDuplicate />
                    <p className="text-sm">Duplicate</p>
                  </button>
                  <button
                    onClick={(e) => toggleMenu(profile.id, e)}
                    className="cursor-pointer rounded-md border p-0.5 px-2 hover:bg-gray-800"
                  >
                    <RiMore2Fill />
                  </button>
                  {activeMoreIdProfile === profile.id && (
                    <div className="absolute top-8 left-0 z-50 flex w-32 flex-col gap-1 rounded-md bg-gray-400">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex cursor-pointer items-center gap-1 py-0.5 pr-0.5 pl-2 text-sm text-black hover:rounded-t-md hover:bg-gray-500"
                      >
                        <MdDriveFileRenameOutline size={14} />
                        <p>Rename</p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(profile);
                        }}
                        className="flex cursor-pointer items-center gap-1 py-0.5 pr-0.5 pl-2 text-sm text-black hover:rounded-b-md hover:bg-gray-500"
                      >
                        <IoTrashBinOutline size={14} />
                        <p>Delete</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="z-40 py-1">
            {!isSaveOpen ? (
              <button
                onClick={() => setIsSaveOpen(!isSaveOpen)}
                className="group bg-v-button hover:bg-v-button-hover mx-auto flex cursor-pointer items-center gap-2 rounded-md p-2 duration-100 ease-in-out"
              >
                <BsStars
                  size={18}
                  className="text-black group-hover:text-white"
                />

                <p className="text-semibold">Safe Resume</p>
              </button>
            ) : (
              <div className="flex items-baseline-last justify-center gap-4">
                <div>
                  <p className="text-sm">Save template</p>
                  <input
                    className="rounded-md border border-white p-1"
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Template data analyst [ver 1.0]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="h-fit cursor-pointer rounded-md bg-blue-500 p-2 hover:bg-blue-600"
                  >
                    <MdNoteAdd size={16} />
                  </button>
                  <button
                    onClick={() => setIsSaveOpen(!isSaveOpen)}
                    className="h-fit cursor-pointer rounded-md bg-orange-500 p-2 hover:bg-orange-600"
                  >
                    <MdCancel size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmModal.show && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 w-full max-w-sm scale-100 rounded-xl border border-gray-100 bg-white p-6 shadow-2xl duration-200">
            <div className="mb-4 flex items-center gap-3 text-amber-500">
              <FiAlertCircle size={24} />
              <h3 className="text-lg font-bold text-gray-800">Konfirmasi</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ ...confirmModal, show: false })
                }
                className="cursor-pointer rounded-lg border-2 border-gray-400 px-4 py-2 text-sm font-medium text-black hover:border-gray-600 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmYes}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-800"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`animate-in slide-in-from-top-5 fixed top-6 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-2xl duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-gray-800"}`}
        >
          {toast.type === "error" ? <FiAlertCircle /> : <FiCheck />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
