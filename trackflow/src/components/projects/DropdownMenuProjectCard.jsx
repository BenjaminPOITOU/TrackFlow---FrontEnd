"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjectAction } from "@/components/projects/hooks/useProjectAction";
import { Ellipsis, Trash2, Archive, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionConfirmationDialog from "@/components/shared/ActionConfirmationDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/**
 * Provides a dropdown menu for project actions, using a custom hook for logic
 * and a reusable dialog for confirmations.
 * @param {object} props
 * @param {string} props.projectId - The ID of the project.
 * @param {string} [props.className] - Optional additional class names.
 * @param {(isHovered: boolean) => void} props.onSetCardHovered - Callback to control the parent card's hover state.
 */
export function DropdownMenuProjectCard({ projectId, className, onSetCardHovered }) {
  const { user } = useAuth();
  const { isProcessing, handleArchive, handleDelete } = useProjectAction();
  const [dialogAction, setDialogAction] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleActionSelect = (actionType) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      setDialogAction(actionType);
    }, 0);
  };

  const handleConfirmAction = async () => {
    if (dialogAction === 'archive') {
      await handleArchive(user?.id, projectId);
    } else if (dialogAction === 'delete') {
      await handleDelete(user?.id, projectId);
    }
    setDialogAction(null);
  };

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);
  
  const handleMenuOpenChange = (open) => {
    setIsMenuOpen(open);
    if (open && onSetCardHovered) {
      onSetCardHovered(false);
    }
  };

  const isActionLoading = isProcessing('archive') || isProcessing('delete');

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild onClick={stopPropagation}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 rounded text-muted-foreground hover:bg-zinc-700 hover:text-foreground", isActionLoading && "cursor-not-allowed opacity-50", className)}
            disabled={isActionLoading}
            aria-label="Project options"
          >
            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ellipsis className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 border-neutral-700 bg-neutral-800 text-gray-300" 
          onClick={stopPropagation}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className="text-gray-400">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-700" />
          <DropdownMenuItem 
            onSelect={() => handleActionSelect('archive')} 
            disabled={isActionLoading} 
            className="cursor-pointer"
          >
            <Archive className="mr-2 h-4 w-4" /><span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleActionSelect('delete')} 
            disabled={isActionLoading} 
            className="cursor-pointer text-red-500 focus:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" /><span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionConfirmationDialog
        isOpen={!!dialogAction}
        onOpenChange={(open) => !open && setDialogAction(null)}
        onConfirm={handleConfirmAction}
        isConfirming={isProcessing(dialogAction)}
        title={dialogAction === 'archive' ? "Archive Project?" : "Delete Project Permanently?"}
        titleIcon={dialogAction === 'archive' ? <Archive className="h-5 w-5 text-yellow-400" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
        description={dialogAction === 'archive' ? "Archiving this project will hide it from view, but it can be restored later." : "This action is irreversible. All associated data will be permanently deleted."}
        confirmText={dialogAction === 'archive' ? "Confirm Archive" : "Yes, Delete Permanently"}
        variant={dialogAction === 'archive' ? 'warning' : 'danger'}
      />
    </>
  );
}