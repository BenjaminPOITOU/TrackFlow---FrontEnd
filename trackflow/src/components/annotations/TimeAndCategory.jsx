import { SelectCategory } from "./SelectCategory";
import { SelectStatus } from "./SelectStatus";
import { useState } from "react";
import { Link2Off, Link2 } from "lucide-react";

export function TimeAndCategory({btnSynchStatus, onBtnSynchStatus}) {
  
  const [valueTime, setValueTime] = useState("0 : 00");
  const [isTimeDisabled, setIsTimeDisabled] = useState(true);
  const [isSynchHovering, setIsSynchHovering] = useState(false);


  return (
    <div className="flex flex-col justify-center items-start gap-2">
      <div className="flex w-full justify-between items-center px-4">
        <div className="flex gap-1 items-center text-sm">
          <span>TIME : </span>
          <input  disabled className={`border border-gray-300 p-1 px-2 rounded ${
          !btnSynchStatus ? "bg-gray-400 text-gray-500" : "bg-neutral-700 text-gray-300"
        }  cursor-not-allowed w-18`} value={btnSynchStatus ? valueTime : "- : - -"} onChange={setValueTime}/> 
         <button
            onMouseLeave={() => setIsSynchHovering(false)}
            onMouseEnter={() => setIsSynchHovering(true)}
            className={`border rounded-full  p-2 cursor-pointer right-3 ml-2 ${btnSynchStatus ? "border-[#21e114]" : "border-gray-300"}`}
            onClick={() => onBtnSynchStatus()}
           
          >
            {btnSynchStatus ? (
              <Link2
                className="transition-all ease-out-linear"
                size={20}
                color="#21e114"
                strokeWidth={2.5}
              />
            ) : (
              <Link2Off size={20} color="#e0e0e0" />
            )}
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 text-sm">
          <span>CATEGORY : </span>
          <SelectCategory className="cursor-pointer" />
        </div>
      </div>

      <div className="flex w-full justify-end items-center pr-4 gap-2 text-sm">
        <span>STATUT : </span>
        <SelectStatus className="cursor-pointer" />
      </div>
    </div>
  );
}
