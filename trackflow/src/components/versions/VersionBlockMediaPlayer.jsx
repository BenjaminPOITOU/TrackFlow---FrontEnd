import { AudioPlayerContent } from "@/components/audioPlayer/AudioPlayerContent";
import { AddAnnotationBlock } from "../annotations/AddAnnotationBlock";
import { AnnotationList } from "../annotations/AnnotationList";

export function VersionBlockMediaPlayer({
  versionName,
  branchName,
  versionAudioUrl,
}) {
  const versionNameSplitted = versionName?.split("V")[1];
  const branchNameUpperCase = branchName?.toLocaleUpperCase();

  return (
    <div className="flex flex-col w-full border border-gray-300 bg-neutral-800 p-4 justify-center items-start rounded gap-4">
      <div className="flex flex-col justify-center items-start">
        <span className="text-xl">VERSION : {versionNameSplitted}</span>
        <span className="text-sm"> Branche : {branchNameUpperCase}</span>
      </div>

      <AudioPlayerContent versionAudioUrl={versionAudioUrl} />

      <div className="w-full border border-gray-300"></div>


      <div className="flex gap-2 justify-between w-full">
        <AddAnnotationBlock className="flex-grow" />
        <AnnotationList className="flex-grow" />
      </div>
    </div>
  );
}
