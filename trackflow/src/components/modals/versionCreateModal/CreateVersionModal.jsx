import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModalWrapper } from "./ModalWrapper";
import { BranchSelector } from "./BranchSelector";
import { FileUploader } from "./FileUploader";
import { AnnotationsList } from "./AnnotationList";
import { InstrumentsManager } from "./InstrumentManager";
import { generateNextVersionName } from "./utils/generateNextVersionName";
import { createVersion, getLatestVersionByBranch } from "@/lib/api/versions";
import { getInstruments } from "@/lib/api/enum";
import { uploadAudio } from "@/lib/api/upload";

const musicalKeys = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];

export const CreateVersionModal = ({ isOpen, onClose, compositionId, projectId, branchList }) => {
  const router = useRouter();

  const [versionName, setVersionName] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [instruments, setInstruments] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [parentVersionId, setParentVersionId] = useState(null);
  
  const [allInstruments, setAllInstruments] = useState([]);
  const [isInstrumentsLoading, setIsInstrumentsLoading] = useState(true);
  
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [submissionStep, setSubmissionStep] = useState("idle");

  /**
   * A modal form for creating a new version.
   * This component acts as the single source of truth for all form data.
   * It fetches the master list of all instruments and provides a success
   * notification upon version creation, ensuring the parent page is refreshed.
   *
   * @param {object} props - The component props.
   * @param {boolean} props.isOpen - Controls the visibility of the modal.
   * @param {Function} props.onClose - Function to call when the modal should be closed.
   * @param {string} props.compositionId - The ID of the composition this new version belongs to.
   * @param {string} props.projectId - The ID of the parent project.
   * @param {Array<object>} props.branchList - A list of available branches for the composition.
   * @returns {JSX.Element | null} The rendered modal component or null if it is not open.
   */
  const resetFormState = useCallback(() => {
    setSelectedBranchId(null);
    setVersionName("");
    setFileToUpload(null);
    setBpm("");
    setKey("");
    setInstruments([]);
    setAnnotations([]);
    setParentVersionId(null);
    setError(null);
    setSubmissionStep("idle");
  }, []);

  useEffect(() => {
    const fetchInstruments = async () => {
      setIsInstrumentsLoading(true);
      try {
        const data = await getInstruments();
        if (!Array.isArray(data)) {
            throw new Error("Les données des instruments sont dans un format incorrect.");
        }
        setAllInstruments(data);
      } catch (err) {
        console.error("Failed to fetch or process instruments:", err);
        setError("Impossible de charger la liste des instruments.");
      } finally {
        setIsInstrumentsLoading(false);
      }
    };

    if (isOpen) {
      fetchInstruments();
    } else {
      resetFormState();
    }
  }, [isOpen, resetFormState]);

  useEffect(() => {
    if (isOpen && branchList && branchList.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branchList[0].id);
    }
  }, [isOpen, branchList, selectedBranchId]);

  useEffect(() => {
    if (!selectedBranchId || isInstrumentsLoading) {
        setVersionName("");
        setInstruments([]);
        setAnnotations([]);
        setParentVersionId(null);
        setBpm("");
        setKey("");
        return;
    }

    const fetchDataForBranch = async () => {
      setIsLoadingData(true);
      setError(null);

      try {
        const latestVersion = await getLatestVersionByBranch({
          projectId,
          compositionId,
          branchId: selectedBranchId
        });
        
        if (latestVersion) {
          setParentVersionId(latestVersion.id);
          setVersionName(generateNextVersionName(latestVersion.name));
          setBpm(latestVersion.bpm || "");
          setKey(latestVersion.key || "");
          setInstruments(latestVersion.instruments || []);
          const inheritedAnnotations = (latestVersion.annotations || []).map(anno => ({
            ...anno, resolved: true,
          }));
          setAnnotations(inheritedAnnotations);
        } else {
          setParentVersionId(null);
          setVersionName(generateNextVersionName(null));
          setInstruments([]);
          setAnnotations([]);
          setBpm("");
          setKey("");
        }
      } catch (err) {
        console.error("Error fetching data for the branch:", err);
        setError("Impossible de charger les données pour cette branche.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDataForBranch();
  }, [selectedBranchId, isInstrumentsLoading, projectId, compositionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload || !selectedBranchId) {
      setError("Veuillez sélectionner une branche et un fichier audio.");
      return;
    }

    setError(null);
    setSubmissionStep("creating");

    try {
      const audioUploadResponse = await uploadAudio(fileToUpload, compositionId);
      
      const versionData = {
        branchId: selectedBranchId,
        parentVersionId: parentVersionId,
        versionName: versionName,
        audioFileUrl: audioUploadResponse.fullUrl,
        durationSeconds: audioUploadResponse.durationSeconds,
        bpm: bpm,
        key: key,
        versionInstrumentPreDefinedList: instruments,
        annotationIdsToResolve: annotations.filter((a) => a.resolved).map((a) => a.id),
        annotationsToCreate: [],
        metadata: {},
      };

      if (versionData.parentVersionId === null) {
        delete versionData.parentVersionId;
      }
      
      const apiParams = { projectId, compositionId, branchId: selectedBranchId, versionData };
      await createVersion(apiParams);
      
      onClose();
      toast.success("La version a été créée avec succès !");
      router.refresh();

    } catch (err) {
      console.error("Error during submission process:", err);
      toast.error("Échec de la création de la version.");
      setError("Une erreur est survenue durant la création. Veuillez réessayer.");
      setSubmissionStep("error");
    } finally {
      if (submissionStep === 'creating') {
        setSubmissionStep("idle");
      }
    }
  };

  const handleAddInstrument = useCallback((instrumentValue) => {
    setInstruments((prev) => [...prev, instrumentValue]);
  }, []);

  const handleRemoveInstrument = useCallback((instrumentValueToRemove) => {
    setInstruments((prev) =>
      prev.filter((instValue) => instValue !== instrumentValueToRemove)
    );
  }, []);
  
  const handleAnnotationToggle = useCallback((id) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a))
    );
  }, []);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Créer une nouvelle version">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BranchSelector
          branches={branchList}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
          isLoading={false}
        />

        {selectedBranchId && (
          <>
            <div>
              <label htmlFor="version-name" className="block text-sm font-medium text-gray-300">
                Nom de la version
              </label>
              <input
                type="text"
                id="version-name"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={isLoadingData ? "Chargement..." : "ex: V2 - Mix Final"}
                disabled={isLoadingData}
                required
              />
            </div>

            <FileUploader onFileSelect={setFileToUpload} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bpm" className="block text-sm font-medium text-gray-300">
                  Tempo (BPM)
                </label>
                <input
                  type="text"
                  id="bpm"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ex: 120"
                  disabled={isLoadingData}
                />
              </div>
              <div>
                <label htmlFor="musical-key" className="block text-sm font-medium text-gray-300">
                  Tonalité
                </label>
                <select
                  id="musical-key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoadingData}
                >
                  <option value="">Non définie</option>
                  {musicalKeys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InstrumentsManager
              allInstruments={allInstruments}
              isLoading={isInstrumentsLoading}
              currentInstruments={instruments}
              onAddInstrument={handleAddInstrument}
              onRemoveInstrument={handleRemoveInstrument}
            />
            <AnnotationsList
              annotations={annotations}
              onToggle={handleAnnotationToggle}
              isLoading={isLoadingData}
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submissionStep !== "idle"}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 border border-transparent rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submissionStep !== "idle" || !selectedBranchId || !fileToUpload}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submissionStep === "creating" ? "Création en cours..." : "Créer la version"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};