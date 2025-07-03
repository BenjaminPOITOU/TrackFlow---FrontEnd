/**
 * @file A container component for managing the display of a selected version's details.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
  getVersionById,
  deleteVersion,
  updateVersion
} from "@/lib/api/versions";
import { updateBranch } from "@/lib/api/branches";
import { VersionBlockDetails } from "./details/VersionBlockDetails";
import { VersionBlockMediaPlayer } from "./VersionBlockMediaPlayer";
import VersionBlockHistory from "./VersionBlockHistory";
/**
 * A container component that manages the display of a selected version's details.
 * It handles fetching the version data, and delegates the management of annotations
 * to the `VersionBlockMediaPlayer` component. It can also display and update branch
 * information even if no version is selected.
 *
 * @param {object} props
 * @param {string} props.projectId - The ID of the parent project.
 * @param {string} props.compositionId - The ID of the parent composition.
 * @param {Array<object>} props.versionList - A list of version summaries for the current branch. Each summary must include a `branchId`.
 * @param {Array<object>} props.branchList - A list of all branches in the composition, typically from the composition details endpoint.
 * @returns {JSX.Element} The rendered VersionBlock component.
 */
export function VersionBlock({ projectId, compositionId, versionList, branchList }) {
  const [currentVersion, setCurrentVersion] = useState(null);
  const [displayBranchList, setDisplayBranchList] = useState(branchList);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading version...");
  const [error, setError] = useState(null);
  const isVersionDetailsEditable = !!currentVersion?.id;

  useEffect(() => {
    setDisplayBranchList(branchList);
  }, [branchList]);

  const fetchVersionDetails = useCallback(async (versionId) => {
    if (!versionId) return;
    setLoadingMessage("Loading version...");
    setIsLoading(true);
    setError(null);
    try {
      const versionSummary = versionList.find(v => v.id === versionId);
      if (!versionSummary || !versionSummary.branchId) {
        throw new Error("Branch information is missing for the selected version.");
      }
      const versionDetails = await getVersionById({
        projectId, compositionId, branchId: versionSummary.branchId, versionId,
      });
      setCurrentVersion(versionDetails);
    } catch (err) {
      console.error(`Failed to fetch version ${versionId}:`, err);
      setError("Could not load the selected version's details.");
      setCurrentVersion(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, compositionId, versionList]);

  useEffect(() => {
    if (versionList && versionList.length > 0 && !currentVersion) {
      const latestVersionSummary = versionList[0];
      if (latestVersionSummary?.id) {
        fetchVersionDetails(latestVersionSummary.id);
      }
    } else if (!versionList || versionList.length === 0) {
      setCurrentVersion(null);
    }
  }, [versionList, currentVersion, fetchVersionDetails]);

  const handleVersionChange = useCallback(async (versionId) => {
    if (currentVersion?.id === versionId) return;
    await fetchVersionDetails(versionId);
  }, [currentVersion, fetchVersionDetails]);
  
  const handleVersionDelete = useCallback(async (versionId) => {
    if (!currentVersion?.branch?.id) {
      setError("Cannot delete: current version context is missing.");
      return;
    }
    setLoadingMessage("Deleting version...");
    setIsLoading(true);
    setError(null);
    try {
      await deleteVersion({ projectId, compositionId, branchId: currentVersion.branch.id, versionId });
    } catch (err) {
      console.error(`Failed to delete version ${versionId}:`, err);
      setError("Could not delete the selected version.");
      setIsLoading(false);
    }
  }, [projectId, compositionId, currentVersion]);

  const handleVersionUpdate = useCallback(async (updateData) => {
    if (!currentVersion?.branch?.id) return;
    try {
      const updatedVersion = await updateVersion({
        projectId, compositionId, branchId: currentVersion.branch.id, versionId: currentVersion.id, updateData,
      });
      setCurrentVersion((prev) => ({ ...prev, ...updatedVersion }));
    } catch (err) {
      console.error("Failed to update version:", err);
      setError("Could not update version details.");
    }
  }, [currentVersion, projectId, compositionId]);

  const handleBranchUpdate = useCallback(async (updateData) => {
    let branchIdToUpdate = currentVersion?.branchId;

    if (!branchIdToUpdate && displayBranchList && displayBranchList.length > 0) {
      branchIdToUpdate = displayBranchList[0].id;
    }

    if (!branchIdToUpdate) {
      setError("Branch context is missing. Cannot update.");
      return;
    }

    try {
      const updatedBranch = await updateBranch({
        projectId, compositionId, branchId: branchIdToUpdate, updateData,
      });
      
      if (currentVersion) {
        setCurrentVersion((prev) => ({
          ...prev,
          branch: { ...prev.branch, ...updatedBranch },
          branchDescription: updatedBranch.description,
        }));
      } else {
        setDisplayBranchList((prevList) => 
          prevList.map((branch) =>
            branch.id === branchIdToUpdate ? { ...branch, ...updatedBranch } : branch
          )
        );
      }
    } catch (err) {
      console.error("Failed to update branch:", err);
      setError("Could not update branch details.");
    }
  }, [currentVersion, projectId, compositionId, displayBranchList]);

  let detailsToDisplay = currentVersion;
  if (!detailsToDisplay && displayBranchList && displayBranchList.length > 0) {
    const defaultBranch = displayBranchList[0];
    detailsToDisplay = {
      id: null, branchId: defaultBranch.id, branchDescription: defaultBranch.description,
      branchName: defaultBranch.name, bpm: null, key: null, durationSeconds: null,
      instruments: null, audioFileUrl: null, name: "No version selected"
    };
  }

  return (
    <div className="relative flex w-full flex-col gap-3">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-zinc-800 bg-opacity-90">
          <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
          <p className="text-xl text-gray-300">{loadingMessage}</p>
        </div>
      )}

      {error && (<div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md">{error}</div>)}

      <div className="hidden md:block">
        <VersionBlockDetails
          version={detailsToDisplay}
          onVersionUpdate={handleVersionUpdate}
          onBranchUpdate={handleBranchUpdate}
          isVersionEditable={isVersionDetailsEditable}
        />
      </div>

      <VersionBlockMediaPlayer
        key={detailsToDisplay?.id || 'no-version'} versionId={detailsToDisplay?.id}
        versionName={detailsToDisplay?.name} branchName={detailsToDisplay?.branchName}
        versionAudioUrl={detailsToDisplay?.audioFileUrl}
      />

      <VersionBlockHistory
        versionList={versionList} selectedVersionId={currentVersion?.id}
        onVersionChange={handleVersionChange} onVersionDelete={handleVersionDelete}
      />
    </div>
  );
}