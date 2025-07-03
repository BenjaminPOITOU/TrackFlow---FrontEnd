/**
 * @file Page component for displaying a single composition and its versions.
 */

import { getCompositionById } from "@/lib/api/compositions";
import { getBranchesByComposition } from "@/lib/api/branches";
import { getVersionsByBranch } from "@/lib/api/versions";
import { VersionListPageHeader } from "@/components/versions/VersionListPageHeader";
import { VersionBlock } from "@/components/versions/VersionBlock";

/**
 * Displays the detail page for a specific composition.
 * This is a React Server Component. It fetches all necessary data for the
 * composition, its branches, and the versions of the primary branch before rendering.
 *
 * @param {object} props - The props object provided by Next.js.
 * @param {object} props.params - The dynamic URL parameters.
 * @param {string} props.params.projectId - The ID of the parent project.
 * @param {string} props.params.compositionId - The ID of the composition to display.
 * @returns {Promise<JSX.Element>} The rendered composition page component.
 */
export default async function CompositionPage({ params }) {
  const { projectId, compositionId } = params;

  const [composition, branchList] = await Promise.all([
    getCompositionById(projectId, compositionId),
    getBranchesByComposition({ projectId, compositionId }),
  ]);


  let versionList = [];
  if (branchList && branchList.length > 0) {
    const mainBranchId = branchList[0].id;
    const summaries = await getVersionsByBranch({
      projectId,
      compositionId,
      branchId: mainBranchId,
    });
    versionList = summaries.map(summary => ({ ...summary, branchId: mainBranchId }));
  }

  return (
    <div className="p-2 md:p-5 w-full min-h-screen flex flex-col">
      {composition ? (
        <div className="flex flex-col gap-4">
          <VersionListPageHeader
            composition={composition}
            projectId={projectId}
            branchList={branchList}
          />
          <div className="w-full border-t border-gray-600"></div>
          <VersionBlock
            projectId={projectId}
            compositionId={compositionId}
            versionList={versionList}
            branchList = {branchList}
          />
        </div>
      ) : (
        <div>Loading composition...</div>
      )}
    </div>
  );
}