
import { Music2 } from "lucide-react";

export function KeyVersion({versionKey}){



    return(

        <div className="flex flex-col w-full justify-center rounded gap-2 border border-gray-300 p-2 bg-neutral-800">
            <div className="flex items-center justify-start gap-1">
                <Music2 color="#e0e0e0" />
                <span>KEY</span>
                </div>
            <p className="pl-2 text-lg">{versionKey}</p>

        </div>
    );
}