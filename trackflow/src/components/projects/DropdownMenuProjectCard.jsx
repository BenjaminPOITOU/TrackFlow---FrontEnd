"use client"

import * as React from "react"
import { Ellipsis } from "lucide-react"
import { cn } from "@/lib/utils"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function DropdownMenuProjectCard({className}) {
const [showStatusBar, setShowStatusBar] = React.useState(true);
const [showActivityBar, setShowActivityBar] = React.useState(false);
const [showPanel, setShowPanel] = React.useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn(
            "inline-flex items-center justify-center p-1 rounded",
            "text-muted-foreground hover:text-foreground hover:bg-zinc-700",
            "transition-colors",
            "focus:outline-none",
            className
          )}><Ellipsis className="w-4 h-4"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-neutral-800">
        <DropdownMenuLabel>Enlever le projet de la liste</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          ARCHIVER
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          SUPPRIMER
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
