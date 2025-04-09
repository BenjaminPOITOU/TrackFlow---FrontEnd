"use client"

import React, { useState } from "react";
import UserMenu from "../usermenu/UserMenu";
import Link from "next/link";
import { MiniVisualizer } from "../MiniVisualizer";
import {
  Home,
  Music2,
  Users,
  Share2,
  GitCompare,
  PlaySquare,
  Archive,
  Trash2,
} from "lucide-react"


export function Sidebar() {

const [activeSection, setActiveSection] = useState("MAIN_SYS");
const [activeItem, setActiveItem] = useState("DASHBOARD");


function handleItemClick(vizToDisplay, itemId){

 
    setActiveSection(vizToDisplay);
    setActiveItem(itemId);


}




  return (
    <aside className="w-64 h-full border-r border-gray-300 flex flex-col bg-zinc-900">
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight font-tech text-gray-300 glow-text">
            TRACKFLOW
          </span>
        </div>
      </div>
        

      <div className="p-3 border-b items-start border-b-gray-300">
        <UserMenu />
      </div>

   

      <nav className="flex-1 p-2 text-gray-300 ${}">
        <div className="mb-4 relative">
          <div className="px-2 py-1.5 text-xs text-gray-300 uppercase tracking-wider flex justify-between items-center">
            <span>MAIN_SYS</span>
            <div className={`transition-opacity duration-300 ${activeSection === 'MAIN_SYS' ? 'opacity-100' : 'opacity-0'}`}>
              <MiniVisualizer className="w-8 h-8" type="cube" />
            </div>
          </div>
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard" className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "DASHBOARD" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("MAIN_SYS","DASHBOARD")}>
                <Home size={18} />
                <span>DASHBOARD</span>
              </Link>
            </li>
            <li>
              <Link href="/projects" className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "PROJECTS" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("MAIN_SYS","PROJECTS")}>
                <Music2 size={18} />
                <span>PROJECTS</span>
              </Link>
            </li>
            <li>
              <button className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "PLAYLIST" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("MAIN_SYS","PLAYLIST")}>
                <PlaySquare size={18} />
                <span>PLAYLIST</span>
              </button >
            </li>
            <li>
              <button  className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "ARCHIVED" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("MAIN_SYS","ARCHIVED")}>
                <Archive size={18} />
                <span>ARCHIVED</span>
              </button >
            </li>
            <li>
              <button className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "TRASH" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("MAIN_SYS","TRASH")}>
                <Trash2 size={18} />
                <span>TRASH</span>
              </button >
            </li>
          </ul>
        </div>

         <div className="mb-4 relative">
          <div className="px-2 py-1.5 text-xs text-gray-300 uppercase tracking-wider flex justify-between items-center ">
            <span>COLLAB_SYS</span>
            <div className={`w-8 h-8 transition-opacity duration-300 ${activeSection === 'COLLAB_SYS' ? 'opacity-100' : 'opacity-0'}`}>
              <MiniVisualizer className="w-8 h-8" type="wave" />
            </div>
          </div>
          <ul className="space-y-1">
            <li>
              <button  className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "LISTENERS" ? "bg-gray-700" : "bg-body"}`}
                onClick={() => handleItemClick("COLLAB_SYS","LISTENERS")}>
                <Users size={18} />
                <span>LISTENERS</span>
              </button >
            </li>
            <li>
              <button  className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "SHARE" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("COLLAB_SYS","SHARE")}>
                <Share2 size={18} />
                <span>SHARE</span>
              </button >
            </li>
          </ul>
        </div>

        <div className="mb-4 relative">
          <div className="px-2 py-1.5 text-xs text-gray-300 uppercase tracking-wider flex justify-between items-center">
            <span>TOOL_SYS</span>
            <div className={`w-8 h-8 transition-opacity duration-300 ${activeSection === 'TOOL_SYS' ? 'opacity-100' : 'opacity-0'}`}>
              <MiniVisualizer className="w-8 h-8" type="circles" />
            </div>
          </div>
          <ul className="space-y-1">
            <li>
              <button  className={`flex w-full gap-3 px-3 py-2 rounded-md items-center cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700 ${activeItem === "COMPARE" ? "bg-gray-700" : "bg-body"}`}
              onClick={() => handleItemClick("TOOL_SYS","COMPARE")}>
                <GitCompare size={18}/>
                <span>COMPARE A/B</span>
              </button >
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
