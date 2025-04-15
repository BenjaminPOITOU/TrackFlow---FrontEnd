"use client"

import React, { useState, useCallback } from "react";
import { Ellipsis, Trash2, Archive, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Pour les notifications


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { archiveProjectById, deleteProjectById } from "@/lib/api/projects";


export function DropdownMenuProjectCard({
  className,
  projectId,
  userId,
  onProjectArchived, 
  onProjectDeleted  
}) {

  
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null); 


  const handleArchiveClick = useCallback(() => {
    setShowArchiveConfirm(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);


 
  const confirmArchive = async () => {
    if (!userId || !projectId) {
      toast.error("Missing user or project information.");
      return;
    }
    setIsArchiving(true);
    setError(null);
    setShowArchiveConfirm(false);

    try {
      console.log(`Archiving project ${projectId} for user ${userId}...`);
    
       await archiveProjectById(userId, projectId);

      toast.success("Project archived successfully!");
      if (onProjectArchived) {
        onProjectArchived(projectId);
      }
    } catch (err) {
      console.error("Failed to archive project:", err);
      setError(err.message || "Failed to archive project.");
      toast.error(`Archive failed: ${err.message}`);
    } finally {
      setIsArchiving(false);
    }
  };


  const confirmDelete = async () => {
    if (!userId || !projectId) {
      toast.error("Missing user or project information.");
      return;
    }
    setIsDeleting(true);
    setError(null);
    setShowDeleteConfirm(false);

    try {
       console.log(`Deleting project ${projectId} for user ${userId}...`);
       await deleteProjectById(userId, projectId);
       toast.success("Project deleted successfully!");
       if (onProjectDeleted) {
         onProjectDeleted(projectId); 
       }
    } catch (err) {
       console.error("Failed to delete project:", err);
       setError(err.message || "Failed to delete project.");
       toast.error(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };


  const isLoading = isArchiving || isDeleting; 

  return (
    <>
   
      <DropdownMenu>
        <DropdownMenuTrigger asChild
         onClick={(event) => {
              console.log("Dropdown trigger clicked, stopping propagation & preventing default.");
              event.stopPropagation();
              event.preventDefault();
          }}
          onMouseDown={(event) => {
           // Tenter d'arrêter l'événement avant même le 'click'
           console.log("Trigger onMouseDown, stopping propagation & preventing default.");
           event.stopPropagation();
           event.preventDefault();
        }}>
          <Button
             variant="ghost"
             size="icon"    
             className={cn(
                "h-6 w-6 rounded", 
                "text-muted-foreground hover:text-foreground hover:bg-zinc-700",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring", 
                 isLoading ? "cursor-not-allowed opacity-50" : "", 
                className
                
             )}
             disabled={isLoading} 
             aria-label="Project options"
          >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Ellipsis className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-neutral-800 border-neutral-700 text-gray-300">
          <DropdownMenuLabel className="text-gray-400">Project Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-700"/>

          <DropdownMenuItem
            className="hover:bg-neutral-700 focus:bg-neutral-700 cursor-pointer"

            onSelect={(event) => {
              event.stopPropagation(); 
              event.preventDefault(); 
              if (!isLoading) {
                 handleArchiveClick(); 
              }
            }}
            disabled={isLoading} 
          >
            <div className="flex items-center justify-start gap-2">
              <Archive className="w-4 h-4" color="#e0e0e0" />
              <span>Archive</span>
            </div>
          </DropdownMenuItem>


          <DropdownMenuItem
            className="text-red-500 hover:bg-neutral-700 focus:bg-neutral-700 focus:text-red-400 cursor-pointer"

            onSelect={(event) => {
              event.stopPropagation(); 
              event.preventDefault(); 
               if (!isLoading) {
                  handleDeleteClick(); 
               }
            }}
            disabled={isLoading} 
          >
            <div className="flex items-center justify-start gap-2">
              <Trash2 className="w-4 h-4" color="#ef4444"/> {}
              <span>Delete</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-yellow-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-yellow-400"/> Archive Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 pt-2">
              Archiving this project will hide it from the main lists but it can usually be restored later. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent hover:bg-zinc-700 border-zinc-600 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
              onClick={confirmArchive} 
              disabled={isArchiving} 
            >
              {isArchiving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
              Confirm Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

 
       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-red-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500"/> Delete Project Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 pt-2">
              This action is irreversible. All associated data (compositions, files, etc.) will be permanently deleted. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent hover:bg-zinc-700 border-zinc-600 text-zinc-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete} 
              disabled={isDeleting} 
            >
               {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}