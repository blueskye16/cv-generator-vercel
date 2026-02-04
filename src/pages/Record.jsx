import { useState, useEffect } from "react";
import { useCvStore } from "@stores";
import { getApplicationData } from "../utils/db";
import {
  FiPlus,
  FiTrash2,
  FiExternalLink,
  FiCopy,
  FiLoader,
  FiX,
  FiRefreshCcw,
  FiFileText,
  FiLayout,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import CvPreview from "../components/layout/CvPreview";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";

export default function Record() {
  const {
    applications,
    savedProfiles,
    addApplication,
    deleteApplication,
    updateApplicationStatus,
    applyAiRevision,
  } = useCvStore();
  const [searchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({
    open: false,
    data: null,
    meta: null,
    loading: false,
  });

  const [activeTab, setActiveTab] = useState("jobDesc");

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    platform: "LinkedIn",
    jobUrl: "",
    jobDesc: "",
    profileId: "",
  });

  useEffect(() => {
    const linkedId = searchParams.get("id");
    if (linkedId) {
      const meta = applications.find((a) => a.id === linkedId);
      if (meta) handleOpenDetail(meta);
    }
  }, [searchParams, applications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedProfile = savedProfiles.find(
      (p) => p.id === formData.profileId,
    );

    await addApplication({
      ...formData,
      linkedProfileName: selectedProfile
        ? selectedProfile.name
        : "Current Draft",
    });

    setIsFormOpen(false);
    setFormData({
      company: "",
      position: "",
      platform: "LinkedIn",
      jobUrl: "",
      jobDesc: "",
      profileId: "",
    });
  };

  const handleOpenDetail = async (meta) => {
    setActiveTab("jobDesc");
    setDetailModal({ open: true, data: null, meta, loading: true });
    try {
      const heavyData = await getApplicationData(meta.id);
      setDetailModal({ open: true, data: heavyData, meta, loading: false });
    } catch (error) {
      console.error("Gagal load data detail", error);
      setDetailModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLoadSnapshot = () => {
    if (detailModal.data?.cvSnapshot) {
      if (
        window.confirm(
          "Load CV versi lampau ini ke editor? Data editor saat ini akan tertimpa.",
        )
      ) {
        applyAiRevision(detailModal.data.cvSnapshot);
        alert("CV berhasil dikembalikan ke versi saat melamar ini!");
      }
    }
  };

  const handleCopyToExcel = (app) => {
    const deepLink = `${window.location.origin}/record?id=${app.id}`;
    const excelLink = `=HYPERLINK("${deepLink}", "Open Detail")`;
    const date = new Date(app.dateApplied).toLocaleDateString("id-ID");
    const textToCopy = `${excelLink}\t${date}\t${app.company}\t${app.position}\t${app.platform}\t${app.status}`;

    navigator.clipboard.writeText(textToCopy);
    alert("Data disalin! Paste langsung di Excel/Spreadsheet.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Pantau lamaran dan arsip CV.
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-white shadow-lg hover:bg-blue-700"
          >
            <FiPlus /> Catat Lamaran
          </button>
        </div>

        {isFormOpen && (
          <div className="animate-in slide-in-from-top-4 mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-200">
              Input Data Lamaran Baru
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                required
                placeholder="Nama Perusahaan"
                className="input-field"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <input
                required
                placeholder="Posisi Dilamar"
                className="input-field"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
              <select
                className="input-field"
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="JobStreet">JobStreet</option>
                <option value="Glints">Glints</option>
                <option value="Email">Email</option>
                <option value="Website">Company Web</option>
              </select>
              <select
                className="input-field"
                value={formData.profileId}
                onChange={(e) =>
                  setFormData({ ...formData, profileId: e.target.value })
                }
              >
                <option value="">-- CV Saat Ini (Current Draft) --</option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="URL Lowongan (Opsional)"
                className="input-field md:col-span-2"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
              />
              <textarea
                placeholder="Paste Job Description Lengkap Disini..."
                className="input-field h-32 md:col-span-2"
                value={formData.jobDesc}
                onChange={(e) =>
                  setFormData({ ...formData, jobDesc: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 pt-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded px-4 py-2 text-gray-500 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded bg-green-600 px-6 py-2 font-bold text-white hover:bg-green-700"
                >
                  Simpan Tracker
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-700/50 dark:text-gray-400">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Posisi & Perusahaan</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Belum ada data lamaran.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="p-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(app.dateApplied).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td
                      className="cursor-pointer p-4"
                      onClick={() => handleOpenDetail(app)}
                    >
                      <div className="font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-200">
                        {app.position}
                      </div>
                      <div className="text-sm text-gray-500">{app.company}</div>
                    </td>
                    <td className="p-4 text-sm">{app.platform}</td>
                    <td className="p-4">
                      <select
                        className={`cursor-pointer appearance-none rounded-full border-none px-2 py-1 text-xs font-bold outline-none ${
                          app.status === "Applied"
                            ? "bg-yellow-100 text-yellow-700"
                            : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status === "Offer"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </td>
                    <td className="flex justify-end gap-2 p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyToExcel(app);
                        }}
                        title="Copy to Excel"
                        className="rounded p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                      >
                        <FiCopy />
                      </button>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteApplication(app.id);
                        }}
                        title="Hapus"
                        className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setDetailModal({ open: false, data: null, meta: null })
          }
        >
          <div
            className="animate-in zoom-in-95 flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold">
                  {detailModal.meta?.position}
                </h2>
                <p className="text-gray-500">
                  {detailModal.meta?.company} •{" "}
                  {new Date(detailModal.meta?.dateApplied).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() =>
                  setDetailModal({ open: false, data: null, meta: null })
                }
                className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-700"
              >
                <FiX />
              </button>
            </div>

            <div className="flex gap-4 border-b border-gray-100 px-6 py-2 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("jobDesc")}
                className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-semibold transition-all ${
                  activeTab === "jobDesc"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiFileText /> Job Description
              </button>
              <button
                onClick={() => setActiveTab("cvSnapshot")}
                className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-semibold transition-all ${
                  activeTab === "cvSnapshot"
                    ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiLayout /> Archived CV
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
              {detailModal.loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                  <FiLoader className="animate-spin text-2xl" /> Membuka
                  Arsip...
                </div>
              ) : (
                <div className="h-full w-full">
                  {activeTab === "jobDesc" && (
                    <div className="h-full overflow-y-auto p-6">
                      <div className="rounded-lg border border-gray-100 bg-white p-6 text-sm leading-relaxed whitespace-pre-line shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {detailModal.data?.jobDesc ||
                          "Tidak ada deskripsi tersimpan."}
                      </div>
                    </div>
                  )}

                  {activeTab === "cvSnapshot" && (
                    <div className="flex h-full w-full justify-center overflow-y-auto p-8">
                      {detailModal.data?.cvSnapshot ? (
                        <div className="relative min-h-[1200px] w-[210mm]">
                          <div className="origin-top scale-[0.85] shadow-2xl">
                            <CvPreview
                              customCvData={detailModal.data.cvSnapshot.cvData}
                              customBiodata={
                                detailModal.data.cvSnapshot.biodata
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                          <FiLayout size={40} className="mb-2 opacity-50" />
                          <p>Data Snapshot CV tidak ditemukan / rusak.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-md flex items-center justify-between border-t border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-xs text-gray-500">
                <button className="flex cursor-default items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <HiMagnifyingGlassCircle size={16} />
                  <span>
                    Used: <strong>{detailModal.meta?.linkedProfileName}</strong>
                  </span>
                </button>
              </div>
              <button
                onClick={handleLoadSnapshot}
                disabled={detailModal.loading || !detailModal.data?.cvSnapshot}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-purple-600 px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-purple-700 disabled:opacity-50 disabled:hover:scale-100"
              >
                <FiRefreshCcw /> Restore This Version
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          @apply w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
        }
      `}</style>
    </div>
  );
}
