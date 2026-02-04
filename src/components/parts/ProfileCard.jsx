import { useState, useRef } from "react";
import { FiMapPin, FiEdit, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { createCvBiodata } from "@stores/cvBiodata";
import { useCvStore } from "@stores";
import { useModalStore } from "@stores/useModalStore";

export default function ProfileCard() {
  const profile = useCvStore((state) => state.biodata);
  const openModal = useModalStore((state) => state.openModal);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSideModalClick = (e, profile) => {
    e.stopPropagation();
    openModal({
      type: "editMode",
      sectionKey: "profile",
      entryId: profile,
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <article className="scrollbar-hidden flex w-full flex-col gap-4 overflow-x-hidden overflow-y-auto shadow-xl">
      <section className="dark:bg-dark-second bg-light-second flex flex-col justify-between rounded-md p-4 md:flex-row-reverse dark:text-white">
        <div className="flex justify-between md:flex-col-reverse md:items-end">
          <button
            onClick={(e) => handleSideModalClick(e, profile)}
            className="flex h-fit w-fit cursor-pointer items-center gap-2 rounded-md bg-black px-2 py-1 text-white hover:bg-gray-900"
          >
            Edit Profile
            <FiEdit size={18} />
          </button>

          <div
            className="flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"
            onClick={handleClick}
          >
            {selectedImage ? (
              <img
                // src={".././src/assets/photo.jpg"}
                src={selectedImage}
                alt="Selected"
                className="h-18 w-18 rounded-full object-cover"
              />
            ) : (
              <FiCamera size={30} />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">{profile.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <FiMail />
            <p>{profile.gmail}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiPhone />
            <p>{profile.phoneNumber}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiMapPin />
            <p>{profile.location}</p>
          </div>
        </div>
      </section>{" "}
    </article>
  );
}
