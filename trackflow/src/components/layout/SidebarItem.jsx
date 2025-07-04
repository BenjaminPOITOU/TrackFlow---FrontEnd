"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * A single item in the sidebar navigation.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.href] - The target URL for navigation.
 * @param {React.ElementType} props.icon - Icon component to render.
 * @param {string} props.text - The display label (in French).
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed.
 * @param {boolean} props.disabled - Whether the item is disabled (non-clickable).
 * @returns {JSX.Element} The sidebar item element.
 */
export default function SidebarItem({ href, icon: Icon, text, isCollapsed, disabled }) {
  const pathname = usePathname();
  const isActive = href && pathname.startsWith(href);

  const content = (
    <>
      <Icon size={18} className="flex-shrink-0" />
      <span className={cn("whitespace-nowrap transition-opacity duration-200 hidden", {
        "lg:inline": !isCollapsed,
      })}>
        {text}
      </span>
    </>
  );

  const commonClasses = cn(
    "flex w-full gap-3 px-3 py-2 rounded-md items-center transition-colors duration-200",
    {
      "justify-center": isCollapsed,
      "lg:justify-start": !isCollapsed,
      "bg-zinc-700": isActive,
      "hover:bg-zinc-700/50": !isActive && !disabled,
      "opacity-50 cursor-not-allowed pointer-events-none": disabled,
    }
  );

  return (
    <li>
      {href ? (
        <Link href={href} className={commonClasses}>
          {content}
        </Link>
      ) : (
        <div className={commonClasses}>{content}</div>
      )}
    </li>
  );
}
