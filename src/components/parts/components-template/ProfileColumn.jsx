import { useCvStore } from "@stores";
import React, { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function ProfileColumn() {
  const { biodata: profile, updateEntryProfile } = useCvStore(
    useShallow((state) => ({
      biodata: state.biodata,
      updateEntryProfile: state.updateEntryProfile,
    })),
  );

  const handleFieldChange = (fieldName, value) => {
    updateEntryProfile(fieldName, value);
  };

  return (
    <section className="dark:bg-dark-second flex flex-col gap-2 bg-white dark:text-white">
      <div>
        <label className="text-sm">Name</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Location</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.location}
          onChange={(e) => handleFieldChange("location", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Phone</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.phoneNumber}
          onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Gmail</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.gmail}
          onChange={(e) => handleFieldChange("gmail", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Linkedin</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.linkedin}
          onChange={(e) => handleFieldChange("linkedin", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Github</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-100 p-2.5 focus:outline-hidden dark:bg-gray-700"
          value={profile.github}
          onChange={(e) => handleFieldChange("github", e.target.value)}
        />
      </div>
    </section>
  );
}
