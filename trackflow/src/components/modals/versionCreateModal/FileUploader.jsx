import React, { useState } from "react";
import { uploadAudioFile } from "@/lib/api/versions";

const CheckmarkIcon = () => (
  <svg
    className="mx-auto h-12 w-12 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const UploadIcon = () => (
  <svg
    className="mx-auto h-12 w-12 text-gray-400"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FileUploader = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      onFileSelect(file); // On passe l'objet File entier au parent
    } else {
      setFileName(null);
      onFileSelect(null); // On informe le parent si la sélection est annulée
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-xl font-medium text-gray-300 mb-2">
        Fichier audio
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md transition-colors
          ${
            fileName
              ? "border-green-500 border-solid"
              : "border-gray-500 border-dashed"
          }`}
      >
        <div className="space-y-2 text-center">
          {/* La coche verte signifie maintenant "Fichier sélectionné" */}
          {fileName ? <CheckmarkIcon /> : <UploadIcon />}

          <div className="text-sm">
            {fileName ? (
              <div className="text-gray-300">
                <p>Fichier prêt pour l'envoi :</p>
                <p className="font-semibold text-white">{fileName}</p>
              </div>
            ) : (
              <div className="text-gray-400">Glissez-déposez ou</div>
            )}
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-indigo-500"
            >
              <span className="ml-1">
                {fileName ? "Changer de fichier" : "choisissez un fichier"}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept=".mp3,.wav"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
