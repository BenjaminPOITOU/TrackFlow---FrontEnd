"use client";

import Link from "next/link";

/**
 * Renders a single item in the sidebar navigation.
 * It can be a link or a button and adjusts its appearance based on collapsed state.
 * @param {object} props - The component props.
 * @param {string} [props.href] - The URL to link to. If not provided, it renders as a button.
 * @param {React.ElementType} props.icon - The icon component to display.
 * @param {string} props.text - The text label for the item.
 * @param {boolean} props.isActive - Whether the item is currently active.
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed.
 * @param {() => void} props.onClick - The function to call when the item is clicked.
 * @returns {JSX.Element} A single sidebar navigation item.
 */
export default function SidebarItem({ href, icon: Icon, text, isActive, isCollapsed, onClick }) {
  const content = (
    <>
      <Icon size={18} className="flex-shrink-0" />
      <span className={`whitespace-nowrap transition-opacity duration-200 hidden ${!isCollapsed && "lg:inline"}`}>
        {text}
      </span>
    </>
  );

  const commonClasses = `flex w-full gap-3 px-3 py-2 rounded-md items-center transition-colors duration-200
    justify-center ${!isCollapsed && "lg:justify-start"}
    ${isActive ? "bg-zinc-700" : "hover:bg-zinc-700/50"}`;

  if (href) {
    return (
      <li>
        <Link href={href} className={commonClasses} onClick={onClick}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button type="button" onClick={onClick} className={commonClasses}>
        {content}
      </button>
    </li>
  );
}