"use client";

/**
 * @file components/sidebar/Sidebar.js (or .tsx)
 * @description The main application sidebar component. It's responsible for primary navigation,
 * user session controls (menu and logout), and features a collapsible design. It's also responsive,
 * displaying a compact header on smaller screens and a full sidebar on larger screens.
 */

import { useState } from "react";
import Link from "next/link";
import UserMenu from "@/components/usermenu/UserMenu";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import LogoutDialog from "../logout/AlertDialogLogout";
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
  SquarePower,
  Router,
} from "lucide-react";

/**
 * Configuration data for the sidebar navigation links, organized by section.
 * This structure makes it easy to add, remove, or disable navigation items.
 */

const mainNavItems = [
  {
    id: "DASHBOARD",
    text: "Tableau de bord",
    href: "",
    icon: Home,
    disabled: true,
  },
  {
    id: "PROJECTS",
    text: "Projets",
    href: "/projects",
    icon: Music2,
    disabled: false,
  },
  {
    id: "PLAYLIST",
    text: "Playlist",
    href: "",
    icon: PlaySquare,
    disabled: true,
  },
  { id: "ARCHIVED", text: "Archives", href: "", icon: Archive, disabled: true },
  { id: "TRASH", text: "Corbeille", href: "", icon: Trash2, disabled: true },
];

const collabNavItems = [
  { id: "LISTENERS", text: "Auditeurs", href: "", icon: Users, disabled: true },
  { id: "SHARE", text: "Partager", href: "", icon: Share2, disabled: true },
];

const toolNavItems = [
  {
    id: "COMPARE",
    text: "Comparer A/B",
    href: "",
    icon: GitCompare,
    disabled: true,
  },
];

const navSections = [
  {
    id: "MAIN",
    title: "Principal",
    items: mainNavItems,
    visualizerType: "cube",
  },
  {
    id: "COLLAB",
    title: "Collaboration",
    items: collabNavItems,
    visualizerType: "wave",
  },
  {
    id: "TOOLS",
    title: "Outils",
    items: toolNavItems,
    visualizerType: "circles",
  },
];


/**
 * Renders the application logo and name ("TrackFlow").
 * The name text is conditionally displayed based on the sidebar's collapsed state to save space.
 * @param {{isCollapsed: boolean}} props - Component props.
 * @returns {JSX.Element}
 */
function SidebarLogo({ isCollapsed }) {
  const logoTextClasses = [
    "text-lg",
    "font-bold",
    "tracking-tight",
    "font-tech",
    "glow-text",
    "transition-opacity",
    "duration-200",
    "hidden",
    !isCollapsed && "lg:inline",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
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
      <span className={logoTextClasses}>TrackFlow</span>
    </div>
  );
}

/**
 * Renders the main list of navigation items.
 * It iterates over the `navSections` data structure and maps each section and its
 * items to `SidebarSection` and `SidebarItem` components, respectively.
 * @param {{isCollapsed: boolean}} props - Component props used to pass down the collapsed state.
 * @returns {JSX.Element}
 */

function NavigationList({ isCollapsed }) {
  return (
    <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
      {navSections.map((section) => (
        <SidebarSection
          key={section.id}
          title={section.title}
          visualizerType={section.visualizerType}
          isCollapsed={isCollapsed}
        >
          {section.items.map((item) => (
            <SidebarItem
              key={item.id}
              text={item.text}
              href={item.href}
              icon={item.icon}
              isCollapsed={isCollapsed}
              disabled={item.disabled}
            />
          ))}
        </SidebarSection>
      ))}
    </nav>
  );
}

export default function Sidebar({ userData }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const sidebarBaseClasses =
    "hidden lg:flex relative h-full border-r border-zinc-700 flex-col bg-zinc-900 text-gray-300 transition-all duration-300 ease-in-out";
  const sidebarWidthClass = isCollapsed ? "w-20" : "lg:w-64";
  const sidebarClasses = `${sidebarBaseClasses} ${sidebarWidthClass}`;

  return (
    <>
      <header className="flex lg:hidden items-center justify-between w-full h-16 px-4 border-b border-zinc-700 bg-zinc-900 z-10">
        <Link href="/projects">
          <SidebarLogo isCollapsed={true} />
        </Link>
      </header>

      <aside className={sidebarClasses}>
        <button
          onClick={toggleSidebar}
          className="absolute top-6 -right-3 z-20 h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 hidden lg:flex items-center justify-center"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="p-4 border-b border-zinc-700 transition-all duration-300 h-[69px] flex items-center justify-center">
          <SidebarLogo isCollapsed={isCollapsed} />
        </div>

        <div className="p-3 border-b border-zinc-700 flex justify-end items-center gap-2">
          <UserMenu userData={userData} isCollapsed={isCollapsed} />
          <button
            onClick={() => setIsAlertOpen(true)}
            className="cursor-pointer"
          >
            <SquarePower color="#c80404" size={25} />
          </button>
        </div>

        <NavigationList isCollapsed={isCollapsed} />
      </aside>

      {isAlertOpen && (
        <LogoutDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
        />
      )}
    </>
  );
}
