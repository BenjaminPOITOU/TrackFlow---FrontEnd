import { DescriptionVersion } from "./DescriptionVersion";
import { TempoVersion } from "./TempoVersion";
import { KeyVersion } from "./KeyVersion";
import { DurationVersion } from "./DurationVersion";
import { InstrumentVersion } from "./InstrumentVersion";

export function VersionBlockDetails({ versionDetailsData }) {
  console.log(
    "Version Detail Data in VersionBlockDetails : ",
    versionDetailsData
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <div className="w-full">
        <DescriptionVersion
          versionDescription={versionDetailsData.description}
        />
      </div>
      <div className="flex gap-2 items-center w-full">
        <TempoVersion versionTemp={versionDetailsData.bpm} />
        <KeyVersion versionKey={versionDetailsData.key} />
        <DurationVersion versionDuration={versionDetailsData.duration} />
        <InstrumentVersion
          versionInstruments={versionDetailsData.versionInstruments}
        />
      </div>
    </div>
  );
}
