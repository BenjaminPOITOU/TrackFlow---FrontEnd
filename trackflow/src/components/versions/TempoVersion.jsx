
import { Drum } from "lucide-react";

export function TempoVersion({versionTemp}){
    return(

        <div className="flex flex-col w-full justify-center rounded gap-2 border border-gray-300 p-2 bg-neutral-800">
            <div className="flex items-center justify-start gap-1">
                <Drum size={20} color="#e0e0e0" />
                <span>TEMPO</span>
                </div>
            <p className="pl-2 text-lg">{versionTemp} BPM </p>

        </div>
    );
}