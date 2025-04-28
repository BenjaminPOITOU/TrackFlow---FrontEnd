import { getVersionById } from "@/lib/api/versions";
import { useState, useEffect } from "react";
import { VersionBlockDetails } from "./VersionBlockDetails";
import { VersionBlockMediaPlayer } from "./VersionBlockMediaPlayer";

export function VersionBlock({ versionId }) {
  const [version, setVersion] = useState(null);
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("Version Id : ", versionId);

  const [versionDetailsData, setVersionDetailsData] = useState({
    versionName: "",
    branchName: "",
    description: "Aucune description.",
    bpm: "Aucun tempo renseigné.",
    key: "Aucune clé renseignée",
    duration: "Aucune durée renseignée.",
    versionInstruments: [],
  });

  const versionAudioUrl = version?.audioFileUrl || "Aucun fichier Audio";

  console.log("Version Details Data : ", versionDetailsData);

  useEffect(() => {
    const fetchVersion = async () => {
      if (versionId) {
        setIsVersionLoading(true);
        setVersion(null);

        try {
          const fetchData = await getVersionById(versionId);
          setVersion(fetchData);
          setVersionDetailsData({
            versionName: fetchData?.versionName || "",
            branchName: fetchData?.branchName || "",
            description: fetchData?.description || "Aucune description.",
            bpm: fetchData?.bpm || "Aucun tempo renseigné.",
            key: fetchData?.key || "Aucune key renseignée.",
            duration: fetchData?.durationSeconds || "Aucune durée renseignée.",
            versionInstruments: fetchData?.versionInstruments || [],
          });
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
    <div className="flex w-full flex-col gap-3">
  
      <VersionBlockDetails versionDetailsData={versionDetailsData} />

      <VersionBlockMediaPlayer
        versionName={versionDetailsData.versionName}
        branchName={versionDetailsData.branchName}
        versionAudioUrl="https://storage.googleapis.com/my-audio-file-bucket/musiques/166a1f3b-b713-4b0b-a085-02b07b865e6e.mp3"
      />
    </div>
  );
}
