import  React from "react"


export function TechnicalFrame({ children }) {
  return (
    <div className="relative h-full">
      
      {/* Marqueurs techniques en périphérie - Gauche */}
      <div className="absolute top-0 left-0 bottom-0 w-6 flex flex-col items-center justify-between py-12 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-0.5 h-8 bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full border border-gray-300"></div>
          <div className="w-2 h-2 rounded-full border border-gray-300"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-0.5 h-16 bg-gray-300"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs rotate-90 whitespace-nowrap">{"304"}</div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Marqueurs techniques en périphérie - Droite */}
      <div className="absolute top-0 right-0 bottom-0 w-6 flex flex-col items-center justify-between py-12 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs">FW</div>
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
            <div className="text-xs">+</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs">NIN</div>
          <div className="text-xs">14</div>
        </div>
      </div>
        <div className="relative z-10 h-full px-8"> {children} </div>
    
    </div>
  )
}
