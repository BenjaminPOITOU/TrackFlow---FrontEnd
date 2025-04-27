import { KeyboardMusic } from "lucide-react";
import { getInstrumentBadgeStyle } from "../shared/InstrumentBadge";


export function InstrumentVersion({versionInstruments = []}) {


  return (
  <div className="flex flex-col w-full justify-center items-start rounded gap-2 border border-gray-300 p-2 bg-neutral-800">
    <div className="flex items-center justify-start gap-1">
      <KeyboardMusic color="#e0e0e0" />
      {versionInstruments.length >1 ? (<span>INSTRUMENTS</span>):(<span>INSTRUMENT</span>)}
    </div>
    <div className="flex gap-2  overflow-y-auto w-full">
    {versionInstruments.length> 0 ? (
      versionInstruments.map((instrument, index) => (
        <p key={index} style={getInstrumentBadgeStyle(instrument.label)} className="text-md ">{instrument.value}</p>
      ))
    ) : (
      "Aucun instrument"
    )}
    </div>
  </div>
);
}
