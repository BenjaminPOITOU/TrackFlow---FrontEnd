import { useEffect, useState } from "react";
import { DescriptionVersion } from "./DescriptionVersion";
import { TempoVersion } from "./TempoVersion";
import { KeyVersion } from "./KeyVersion";
import { DurationVersion } from "./DurationVersion";
import { InstrumentVersion } from "./InstrumentVersion";
import { getVersionById } from "@/lib/api/versions";

export function VersionBlockDetails({ versionId }) {
  const [version, setVersion] = useState(null);
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Version detail : ", version);
  useEffect(() => {
    const fetchVersion = async () => {
      if (versionId) {
        setIsVersionLoading(true);
        setVersion(null);

        try {
          const fetchData = await getVersionById(versionId);
          setVersion(fetchData);
          setIsVersionLoading(false);
          setError(false);
        } catch (error) {
          setVersion(null);
          setIsVersionLoading(false);

          console.log("Error with fetching version by Id : ", error);
        }
      } else {
        console.log("Version Id not found...");
      }
    };

    fetchVersion();
  }, [versionId]);
  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <div className="w-full">
        <DescriptionVersion versionDescription={version?.description} />
      </div>
      <div className="flex gap-2 items-center w-full">
        <TempoVersion  versionTemp={version?.bpm} />
        <KeyVersion  versionKey={version?.key} />
        <DurationVersion  versionDuration={version?.durationSeconds} />
        <InstrumentVersion  versionInstruments={version?.versionInstruments} />
      </div>
    </div>
  );
}
