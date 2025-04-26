import { Clock } from "lucide-react";




export function DurationVersion({versionDuration}) {

    const versionDurationMinute = Math.floor(versionDuration/60);
    let versionDurationSeconds = versionDuration - versionDurationMinute*60;


       if(versionDurationSeconds<10){

        versionDurationSeconds = `0${versionDurationSeconds}`
       }

    

     const versionDurationFormated = `${versionDurationMinute} : ${versionDurationSeconds}`

    
  return (
    <div className="flex flex-col w-full justify-center rounded gap-2 border border-gray-300 p-2 bg-neutral-800">
      <div className="flex items-center justify-start gap-1">
        <Clock color="#e0e0e0" />
        <span>DURATION</span>
      </div>
      <p className="pl-2 text-lg">{versionDurationFormated}</p>
    </div>
  );
}
