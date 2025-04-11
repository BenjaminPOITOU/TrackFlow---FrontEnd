"use client"

import React from "react";
import { Plus } from "lucide-react";


export default function PageHeader({ title, subtitle, buttonText, onActionClick}) {


  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col gap-1 text-gray-300">
        {title && (
          <h1 className="text-2xl font-semibold glow-text"> {title} </h1>
        )}
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      <div>
        {buttonText && onActionClick &&(
            
            <button className="p-4 flex text-gray-300 gap-2 border border-gray-300 cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700" onClick={onActionClick}>
            <Plus/>
            {buttonText}
        </button>)}
      </div>
    </div>
  );
}