import { useState, useMemo, useEffect, useRef } from "react";
import { useCvStore } from "@stores";
import { useModalStore } from "@stores/useModalStore";
import {
  FiSearch,
  FiTrash2,
  FiDownload,
  FiCheck,
  FiAlertCircle,
  FiPlus,
  FiSave,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { BiSortAlt2 } from "react-icons/bi";

export default function SideTemplateManager() {
  const {
    savedProfiles,
    saveAsNewProfile,
    loadProfile,
    deleteProfile,
    renameProfile,
    hydrateTemplates,
  } = useCvStore();
  const { closeModal } = useModalStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [newProfileName, setNewProfileName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const editInputRef = useRef(null);

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

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const askConfirm = (msg, actionCallback) => {
    setConfirmModal({ show: true, message: msg, action: actionCallback });
  };

  const startEditing = (profile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveRename = (id) => {
    if (!editName.trim()) {
      showToast("Nama tidak boleh kosong", "error");
      return;
    }
    renameProfile(id, editName);
    setEditingId(null);
    showToast("Nama berhasil diubah");
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    hydrateTemplates();
  }, [hydrateTemplates]);

  const handleSave = () => {
    if (!newProfileName.trim()) {
      showToast("Nama template tidak boleh kosong!", "error");
      return;
    }
    saveAsNewProfile(newProfileName);
    setNewProfileName("");
    showToast("Template berhasil disimpan!");
  };

  const handleDelete = (profile) => {
    askConfirm(`Hapus permanen "${profile.name}"?`, () => {
      deleteProfile(profile.id);
      showToast("Template dihapus.", "error");
    });
  };

  const handleLoad = (profile) => {
    askConfirm(`Timpa CV saat ini dengan "${profile.name}"?`, () => {
      loadProfile(profile.id);
      closeModal();
    });
  };

  const filteredProfiles = useMemo(() => {
    let result = savedProfiles.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "date") {
      result.sort(
        (a, b) => new Date(b.lastModified) - new Date(a.lastModified),
      );
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [savedProfiles, searchTerm, sortBy]);

  return (
    <div className="relative flex h-full flex-col gap-4 dark:text-white">
      {/* 1. SAVE NEW SECTION */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Simpan Pekerjaan Saat Ini
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Contoh: Data Analyst - EN (v1)"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!newProfileName.trim()}
          >
            <FiSave size={18} />
          </button>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* 2. SEARCH & SORT CONTROLS */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari template..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "date" ? "name" : "date")}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          title="Sort by Date/Name"
        >
          <BiSortAlt2 size={18} />
          <span className="hidden sm:inline">
            {sortBy === "date" ? "Terbaru" : "Nama"}
          </span>
        </button>
      </div>

      {/* 3. LIST OF TEMPLATES */}
      {/* 3. LIST OF TEMPLATES */}
      <div className="max-h-[400px] flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <p>Tidak ada template ditemukan</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className={`group flex items-center justify-between rounded-md border p-3 shadow-sm transition-all ${
                editingId === profile.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              }`}
            >
              {/* --- MODE EDIT VS MODE DISPLAY --- */}
              {editingId === profile.id ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    ref={editInputRef}
                    type="text"
                    className="flex-1 rounded border border-blue-300 px-2 py-1 text-sm outline-none dark:border-blue-600 dark:bg-gray-900"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename(profile.id);
                      if (e.key === "Escape") cancelEditing();
                    }}
                  />
                  <button
                    onClick={() => saveRename(profile.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <FiCheck size={18} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="min-w-0 flex-1 cursor-pointer pr-4"
                    onClick={() => handleLoad(profile)}
                  >
                    <h4 className="truncate font-semibold text-gray-800 dark:text-gray-100">
                      {profile.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(profile.lastModified).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      onClick={() => handleLoad(profile)}
                      className="rounded p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                      title="Load"
                    >
                      <FiDownload size={18} />
                    </button>
                    <button
                      onClick={() => startEditing(profile)}
                      className="rounded p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      title="Rename"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(profile)}
                      className="rounded p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- OVERLAYS (Toast & Confirm) --- */}
      {confirmModal.show && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-black/60 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 w-full max-w-xs rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800">
            <div className="mb-3 flex items-center gap-2 text-amber-500">
              <FiAlertCircle size={20} />
              <h4 className="font-bold text-gray-900 dark:text-white">
                Konfirmasi
              </h4>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setConfirmModal({ ...confirmModal, show: false })
                }
                className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  confirmModal.action();
                  setConfirmModal({ ...confirmModal, show: false });
                }}
                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`animate-in slide-in-from-top-2 absolute top-2 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}
        >
          {toast.type === "error" ? <FiAlertCircle /> : <FiCheck />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
