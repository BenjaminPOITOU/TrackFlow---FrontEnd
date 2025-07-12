import { DescriptionVersion } from "./DescriptionVersion";
import { TempoVersion } from "./TempoVersion";
import { KeyVersion } from "./KeyVersion";
import { DurationVersion } from "./DurationVersion";
import { InstrumentVersion } from "./InstrumentVersion";

/**
 * @file This component serves as a container for all the detailed information blocks of a version.
 */

/**
 * Renders a block containing various details about a specific version.
 * This component distinguishes between data belonging to a 'version' and data belonging to its parent 'branch'.
 * It passes the correct update handlers (`onVersionUpdate` or `onBranchUpdate`) to its child components.
 *
 * @param {object} props - The component props.
 * @param {object} props.version - The version object containing all necessary details (e.g., bpm, key, branchDescription).
 * @param {Function} props.onVersionUpdate - Callback function to update properties specific to the version.
 * @param {Function} props.onBranchUpdate - Callback function to update properties specific to the branch (like the description).
 * @returns {JSX.Element} The rendered component with all version details.
 */
export function VersionBlockDetails({
  version,
  onVersionUpdate,
  onBranchUpdate,
  isVersionEditable,
}) {
  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <div className="w-full">
        <DescriptionVersion
          branchDescription={version?.branchDescription}
          onDescriptionSave={onBranchUpdate}
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
        <TempoVersion
          versionBpm={version?.bpm}
          onBpmSave={onVersionUpdate}
          isEditable={false}
        />
        <KeyVersion
          versionKey={version?.key}
          onKeySave={onVersionUpdate}
          isEditable={false}
        />
        <DurationVersion
          versionDuration={version?.durationSeconds}
          isEditable={false}
        />
        <InstrumentVersion
          versionInstruments={version?.instruments}
          onInstrumentsSave={onVersionUpdate}
          isEditable={false}
        />
      </div>
    </div>
  );
}
