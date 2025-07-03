"use client";

import { useState } from "react";
import Link from "next/link";
import UserMenu from "@/components/usermenu/UserMenu";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import {
  Home,
  Music2,
  Users,
  Share2,
  GitCompare,
  PlaySquare,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mainNavItems = [
  { id: "DASHBOARD", text: "Dashboard", href: "/dashboard", icon: Home },
  { id: "PROJECTS", text: "Projects", href: "/projects", icon: Music2 },
  { id: "PLAYLIST", text: "Playlist", icon: PlaySquare },
  { id: "ARCHIVED", text: "Archived", icon: Archive },
  { id: "TRASH", text: "Trash", icon: Trash2 },
];

const collabNavItems = [
  { id: "LISTENERS", text: "Listeners", icon: Users },
  { id: "SHARE", text: "Share", icon: Share2 },
];

const toolNavItems = [
  { id: "COMPARE", text: "Compare A/B", icon: GitCompare },
];

const navSections = [
  { id: "MAIN_SYS", title: "Main", items: mainNavItems, visualizerType: "cube" },
  { id: "COLLAB_SYS", title: "Collab", items: collabNavItems, visualizerType: "wave" },
  { id: "TOOL_SYS", title: "Tools", items: toolNavItems, visualizerType: "circles" },
];

/**
 * Main application sidebar, handling navigation and its own collapsed state.
 * It is a Client Component due to its use of state for interactivity.
 * It is composed of smaller, more manageable child components.
 * @returns {JSX.Element} The main sidebar and mobile header.
 */
export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("MAIN_SYS");
  const [activeItem, setActiveItem] = useState("DASHBOARD");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (sectionId, itemId) => {
    setActiveSection(sectionId);
    setActiveItem(itemId);
  };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>
      <span className={`text-lg font-bold tracking-tight font-tech glow-text transition-opacity duration-200 hidden ${!isCollapsed && "lg:inline"}`}>
        TrackFlow
      </span>
    </div>
  );

  return (
    <>
      <header className="flex lg:hidden items-center justify-between w-full h-16 px-4 border-b border-zinc-700 bg-zinc-900 z-10">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <UserMenu isCollapsed={true} />
      </header>

      <aside className={`hidden lg:flex relative h-full border-r border-zinc-700 flex-col bg-zinc-900 text-gray-300 transition-all duration-300 ease-in-out w-20 ${!isCollapsed && "lg:w-64"}`}>
        <button onClick={toggleSidebar} className="absolute top-6 -right-3 z-20 h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 hidden lg:flex items-center justify-center">
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="p-4 border-b border-zinc-700 transition-all duration-300 h-[69px] flex items-center justify-center">
          <Logo />
        </div>

        <div className="p-3 border-b border-zinc-700 flex justify-center">
          <UserMenu isCollapsed={isCollapsed} />
        </div>

        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
          {navSections.map((section) => (
            <SidebarSection
              key={section.id}
              title={section.title}
              visualizerType={section.visualizerType}
              isCollapsed={isCollapsed}
              isActiveSection={activeSection === section.id}
            >
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  text={item.text}
                  href={item.href}
                  icon={item.icon}
                  isCollapsed={isCollapsed}
                  isActive={activeItem === item.id}
                  onClick={() => handleItemClick(section.id, item.id)}
                />
              ))}
            </SidebarSection>
          ))}
        </nav>
      </aside>
    </>
  );
}